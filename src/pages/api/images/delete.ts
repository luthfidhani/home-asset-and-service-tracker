import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const id = formData.get('id')?.toString();
  const asset_id = formData.get('asset_id')?.toString();
  const image_url = formData.get('image_url')?.toString();
  
  if (!id || !asset_id) {
    return redirect(`/assets/${asset_id}/images?error=invalid`);
  }

  try {
    // Delete from storage
    if (image_url) {
      try {
        const url = new URL(image_url);
        const path = url.pathname.split('/assets/')[1];
        if (path) {
          await supabase.storage.from('assets').remove([decodeURIComponent(path)]);
        }
      } catch (e) {
        console.error('Storage deletion error:', e);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('asset_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Image deletion error:', error);
      return redirect(`/assets/${asset_id}/images?error=delete_failed`);
    }

    return redirect(`/assets/${asset_id}/images?success=deleted`);
  } catch (error) {
    console.error('Image deletion error:', error);
    return redirect(`/assets/${asset_id}/images?error=server`);
  }
};

