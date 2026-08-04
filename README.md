# MVMNT CULTR Website Mockup

Static website mockup for MVMNT CULTR, Dr. Kyle "Simi" Simkovich's performance chiropractic and sports-medicine clinic in Arcadia, CA.

## Current Status

- Mockup sent to client for review on July 30, 2026.
- GitHub repo: https://github.com/404christiann/MVMNTCULTRWebsite
- Vercel production: https://mvmntcultrwebsite.vercel.app
- Vercel project: `mvmntcultrwebsite`
- Primary booking link: https://movementprescribed.janeapp.com/

## Site Direction

The site is built to feel like elite sports-medicine credibility without becoming intimidating for everyday clients. The main direction is clean, professional, and direct: black, white, and `#FFBF00` gold with large condensed headings, strong photography, and simple navigation.

The core positioning is credibility first, booking second. Booking is always available through the `Book Now` button, but the mockup is designed to show experience, personability, and clinical standards before pushing appointments.

## Pages

### Home

- Full-screen hero using facility imagery.
- Transparent desktop/mobile navigation that turns white on scroll or when the mobile menu opens.
- Mobile hamburger drawer with Home, About, Contact, and Book Now.
- "A clinic experience that connects wellness, rehab, and performance" card row.
- Partner logo carousel using supplied team logo assets.
- "Welcome to MVMNT CULTR" service cards.
- Clinic hours section.
- ID Forest Medicine Consulting section.
- Socials section with Instagram, TikTok, Yelp, Facebook, and X placeholders.

### About

- Redesigned around Dr. Simi's portrait.
- Professional black/gold gradient hero-style profile section.
- Socials section replacing the older education/experience/care model row.
- Location section with address and embedded Google map.

### Contact

- Professional inquiry form layout.
- Clinic contact details.
- Jane booking CTA.
- Clinic hours.
- Same black/gold gradient direction as the About page.

## Implemented Details

- Multi-page static structure:
  - `/`
  - `/about/`
  - `/contact/`
- Mobile-friendly navigation with hamburger menu.
- White mobile menu open state to avoid gray/translucent header mismatch.
- Mobile-only slide hints for horizontal card sections.
- Responsive sections tuned for desktop and mobile.
- Assets organized under `assets/images` and `assets/team-logos`, all WebP.
- Only images actually referenced by a page are kept in the repo. Six unused files
  (`dr-simi.png`, `force-plate.jpg`, `info-post.png`, `logo-lockup.png`, `training-rack.jpg`,
  `waiting-room.jpg`) were removed in commit `249b1e1`'s successor and remain recoverable from git
  history: `git checkout <commit>^ -- assets/images/<file>`.
- `.gitignore` excludes `.DS_Store`, `.vercel`, `node_modules`, and `.env*`.

## Contact Form

The form posts to `/api/contact`, a Vercel serverless function that relays the submission to the
clinic by email through [Resend](https://resend.com). It writes nothing to a database and does not
log submission content: the form invites people to describe medical complaints, so that content
lives in email and nowhere else.

A hosted form service (Web3Forms, Formspree) was rejected for this reason. Both store submissions —
Web3Forms' privacy policy states submission data is kept in an AWS database for up to three years
and that submitter IP and email are shared with CleanTalk and Akismet for spam filtering. Resend's
free plan retains data for one day.

Behaviour:

- Submission is handled by `fetch` in `script.js`, so the visitor stays on the page.
- `reply_to` is the submitter's address, so Kyle can reply straight from his inbox.
- `botcheck` is a honeypot: visually hidden, `tabindex="-1"`, `aria-hidden`. When tripped the
  function returns success and sends nothing, so bots learn nothing.
- Success and error states render in `#form-status`. On failure the message surfaces the clinic
  phone number and email, so an inquiry is never a dead end.
- The `<form>` keeps a real `action` and `method="POST"`. Without JavaScript the browser posts
  normally, the function accepts form-encoded bodies, and redirects to `/contact/?sent=1`, which
  `script.js` reads to show the banner.
- User input is HTML-escaped before it goes into the email body.

### Environment variables

Set these in Vercel > Project Settings > Environment Variables. Changing them requires a redeploy
to take effect. `.env.local` mirrors them for `vercel dev` only and is gitignored — the deployed
site never reads it.

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From the Resend dashboard. Without it the function returns 500. |
| `CONTACT_TO` | no | Defaults to `info@mvmntcultr.com`. |
| `CONTACT_FROM` | no | Defaults to `MVMNT CULTR Website <onboarding@resend.dev>`. |

### Sender domain — cross-project dependency

Mail is sent from `noreply@auth.onziofutbol.com`. That domain is verified in a Resend account whose
free plan allows only one domain, and the slot belongs to the Onzio platform. This was a deliberate
call: it works today with no DNS changes, and because these emails only travel inbound to the
clinic, no patient ever sees the sending address.

The cost is a dependency between two unrelated projects. **If `auth.onziofutbol.com` is ever
removed or unverified in Resend, this contact form stops delivering, and it will fail quietly.**
The clean fix is a separate Resend account owned by the clinic, with `send.mvmntcultr.com`
verified; then only `CONTACT_FROM` and `RESEND_API_KEY` change.

### Switching to the real domain

`mvmntcultr.com` is registered at GoDaddy, which also hosts its DNS. Two things live there that must
not be disturbed:

- **Google Workspace MX records** (`aspmx.l.google.com` and friends). `info@mvmntcultr.com` is a real
  mailbox and depends on them.
- **An existing SPF record**, `v=spf1 include:dc-aa8e722993._spfm.mvmntcultr.com ~all`. A domain may
  have only one SPF record, so any future email-sending setup belongs on a subdomain such as
  `send.mvmntcultr.com`, never the root.

To point the site at Vercel, change the apex `A` record at GoDaddy to `76.76.21.21` and delete the
second apex `A` record. `www` is a CNAME to the apex and follows automatically.

Do **not** accept Vercel's offer to switch the nameservers to `ns1.vercel-dns.com`. That moves DNS
off GoDaddy and drops the Google Workspace MX records, breaking clinic email.

## Known Placeholders

- Yelp and X icons were removed for launch; Kyle had no profiles to link. The Instagram, TikTok, and
  Facebook icons carry real URLs.
- The form still sends from `onboarding@resend.dev` to a test inbox. See "Switching to the real
  domain" above.
- ID Forest Medicine Consulting copy is a placeholder area for Kyle's new consulting work.
- Additional office photos/videos can be added after the new shoot is ready.

## Local Preview

Run a local static server from this folder:

```bash
python3 -m http.server 4174
```

Then open:

```text
http://127.0.0.1:4174/
```

## Deployment Notes

The site is deployed on Vercel as a static project. No framework or build step is required.

Useful commands:

```bash
vercel deploy
vercel deploy --prod
vercel inspect https://mvmntcultrwebsite.vercel.app
```

Future pushes to `main` should trigger Vercel deployments because the GitHub repository is connected to the Vercel project.

## Next Client Review Items

- Confirm exact social profile links.
- Confirm final clinic hours.
- Add final office photo/video shoot assets when ready.
- Connect the real `mvmntcultr.com` domain (registered at GoDaddy) once the UI is finalized.
