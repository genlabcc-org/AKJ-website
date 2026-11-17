import React from 'react';

export default function PageHero({ title, subtitle, children }) {
  return (
    <section className="site-hero">
      <div className="site-hero-inner">
        <h1 className="site-hero-title">{title}</h1>
        {subtitle && <p className="site-hero-subtitle">{subtitle}</p>}
        {children && <div className="site-hero-extra">{children}</div>}
      </div>
    </section>
  );
}
