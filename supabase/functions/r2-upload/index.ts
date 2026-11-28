/**
 * Supabase Edge Function: r2-upload
 *
 * Securely uploads and deletes AKJ Learner Achievement photos in Cloudflare R2
 * using AWS Signature V4 (S3-compatible R2 API) and Firebase Admin Auth JWT verification.
 *
 * Required Supabase Secrets (`supabase secrets set ...`):
 *   R2_ACCOUNT_ID        = <Your 32-char Cloudflare Account ID>
 *   R2_ACCESS_KEY_ID     = <Cloudflare R2 API Token Access Key ID>
 *   R2_SECRET_ACCESS_KEY = <Cloudflare R2 API Token Secret Access Key>
 *
 * Optional Supabase Secrets (already defaulted for AKJ):
 *   R2_BUCKET_NAME       = achievements
 *   R2_PUBLIC_URL        = https://pub-522d6b6a5e3d4ca3a2936d2a49d9e9d2.r2.dev
 *   FIREBASE_PROJECT_ID  = akj-web-aa42f
 */

const DEFAULT_BUCKET_NAME = 'achievements';
const DEFAULT_PUBLIC_URL = 'https://pub-522d6b6a5e3d4ca3a2936d2a49d9e9d2.r2.dev';
const DEFAULT_FIREBASE_PROJECT_ID = 'akj-web-aa42f';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const FIREBASE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let cachedJwks: JsonWebKey[] | null = null;
let cachedJwksExpiresAt = 0;

