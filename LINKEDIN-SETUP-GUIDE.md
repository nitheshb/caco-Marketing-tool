# LinkedIn Posting Setup Guide (Hello Stores)

This guide walks you through configuring LinkedIn posting in the Marketing Tool so you can post to your **Hello Stores** page.

---

## Overview

When you connect LinkedIn:
1. Your **personal profile** gets connected
2. Any **pages you admin** (like Hello Stores) also get connected automatically
3. When you publish content, it goes to all connected LinkedIn accounts (personal + pages)

---

## Step 1: Create a LinkedIn Developer App

1. Go to **[LinkedIn Developers](https://www.linkedin.com/developers/apps)**
2. Click **"Create app"**
3. Fill in:
   - **App name:** e.g. "Hello Stores Marketing"
   - **LinkedIn Page:** Select your **Hello Stores** page (or create one if needed)
   - **Privacy policy URL:** Your website or a placeholder
   - **App logo:** Optional
4. Agree to the terms and click **Create app**

---

## Step 2: Add Required Products

1. In your new app, go to the **Products** tab
2. Click **"Request access"** for these products:
   - **Share on LinkedIn** — needed to post content (personal + company pages)
   - **Sign in with LinkedIn using OpenID Connect** — needed for login
   - **Advertising API** (optional but recommended for token refresh)
3. Complete any forms LinkedIn asks for
4. Wait for approval if needed (usually quick for Share on LinkedIn)

---

## Step 3: Configure OAuth Redirect URI

1. Go to the **Auth** tab of your app
2. Under **OAuth 2.0 settings**, find **Authorized redirect URLs**
3. Click **Add redirect URL**
4. Add your callback URL:

   **Production (live site):**
   ```
   https://YOUR-DOMAIN.com/api/settings/social/callback/linkedin
   ```

   **Local development:**
   ```
   http://localhost:3000/api/settings/social/callback/linkedin
   ```

5. Replace `YOUR-DOMAIN.com` with your actual app URL (e.g. `agentelephant.ai`)
6. Click **Update**

---

## Step 4: Copy Your Credentials

1. Still on the **Auth** tab
2. Find:
   - **Client ID** — copy it
   - **Client Secret** — click **Show** and copy it

---

## Step 5: Add Credentials in the Marketing Tool

1. Open your Marketing Tool and go to **Settings**
2. Scroll to **Social Media Connections**
3. Click the **"Manage OAuth Credentials"** (or **"Credentials"**) button near the top
4. In the modal:
   - **Platform:** Select **LinkedIn**
   - **App Name:** e.g. `Hello Stores`
   - **Client ID:** Paste the Client ID from LinkedIn
   - **Client Secret:** Paste the Client Secret from LinkedIn
5. Click **Save**

---

## Step 6: Connect Your LinkedIn Account

1. Go back to the Settings page
2. Find the **LinkedIn** card
3. Click **"Connect Account"**
4. A dialog will show your saved credentials
5. Click **"Use this Credential"** on your Hello Stores app
6. You will be redirected to LinkedIn
7. Sign in (if needed) and **allow** the app permissions
8. You will be redirected back to Settings

---

## Step 7: Verify Connection

After connecting, you should see:

- Your **personal profile** under LinkedIn (if you allowed it)
- **Hello Stores (Page)** — your company page

Both will appear as separate connected accounts. When you schedule or publish content to LinkedIn, it will post to all connected accounts (personal + Hello Stores page).

---

## Environment Variable (Optional)

If you use environment variables, ensure this is set in `.env`:

```
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
```

Use `http://localhost:3000` for local development. This is used for OAuth redirect URLs.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing integration ID" | Add credentials first (Step 5), then connect |
| "Invalid integration" | Check that Client ID and Client Secret are correct |
| Redirect URI mismatch | Make sure the URL in LinkedIn matches exactly: `.../api/settings/social/callback/linkedin` |
| Hello Stores page not showing | Make sure you’re an **Admin** of the Hello Stores page on LinkedIn |
| Post fails | Reconnect your LinkedIn account in Settings; tokens can expire |

---

## Quick Checklist

- [ ] LinkedIn app created
- [ ] Products added (Share on LinkedIn, OpenID Connect)
- [ ] Redirect URI configured
- [ ] Credentials saved in Marketing Tool
- [ ] LinkedIn connected via "Connect Account"
- [ ] Hello Stores (Page) visible under connections
