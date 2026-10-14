# Mekina Market

Responsive parts marketplace landing page based on the supplied reference and Mekina Market logo. Includes buyer request and supplier registration forms, English, Amharic, Tigrinya, Afaan Oromo and Somali UI, Netlify Functions API, protected admin views, CSV export, and launch-document drafts.

## Recommended hosting: Netlify + Cloudflare DNS

The project is configured for repository-based Netlify deployment. Netlify hosts the static site and serverless API; Netlify Blobs stores submissions. Cloudflare manages your domain's DNS. The beginner walkthrough is in the supplied hosting guide PDF.

1. Unzip the project and create a GitHub repository.
2. Import that repository into Netlify. Configuration is in `netlify.toml`; build command `npm run build`, publish directory `dist`, and functions in `netlify/functions`.
3. Set `ADMIN_TOKEN` in Netlify project environment variables. Never place it in browser code or commit `.env`.
4. Add your custom domain in Netlify. If Cloudflare will provide DNS, update nameservers at your registrar to the pair shown in Cloudflare, add the records Netlify specifies, and initially use DNS-only (gray cloud).
5. Finish business setup and replace all privacy/terms draft fields before advertising. See `docs/LAUNCH.md`.

Provider interfaces change. Follow the current values shown in your Netlify and Cloudflare dashboards, and preserve existing email DNS records when changing nameservers.

## Local preview

Requires Node.js 20 or newer. Run `npm install`, then `npm start`, and open `http://localhost:3000`.

The local Node server uses `.env` and stores development submissions in `data/submissions.json`. Netlify deployment uses `netlify/functions/api.mjs` and Netlify Blobs instead. Do not use local sample data as a production backup.

## Project contents

- `index.html`, `styles.css`, `app.js`: site and client interactions.
- `logo.svg`, `public/`: supplied logo and public site assets.
- `netlify.toml`, `scripts/build.js`: Netlify build and publish configuration.
- `netlify/functions/api.mjs`: serverless API and Netlify Blobs data storage.
- `server.js`: local development server and optional Node host implementation.
- `privacy.html`, `terms.html`: drafts requiring business and legal review.
- `docs/LAUNCH.md`, `docs/OPERATIONS.md`: launch and maintenance steps.
- `.env.example`: local server settings template; do not upload real secrets.

## Language coverage

The selector offers English, Amharic, Tigrinya, Afaan Oromo and Somali. Some secondary text or validation may still fall back to English. Have fluent speakers review and complete every translation before promoting those languages.
