import { NextResponse } from 'next/server';
import { get } from '@/lib/store';

export async function GET(request, { params }) {
  const { id } = await params;
  const report = get(id);

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(report);
}
