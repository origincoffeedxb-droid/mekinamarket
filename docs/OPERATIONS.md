# Operations

## Netlify deployment

Production uses the Git-connected Netlify site. Push approved code changes to the connected GitHub branch; Netlify runs `npm run build`, publishes `dist`, and deploys `netlify/functions`. Review deploy logs after releases. Use a rollback from Netlify if a deployment causes a problem.

## Admin access and secret

Open `https://YOUR-DOMAIN/#supplier-view` and enter the `ADMIN_TOKEN` configured in Netlify project environment variables. The browser holds the token for that tab session. Buyer and supplier records, plus CSV export, require the token. Never commit or publish it. Rotate it in Netlify and redeploy if it may have been exposed.

## Production data

The Netlify Function writes submissions to Netlify Blobs. Review current Netlify Blobs plan limits and retention terms. Restrict Netlify account access to trusted administrators. Periodically review records and delete them when no longer needed under the published retention policy. CSV files contain personal information; store and share them securely.

## API endpoints

- `GET /api/health`: health check.
- `POST /api/requests`: validates and stores a buyer request.
- `POST /api/suppliers`: validates and stores a supplier registration.
- `GET /api/admin/requests`: protected buyer request list.
- `GET /api/admin/suppliers`: protected supplier list.
- `GET /api/admin/export.csv`: protected CSV export of buyer requests.

## Local development

Install Node.js 20+, run `npm install`, then `npm start`. Local `server.js` stores records in `data/submissions.json`, separate from Netlify Blobs. Do not mistake local data for production data or rely on a local copy as a production backup.

## Privacy and support

Keep the privacy notice, terms and published data practices accurate. The forms collect personal contact details; limit administrator access and retain only what the business needs. This starter does not send automatic email or messaging notifications, so check new requests through the admin view.
