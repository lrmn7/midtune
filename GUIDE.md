# Midtune Deployment Guide to Cloudflare

## 1. Preparation

Make sure you have prepared the following:
* **Cloudflare Account**: Create a free account at [cloudflare.com](https://dash.cloudflare.com) if you do not have one yet.
* **Node.js**: Version 18+ installed on your computer.
* **npm**: Package manager (comes with Node.js).
* **Wrangler CLI**: Cloudflare's official tool for deploying applications from the terminal.
* **Midtune Repository**: The project code located locally.
* **Active Domain on Cloudflare**: You must have access to the `listune.app` domain in the Cloudflare dashboard to create the `midwest.listune.app` subdomain.

---

## 2. Install Dependencies

Before running or building the project, install all required libraries.

Open your terminal in the project folder, then run:

```bash
npm install
```

---

## 3. Running the Project Locally

To test the website on your computer (development), run:

```bash
npm run dev
```

The local server will start, usually at `http://localhost:5173`. 
*(Note: Local mode defaults to loading "demo data" instead of data from Cloudflare D1. Stop this process using `Ctrl+C` when no longer in use)*.

---

## 4. Build Project

To test if the code compiles properly (production-ready), run this command:

```bash
npm run build
```

This command runs TypeScript checks and Vite build. The resulting static files will be in the `dist` folder.

---

## 5. Setup Cloudflare D1 (Database)

Midtune uses **Cloudflare D1**, which is a serverless SQLite database.

**Step 1:** Create a D1 database using Wrangler CLI
```bash
npx wrangler d1 create midtune
```
After running this, the terminal will output information like:
```toml
[[d1_databases]]
binding = "DB"
database_name = "midtune-db"
database_id = "xxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
```

**Step 2:** Update the `wrangler.toml` file
Open the `wrangler.toml` file in your project, then insert the `database_id` matching the output from step one. The binding name must be `"DB"`.

**Step 3:** Create table schema and insert initial data (seed)
Run the `.sql` files located in the `db/` folder to the remote database:
```bash
npx wrangler d1 execute midtune --remote --file=db/schema.sql
npx wrangler d1 execute midtune --remote --file=db/seed.sql
```

---

## 6. Environment Variables and Secrets

For the **Admin** (`/admin`) page, the system does not use the database for login, but rather validates the password via environment variables (server-side).

You need two secrets:
1. `ADMIN_SECRET`: The password to log in to the admin panel.
2. `HMAC_KEY`: A long random string (minimum 64 characters) to sign the session token.

**IMPORTANT:** Never put actual values in frontend code or in public configuration files!

For Cloudflare Pages, you add these via CLI before deploying:
```bash
npx wrangler secret put ADMIN_SECRET
npx wrangler secret put HMAC_KEY
```
*(You can also add them manually later in Cloudflare Dashboard > Pages > Midtune > Settings > Variables and Secrets).*

---

## 7. Deploy to Cloudflare Pages

The easiest way to deploy Midtune is directly from the Cloudflare Dashboard with GitHub integration.

1. Log into the **Cloudflare Dashboard**.
2. Select the **Workers & Pages** menu on the left sidebar.
3. Click the **Create Application** button then choose the **Pages** tab.
4. Click **Connect to Git** and link your GitHub account.
5. Select the **Midtune** project repository.
6. Under **Set up builds and deployments**, configure as follows:
   * **Framework preset:** `Vite` (or `React`)
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
7. Click **Save and Deploy**.

Cloudflare will automatically build and publish your website at a `.pages.dev` domain.

---

## 8. D1 Binding in Cloudflare Pages

For the API Functions to communicate with the D1 database, you must connect (bind) D1 to your Pages project in the dashboard.

1. Open your Pages project in the Cloudflare Dashboard.
2. Go to the **Settings** > **Functions** tab.
3. Scroll down to the **D1 database bindings** section.
4. Click **Add binding**.
5. Fill the **Variable name** with `DB`. *(Important! It must be "DB" because the API reads it by this name)*.
6. In the adjacent column, select the **midtune-db** database.
7. Perform a **Redeploy** (rebuild) so this binding is recognized.

---

## 9. Custom Domain Setup

By default, your website gets a domain like `midtune-xxx.pages.dev`. To change it to `midwest.listune.app`:

1. Open your Pages project in the **Cloudflare Dashboard**.
2. Go to the **Custom Domains** tab.
3. Click **Set up a custom domain**.
4. Enter `midwest.listune.app` and click Continue.
5. Since the `listune.app` domain is already managed by Cloudflare, they will handle the DNS (CNAME) settings automatically.
6. Wait for the DNS propagation process (usually less than 5 minutes) and SSL will become active automatically. Check access via `https://midwest.listune.app`.

---

## 10. Admin Protection

Midtune uses **app-level authentication**. 
All API data mutation endpoints (`POST /api/admin/tracks`, `PUT`, `DELETE`) are validated and reject any requests (returning a `401 Unauthorized` error) that do not include a valid Bearer Token. This token is only generated when an admin logs in successfully and is stored in browser memory to remain secure (without persistent cookies or `localStorage`).

**Endpoint Security Testing (Curl):**
Try to perform an HTTP DELETE without a valid login:
```bash
curl -X DELETE https://midwest.listune.app/api/admin/tracks/example-id
```
If correct, the response will return *HTTP 401 Unauthorized*.

**Additional Recommendation (Cloudflare Access):**
In addition to the application login system, it is highly recommended to add **Cloudflare Zero Trust / Access** specifically for the `/admin` URL path. This ensures only users with registered emails (for example, your Google/GitHub login) can open the admin page. Anonymous access will be blocked immediately at the Cloudflare network level before it touches the React application.

---

## 11. Post-Deployment Verification

Perform this checklist after the website is live:

- [ ] Open `https://midwest.listune.app`.
- [ ] Make sure the track list appears (meaning the D1 connection was successful).
- [ ] Test audio (Play/Pause) and ensure the *Floating Mini Player* appears.
- [ ] Click **Download** and watch the numbers increment (refresh the page).
- [ ] Click **Copy Audio URL** and ensure the *toast notification* appears.
- [ ] Open the `https://midwest.listune.app/admin` page.
- [ ] Log in using the password from `ADMIN_SECRET`.
- [ ] Try creating a new Track then go back to the home page, ensure it is displayed.
- [ ] Return to admin, try clicking Delete. You should confirm the dialog modal, then the track will be hard-deleted.
- [ ] Check *Recently Added* and the total track count on *Home*, ensure the data is synced and cleared of old cache.

---

## 12. Troubleshooting

Some common issues that frequently occur:

* **No songs appearing:**
  Ensure *D1 Binding* (`DB` variable) has been set up (Step 8). Try redeploying afterward.
* **Cannot log in as Admin:**
  Ensure `ADMIN_SECRET` and `HMAC_KEY` have been properly set in the Settings > Environment Variables menu.
* **Build failed / Vite Error:**
  Ensure the build script is `tsc --noEmit && vite build`. If `vite-tsconfig-paths` causes errors (in newer Vite versions), make sure the plugin is removed from `vite.config.ts`.
* **After deletion, the track still appears on the public page:**
  Cloudflare caching might be holding the request. Midtune defaults to `Cache-Control: no-store` on public API endpoints so instant invalidation occurs. If not, clear the cache manually (Purge Cache) in the *Caching* tab of the Cloudflare dashboard.
* **Audio does not play (CORS):**
  Ensure the URL of the mp3/wav file (for example, in AWS S3 or a separate file server) has been configured with the `Access-Control-Allow-Origin: *` header on that server.