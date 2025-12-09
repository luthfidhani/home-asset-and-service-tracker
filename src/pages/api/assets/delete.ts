import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  
  if (!id) {
    return redirect('/assets?error=invalid');
  }

  try {
    // Get all images for this asset to delete from storage
    const { data: images } = await supabase
      .from('asset_images')
      .select('image_url')
      .eq('asset_id', id);

    // Delete images from storage
    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const url = new URL(img.image_url);
        const path = url.pathname.split('/assets/')[1];
        return path;
      }).filter(Boolean);

      if (filePaths.length > 0) {
        await supabase.storage.from('assets').remove(filePaths);
      }
    }

    // Delete asset (cascade will delete related records)
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Asset deletion error:', error);
      return redirect('/assets?error=delete_failed');
    }

    return redirect('/assets?success=deleted');
  } catch (error) {
    console.error('Asset deletion error:', error);
    return redirect('/assets?error=server');
  }
};

