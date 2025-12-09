import type { AstroCookies } from 'astro';
import { supabase } from './supabase';

const ACCESS_TOKEN_COOKIE = 'sb-access-token';
const REFRESH_TOKEN_COOKIE = 'sb-refresh-token';

export async function getSession(cookies: AstroCookies) {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    // Try to refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (refreshError || !refreshData.session) {
      return null;
    }

    // Update cookies with new tokens
    setAuthCookies(cookies, refreshData.session.access_token, refreshData.session.refresh_token);
    return refreshData.session;
  }

  return data.session;
}

export function setAuthCookies(cookies: AstroCookies, accessToken: string, refreshToken: string) {
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions);
  cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
}

export function clearAuthCookies(cookies: AstroCookies) {
  cookies.delete(ACCESS_TOKEN_COOKIE, { path: '/' });
  cookies.delete(REFRESH_TOKEN_COOKIE, { path: '/' });
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string, accessToken: string) {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const { data, error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateEmail(newEmail: string, accessToken: string) {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const { data, error } = await client.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    throw error;
  }

  return data;
}

