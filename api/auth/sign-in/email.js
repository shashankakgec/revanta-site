// Explicit Vercel route for Neon Auth's nested email-signin endpoint.
// The shared proxy handles URL normalization, cookies, and upstream responses.
import handler from '../../[...path].js';

export default function signInEmail(req, res) {
  return handler(req, res);
}
