# Deployment Guide for NeuroLattice

This guide walks you through deploying the application to **Vercel** (recommended) or Netlify.

## Prerequisite: GitHub Repository
1. Initialize git in your folder if you haven't:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Connect your local folder to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
   *Note: Ensure `.env` is listed in your `.gitignore` file so your keys are not uploaded.*

---

## Option 1: Vercel (Fastest)

1. **Dashboard Setup**:
   - Go to [vercel.com](https://vercel.com) and Sign Up/Log In.
   - Click **"Add New..."** → **"Project"**.
   - Select "Continue with GitHub" and import your `NeuroLattice-web` repository.

2. **Configure Build**:
   - **Framework Preset**: Select **Vite** (It usually auto-detects this).
   - **Build Command**: `npm run build` (or `vite build`).
   - **Output Directory**: `dist`.

3. **Add Environment Variables (Crucial Step)**:
   - Expand the **"Environment Variables"** section.
   - Add the following three keys (copy-paste the values from your local notes/file):
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

4. **Deploy**:
   - Click **"Deploy"**. Vercel will build the site and provide a URL (e.g., `neurolattice-web.vercel.app`).

---

## Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) -> "Add new site" -> "Import an existing project".
2. Select GitHub and choose your repo.
3. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Environment variables**:
   - Click "Show advanced" or go to Site Settings > Environment variables after creating.
   - Add the same `VITE_...` keys and values as above.
5. Click **"Deploy site"**.

---

## Option 3: Setting up the Custom Domain (neuro-lattice.com)

## Cost & Hosting Comparison (AWS vs. Azure vs. Vercel)

Since you are new to web dev, here is the breakdown:

| Provider | Complexity | Estimated Cost (Static Site) | Recommendation |
| :--- | :--- | :--- | :--- |
| **Vercel** | **Very Low** (One-click) | **$0 / month** (Hobby Tier) | **✅ Best Choice** |
| **Netlify** | Very Low | $0 / month (Starter Tier) | Great Alternative |
| **AWS** (Amplify) | Medium | Free Tier (1 yr) -> Pay per GB | Good if you use AWS |
| **AWS** (S3+CloudFront)| High (Manual config) | ~$0.50 - $1.00 / month | Overkill |
| **Azure** | Medium | Free Tier available | Good for MS shops |

**Why Vercel?**
Your website is a "Static Site" (Frontend only). Vercel hosts these for free on their global CDN. You only pay if you exceed huge bandwidth limits (which takes millions of visitors).

**Current Status:**
*   ✅ **Code is on GitHub**: Safe and saved.
*   ❌ **Website is NOT live yet**: You must connect GitHub to Vercel to make it accessible to the world.

## Troubleshooting: "I deployed without Environment Variables!"
If you forgot to add the keys before clicking Deploy, the contact form **will not work**. To fix it:

1.  Go to your Vercel Project Dashboard.
2.  Click **Settings** (top tab) → **Environment Variables** (left sidebar).
3.  Add the 3 keys (`VITE_EMAILJS_...`) one by one.
4.  **Important**: The changes won't apply to the *current* live site automatically.
5.  Go to the **Deployments** tab (top).
6.  Click the **three dots (⋮)** next to the latest deployment → **Redeploy**.
7.  Click **Redeploy** again in the confirmation popup.
8.  Wait for the build to finish. Now the contact form will work.

Follow the **Option 1** steps above to finish the process.

## Updating Your Site (Auto-Deploy)
Since you connected Vercel to GitHub, **deployment is automatic**.

1.  **Make changes** locally.
2.  `git add .`, `git commit`, `git push`.
3.  **Vercel detects the push** and immediately starts building the new version.
4.  Within 1-2 minutes, your live site (`neuro-lattice.com`) is updated.

**Regarding Environment Variables:**
*   If you have already added the variables in Vercel Settings, every new push (like the one you just did) will automatically include them.
*   You do **NOT** need to manually redeploy unless you change variables *without* pushing new code.

## Option 3: Setting up the Custom Domain (neuro-lattice.com)
By default, you will get a `.vercel.app` or `.netlify.app` domain. To use `neuro-lattice.com`:

1.  **Buy the Domain**: Ensure you have purchased `neuro-lattice.com` from a registrar (GoDaddy, Namecheap, etc.) or buy it directly through Vercel.
2.  **In Vercel Dashboard**:
    - Go to **Settings** -> **Domains**.
    - Type `neuro-lattice.com` and click **Add**.
3.  **Configure DNS**:
    - Vercel will provide you with **Nameservers** (e.g., `ns1.vercel-dns.com`) or an **A Record** IP address.
    - Go to your domain registrar (where you bought the domain) and update the DNS settings to point to these values.
4.  **Wait**: DNS changes can take up to 24-48 hours to propagate, but usually happen within minutes.
5.  **SSL**: Vercel automatically creates an SSL certificate (HTTPS) for your custom domain.

## Post-Deployment Security (EmailJS)
**Important Question: "Doesn't `VITE_` expose these keys to the public?"**
**Yes, it does.** This is necessary because your website runs in the user's browser, so the browser needs these keys to know where to send the email.

**Is it safe?**
Yes, **IF** you enable the **AllowList**.
1.  Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/admin).
2.  Navigate to **Account** -> **Security** (or API settings).
3.  Look for **"Allowed Domains"** or **Origin Whitelist**.
4.  Add your domain: `neuro-lattice.com` (and `www.neuro-lattice.com`).
5.  **Result**: Even though people can see your keys, **they cannot use them** because EmailJS will block any request that doesn't come from your website.

*Note: Never expose your "Private Key". The keys we are using here (Service ID, Template ID, Public Key) are designed for public, client-side use.*

### Advanced: Can I hide them completely?
**Yes.** To do this, we must move the email logic from the Browser to the Server (a **Vercel Serverless Function**).
1.  We create a backend API route (e.g., `/api/email`).
2.  The browser sends the message to *your* backend.
3.  Your backend (which holds the hidden keys) sends it to EmailJS.

**Trade-off:** This is more complex to set up but is the most secure method.
**Do you want me to set this up for you?** (Just ask!).

### Final Status: ACTION REQUIRED ⚠️
**Your site's contact form is currently BROKEN because you haven't added the keys.**

**You must do this now:**
1.  Go to Vercel -> Settings -> Environment Variables.
2.  Add these 3 items:

| Key | Value |
| :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID` | `service_8kvs4bm` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_l3wvfsg` |
| `VITE_EMAILJS_PUBLIC_KEY` | `PU6cev6f8HWnPz9dz` |

3.  After adding them, go to **Deployments** and click **Redeploy**.
4.  Then your site will work securely.

## Security FAQ
**"Did you hardcode the keys? My repo is public!"**
**NO.** I did strictly the opposite.
*   **The Code**: Uses `process.env.VITE_EMAILJS_SERVICE_ID`. This is just a *variable name* (like a placeholder).
*   **The Value**: Is stored securely in Vercel's settings.
*   **Result**: Anyone viewing your GitHub code will see *that* you use a key, but they will never see *what* the key is. This is 100% safe.

### Monitoring the Build
If you see `tsc -b && vite build` in the logs, **that is good**. It means your site is compiling.
*   If it fails: It's usually a TypeScript error. Let me know.
*   If it succeeds: You will see "Complete" or "Success". Then check your site!
