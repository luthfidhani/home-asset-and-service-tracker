import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const id = formData.get('id')?.toString();
  const asset_id = formData.get('asset_id')?.toString();
  const service_date = formData.get('service_date')?.toString();
  
  if (!id || !asset_id || !service_date) {
    return redirect(`/services/${id}/edit?error=validation`);
  }

  try {
    const { error } = await supabase
      .from('services')
      .update({
        asset_id,
        service_date,
        problem_description: formData.get('problem_description')?.toString() || null,
        repair_action: formData.get('repair_action')?.toString() || null,
        service_place: formData.get('service_place')?.toString() || null,
        cost: parseFloat(formData.get('cost')?.toString() || '0') || 0,
        status: formData.get('status')?.toString() || 'completed',
      })
      .eq('id', id);

    if (error) {
      console.error('Service update error:', error);
      return redirect(`/services/${id}/edit?error=database`);
    }

    return redirect('/services');
  } catch (error) {
    console.error('Service update error:', error);
    return redirect(`/services/${id}/edit?error=server`);
  }
};

