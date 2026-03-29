const { URL } = require('url');
const dns = require('dns').promises;
const cheerio = require('cheerio');

const TIMEOUT = 10000;

async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal, redirect: 'follow' });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

function grade(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function status(score) {
  if (score >= 75) return 'pass';
  if (score >= 50) return 'warn';
  return 'fail';
}

// 1. SSL/TLS Check
async function checkSSL(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const parsed = new URL(urlStr);
    const httpsUrl = `https://${parsed.hostname}`;
    const httpUrl = `http://${parsed.hostname}`;

    // Check HTTPS availability
    try {
      const res = await fetchWithTimeout(httpsUrl);
      if (res.ok || res.status < 400) {
        details.push('HTTPS is available');
        score += 50;
      }
    } catch {
      details.push('HTTPS is NOT available');
      recommendations.push('Enable HTTPS on your server with a valid SSL certificate');
    }

    // Check HTTP → HTTPS redirect
    try {
      const res = await fetchWithTimeout(httpUrl, { redirect: 'manual' });
      const location = res.headers.get('location') || '';
      if (res.status >= 300 && res.status < 400 && location.startsWith('https')) {
        details.push('HTTP redirects to HTTPS');
        score += 50;
      } else if (score > 0) {
        details.push('HTTP does NOT redirect to HTTPS');
        recommendations.push('Configure HTTP to HTTPS redirect');
        score += 20;
      }
    } catch {
      if (score > 0) {
        details.push('Could not check HTTP redirect');
        score += 20;
      }
    }
  } catch (e) {
    details.push('Could not reach target');
    recommendations.push('Ensure the site is accessible');
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 2. Security Headers
async function checkSecurityHeaders(urlStr) {
  const details = [];
  const recommendations = [];
  let points = 0;

  const headersToCheck = [
    { name: 'strict-transport-security', label: 'Strict-Transport-Security (HSTS)', rec: 'Add HSTS header to enforce HTTPS' },
    { name: 'x-frame-options', label: 'X-Frame-Options', rec: 'Add X-Frame-Options to prevent clickjacking' },
    { name: 'x-content-type-options', label: 'X-Content-Type-Options', rec: 'Add X-Content-Type-Options: nosniff' },
    { name: 'content-security-policy', label: 'Content-Security-Policy', rec: 'Implement a Content Security Policy' },
    { name: 'referrer-policy', label: 'Referrer-Policy', rec: 'Add a Referrer-Policy header' },
    { name: 'permissions-policy', label: 'Permissions-Policy', rec: 'Add a Permissions-Policy header' },
  ];

  try {
    const res = await fetchWithTimeout(urlStr);
    for (const h of headersToCheck) {
      if (res.headers.get(h.name)) {
        details.push(`${h.label}: present`);
        points++;
      } else {
        details.push(`${h.label}: missing`);
        recommendations.push(h.rec);
      }
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not reach target'], recommendations: [] };
  }

  const score = Math.round((points / 6) * 100);
  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 3. SEO Essentials
async function checkSEO(urlStr) {
  const details = [];
  const recommendations = [];
  let points = 0;
  const maxPoints = 11;

  try {
    const res = await fetchWithTimeout(urlStr);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Title
    const title = $('title').text().trim();
    if (title) {
      points++;
      if (title.length <= 60) {
        details.push(`Title tag present (${title.length} chars) — good length`);
        points++;
      } else {
        details.push(`Title tag present but too long (${title.length} chars)`);
        recommendations.push('Shorten title tag to under 60 characters');
      }
    } else {
      details.push('Title tag missing');
      recommendations.push('Add a <title> tag');
    }

    // Meta description
    const desc = $('meta[name="description"]').attr('content') || '';
    if (desc) {
      points++;
      if (desc.length <= 160) {
        details.push(`Meta description present (${desc.length} chars) — good length`);
      } else {
        details.push(`Meta description too long (${desc.length} chars)`);
        recommendations.push('Shorten meta description to under 160 characters');
      }
    } else {
      details.push('Meta description missing');
      recommendations.push('Add a meta description');
    }

    // OG tags
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    let ogCount = 0;
    for (const tag of ogTags) {
      if ($(`meta[property="${tag}"]`).attr('content')) ogCount++;
    }
    if (ogCount === 4) {
      details.push('All Open Graph tags present');
      points += 2;
    } else {
      details.push(`${ogCount}/4 Open Graph tags present`);
      recommendations.push('Add missing Open Graph tags (og:title, og:description, og:image, og:url)');
      if (ogCount >= 2) points++;
    }

    // Twitter cards
    if ($('meta[name="twitter:card"]').attr('content')) {
      details.push('Twitter card meta tag present');
      points++;
    } else {
      details.push('Twitter card meta tag missing');
      recommendations.push('Add Twitter card meta tags');
    }

    // Canonical
    if ($('link[rel="canonical"]').attr('href')) {
      details.push('Canonical link present');
      points++;
    } else {
      details.push('Canonical link missing');
      recommendations.push('Add a canonical link tag');
    }

    // Robots meta
    if ($('meta[name="robots"]').attr('content')) {
      details.push('Robots meta tag present');
      points++;
    } else {
      details.push('Robots meta tag missing');
    }

    // H1
    const h1s = $('h1');
    if (h1s.length === 1) {
      details.push('Single H1 tag present — good');
      points++;
    } else if (h1s.length > 1) {
      details.push(`Multiple H1 tags found (${h1s.length})`);
      recommendations.push('Use only one H1 tag per page');
    } else {
      details.push('No H1 tag found');
      recommendations.push('Add an H1 heading');
    }

    // Image alt text
    const images = $('img');
    if (images.length > 0) {
      const withAlt = images.filter((_, el) => $(el).attr('alt')).length;
      const pct = Math.round((withAlt / images.length) * 100);
      details.push(`${withAlt}/${images.length} images have alt text (${pct}%)`);
      if (pct >= 80) points++;
      if (pct < 100) recommendations.push('Add alt text to all images');
    } else {
      details.push('No images found');
      points++;
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not fetch page for SEO analysis'], recommendations: [] };
  }

  const score = Math.round((points / maxPoints) * 100);
  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 4. robots.txt
async function checkRobots(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const parsed = new URL(urlStr);
    const robotsUrl = `${parsed.protocol}//${parsed.hostname}/robots.txt`;
    const res = await fetchWithTimeout(robotsUrl);

    if (res.ok) {
      const text = await res.text();
      details.push('robots.txt exists');
      score += 50;

      if (text.toLowerCase().includes('sitemap')) {
        details.push('Sitemap reference found in robots.txt');
        score += 50;
      } else {
        details.push('No sitemap reference in robots.txt');
        recommendations.push('Add a Sitemap directive to robots.txt');
        score += 20;
      }
    } else {
      details.push('robots.txt not found');
      recommendations.push('Create a robots.txt file');
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not check robots.txt'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 5. sitemap.xml
async function checkSitemap(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const parsed = new URL(urlStr);
    const sitemapUrl = `${parsed.protocol}//${parsed.hostname}/sitemap.xml`;
    const res = await fetchWithTimeout(sitemapUrl);

    if (res.ok) {
      const text = await res.text();
      details.push('sitemap.xml exists');
      score += 40;

      if (text.includes('<urlset') || text.includes('<sitemapindex')) {
        details.push('Valid XML sitemap format');
        score += 30;

        const urlCount = (text.match(/<url>/g) || []).length;
        const sitemapCount = (text.match(/<sitemap>/g) || []).length;
        if (urlCount > 0) {
          details.push(`Contains ${urlCount} URLs`);
          score += 30;
        } else if (sitemapCount > 0) {
          details.push(`Sitemap index with ${sitemapCount} sub-sitemaps`);
          score += 30;
        }
      } else {
        details.push('sitemap.xml does not appear to be valid XML');
        recommendations.push('Ensure sitemap.xml uses valid XML format');
        score += 10;
      }
    } else {
      details.push('sitemap.xml not found');
      recommendations.push('Create an XML sitemap');
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not check sitemap.xml'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 6. Performance
async function checkPerformance(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const start = Date.now();
    const res = await fetchWithTimeout(urlStr);
    const ttfb = Date.now() - start;
    const body = await res.text();
    const responseSize = Buffer.byteLength(body, 'utf-8');

    // TTFB
    if (ttfb < 500) {
      details.push(`Time to first byte: ${ttfb}ms — excellent`);
      score += 30;
    } else if (ttfb < 1500) {
      details.push(`Time to first byte: ${ttfb}ms — acceptable`);
      score += 20;
    } else {
      details.push(`Time to first byte: ${ttfb}ms — slow`);
      recommendations.push('Improve server response time (TTFB > 1500ms)');
      score += 5;
    }

    // Response size
    const sizeKB = Math.round(responseSize / 1024);
    if (sizeKB < 200) {
      details.push(`Response size: ${sizeKB}KB — lightweight`);
      score += 25;
    } else if (sizeKB < 1000) {
      details.push(`Response size: ${sizeKB}KB — moderate`);
      score += 15;
    } else {
      details.push(`Response size: ${sizeKB}KB — heavy`);
      recommendations.push('Reduce page size for faster loading');
      score += 5;
    }

    // Compression
    const encoding = res.headers.get('content-encoding') || '';
    if (encoding.includes('gzip') || encoding.includes('br') || encoding.includes('deflate')) {
      details.push(`Compression enabled: ${encoding}`);
      score += 25;
    } else {
      details.push('No compression detected');
      recommendations.push('Enable gzip or Brotli compression');
    }

    // Render-blocking scripts
    const $ = cheerio.load(body);
    const headScripts = $('head script[src]').filter((_, el) => {
      const s = $(el);
      return !s.attr('defer') && !s.attr('async');
    });
    if (headScripts.length === 0) {
      details.push('No render-blocking scripts in <head>');
      score += 20;
    } else {
      details.push(`${headScripts.length} render-blocking script(s) in <head>`);
      recommendations.push('Add defer or async to scripts in <head>');
      score += 5;
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not measure performance'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 7. Mobile/Viewport
async function checkMobile(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const res = await fetchWithTimeout(urlStr);
    const html = await res.text();
    const $ = cheerio.load(html);

    const viewport = $('meta[name="viewport"]').attr('content') || '';
    if (viewport) {
      details.push('Viewport meta tag present');
      score += 50;

      if (viewport.includes('width=device-width')) {
        details.push('Includes width=device-width');
        score += 50;
      } else {
        details.push('Missing width=device-width');
        recommendations.push('Add width=device-width to viewport meta tag');
        score += 20;
      }
    } else {
      details.push('Viewport meta tag missing');
      recommendations.push('Add <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not check viewport'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 8. DNS / Email Security
async function checkDNS(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 0;

  try {
    const parsed = new URL(urlStr);
    const domain = parsed.hostname;

    // SPF
    try {
      const records = await dns.resolveTxt(domain);
      const flat = records.map(r => r.join(''));
      const spf = flat.find(r => r.includes('v=spf1'));
      if (spf) {
        details.push('SPF record found');
        score += 50;
      } else {
        details.push('No SPF record found');
        recommendations.push('Add an SPF record to prevent email spoofing');
      }
    } catch {
      details.push('Could not resolve TXT records for SPF');
    }

    // DMARC
    try {
      const records = await dns.resolveTxt(`_dmarc.${domain}`);
      const flat = records.map(r => r.join(''));
      const dmarc = flat.find(r => r.includes('v=DMARC1'));
      if (dmarc) {
        details.push('DMARC record found');
        score += 50;
      } else {
        details.push('No DMARC record found');
        recommendations.push('Add a DMARC record for email authentication');
      }
    } catch {
      details.push('No DMARC record found');
      recommendations.push('Add a DMARC record for email authentication');
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not perform DNS checks'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// 9. Tech Stack Fingerprint
async function checkTechStack(urlStr) {
  const details = [];
  let score = 100; // Informational — always passes

  try {
    const res = await fetchWithTimeout(urlStr);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Server header
    const server = res.headers.get('server');
    if (server) details.push(`Server: ${server}`);

    // X-Powered-By
    const powered = res.headers.get('x-powered-by');
    if (powered) details.push(`X-Powered-By: ${powered}`);

    // Generator
    const generator = $('meta[name="generator"]').attr('content');
    if (generator) details.push(`Generator: ${generator}`);

    // Framework detection
    if (html.includes('wp-content') || html.includes('wp-includes')) details.push('Detected: WordPress');
    if (html.includes('__NEXT_DATA__') || html.includes('_next/')) details.push('Detected: Next.js');
    if (html.includes('__nuxt') || html.includes('/_nuxt/')) details.push('Detected: Nuxt/Vue');
    if (html.includes('ng-version') || html.includes('ng-app')) details.push('Detected: Angular');
    if (html.includes('data-reactroot') || html.includes('__react')) details.push('Detected: React');
    if (html.includes('Shopify.theme')) details.push('Detected: Shopify');
    if (html.includes('squarespace')) details.push('Detected: Squarespace');
    if (html.includes('wix.com') || html.includes('X-Wix')) details.push('Detected: Wix');

    if (details.length === 0) details.push('No specific tech stack identified');
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not analyze tech stack'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations: [] };
}

// 10. Broken Links
async function checkBrokenLinks(urlStr) {
  const details = [];
  const recommendations = [];
  let score = 100;

  try {
    const parsed = new URL(urlStr);
    const res = await fetchWithTimeout(urlStr);
    const html = await res.text();
    const $ = cheerio.load(html);

    const links = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      try {
        const resolved = new URL(href, urlStr);
        if (resolved.hostname === parsed.hostname && resolved.href !== urlStr) {
          links.push(resolved.href);
        }
      } catch { /* ignore invalid URLs */ }
    });

    const unique = [...new Set(links)].slice(0, 10);
    details.push(`Found ${links.length} internal links, checking first ${unique.length}`);

    let broken = 0;
    const results = await Promise.allSettled(
      unique.map(async (link) => {
        try {
          const r = await fetchWithTimeout(link, { method: 'HEAD' });
          return { link, status: r.status };
        } catch {
          return { link, status: 0 };
        }
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        const { link, status: code } = r.value;
        if (code < 200 || code >= 400) {
          broken++;
          details.push(`Broken: ${link} (${code || 'unreachable'})`);
        }
      }
    }

    if (broken > 0) {
      score = Math.max(0, 100 - (broken * 20));
      recommendations.push(`Fix ${broken} broken internal link(s)`);
    } else {
      details.push('All checked internal links returned 200');
    }
  } catch {
    return { score: 0, grade: 'F', status: 'error', details: ['Could not check links'], recommendations: [] };
  }

  return { score, grade: grade(score), status: status(score), details, recommendations };
}

// Main scan runner
async function runScan(url) {
  // Normalize URL
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const [ssl, headers, seo, robots, sitemap, performance, mobile, dnsSec, techStack, brokenLinks] =
    await Promise.allSettled([
      checkSSL(targetUrl),
      checkSecurityHeaders(targetUrl),
      checkSEO(targetUrl),
      checkRobots(targetUrl),
      checkSitemap(targetUrl),
      checkPerformance(targetUrl),
      checkMobile(targetUrl),
      checkDNS(targetUrl),
      checkTechStack(targetUrl),
      checkBrokenLinks(targetUrl),
    ]);

  const errorResult = { score: 0, grade: 'F', status: 'error', details: ['Check failed'], recommendations: [] };

  const results = {
    ssl: ssl.status === 'fulfilled' ? ssl.value : errorResult,
    securityHeaders: headers.status === 'fulfilled' ? headers.value : errorResult,
    seo: seo.status === 'fulfilled' ? seo.value : errorResult,
    robots: robots.status === 'fulfilled' ? robots.value : errorResult,
    sitemap: sitemap.status === 'fulfilled' ? sitemap.value : errorResult,
    performance: performance.status === 'fulfilled' ? performance.value : errorResult,
    mobile: mobile.status === 'fulfilled' ? mobile.value : errorResult,
    dns: dnsSec.status === 'fulfilled' ? dnsSec.value : errorResult,
    techStack: techStack.status === 'fulfilled' ? techStack.value : errorResult,
    brokenLinks: brokenLinks.status === 'fulfilled' ? brokenLinks.value : errorResult,
  };

  // Weighted average
  const weights = {
    securityHeaders: 0.20,
    ssl: 0.15,
    seo: 0.20,
    performance: 0.15,
    mobile: 0.10,
    dns: 0.10,
    robots: 0.025,
    sitemap: 0.025,
    techStack: 0.05,
    brokenLinks: 0.05,
  };

  let overallScore = 0;
  for (const [key, weight] of Object.entries(weights)) {
    overallScore += (results[key]?.score || 0) * weight;
  }
  overallScore = Math.round(overallScore);

  // Count statuses
  const counts = { pass: 0, warn: 0, fail: 0, error: 0 };
  for (const val of Object.values(results)) {
    counts[val.status] = (counts[val.status] || 0) + 1;
  }

  return {
    url: targetUrl,
    scannedAt: new Date().toISOString(),
    overallScore,
    overallGrade: grade(overallScore),
    counts,
    results,
  };
}

module.exports = { runScan };
