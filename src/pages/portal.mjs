import clientDashboard from './client-dashboard.mjs';

// The client-facing portal is now the clean lead-only dashboard.
// Keep /client-dashboard available as an equivalent route while /portal remains the familiar link.
export default {
  ...clientDashboard,
  path: '/portal',
  title: 'Client Lead Dashboard | Revanta',
  description: 'Sign in to view leads collected by your Revanta-built website.',
};
