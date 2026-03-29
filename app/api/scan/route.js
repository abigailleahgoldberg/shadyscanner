import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { runScan } from '@/lib/scanner';
import { save } from '@/lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    let parsed;
    try {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      parsed = new URL(normalized);
      if (!parsed.hostname.includes('.')) throw new Error('Invalid hostname');
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const id = uuidv4();
    const results = await runScan(url);
    const report = { id, ...results };

    save(id, report);

    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ error: 'Scan failed: ' + e.message }, { status: 500 });
  }
}
