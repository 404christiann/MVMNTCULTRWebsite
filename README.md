# MVMNT CULTR Website Mockup

Static website mockup for MVMNT CULTR, Dr. Kyle "Simi" Simkovich's performance chiropractic and sports-medicine clinic in Arcadia, CA.

## Current Status

- Mockup sent to client for review on July 30, 2026.
- GitHub repo: https://github.com/404christiann/MVMNTCULTRWebsite
- Vercel production: https://mvmntcultrwebsite.vercel.app
- Vercel project: `mvmntcultrwebsite`
- Primary booking link: https://movementprescribed.janeapp.com/
- September 16, 2026: homepage clinic-hours weekly schedule approved and implemented locally;
  desktop/mobile and automatic day highlighting verified. This change has not been deployed.

## Site Direction

The site is built to feel like elite sports-medicine credibility without becoming intimidating for everyday clients. The main direction is clean, professional, and direct: black, white, and `#FFBF00` gold with large condensed headings, strong photography, and simple navigation.

The core positioning is credibility first, booking second. Booking is always available through the `Book Now` button, but the mockup is designed to show experience, personability, and clinical standards before pushing appointments.

## Pages

### Home

- Full-screen hero using facility imagery.
- Desktop pill navigation with Home, About, Contact, and a yellow Book Now button; the full logo and wordmark move into the compact navigation group on scroll.
- Mobile keeps the top-right hamburger; the closed header turns white on scroll, while the open menu uses the black, warm-white, and gold site palette.
- Mobile hamburger drawer with Home, About, Contact, and Book Now.
- "The MVMNT CULTR method" section with a yellow heading, black background, and three open care columns; stacked rows on mobile. All care details remain visible without interaction. The heading plays the approved 1.45-second gold light sweep once when it enters view, and stays static for reduced-motion preferences.
- Partner logo carousel using supplied team logo assets.
- "Welcome to MVMNT CULTR" service cards.
- Clinic hours with a seven-day schedule, automatic Pacific-time day highlight, and Book now CTA.
- ID Forest Medicine Consulting section.
- Compact white social row with “Keep in touch.” and Instagram, TikTok, and Facebook text links.

### About

- Redesigned around Dr. Simi's portrait.
- Professional black/gold gradient hero-style profile section.
- Compact black social row with “Keep in touch.” and gold social icons beside the platform names.
- Studio-style location section with the clinic photo, floating address card, and direct directions/booking links.

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

## Approved Navigation

The full-wordmark design from `design-previews/navigation-options.html#wordmark` is
implemented locally on Home, About, and Contact. Desktop starts with the logo on the
left, a centered 252 × 52px dark navigation pill, and a separate 124 × 52px yellow
Book Now button on the right. Scrolling past 80px brings the full wordmark, navigation,
and the selected compact-block booking button into one 504 × 52px dark navbar. The yellow
104 × 36px button sits inside the shell with an 8px edge inset. It expands again below
70px to avoid threshold flicker. Links use equal gaps, balanced padding, and light text
without selection backgrounds. The approved direction came from option 2 in
`design-previews/book-button-options.html`.

At 860px and below, the existing top-right hamburger opens a full-screen black menu with
warm-white links, a gold active state, and the gold **Book Now** button using its existing
Jane URL. The menu supports
Escape, keyboard focus wrapping, scroll locking, and automatic closure on desktop resize.
Short screens can scroll the drawer. Navigation transitions respect reduced motion.
The header entrance uses opacity only so it does not change the fixed drawer's positioning.

Previous navigation verification covered desktop 1440 × 900, mobile 390 × 844, and the
861px desktop boundary. The booking-button and mobile-palette update was browser checked at
1280 × 720, 863px desktop, and 391 × 843, including active-page styling, compact scroll state,
desktop/mobile booking visibility, the black-and-gold mobile menu, and Escape/scroll-lock
cleanup. JavaScript syntax and diff checks passed. Existing page content and other in-progress
edits were preserved. No contact forms were submitted. These changes have not been pushed or
deployed.

## About Page Visit Section

The Studio split concept from `design-previews/visit-options.html#studio` is implemented
locally at `/about/#visit`. The final version uses a live Google map without the
photo/map switch. Desktop places the copy beside the map; at 700px and below, the copy
and two equally sized buttons stack above the map and floating address card.

**Get directions** opens Google Maps for 26 La Porte St, Suite A, Arcadia, CA 91006.
**Book a visit** opens the existing Jane booking page. Both links open a new tab, use
centered text, and have no arrows. The pin icons remain in the section label and address
card. The map has a lower ledge so the floating address card does not obscure Google
controls or attribution.

