import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    const [
      { count: assets },
      { count: services },
      { count: warranties },
      { count: sales },
    ] = await Promise.all([
      supabase.from('assets').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('warranties').select('*', { count: 'exact', head: true }),
      supabase.from('asset_sales').select('*', { count: 'exact', head: true }),
    ]);

    return new Response(JSON.stringify({
      assets: assets || 0,
      services: services || 0,
      warranties: warranties || 0,
      sales: sales || 0,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Summary fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch summary' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

