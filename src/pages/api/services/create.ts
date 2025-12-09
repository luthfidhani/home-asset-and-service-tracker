import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { generateFileName } from '../../../lib/utils';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const asset_id = formData.get('asset_id')?.toString();
  const service_date = formData.get('service_date')?.toString();
  
  if (!asset_id || !service_date) {
    return redirect('/services/new?error=validation');
  }

  try {
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        asset_id,
        service_date,
        problem_description: formData.get('problem_description')?.toString() || null,
        repair_action: formData.get('repair_action')?.toString() || null,
        service_place: formData.get('service_place')?.toString() || null,
        cost: parseFloat(formData.get('cost')?.toString() || '0') || 0,
        status: formData.get('status')?.toString() || 'completed',
      })
      .select()
      .single();

    if (error) {
      console.error('Service creation error:', error);
      return redirect('/services/new?error=database');
    }

    // Handle receipt upload
    const receipt = formData.get('receipt') as File;
    
    if (receipt && receipt.size > 0) {
      const fileName = `receipts/${asset_id}/${generateFileName(receipt.name)}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, receipt);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('assets')
          .getPublicUrl(fileName);

        await supabase.from('asset_images').insert({
          asset_id,
          image_url: urlData.publicUrl,
          image_type: 'receipt',
        });
      }
    }

    return redirect('/services');
  } catch (error) {
    console.error('Service creation error:', error);
    return redirect('/services/new?error=server');
  }
};

