'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');

  function handleScan(e) {
    e.preventDefault();
    if (url.trim()) {
      router.push(`/scan?url=${encodeURIComponent(url.trim())}`);
    }
  }

  return (
    <>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoIcon}>&#128270;</div>
          <span className={styles.logoShady}>Shady</span>
          <span className={styles.logoScanner}>Scanner</span>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="/scan" className={styles.navCta}>Scan now</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot}></span>
              AI-Powered Security
            </div>
            <h1 className={styles.heroTitle}>
              Scan Before<br />They <span className={styles.accentYellow}>Strike.</span>
            </h1>
            <p className={styles.heroDesc}>
              AI-powered security scanning for websites, APIs, and business tools.
              Find vulnerabilities before attackers do.
            </p>
            <div className={styles.heroCtaGroup}>
              <a href="/scan" className={styles.btnPrimary}>Scan your site</a>
              <a href="#features" className={styles.btnGhost}>See how it works</a>
            </div>
          </div>

          {/* MOCK SCAN TERMINAL */}
          <div className={styles.scanTerminal} aria-label="Mock security scan output">
            <div className={styles.terminalHeader}>
              <div className={`${styles.terminalDot} ${styles.terminalDotRed}`}></div>
              <div className={`${styles.terminalDot} ${styles.terminalDotYellow}`}></div>
              <div className={`${styles.terminalDot} ${styles.terminalDotGreen}`}></div>
              <span className={styles.terminalTitle}>shadyscanner &mdash; live scan</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.tLine}>
                <span className={styles.tPrompt}>$</span>
                <span className={styles.tCmd}>scan --target example.com --deep</span>
              </div>
              <div className={`${styles.tOutput} ${styles.tSection}`}>Initializing AI scan engine...</div>
              <div className={styles.tOutput}><span className={styles.tOk}>&#10003;</span> DNS + TLS configuration checked</div>
              <div className={styles.tOutput}><span className={styles.tOk}>&#10003;</span> HTTP security headers analyzed</div>
              <div className={styles.tOutput}><span className={styles.tWarn}>&#9654;</span> Missing CSP header detected</div>
              <div className={`${styles.tOutput} ${styles.tSection}`}>Checking exposed endpoints...</div>
              <div className={styles.tOutput}><span className={styles.tOk}>&#10003;</span> 47 endpoints crawled</div>
              <div className={styles.tOutput}><span className={styles.tCrit}>&#9650;</span> SQL injection risk: /api/users</div>
              <div className={styles.tOutput}><span className={styles.tWarn}>&#9654;</span> Outdated dependency: lodash 4.17.19</div>
              <div className={`${styles.tOutput} ${styles.tSection}`}>Generating report...</div>
              <div className={styles.tLine}>
                <span className={styles.tPrompt}>$</span>
                <span className={styles.tCmd}><span className={styles.tCursor}></span></span>
              </div>
            </div>
            <div className={styles.scanStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue} style={{ color: 'var(--yellow)' }}>2</div>
                <div className={styles.statLabel}>Critical</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue} style={{ color: '#f59e0b' }}>5</div>
                <div className={styles.statLabel}>Warnings</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue} style={{ color: 'var(--blue)' }}>41</div>
                <div className={styles.statLabel}>Passed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustBarInner}>
          <div className={styles.trustItem}>
            <span className={styles.trustItemIcon}>&#128274;</span>
            <span>No data stored</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustItemIcon}>&#9889;</span>
            <span>Scans in under 60 seconds</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustItemIcon}>&#128200;</span>
            <span>OWASP Top 10 coverage</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustItemIcon}>&#128296;</span>
            <span>Built for developers</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className={styles.features} id="features">
        <p className={styles.sectionTag}>What we scan</p>
        <h2 className={styles.sectionTitle}>Security coverage that actually makes sense.</h2>
        <p className={styles.sectionSub}>Three core scan types to cover your whole attack surface, without the enterprise price tag.</p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>&#127760;</div>
            <h3>Website Vulnerability Scan</h3>
            <p>Full-spectrum surface analysis for your public-facing site. Headers, SSL, forms, exposed files, and more.</p>
            <ul className={styles.featureList}>
              <li><span className={styles.featureListDot}></span>HTTP security headers</li>
              <li><span className={styles.featureListDot}></span>SSL/TLS configuration</li>
              <li><span className={styles.featureListDot}></span>Open redirect detection</li>
              <li><span className={styles.featureListDot}></span>XSS and injection vectors</li>
            </ul>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>&#128279;</div>
            <h3>API Security Check</h3>
            <p>Probe your API endpoints for authentication gaps, data leaks, and broken access controls.</p>
            <ul className={styles.featureList}>
              <li><span className={styles.featureListDot}></span>Broken authentication checks</li>
              <li><span className={styles.featureListDot}></span>Rate limiting validation</li>
              <li><span className={styles.featureListDot}></span>Sensitive data exposure</li>
              <li><span className={styles.featureListDot}></span>CORS misconfiguration</li>
            </ul>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>&#128230;</div>
            <h3>Dependency Audit</h3>
            <p>Scan your package dependencies for known CVEs and outdated libraries before they become a liability.</p>
            <ul className={styles.featureList}>
              <li><span className={styles.featureListDot}></span>CVE database lookup</li>
              <li><span className={styles.featureListDot}></span>npm, pip, and gem support</li>
              <li><span className={styles.featureListDot}></span>Transitive dependency checks</li>
              <li><span className={styles.featureListDot}></span>Fix recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.pricingInner}>
          <p className={styles.sectionTag}>Pricing</p>
          <h2 className={styles.sectionTitle}>Simple pricing, coming soon.</h2>
          <p className={styles.sectionSub} style={{ marginBottom: '3.5rem' }}>
            We&apos;re working on pricing that doesn&apos;t require a meeting with your CFO. Sign up for early access to be first in line.
          </p>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingTier}>Free</div>
              <div className={styles.pricingPrice}>$0</div>
              <div className={styles.pricingComing}>Coming soon</div>
              <p className={styles.pricingDesc}>For developers and individuals who want baseline security visibility.</p>
              <ul className={styles.pricingFeatures}>
                <li><span className={styles.pricingCheck}>&#10003;</span> 3 scans per month</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Website vulnerability scan</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Basic report export</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Email alerts</li>
              </ul>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>Most Popular</div>
              <div className={`${styles.pricingTier} ${styles.pricingTierFeatured}`}>Pro</div>
              <div className={styles.pricingPrice}>TBD</div>
              <div className={styles.pricingComing}>Coming soon</div>
              <p className={styles.pricingDesc}>For freelancers and small teams who need full coverage across projects.</p>
              <ul className={styles.pricingFeatures}>
                <li><span className={styles.pricingCheck}>&#10003;</span> Unlimited scans</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> All scan types</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> API access</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Scheduled monitoring</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Priority support</li>
              </ul>
            </div>
            <div className={styles.pricingCard}>
              <div className={styles.pricingTier}>Business</div>
              <div className={styles.pricingPrice}>TBD</div>
              <div className={styles.pricingComing}>Coming soon</div>
              <p className={styles.pricingDesc}>For teams that need compliance reporting and custom integrations.</p>
              <ul className={styles.pricingFeatures}>
                <li><span className={styles.pricingCheck}>&#10003;</span> Everything in Pro</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> SSO + team management</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Compliance reports</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Slack and webhook alerts</li>
                <li><span className={styles.pricingCheck}>&#10003;</span> Dedicated onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SCAN CTA */}
      <section className={styles.scanCta} id="scan-now">
        <div className={styles.scanCtaInner}>
          <h2>Scan your site <span>right now.</span></h2>
          <p>Enter your URL below and get a full security audit in under 60 seconds. Free, no signup required.</p>
          <form className={styles.scanCtaForm} onSubmit={handleScan}>
            <input
              type="url"
              placeholder="https://yoursite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              aria-label="Website URL"
            />
            <button type="submit">Scan now</button>
          </form>
          <p className={styles.scanCtaFine}>For use on sites you own or have permission to scan.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>ShadyScanner</div>
        <div className={styles.footerCopy}>&copy; 2026 Shady Scanner. All rights reserved.</div>
      </footer>
    </>
  );
}
