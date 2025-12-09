import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const asset_id = formData.get('asset_id')?.toString();
  const sold_date = formData.get('sold_date')?.toString();
  const sold_price = parseFloat(formData.get('sold_price')?.toString() || '0');
  
  if (!asset_id || !sold_date || isNaN(sold_price)) {
    return redirect('/sales/new?error=validation');
  }

  try {
    // Check if asset is already sold
    const { data: existing } = await supabase
      .from('asset_sales')
      .select('id')
      .eq('asset_id', asset_id)
      .single();

    if (existing) {
      return redirect('/sales/new?error=already_sold');
    }

    // Get asset purchase price to calculate profit/loss
    const { data: asset } = await supabase
      .from('assets')
      .select('purchase_price')
      .eq('id', asset_id)
      .single();

    const purchase_price = asset?.purchase_price || 0;
    const profit_loss = sold_price - purchase_price;

    // Create sale record
    const { error: saleError } = await supabase
      .from('asset_sales')
      .insert({
        asset_id,
        sold_date,
        sold_price,
        buyer_name: formData.get('buyer_name')?.toString() || null,
        profit_loss,
      });

    if (saleError) {
      console.error('Sale creation error:', saleError);
      return redirect('/sales/new?error=database');
    }

    // Update asset status to sold
    const { error: updateError } = await supabase
      .from('assets')
      .update({ status: 'sold' })
      .eq('id', asset_id);

    if (updateError) {
      console.error('Asset status update error:', updateError);
    }

    return redirect('/sales');
  } catch (error) {
    console.error('Sale creation error:', error);
    return redirect('/sales/new?error=server');
  }
};

