import type { APIRoute } from 'astro';
import { updatePassword } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  const formData = await request.formData();
  
  const new_password = formData.get('new_password')?.toString();
  const confirm_password = formData.get('confirm_password')?.toString();
  
  if (!new_password || !confirm_password) {
    return redirect('/settings?error=validation');
  }

  if (new_password !== confirm_password) {
    return redirect('/settings?error=password_mismatch');
  }

  if (new_password.length < 6) {
    return redirect('/settings?error=password_short');
  }

  try {
    const session = locals.session;
    if (!session?.access_token) {
      return redirect('/login');
    }

    await updatePassword(new_password, session.access_token);
    
    return redirect('/settings?success=password');
  } catch (error) {
    console.error('Password update error:', error);
    return redirect('/settings?error=server');
  }
};

