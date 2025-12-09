import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  const asset_id = formData.get('asset_id')?.toString();
  
  if (!id) {
    return redirect('/sales?error=invalid');
  }

  try {
    // Delete sale record
    const { error } = await supabase
      .from('asset_sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Sale deletion error:', error);
      return redirect('/sales?error=delete_failed');
    }

    // Revert asset status to active
    if (asset_id) {
      await supabase
        .from('assets')
        .update({ status: 'active' })
        .eq('id', asset_id);
    }

    return redirect('/sales');
  } catch (error) {
    console.error('Sale deletion error:', error);
    return redirect('/sales?error=server');
  }
};

