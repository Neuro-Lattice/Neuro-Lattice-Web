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
Since your keys are public in the browser (necessary for client-side sending), you must restrict *where* they can be used.

1. Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/admin).
2. Navigate to **Account** -> **Security** (or API settings).
3. Look for **"Allowed Domains"** or **Origin Whitelist**.
4. Add your new Vercel/Netlify domain (e.g., `neurolattice.vercel.app`).
5. This ensures that even if someone steals your ID, they cannot send emails from their own website.
