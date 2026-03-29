'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

const STEPS = [
  'Checking SSL/TLS...',
  'Analyzing security headers...',
  'Scanning SEO essentials...',
  'Checking robots.txt & sitemap...',
  'Measuring performance...',
  'Testing mobile compatibility...',
  'Checking DNS & email security...',
  'Fingerprinting tech stack...',
  'Checking for broken links...',
  'Generating report...',
];

function ScanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillUrl = searchParams.get('url') || '';

  const [url, setUrl] = useState(prefillUrl);
  const [scanning, setScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefillUrl && !scanning) {
      startScan(prefillUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startScan(targetUrl) {
    setScanning(true);
    setError('');
    setCurrentStep(0);

    // Animate steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Scan failed');
      }

      const data = await res.json();
      router.push(`/report/${data.id}`);
    } catch (e) {
      clearInterval(interval);
      setScanning(false);
      setError(e.message || 'Something went wrong. Please try again.');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) {
      startScan(url.trim());
    }
  }

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoIcon}>&#128270;</div>
          <span className={styles.logoShady}>Shady</span>
          <span className={styles.logoScanner}>Scanner</span>
        </Link>
      </nav>

      <div className={styles.container}>
        {!scanning ? (
          <>
            <h1 className={styles.title}>
              Scan <span className={styles.accent}>any website</span>
            </h1>
            <p className={styles.subtitle}>
              Enter a URL to get a comprehensive security, SEO, and performance audit in under 60 seconds.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                aria-label="Website URL"
                autoFocus
              />
              <button className={styles.button} type="submit">Scan</button>
            </form>
            <p className={styles.disclaimer}>For use on sites you own or have permission to scan.</p>
            {error && <div className={styles.error}>{error}</div>}
          </>
        ) : (
          <div className={styles.scanning}>
            <div className={styles.spinner}></div>
            <p className={styles.scanningText}>Scanning in progress...</p>
            <p className={styles.scanningUrl}>{url}</p>
            <div className={styles.scanningSteps}>
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`${styles.scanStep} ${i < currentStep ? styles.scanStepDone : ''} ${i === currentStep ? styles.scanStepActive : ''}`}
                >
                  <span className={styles.scanStepIcon}>
                    {i < currentStep ? '\u2713' : i === currentStep ? '\u25B6' : '\u2022'}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ScanPage() {
  return (
    <Suspense>
      <ScanPageInner />
    </Suspense>
  );
}
