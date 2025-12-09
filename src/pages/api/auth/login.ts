import type { APIRoute } from 'astro';
import { signIn, setAuthCookies } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/login?error=missing_fields');
  }

  try {
    const { session } = await signIn(email, password);
    
    if (!session) {
      return redirect('/login?error=invalid_credentials');
    }

    setAuthCookies(cookies, session.access_token, session.refresh_token);
    
    return redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/login?error=invalid_credentials');
  }
};

