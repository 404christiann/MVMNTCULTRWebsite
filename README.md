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

## Known Placeholders

- Social links currently use `#` placeholders until Kyle provides exact URLs or handles.
- Contact form currently uses a `mailto:` action. A production version should use a real form handler if Kyle wants reliable submissions.
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
- Confirm whether `info@mvmntcultr.com` is the preferred contact email.
- Confirm whether the Contact form should stay as `mailto:` or move to a hosted form provider.
- Add final office photo/video shoot assets when ready.
- Decide when to connect the real `mvmntcultr.com` domain.
