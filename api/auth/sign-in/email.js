// Vercel did not route the nested Neon Auth sign-in path to the catch-all
// function in this deployment. Explicitly expose the endpoint used by the
// dashboard and reuse the same-origin proxy implementation.
export { default } from '../[...path].js';
