import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  
  if (!id) {
    return redirect('/services?error=invalid');
  }

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Service deletion error:', error);
      return redirect('/services?error=delete_failed');
    }

    return redirect('/services');
  } catch (error) {
    console.error('Service deletion error:', error);
    return redirect('/services?error=server');
  }
};

