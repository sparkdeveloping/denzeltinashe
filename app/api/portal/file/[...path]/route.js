import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getPortalSession } from '../../../../../lib/portal/auth';
import { canAccessClient, findClient } from '../../../../../lib/portal/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ROOT = path.join(process.cwd(), 'data', 'files');

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.pdf') return 'application/pdf';
  return 'application/octet-stream';
}

export async function GET(request, { params }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const resolved = await params;
  const segments = Array.isArray(resolved.path) ? resolved.path : [];
  if (segments.length < 2 || segments.some((segment) => segment.includes('..') || segment.includes('/') || segment.includes('\\'))) {
    return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
  }

  const clientSlug = segments[0];
  const { client } = await findClient(clientSlug);
  if (!client || !canAccessClient(session, client)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const filePath = path.join(ROOT, ...segments);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
  }

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType(filePath),
        'Cache-Control': 'private, max-age=300',
        'Content-Disposition': `inline; filename="${path.basename(filePath).replace(/"/g, '')}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
}
