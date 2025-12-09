import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const asset_id = formData.get('asset_id')?.toString();
  const warranty_start = formData.get('warranty_start')?.toString();
  const warranty_end = formData.get('warranty_end')?.toString();
  
  if (!asset_id || !warranty_start || !warranty_end) {
    return redirect('/warranties/new?error=validation');
  }

  try {
    // Check if warranty already exists for this asset
    const { data: existing } = await supabase
      .from('warranties')
      .select('id')
      .eq('asset_id', asset_id)
      .single();

    if (existing) {
      return redirect('/warranties/new?error=duplicate');
    }

    const { error } = await supabase
      .from('warranties')
      .insert({
        asset_id,
        warranty_start,
        warranty_end,
        provider: formData.get('provider')?.toString() || null,
        notes: formData.get('notes')?.toString() || null,
      });

    if (error) {
      console.error('Warranty creation error:', error);
      return redirect('/warranties/new?error=database');
    }

    return redirect('/warranties');
  } catch (error) {
    console.error('Warranty creation error:', error);
    return redirect('/warranties/new?error=server');
  }
};

