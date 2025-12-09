import type { APIRoute } from 'astro';
import { clearAuthCookies, signOut } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    await signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  clearAuthCookies(cookies);
  
  return redirect('/login');
};

