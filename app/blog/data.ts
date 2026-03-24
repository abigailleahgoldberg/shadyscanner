export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: number;
}

export const posts: BlogPost[] = [
  {
    slug: "security-scanning-why-it-matters-2026",
    title: "Security Scanning in 2026: Why It Matters More Than Ever",
    excerpt: "Your website is exposed to more threats than it was five years ago. Here is why you need continuous security scanning.",
    content: `The threat landscape for websites has expanded dramatically. Vulnerability databases grow daily. New attack vectors emerge monthly. The assumption that your website is secure because you built it once and it has not been hacked is a dangerous one.

Security scanning is the automated process of testing your website for known vulnerabilities, misconfigurations, and weaknesses. It checks your code, your dependencies, your infrastructure, your DNS records, and your security headers. It compares what it finds against databases of known vulnerabilities.

Why does this matter? Because a single unpatched vulnerability can expose your entire business. A known vulnerability with a public exploit is often the entry point for attackers. The average time between a vulnerability being discovered and being exploited is measured in days, sometimes hours.

Continuous scanning is the answer. Running a scan once every six months is insufficient. Scanning weekly or daily means you catch problems quickly, while they are still theoretical and before they can be exploited.

The scanning should cover multiple layers: your application code, your third-party dependencies, your infrastructure configuration, your API endpoints, and your data handling. A comprehensive scan is thorough and becomes part of your regular maintenance.

Not all vulnerabilities are critical but all should be addressed. A critical vulnerability needs to be patched immediately. A medium severity issue should be on your roadmap. A low severity issue can be deprioritized but should not be ignored forever.

Security is not a feature. It is a requirement. Scanning is how you prove you are taking it seriously.`,
    date: "2026-03-24",
    category: "Security",
    readTime: 5
  },
  {
    slug: "website-data-protection-compliance-guide-2026",
    title: "Website Data Protection: GDPR, CCPA, and Compliance in 2026",
    excerpt: "How to handle user data responsibly and legally. What regulations you need to know about and how to implement them.",
    content: `If you collect user data on your website — email addresses, names, IP addresses, behavioral data — you are subject to data protection regulations. In the US, it is the CCPA and similar state laws. In Europe, it is the GDPR. Many other countries have their own regulations.

The core principle across all of them is similar: users have rights regarding their data, businesses have obligations regarding how they collect and use that data, and there are consequences for violations.

Under GDPR and similar regulations, you must be transparent about what data you collect, why you collect it, how long you keep it, and who has access to it. You must obtain explicit consent before collecting data beyond what is strictly necessary for your service. You must allow users to access their data, correct it, or request deletion.

Privacy policies are mandatory and they must be specific. A generic policy saying "we protect your data" is insufficient. You must actually explain what data you collect, how you collect it, and what you do with it.

Cookies require specific consent in many jurisdictions. The days of silently tracking users with cookies are over. You need explicit opt-in, usually through a cookie banner that explains what cookies are being set.

Data breaches must be reported. If you are hacked and user data is exposed, you are legally required to notify affected users within a certain timeframe (usually 30-72 hours).

The penalties for non-compliance are severe. GDPR violations can result in fines up to €20 million or 4% of global revenue, whichever is higher. California CCPA violations can result in fines per violation.

Implementing these requirements is not optional. If you collect user data, compliance is mandatory.`,
    date: "2026-03-24",
    category: "Compliance",
    readTime: 6
  },
];
