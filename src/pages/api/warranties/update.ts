import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const id = formData.get('id')?.toString();
  const warranty_start = formData.get('warranty_start')?.toString();
  const warranty_end = formData.get('warranty_end')?.toString();
  
  if (!id || !warranty_start || !warranty_end) {
    return redirect(`/warranties/${id}/edit?error=validation`);
  }

  try {
    const { error } = await supabase
      .from('warranties')
      .update({
        warranty_start,
        warranty_end,
        provider: formData.get('provider')?.toString() || null,
        notes: formData.get('notes')?.toString() || null,
      })
      .eq('id', id);

    if (error) {
      console.error('Warranty update error:', error);
      return redirect(`/warranties/${id}/edit?error=database`);
    }

    return redirect('/warranties');
  } catch (error) {
    console.error('Warranty update error:', error);
    return redirect(`/warranties/${id}/edit?error=server`);
  }
};

