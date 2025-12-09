import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { generateFileName } from '../../../lib/utils';
import type { Asset } from '../../../lib/database.types';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const name = formData.get('name')?.toString();
  const category = formData.get('category')?.toString();
  
  if (!name || !category) {
    return redirect('/assets/new?error=validation');
  }

  try {
    // Create asset
    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .insert({
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
      .select()
      .single();

    if (assetError || !assetData) {
      console.error('Asset creation error:', assetError);
      return redirect('/assets/new?error=database');
    }

    const asset = assetData as Asset;

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    
    for (const image of images) {
      if (image && image.size > 0) {
        const fileName = `${asset.id}/${generateFileName(image.name)}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, image);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('assets')
            .getPublicUrl(fileName);

          await supabase.from('asset_images').insert({
            asset_id: asset.id,
            image_url: urlData.publicUrl,
            image_type: 'asset',
          });
        }
      }
    }

    return redirect(`/assets/${asset.id}`);
  } catch (error) {
    console.error('Asset creation error:', error);
    return redirect('/assets/new?error=server');
  }
};
