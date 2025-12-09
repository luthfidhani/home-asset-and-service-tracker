import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { generateFileName } from '../../../lib/utils';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const asset_id = formData.get('asset_id')?.toString();
  const image_type = formData.get('image_type')?.toString() || 'asset';
  const image = formData.get('image') as File;
  
  if (!asset_id || !image || image.size === 0) {
    return redirect(`/assets/${asset_id}/images?error=validation`);
  }

  try {
    const fileName = `${asset_id}/${generateFileName(image.name)}`;
    
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return redirect(`/assets/${asset_id}/images?error=upload_failed`);
    }

    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase.from('asset_images').insert({
      asset_id,
      image_url: urlData.publicUrl,
      image_type,
    });

    if (dbError) {
      console.error('Image record error:', dbError);
      // Try to clean up uploaded file
      await supabase.storage.from('assets').remove([fileName]);
      return redirect(`/assets/${asset_id}/images?error=database`);
    }

    return redirect(`/assets/${asset_id}/images?success=true`);
  } catch (error) {
    console.error('Image upload error:', error);
    return redirect(`/assets/${asset_id}/images?error=server`);
  }
};

