import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString();
  const category = formData.get('category')?.toString();
  
  if (!id || !name || !category) {
    return redirect(`/assets/${id}/edit?error=validation`);
  }

  try {
    const { error } = await supabase
      .from('assets')
      .update({
        name,
        category,
        brand: formData.get('brand')?.toString() || null,
        model: formData.get('model')?.toString() || null,
        serial_number: formData.get('serial_number')?.toString() || null,
        location: formData.get('location')?.toString() || null,
        purchase_date: formData.get('purchase_date')?.toString() || null,
        purchase_price: parseFloat(formData.get('purchase_price')?.toString() || '0') || 0,
        condition: formData.get('condition')?.toString() || 'good',
        status: formData.get('status')?.toString() || 'active',
        notes: formData.get('notes')?.toString() || null,
      })
      .eq('id', id);

    if (error) {
      console.error('Asset update error:', error);
      return redirect(`/assets/${id}/edit?error=database`);
    }

    return redirect(`/assets/${id}`);
  } catch (error) {
    console.error('Asset update error:', error);
    return redirect(`/assets/${id}/edit?error=server`);
  }
};