Desktop and mobile visuals, map loading, button sizes, link destinations, and absence of
horizontal overflow were checked. JavaScript syntax and diff checks passed. The About
markup outside this section was compared with the pre-change file and preserved. No
booking or form submission occurred. This work has not been pushed or deployed.

## Homepage Clinic Hours

The approved design is option 1, **Weekly schedule**, from
[`design-previews/clinic-hours-options.html`](design-previews/clinic-hours-options.html#weekly).
It takes inspiration from the [Framer Business Hours component](https://www.framer.com/marketplace/components/business-hours/)
and is implemented directly in the static site, with no Framer dependency.

The white section follows Services and precedes the consulting section. Desktop shows the
heading, supporting copy, booking button, and Arcadia address on the left, with the full weekly
schedule in a rounded card on the right. At widths of 700px and below, the content stacks and
the full-width Book now button appears below the schedule. Both button variants link to the
existing Jane booking page; only the appropriate variant is displayed at each width.

The current schedule remains:

| Days | Hours (Pacific time) |
| --- | --- |
| Monday–Friday | 9:00 am–7:00 pm |
| Saturday | By appointment |
| Sunday | Closed |

### Automatic day highlighting

`script.js` uses `Intl.DateTimeFormat` with `America/Los_Angeles` to identify the clinic's current
day, independently of the visitor's time zone. The matching row receives a pale gold background,
a dot, bold text, and `aria-current="date"`. It refreshes on page load, every minute while the
page is open, and when the tab becomes visible again. Pacific daylight saving changes are handled
by the browser's time-zone rules; there is no hardcoded date or annual rollover to maintain.

This highlights the current day only, not live appointment availability or an open/closed status.
The weekly hours are static content: holiday closures and schedule changes still require editing.
Without JavaScript, all seven days and the booking link remain available without the highlight.

### Maintenance and verification

- Homepage markup and hours: `index.html`, section `#clinic-hours`, rows marked `data-clinic-day`.
- Scoped styling: `.home-hours-*` rules in `styles.css`.
- Day selection and refresh: `clinicHourRows` block in `script.js`.
- The Contact page's separate hours were not changed by this homepage redesign; keep both
  schedules consistent when updating actual operating hours.
- Verified locally on September 16, 2026 at 1280px desktop and 390px mobile: all seven days,
  correct day highlight, responsive booking-button placement, no horizontal overflow, and no
  browser console errors. Booking destinations were checked; no appointment was submitted.
- Script checks covered Pacific midnight rollover, Saturday/Sunday, daylight saving transitions,
  return-to-tab refresh, and a future year. `node --check script.js` and `git diff --check` passed.
- Local review: http://127.0.0.1:4174/#clinic-hours. Production deployment remains pending.

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

## Approved Social Text Links

Option 1, **Text links**, from `design-previews/social-four-directions.html#text` is
implemented locally on Home and About. Both use “Keep in touch.” with unboxed
Instagram, TikTok, and Facebook links. Both use the brand yellow (`#FFBF00`) for icons and hover underlines. Home uses
white (`#FFFFFF`) with ink text (`#080808`); About uses ink with the site’s
warm-white text (`#F8F7F2`). Desktop is a 104px row; phones show the heading above
one horizontal link row. Links retain their existing profile destinations and open
in a new tab, with accessible labels, 44px tap targets, visible keyboard focus, and
subtle gold hover underlines. Reduced motion disables the underline transition.

Verified in the browser on desktop and at 390px and 320px widths for both pages,
including overflow, link destinations, and keyboard focus. Not pushed or deployed.

Social visibility fix: social rows are excluded from scroll-reveal animations. On tall
desktop screens, the homepage footer prevented the row from reaching the old 84%
viewport trigger, leaving it hidden. The row now renders visibly from page load.

## Approved Performance Insight Section

The **Clear split** design from `design-previews/performance-options.html#split`
is implemented on the homepage at `#member-support`, between Clinic hours and
Keep in touch. Desktop pairs the headline and member introduction with one panel:
white for every-member support and charcoal for movement-plan access to Dr. Simi.
The approved gold icons, copy, rounded corners, and second-opinion note are retained.
At 620px and below, the introduction sits above the stacked panel.

Verified visually on desktop and at 390px and 320px phone widths, with no horizontal
overflow at either phone width or at 768px. This is a local implementation; not pushed
or deployed.
