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
- Assets organized under `assets/images` and `assets/team-logos`.
- `.gitignore` excludes `.DS_Store`, `.vercel`, `node_modules`, and `.env*`.

## Contact Form

The contact form posts to [Web3Forms](https://web3forms.com) (`https://api.web3forms.com/submit`) and is
delivered by email to `info@mvmntcultr.com`. Web3Forms forwards submissions to email and does not
store them, which is deliberate: the form invites people to describe medical complaints, so that
content is never persisted in a database by us.

Behaviour:

- Submission is handled by `fetch` in `script.js`, so the visitor stays on the page.
- `replyto` is set to the submitter's email address, so Kyle can reply directly from his inbox.
- `botcheck` is Web3Forms' honeypot field. It is visually hidden, `tabindex="-1"`, and `aria-hidden`.
- Success and error states render in `#form-status`. On failure the message surfaces the clinic
  phone number and email so an inquiry is never silently lost.
- The `<form>` still has a real `action` and `method="POST"`, so submission degrades gracefully if
  JavaScript fails to load.

### Required before launch

The `access_key` hidden input in `contact/index.html` is set to
`REPLACE_WITH_WEB3FORMS_ACCESS_KEY`. Until a real key is in place, every submission fails and the
visitor sees the error state. To get one, enter `info@mvmntcultr.com` at
<https://web3forms.com> and paste the UUID that arrives by email into that input.

## Known Placeholders

- Social links currently use `#` placeholders until Kyle provides exact URLs or handles.
- Web3Forms `access_key` is a placeholder. See "Required before launch" above.
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
