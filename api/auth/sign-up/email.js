// Explicit Vercel route for Neon Auth's nested email-signup endpoint.
// The shared proxy handles URL normalization, cookies, and upstream responses.
import handler from '../[...path].js';

export default function signUpEmail(req, res) {
  return handler(req, res);
}
