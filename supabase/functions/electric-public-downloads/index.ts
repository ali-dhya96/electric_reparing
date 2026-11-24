// ELECTRIC SYSTEM — public, read-only latest-download metadata for the landing page.
// Deploy as a NEW Edge Function named electric-public-downloads.
// Set "Verify JWT" OFF: visitors do not sign in to view download links.
// NEVER put SUPABASE_SERVICE_ROLE_KEY in HTML, JS or public repositories.
import { createClient } from 'npm:@supabase/supabase-js@2';

const HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=60',
  'X-Content-Type-Options': 'nosniff',
};
const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: HEADERS,
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const appType = Deno.env.get('PUBLIC_DOWNLOAD_APP_TYPE') || 'center';
const db = supabaseUrl && serviceRole
  ? createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

type Release = {
  version_name: string;
  build_number: number;
  download_url: string;
  release_notes: string | null;
  file_size_bytes: number | null;
  published_at: string | null;
};

function safeRelease(input: Record<string, unknown> | null): Release | null {
  if (!input) return null;
  const rawUrl = String(input.download_url || '');
  let url: URL;
  try { url = new URL(rawUrl); }
  catch { return null; }
  if (url.protocol !== 'https:') return null;
  const version = String(input.version_name || '').trim();
  if (!/^\d+\.\d+\.\d+(?:[-+][\w.]+)?$/.test(version)) return null;
  return {
    version_name: version,
    build_number: Number(input.build_number) || 0,
    download_url: url.href,
    release_notes: typeof input.release_notes === 'string'
      ? input.release_notes.slice(0, 500) : null,
    file_size_bytes: typeof input.file_size_bytes === 'number'
      ? input.file_size_bytes : null,
    published_at: typeof input.published_at === 'string'
      ? input.published_at : null,
  };
}

async function latestFor(platform: 'android' | 'ios'): Promise<Release | null> {
  if (!db) throw new Error('SERVER_CONFIGURATION_MISSING');
  const { data, error } = await db.from('electric_app_releases')
    .select('version_name,build_number,download_url,release_notes,file_size_bytes,published_at')
    .eq('app_type', appType)
    .eq('platform', platform)
    .eq('is_published', true)
    .not('download_url', 'is', null)
    .order('build_number', { ascending: false })
    .limit(25);
  if (error) throw error;
  const rows = (data || []) as Record<string, unknown>[];
  for (const row of rows) {
    const release = safeRelease(row);
    if (release) return release;
  }
  return null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: HEADERS });
  }
  if (request.method !== 'GET') return respond({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
  if (!db) return respond({ ok: false, error: 'SERVER_CONFIGURATION_MISSING' }, 503);
  try {
    const [android, ios] = await Promise.all([latestFor('android'), latestFor('ios')]);
    return respond({
      ok: true,
      app_type: appType,
      checked_at: new Date().toISOString(),
      releases: { android, ios },
    });
  } catch (error) {
    console.error('PUBLIC_RELEASE_METADATA_ERROR', error);
    return respond({ ok: false, error: 'RELEASE_LOOKUP_FAILED' }, 503);
  }
});
