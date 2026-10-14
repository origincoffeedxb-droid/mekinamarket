# Launch guide: Netlify + Cloudflare

This project is prepared for a Git-connected Netlify site and Cloudflare-managed DNS. Netlify hosts the front end, serverless API and Blobs storage. Use the companion beginner PDF for step-by-step instructions.

## 1. Finish business content

- In `app.js`, replace the WhatsApp number, Telegram username and email placeholders in `CONFIG` with verified business contacts.
- Confirm service cities, part categories and supplier types.
- Review English, Amharic, Tigrinya, Afaan Oromo and Somali translations with fluent speakers. Several secondary strings and validation messages may fall back to English.
- Replace all `[REPLACE ...]` fields in `privacy.html` and `terms.html`. These are drafts, not legal advice; obtain local review and publish accurate privacy, retention and contact details.
- Decide who will read and respond to leads. The site stores submissions; it does not automatically contact the business.

## 2. Put the project in GitHub

Extract the supplied project ZIP. Create an empty GitHub repository and push the project files (not the ZIP file). Keep `.env`, tokens, and collected customer data out of Git. `.gitignore` excludes local secrets and data.

## 3. Deploy to Netlify

- Choose **Add new project / Import an existing project** and connect the GitHub repository.
- Select the repository and production branch. Approve repository access.
- `netlify.toml` sets build command `npm run build`, publish directory `dist`, and functions directory `netlify/functions`.
- Deploy and review the generated `*.netlify.app` URL.
- In **Project configuration → Environment variables**, add `ADMIN_TOKEN` with a long, randomly generated secret. Never add it to `app.js`, `index.html`, GitHub, or a public document. Save and redeploy after adding or changing it.
- Confirm `https://YOUR-SITE.netlify.app/api/health` returns JSON with `ok: true`. Netlify Blobs stores submissions.
- Open `https://YOUR-SITE.netlify.app/#supplier-view`, enter the token, and confirm protected admin records and CSV export are available.

## 4. Connect Cloudflare DNS and your domain

- Add your domain in Cloudflare and review scanned DNS records. Copy existing MX and TXT records used for email before changing nameservers.
- At the domain registrar, replace current nameservers with the exact pair assigned by Cloudflare. Propagation takes time. Preserve email records in Cloudflare DNS.
- In Netlify, add the domain under **Domain management**. Follow Netlify external DNS verification and copy the exact records it shows.
- Typical Netlify records may use `www` CNAME pointing to your site's `*.netlify.app` name and an apex/root record. Netlify may provide a flattened CNAME target or an A record such as `75.2.60.5`; use the exact values displayed in your own project.
- In Cloudflare DNS, create the records Netlify specifies. Start with **DNS only** (gray cloud). Wait until Netlify verifies the domain and provisions HTTPS.
- Set the preferred primary domain in Netlify and test both root and `www`.
- Test the custom domain using HTTPS. Keep the gray cloud initially. If later enabling Cloudflare proxy (orange cloud), first verify Netlify HTTPS works and set Cloudflare SSL/TLS to **Full (strict)**. Do not use Flexible mode.

## 5. Pre-launch review

- Check layout, logo, forms and language selector on phone, tablet and desktop.
- Submit clearly labeled test buyer and supplier records; confirm admin view and CSV export work. Delete test records using an appropriate secure maintenance method before going live.
- Confirm `ADMIN_TOKEN` is set in Netlify only and is absent from Git history and client files.
- Verify contacts and lead response process.
- Complete privacy/terms drafts and obtain appropriate review.
- Verify custom domain, HTTPS, DNS and email records.
- Review current Netlify plan limits for Functions and Blobs and assign an owner to monitor deployments and leads.

## 6. Keep it current

Edit files locally, commit and push changes to GitHub; Netlify will build and deploy them. Check Netlify deploy logs if a build fails. See [OPERATIONS.md](OPERATIONS.md).

## Local alternative

For a local preview, install Node.js 20+, run `npm install`, then `npm start` and visit `http://localhost:3000`. `server.js` stores local records in `data/submissions.json`; production Netlify uses Functions and Blobs.
