# Happy Tooth

A responsive dental clinic website with an appointment request form. Hosted on Vercel, source-controlled in GitHub, and backed by Neon Postgres.

## Structure
- `index.html`, `styles.css`, `script.js`: public clinic website
- `api/appointments.js`: server-side form handler; inserts only into Neon and never exposes patient records
- `vercel.json`: response security headers
- `package.json`: serverless database driver

## Required Vercel environment variables
- `DATABASE_URL`: pooled Neon connection string for the dedicated Happy Tooth database.
- `CLINIC_DASHBOARD_PASSCODE`: temporary demo-only admin passcode. Change before real patient data.
- `ADMIN_SESSION_SECRET`: random signing secret used for the 8-hour HttpOnly admin session cookie.

Keep all values encrypted in Vercel; never place them in browser code or commit them to Git.

## Neon schema
Table: `public.happy_tooth_appointments`. The API supports INSERT only; no public endpoint can read patient submissions.

## Before sharing with real patients
1. Confirm the clinic's address, phone, email, operating hours, real services, practitioner details, and preferred appointment workflow.
2. Configure `DATABASE_URL` in the Vercel project for Production, Preview, and Development.
3. Deploy and submit a test request; verify it appears in Neon.
4. Add an authenticated clinic-only appointment management interface before staff need to review requests online.
5. Add the clinic's privacy notice and ensure its data-retention/contact process meets applicable requirements.
6. Configure a custom domain if the clinic owns one.

Submitting the form is an appointment request, not a booking confirmation. The website uses placeholders for unverified clinic details and does not claim real staff credentials or testimonials.


## Demo details
The public site intentionally displays sample contact details (123 Smile Street, Ghaziabad; +91 90000 00000; hello@happytooth.example; sample Mon–Sat hours). These are fictional placeholders and must be replaced with verified clinic information. Admin route: `/admin/`. Temporary demo passcode is provided to the project owner separately; rotate it before any real patient data is collected.
