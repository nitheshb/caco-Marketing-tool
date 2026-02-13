# Vidmaxx: AI Video Generator and Scheduler

Vidmaxx is a premium, high-aesthetic SaaS application that automates the creation and scheduling of short-form videos for social media. Using cutting-edge AI for scriptwriting, image generation, and voiceovers, Vidmaxx handles the entire production pipeline and publishes directly to YouTube, Instagram, and TikTok.

## 🚀 Features
- **AI-Powered Workflows**: Automatically generates scripts, images, and voiceovers based on your chosen niche.
- **Premium Video Styling**: High-quality Remotion-based rendering with kinetic typography and cinematic effects.
- **Automated Scheduling**: Set your publish time and let Vidmaxx handle the daily generation and posting.
- **Multi-Platform Support**: Integrated with YouTube (OAuth), Instagram (Graph API), and TikTok (V2 API).
- **Usage Tracking**: Built-in billing and credit system with real-time usage monitoring.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- **Backend Workers**: Inngest (Serverless workflows).
- **Creative AI**: 
  - **Text/Script**: Google Gemini 2.5 Flash.
  - **Images**: Google Nano Banana (via Gemini APIs).
  - **Audio**: Deepgram & Fonada.
- **Video Engine**: Remotion (AWS Lambda).
- **Infrastructure**: Supabase (Database/RLS), Clerk (Auth/Billing), Plunk (Emails).

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd vidmaxx
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and populate it with the keys generated in the next section. Refer to `.env.example` for the required keys.

### 4. Run Locally
```bash
# Start the Next.js dev server
npm run dev

# Start Inngest Dev Server (Required for local workflows)
npx inngest-cli@latest dev
```

---

## 🔑 API Key Setup Guide

### 1. Supabase (Database)
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  In **Project Settings > API**, copy the `URL` and `anon public` key.
3.  Copy the `service_role` key from the same page (keep this secret).
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Clerk (Authentication & Billing)
1.  Create an application at [Clerk](https://clerk.com/).
2.  Enable Email and Social logins.
3.  In **API Keys**, copy your publishable and secret keys.
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`

### 3. Google Gemini (AI Script & Images)
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Generate a new API Key.
    - `GEMINI_API_KEY`

### 4. Deepgram (Voice/TTS)
1.  Sign up at [Deepgram](https://deepgram.com/).
2.  Create an API Key with 'Administrator' or 'Member' permissions.
    - `DEEPGRAM_API_KEY`

### 5. Fonada (Advanced Audio)
1.  Get your API Key from your [Fonada Dashboard](https://fonada.com/).
    - `FONADA_API_KEY`

### 6. AWS (Remotion Rendering)
Vidmaxx uses Remotion Lambda for ultra-fast GPU-based video rendering.
1.  Create an AWS account and an IAM User with `AdministratorAccess` (for setup).
2.  Install the [Remotion Lambda CLI](https://www.remotion.dev/docs/lambda/install).
3.  Deploy your function: `npx remotion lambda functions deploy`.
4.  Get your `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` from IAM.
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `REMOTION_LAMBDA_REGION`
    - `REMOTION_LAMBDA_SERVE_URL` (Generated after `npx remotion lambda sites create`)

### 7. Google Cloud (YouTube Publishing)
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a project and enable the **YouTube Data API v3**.
3.  Configure the **OAuth Consent Screen** (External).
4.  Create **OAuth 2.0 Client IDs** (Web Application).
5.  Set the redirect URI: `http://localhost:3000/api/settings/social/callback/youtube`.
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`

### 8. Meta for Developers (Instagram Reels)
1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Create an App and add **Instagram Graph API**.
3.  Setup the redirect URI for your callback.
    - `FACEBOOK_CLIENT_ID`
    - `FACEBOOK_CLIENT_SECRET`

### 9. Plunk (Email)
1.  Sign up at [Plunk](https://useplunk.com/).
2.  Copy your API Key from the dashboard.
    - `PLUNK_API_KEY`

---

## 🏗️ Production Build
To create an optimized production build:
```bash
npm run build
```
Note: Ensure Node.js memory limit is increased for the build process (handled automatically in the build script via `NODE_OPTIONS='--max-old-space-size=4096'`).

## 📄 License
This project is licensed under the MIT License.
# caco-Marketing-tool
