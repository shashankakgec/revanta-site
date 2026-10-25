# Happy Tooth

A responsive dental clinic website with an appointment request form. Hosted on Vercel, source-controlled in GitHub, and backed by Neon Postgres.

## Structure
- `index.html`, `styles.css`, `script.js`: public clinic website
- `api/appointments.js`: server-side form handler; inserts only into Neon and never exposes patient records
- `vercel.json`: response security headers
- `package.json`: serverless database driver

## Required Vercel environment variable
Set `DATABASE_URL` to the pooled Neon connection string for the dedicated Happy Tooth database. Keep it encrypted; never place it in browser code or commit it to Git.

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
