# Happy Tooth

A responsive dental clinic website with an appointment request form. Hosted on Vercel, source-controlled in GitHub, and backed by Neon Postgres.

## Structure
- `index.html`, `styles.css`, `script.js`: public clinic website
- `api/appointments.js`: server-side booking validation and appointment insert
- `api/appointments-availability.js`: returns available time slots without exposing patient details
- `vercel.json`: response security headers
- `package.json`: serverless database driver

## Required Vercel environment variables
- `DATABASE_URL`: pooled Neon connection string for the dedicated Happy Tooth database.
- `CLINIC_DASHBOARD_PASSCODE`: temporary demo-only admin passcode. Change before real patient data.
- `ADMIN_SESSION_SECRET`: random signing secret used for the 8-hour HttpOnly admin session cookie.

Keep all values encrypted in Vercel; never place them in browser code or commit them to Git.

## Appointment rules
- Monday–Friday only, in the clinic's `Asia/Kolkata` time zone.
- 9:00 AM through 4:40 PM, with 20-minute slots.
- Booking date must be today through 14 days ahead; past times today are unavailable.
- Each active request reserves its date/time. A database unique index prevents simultaneous duplicate bookings; cancelling a request releases its slot.
- `GET /api/appointments-availability?date=YYYY-MM-DD` returns only available/booked slot times, never patient details.

## Neon schema
Table: `public.happy_tooth_appointments`. Public appointment APIs do not expose patient records; the clinic admin endpoint requires a signed-in session.

## Before sharing with real patients
1. Confirm the clinic's address, phone, email, operating hours, real services, practitioner details, and preferred appointment workflow.
2. Configure `DATABASE_URL` in the Vercel project for Production, Preview, and Development.
3. Deploy and submit a test request; verify it appears in Neon.
4. Rotate the demo admin password and signing secret before staff handle real patient data.
5. Add the clinic's privacy notice and ensure its data-retention/contact process meets applicable requirements.
6. Configure a custom domain if the clinic owns one.

Submitting the form is an appointment request, not a booking confirmation. The website uses placeholders for unverified clinic details and does not claim real staff credentials or testimonials.


## Demo details
The public site intentionally displays sample contact details (123 Smile Street, Ghaziabad; +91 90000 00000; hello@happytooth.example; sample Mon–Sat hours). These are fictional placeholders and must be replaced with verified clinic information. Admin route: `/admin/`. Temporary demo passcode is provided to the project owner separately; rotate it before any real patient data is collected.

## Revanta client dashboard integration
The owner-controlled client portal can display Happy Tooth appointments to the assigned Joe Lee account. Configure `HAPPY_TOOTH_DATABASE_URL` as an encrypted Vercel environment variable on the `revanta-site` project, Preview target, branch `feature/owner-controlled-client-portal`, using the Happy Tooth Neon pooled connection string. Do not expose this connection string in browser code or commit it to Git. The integration reads appointments server-side and is restricted to the account assigned to the Happy Tooth project.
