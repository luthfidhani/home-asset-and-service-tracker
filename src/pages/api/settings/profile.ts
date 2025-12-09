import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect }) => {
  // Profile updates are handled through email verification
  // This is a placeholder for future enhancements
  return redirect('/settings?success=profile');
};

