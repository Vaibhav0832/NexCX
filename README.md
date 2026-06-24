# NexCX — Website

Premium, enterprise-grade marketing website for **NexCX**, an independent Genesys consulting company. Built as a fully static site — no backend, no server, zero monthly hosting cost beyond domain ownership.

**Stack:** React + Vite + Tailwind CSS + Framer Motion + React Three Fiber (Three.js)

---

## 1. Project Structure

```
nexcx/
├── public/                      # Static assets copied as-is to the build output
│   ├── logo-full.png            # Full NexCX logo (hero, large use)
│   ├── logo-wordmark.png        # Cropped wordmark (navbar, footer)
│   ├── favicon.png              # Browser tab icon
│   ├── robots.txt               # SEO crawler rules
│   ├── sitemap.xml              # SEO sitemap
│   ├── _redirects               # Cloudflare Pages SPA fallback routing
│   └── _headers                 # Cloudflare Pages cache & security headers
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky nav with logo + links
│   │   ├── Hero.jsx             # Hero section with 3D network background
│   │   ├── About.jsx            # About NexCX section
│   │   ├── Services.jsx         # 6 service cards with 3D tilt hover
│   │   ├── WhyNexCX.jsx         # Animated stat counters
│   │   ├── Process.jsx          # 4-step engagement timeline
│   │   ├── Contact.jsx          # Contact form + details
│   │   └── Footer.jsx           # Footer with logo, links, copyright
│   ├── three/
│   │   └── NetworkScene.jsx     # R3F animated particle/node network
│   ├── App.jsx                  # Assembles all sections
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind directives + custom utility classes
├── index.html                   # HTML shell with full SEO meta tags
├── tailwind.config.js           # Design tokens (colors, fonts, gradients)
├── postcss.config.js
├── vite.config.js               # Build config with manual code-splitting
├── package.json
└── .gitignore
```

---

## 2. Run Locally

Requires [Node.js](https://nodejs.org) 18+ installed.

```bash
cd nexcx
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

To build a production bundle and preview it locally:

```bash
npm run build
npm run preview
```

The production build is output to `dist/` — this is the folder you deploy.

---

## 3. Deploy to GitHub

1. Create a new, empty repository on GitHub (e.g. `nexcx-website`). Do **not** initialize it with a README.
2. From inside the `nexcx/` project folder:

```bash
git init
git add .
git commit -m "Initial commit — NexCX website"
git branch -M main
git remote add origin https://github.com/<your-username>/nexcx-website.git
git push -u origin main
```

---

## 4. Deploy to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare to access your GitHub account and select the `nexcx-website` repository.
3. Configure the build settings exactly as follows:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (leave default) |
| Node.js version | 18 or higher (set via environment variable `NODE_VERSION=20` if needed) |

4. Click **Save and Deploy**. Cloudflare will install dependencies, run the build, and deploy automatically. You'll get a free `*.pages.dev` URL within a couple of minutes (e.g. `nexcx-website.pages.dev`) — confirm the site loads correctly there first.

Every future `git push` to `main` will trigger an automatic redeploy.

---

## 5. Connect Your Custom Domain (nexcx.in)

Since you already own `nexcx.in`:

1. In the Cloudflare Pages project, go to **Custom domains** → **Set up a custom domain**.
2. Enter `nexcx.in` and click **Continue**.
3. **If your domain's nameservers are already on Cloudflare:** Cloudflare will detect this automatically and add the correct DNS record (a `CNAME` pointing to your `*.pages.dev` project) for you — just confirm and activate.
4. **If your domain is registered elsewhere (e.g. GoDaddy, Namecheap, BigRock) and not yet on Cloudflare:**
   - Add `nexcx.in` as a new site in your main Cloudflare dashboard (free plan is fine).
   - Cloudflare gives you two nameservers (e.g. `xxx.ns.cloudflare.com`).
   - Log into your domain registrar and update the domain's nameservers to the two Cloudflare ones provided. This can take a few minutes up to 24 hours to propagate.
   - Once Cloudflare shows the zone as **Active**, return to the Pages project → **Custom domains** → add `nexcx.in` again. It will now configure the DNS record automatically.
5. Repeat for `www.nexcx.in` if you want both the bare domain and the `www` subdomain to work (Cloudflare Pages lets you add both and will offer to redirect one to the other).
6. SSL/TLS is automatic and free — Cloudflare issues and renews the certificate for you. Within a few minutes, `https://nexcx.in` will be live.

### DNS Configuration Steps (Summary)

| Step | Action |
|---|---|
| 1 | Move `nexcx.in` DNS to Cloudflare (if not already) by updating nameservers at your registrar |
| 2 | Wait for Cloudflare zone to show "Active" |
| 3 | In Cloudflare Pages → Custom domains → add `nexcx.in` |
| 4 | Cloudflare auto-creates a `CNAME` record: `nexcx.in → nexcx-website.pages.dev` |
| 5 | (Optional) Add `www.nexcx.in` the same way and set a redirect rule |
| 6 | Confirm SSL certificate is issued (usually automatic within minutes) |

---

## 6. Production Build Settings Reference

These are the exact settings Cloudflare Pages needs (also auto-detected from this repo):

```
Build command:        npm run build
Build output directory: dist
Node version:          18+ (20 recommended)
```

No environment variables or secrets are required — this is a fully static site with no backend calls.

---

## 7. Contact Form Options

The contact form currently submits via a `mailto:` link — it opens the visitor's email client pre-filled with their message addressed to `info@nexcx.in`. This requires zero backend and zero monthly cost, but does depend on the visitor having a configured email client.

If you'd prefer an in-page submit (no email client redirect), two free, static-site-friendly options:

- **[Web3Forms](https://web3forms.com)** — free tier, just needs an access key, no signup wall to start.
- **[Formspree](https://formspree.io)** — free tier (50 submissions/month), simple form action swap.

Either way, you'd just change the `<form>`'s submit handler in `src/components/Contact.jsx` to `fetch()` the chosen endpoint instead of building a `mailto:` link — no other architecture changes needed.

---

## 8. Updating the Logo

If you obtain a transparent-background (PNG with alpha or SVG) version of the NexCX logo later, simply replace `public/logo-full.png` and `public/logo-wordmark.png` with the new files (keep the same filenames), and rebuild. No code changes required.

---

## 9. Accessibility & Performance Notes

- Respects `prefers-reduced-motion` — all animations are disabled for users who request it at the OS level.
- All interactive elements have visible keyboard focus states.
- The 3D scene is lazy-loaded and code-split into its own chunk so it never blocks the initial page render.
- Semantic HTML, descriptive `alt` text on all images, and a `ProfessionalService` JSON-LD schema block for richer search results.
