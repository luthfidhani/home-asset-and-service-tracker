import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  
  if (!id) {
    return redirect('/warranties?error=invalid');
  }

  try {
    const { error } = await supabase
      .from('warranties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Warranty deletion error:', error);
      return redirect('/warranties?error=delete_failed');
    }

    return redirect('/warranties');
  } catch (error) {
    console.error('Warranty deletion error:', error);
    return redirect('/warranties?error=server');
  }
};

