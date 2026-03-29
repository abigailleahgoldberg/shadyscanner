'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const SECTION_META = {
  ssl: { icon: '\uD83D\uDD12', label: 'SSL / TLS' },
  securityHeaders: { icon: '\uD83D\uDEE1\uFE0F', label: 'Security Headers' },
  seo: { icon: '\uD83D\uDD0D', label: 'SEO Essentials' },
  robots: { icon: '\uD83E\uDD16', label: 'robots.txt' },
  sitemap: { icon: '\uD83D\uDDFA\uFE0F', label: 'Sitemap' },
  performance: { icon: '\u26A1', label: 'Performance' },
  mobile: { icon: '\uD83D\uDCF1', label: 'Mobile / Viewport' },
  dns: { icon: '\uD83D\uDCE7', label: 'DNS / Email Security' },
  techStack: { icon: '\uD83D\uDEE0\uFE0F', label: 'Tech Stack' },
  brokenLinks: { icon: '\uD83D\uDD17', label: 'Broken Links' },
};

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function badgeClass(status) {
  if (status === 'pass') return styles.badgePass;
  if (status === 'warn') return styles.badgeWarn;
  if (status === 'error') return styles.badgeError;
  return styles.badgeFail;
}

function detailIconClass(text) {
  const lower = text.toLowerCase();
  if (lower.includes('missing') || lower.includes('not found') || lower.includes('not ') || lower.includes('broken') || lower.includes('no ')) return 'fail';
  if (lower.includes('too long') || lower.includes('slow') || lower.includes('heavy') || lower.includes('multiple') || lower.includes('render-blocking')) return 'warn';
  if (lower.includes('present') || lower.includes('found') || lower.includes('available') || lower.includes('good') || lower.includes('redirect') || lower.includes('excellent') || lower.includes('enabled') || lower.includes('passed') || lower.includes('lightweight') || lower.includes('single')) return 'ok';
  return 'info';
}

function detailIcon(type) {
  if (type === 'ok') return { symbol: '\u2713', cls: styles.detailOk };
  if (type === 'warn') return { symbol: '\u26A0', cls: styles.detailWarn };
  if (type === 'fail') return { symbol: '\u2717', cls: styles.detailFail };
  return { symbol: '\u2022', cls: styles.detailInfo };
}

function SectionCard({ sectionKey, data }) {
  const [open, setOpen] = useState(data.status !== 'pass');
  const meta = SECTION_META[sectionKey] || { icon: '\u2022', label: sectionKey };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setOpen(!open)}>
        <div className={styles.cardHeaderLeft}>
          <span className={styles.cardIcon}>{meta.icon}</span>
          <span className={styles.cardTitle}>{meta.label}</span>
        </div>
        <div className={styles.cardHeaderRight}>
          <span className={`${styles.cardBadge} ${badgeClass(data.status)}`}>
            {data.status.toUpperCase()}
          </span>
          <span className={styles.cardScore}>{data.score}/100</span>
          <span className={`${styles.cardChevron} ${open ? styles.cardChevronOpen : ''}`}>
            &#9660;
          </span>
        </div>
      </div>
      {open && (
        <div className={styles.cardBody}>
          <ul className={styles.detailsList}>
            {data.details.map((d, i) => {
              const type = detailIconClass(d);
              const { symbol, cls } = detailIcon(type);
              return (
                <li key={i} className={styles.detailItem}>
                  <span className={`${styles.detailIcon} ${cls}`}>{symbol}</span>
                  {d}
                </li>
              );
            })}
          </ul>
          {data.recommendations && data.recommendations.length > 0 && (
            <>
              <div className={styles.recsTitle}>Recommendations</div>
              <ul className={styles.recsList}>
                {data.recommendations.map((r, i) => (
                  <li key={i} className={styles.recItem}>
                    <span className={styles.recIcon}>&#9656;</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportPage({ params }) {
  const { id } = use(params);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/report/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading report...</p>
        </div>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Nav />
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Report not found</h1>
          <p className={styles.notFoundDesc}>This scan report may have expired or the ID is invalid.</p>
          <Link href="/scan" className={styles.notFoundBtn}>Run a new scan</Link>
        </div>
      </>
    );
  }

  const color = scoreColor(report.overallScore);
  const sectionOrder = ['ssl', 'securityHeaders', 'seo', 'performance', 'mobile', 'dns', 'robots', 'sitemap', 'techStack', 'brokenLinks'];

  return (
    <>
      <Nav reportUrl={typeof window !== 'undefined' ? window.location.href : ''} />
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.scoreCircle} style={{ borderColor: color }}>
            <span className={styles.scoreNumber} style={{ color }}>{report.overallScore}</span>
            <span className={styles.scoreGrade} style={{ color }}>{report.overallGrade}</span>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerUrl}>{report.url}</div>
            <div className={styles.headerDate}>
              Scanned {new Date(report.scannedAt).toLocaleString()}
            </div>
            <h1 className={styles.headerTitle}>Security Audit Report</h1>
            <div className={styles.summaryBar}>
              <div className={`${styles.summaryItem} ${styles.summaryPass}`}>
                &#10003; {report.counts.pass || 0} Passed
              </div>
              <div className={`${styles.summaryItem} ${styles.summaryWarn}`}>
                &#9888; {report.counts.warn || 0} Warnings
              </div>
              <div className={`${styles.summaryItem} ${styles.summaryFail}`}>
                &#10007; {(report.counts.fail || 0) + (report.counts.error || 0)} Failed
              </div>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <div className={styles.sections}>
          {sectionOrder.map((key) => {
            const data = report.results[key];
            if (!data) return null;
            return <SectionCard key={key} sectionKey={key} data={data} />;
          })}
        </div>

        <p className={styles.disclaimer}>
          For use on sites you own or have permission to scan. Results are informational only.
        </p>
      </div>
    </>
  );
}

function Nav({ reportUrl }) {
  function copyLink() {
    if (reportUrl) {
      navigator.clipboard.writeText(reportUrl);
    }
  }

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLogo}>
        <div className={styles.navLogoIcon}>&#128270;</div>
        <span className={styles.logoShady}>Shady</span>
        <span className={styles.logoScanner}>Scanner</span>
      </Link>
      <div className={styles.navActions}>
        {reportUrl && (
          <button className={styles.navBtnGhost} onClick={copyLink}>
            Copy link
          </button>
        )}
        <Link href="/scan" className={styles.navBtn}>New scan</Link>
      </div>
    </nav>
  );
}