function corsHeaders(req: Request): Record<string, string> {
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '*';
  const reqOrigin = req.headers.get('Origin') || '*';
  const origin =
    allowedOrigin === '*'
      ? '*'
      : allowedOrigin
          .split(',')
          .map((s) => s.trim())
          .includes(reqOrigin)
        ? reqOrigin
        : allowedOrigin.split(',')[0].trim();

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-firebase-token',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: unknown, status: number, req: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(req),
    },
  });
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padded =
    base64Url.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (base64Url.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeJwtPart(base64Url: string): Record<string, unknown> {
  const bytes = base64UrlToUint8Array(base64Url);
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function getFirebasePublicKeys(): Promise<JsonWebKey[]> {
  const now = Date.now();
  if (cachedJwks && now < cachedJwksExpiresAt) {
    return cachedJwks;
  }

  const res = await fetch(FIREBASE_JWKS_URL);
  if (!res.ok) {
    throw new Error('Unable to fetch Firebase JWKS');
  }

  const cacheControl = res.headers.get('Cache-Control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 3600 * 1000;

  const data = await res.json();
  cachedJwks = (data.keys || []) as JsonWebKey[];
  cachedJwksExpiresAt = now + maxAgeMs;
  return cachedJwks;
}

async function verifyFirebaseToken(
  tokenHeader: string | null,
  projectId: string
): Promise<Record<string, unknown> | null> {
  if (!tokenHeader) return null;
  const token = tokenHeader.startsWith('Bearer ')
    ? tokenHeader.slice(7).trim()
    : tokenHeader.trim();

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = decodeJwtPart(headerB64);
  const payload = decodeJwtPart(payloadB64);

  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (
    typeof payload.exp !== 'number' ||
    payload.exp <= nowSec ||
    typeof payload.iat !== 'number' ||
    payload.iat > nowSec + 300 ||
    payload.aud !== projectId ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    !payload.sub
  ) {
    return null;
  }

  const jwks = await getFirebasePublicKeys();
  const jwk = jwks.find((k) => (k as { kid?: string }).kid === header.kid);
  if (!jwk) return null;

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signedBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signatureBytes = base64UrlToUint8Array(signatureB64);
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signatureBytes,
    signedBytes
  );

  return valid ? payload : null;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return toHex(new Uint8Array(digest));
}

async function hmacSha256(
  keyBytes: Uint8Array | string,
  message: string
): Promise<Uint8Array> {
  const rawKey =
    typeof keyBytes === 'string' ? new TextEncoder().encode(keyBytes) : keyBytes;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(message)
  );
  return new Uint8Array(sig);
}

function encodeS3Path(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

async function signedR2Request({
  method,
  accountId,
  accessKeyId,
  secretAccessKey,
  bucketName,
  objectKey,
  bodyBytes,
  contentType,
}: {
  method: 'PUT' | 'DELETE';
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  objectKey: string;
  bodyBytes?: Uint8Array;
  contentType?: string;
}): Promise<Response> {
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = 'auto';
  const service = 's3';
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payload = bodyBytes || new Uint8Array(0);
  const payloadHash = await sha256Hex(payload);
  const canonicalUri = `/${encodeS3Path(`${bucketName}/${objectKey}`)}`;

  const headerEntries: Array<[string, string]> = [
    ['host', host],
    ['x-amz-content-sha256', payloadHash],
    ['x-amz-date', amzDate],
  ];

  if (method === 'PUT') {
    headerEntries.push(['cache-control', 'public, max-age=31536000, immutable']);
    if (contentType) {
      headerEntries.push(['content-type', contentType]);
    }
  }

  headerEntries.sort((a, b) => a[0].localeCompare(b[0]));

  const canonicalHeaders = headerEntries.map(([k, v]) => `${k}:${v}\n`).join('');
  const signedHeaders = headerEntries.map(([k]) => k).join(';');

  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = await hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  const signature = toHex(await hmacSha256(kSigning, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const fetchHeaders: Record<string, string> = {
    Authorization: authorization,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
  };
  if (method === 'PUT') {
    fetchHeaders['cache-control'] = 'public, max-age=31536000, immutable';
    if (contentType) {
      fetchHeaders['content-type'] = contentType;
    }
  }

  return await fetch(`https://${host}${canonicalUri}`, {
    method,
    headers: fetchHeaders,
    body: method === 'PUT' ? payload : undefined,
  });
}

function getSafeExtension(fileName: string, contentType: string): string {
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/jpeg' || contentType === 'image/jpg') return 'jpg';
  if (contentType === 'image/gif') return 'gif';
  const extMatch = (fileName || '').match(/\.([a-zA-Z0-9]+)$/);
  return extMatch ? extMatch[1].toLowerCase() : 'webp';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  const accountId = Deno.env.get('R2_ACCOUNT_ID') || '';
  const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID') || '';
  const secretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY') || '';
  const bucketName = Deno.env.get('R2_BUCKET_NAME') || DEFAULT_BUCKET_NAME;
  const publicBaseUrl = (Deno.env.get('R2_PUBLIC_URL') || DEFAULT_PUBLIC_URL).replace(/\/+$/, '');
  const firebaseProjectId = Deno.env.get('FIREBASE_PROJECT_ID') || DEFAULT_FIREBASE_PROJECT_ID;

  const missingSecrets = [
    !accountId && 'R2_ACCOUNT_ID',
    !accessKeyId && 'R2_ACCESS_KEY_ID',
    !secretAccessKey && 'R2_SECRET_ACCESS_KEY',
  ].filter(Boolean);

  if (missingSecrets.length > 0) {
    return jsonResponse(
      {
        error: `Missing Supabase Edge Function secrets: ${missingSecrets.join(', ')}. Set them via "supabase secrets set" or Supabase Dashboard.`,
      },
      500,
      req
    );
  }

  const firebaseToken =
    req.headers.get('x-firebase-token') || req.headers.get('authorization');
  const verifiedUser = await verifyFirebaseToken(firebaseToken, firebaseProjectId).catch(
    () => null
  );

  if (!verifiedUser) {
    return jsonResponse(
      { error: 'Unauthorized: invalid or missing admin token.' },
      401,
      req
    );
  }

  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'Expected multipart/form-data request.' }, 400, req);
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return jsonResponse({ error: 'Missing image file field.' }, 400, req);
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return jsonResponse({ error: 'Only image uploads are allowed.' }, 400, req);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonResponse({ error: 'Image size exceeds 10 MB limit.' }, 413, req);
    }

    const ext = getSafeExtension(file.name, file.type);
    const objectKey = `achievements/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bodyBytes = new Uint8Array(await file.arrayBuffer());

    const r2Res = await signedR2Request({
      method: 'PUT',
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      objectKey,
      bodyBytes,
      contentType: file.type,
    });

    if (!r2Res.ok) {
      const errText = await r2Res.text().catch(() => '');
      return jsonResponse(
        { error: `Cloudflare R2 upload failed (${r2Res.status}): ${errText || r2Res.statusText}` },
        502,
        req
      );
    }

    return jsonResponse(
      {
        key: objectKey,
        url: `${publicBaseUrl}/${objectKey}`,
      },
      200,
      req
    );
  }

  if (req.method === 'DELETE') {
    const reqUrl = new URL(req.url);
    let key = reqUrl.searchParams.get('key');

    if (!key) {
      const body = await req.json().catch(() => ({}));
      if (typeof body.key === 'string') {
        key = body.key;
      } else if (typeof body.url === 'string' && body.url.startsWith(`${publicBaseUrl}/`)) {
        key = body.url.slice(publicBaseUrl.length + 1);
      }
    }

    if (!key || !key.startsWith('achievements/')) {
      return jsonResponse({ error: 'Invalid or missing R2 object key.' }, 400, req);
    }

    const r2Res = await signedR2Request({
      method: 'DELETE',
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      objectKey: key,
    });

    if (!r2Res.ok && r2Res.status !== 404) {
      const errText = await r2Res.text().catch(() => '');
      return jsonResponse(
        { error: `Cloudflare R2 delete failed (${r2Res.status}): ${errText || r2Res.statusText}` },
        502,
        req
      );
    }

    return jsonResponse({ deleted: true, key }, 200, req);
  }

  return jsonResponse({ error: 'Method not allowed.' }, 405, req);
});
