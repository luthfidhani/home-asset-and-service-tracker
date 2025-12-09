import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const id = formData.get('id')?.toString();
  const asset_id = formData.get('asset_id')?.toString();
  const sold_date = formData.get('sold_date')?.toString();
  const sold_price = parseFloat(formData.get('sold_price')?.toString() || '0');
  
  if (!id || !asset_id || !sold_date || isNaN(sold_price)) {
    return redirect(`/sales/${id}/edit?error=validation`);
  }

  try {
    // Get asset purchase price to recalculate profit/loss
    const { data: asset } = await supabase
      .from('assets')
      .select('purchase_price')
      .eq('id', asset_id)
      .single();

    const purchase_price = asset?.purchase_price || 0;
    const profit_loss = sold_price - purchase_price;

    const { error } = await supabase
      .from('asset_sales')
      .update({
        sold_date,
        sold_price,
        buyer_name: formData.get('buyer_name')?.toString() || null,
        profit_loss,
      })
      .eq('id', id);

    if (error) {
      console.error('Sale update error:', error);
      return redirect(`/sales/${id}/edit?error=database`);
    }

    return redirect('/sales');
  } catch (error) {
    console.error('Sale update error:', error);
    return redirect(`/sales/${id}/edit?error=server`);
  }
};

