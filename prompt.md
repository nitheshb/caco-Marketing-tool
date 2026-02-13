# Vidmaxx AI Prompt Documentation (Full Project History)

This document details the AI prompts used throughout the development of Vidmaxx, organized by project phase. More Fromatted one and might be different from the one in the project.

---

## Phase 1: Project Inception & UI Foundation
**Objective**: Build a modern, premium SaaS dashboard for AI video generation.

### Initial App Setup
> "Create a Next.js 14/15 application using TypeScript, Tailwind CSS, and Shadcn UI. Implement a premium, high-aesthetic dashboard with a glassmorphism sidebar, dark/light mode support, and a responsive layout. Focus on vibrant colors and smooth transitions."

### Stepper/Creation Flow (Detailed)

#### 1. Niche Selection
> "Build a 'Niche Selection' step using a Tabs component. The first tab should show a grid of predefined niches (Scary Stories, Motivational, Facts, etc.) each with a unique Lucide icon and color. The second tab should allow for a 'Custom Niche' using a large, high-aesthetic input field. Use card-based selection with hover effects and a primary indigo border for the active state."

#### 2. Language & Voice Selection
> "Implement a 'Language & Voice' selection step. Include a globe-icon Select dropdown for multi-language support (English, Hindi, Spanish, etc.) using country flags. Below, create a scrollable grid of 'Voice Cards' that feature: 
> - Capitalized voice names.
> - Gender & Model badges.
> - A circular Play/Pause button for audio previewing.
> Ensure the voice model (Deepgram/Fonadalab) updates dynamically based on the selected language."

#### 3. Visual Style Selection
> "Create a 'Video Style' step featuring a horizontal scrollable carousel of 9:16 aspect-ratio cards. Each card must have a high-quality preview image, a dark gradient overlay, and bold white typography for styles like Cinematic, Anime, Urban, and Cyberpunk. Add a zoom-in animation on selection and hover."

#### 4. Caption Style Selection
> "Develop a 'Caption Style' selection step with live-preview cards. Each card must showcase a specific typographic theme:
> - **Modern**: Clean, white text with soft shadows.
> - **Neon**: Glowing pink/purple text with stroke effects.
> - **Highlight**: Black text on a yellow 'pop' background.
> - **Pop**: Bouncing, high-contrast kinetic typography.
> - **Classic**: Thick-bordered, traditional social media style."

#### 5. Background Music Selection
> "Design a 'Background Music' selection step using a multi-select list. Each track should have a checkbox, a music icon, and a play button for previewing. Use a clean, indigo-accented card layout for each track."

#### 6. Series Details & Finalization
> "Build a 'Series Details' step to finalize the configuration. Include:
> - A 'Series Name' input field.
> - A 'Video Duration' select menu (30-50s or 50-70s).
> - A 'Publish Time' clock input.
> - A grid of 'Platform Selectors' (TikTok, Instagram, YouTube) with Lucide icons and checkboxes.
> Add a descriptive 'Note' card at the bottom explaining the scheduled generation process."

---

## Phase 2: Database & Backend Architecture
**Objective**: Scalable storage and background processing.

### Supabase Schema
> "Design a Supabase database schema for an AI video generator. 
> - Table `series`: id, user_id, niche, video_style, caption_style, language, voice, duration, status.
> - Table `videos`: id, series_id, title, script (JSON), voiceover_url, captions (JSON), images (JSON), video_url, status.
> Enable Row Level Security (RLS) linked to Clerk authentication."

---

## Phase 3: Core AI Video Pipeline
**Objective**: Connect LLMs and background workers.

### Script & Scene Generation (Gemini)
**Model**: `gemini-2.5-flash`
> "You are a professional video script writer. Generate a script for the [NICHE] in [STYLE] style. Break it into [COUNT] scenes. For each scene, provide:
> 1. The narration text.
> 2. A detailed image generation prompt matching the chosen style.
> Return as raw JSON."

### Image Generation (Replicate -> Google Nano Banana)
**Transition Prompt**:
> "Switch the image generation logic from Replicate's SDXL to Google's Nano Banana (gemini-2.5-flash-image). Ensure character consistency and high speed."

---

## Phase 4: Video Rendering (Remotion)
**Objective**: Dynamic video composition.

### Remotion Composition
> "Create a Remotion project that takes an array of image URLs and an audio URL. 
> - Sequence images with a 'Ken Burns' Pan & Zoom effect.
> - Implement word-by-word synchronized captions using timestamps.
> - Add premium styling to captions (Neon, Pop, Modern) with spring animations.
> - Optimize for AWS Lambda rendering."

---

## Phase 5: Notifications & Polishing
**Objective**: User engagement and feedback.

### Plunk Email Notification
> "Integrate Plunk to send an email when a video is ready. Create a premium HTML template with:
> - Video Title & Series Name.
> - A large thumbnail preview of the first scene.
> - Large 'View' and 'Download' buttons with indigo/purple gradients.
> Trigger this step inside the Inngest workflow."

---

---

## Phase 6: Advanced Post-Production & Refinement
**Objective**: Professional-grade video aesthetics and audio.

### Advanced Caption Styling
> "Enhance the Remotion `Composition.tsx` with dynamic caption animations. Implement a 'Word-by-Word' pop effect where each word scales up briefly when spoken. Add support for multiple themes (Giant, Neon, Highlight) with specific font families and drop shadows for maximum readability on mobile devices."

### Audio Engineering
> "Update the audio processing logic to include background music ducking. When the voiceover is active, the background music volume should automatically lower to 20%, then return to 100% during silence. Ensure the final mixed audio is normalized to -3dB."

---

## Phase 7: Social Media Automation (Expansion)
**Objective**: Native publishing to Meta and TikTok ecosystems.

### Instagram/Facebook Publishing
> "Implement a server-side route using the Facebook Graph API to publish videos as Reels. 
> - Handle the multi-step upload process (Initialize -> Upload Bin -> Finalize).
> - Map the AI-generated summary to the Instagram Caption.
> - Ensure 100% compliance with Meta's video requirement (1080x1920, H.264)."

### TikTok Publishing (V2)
> "Integrate the TikTok for Developers API (v2) for automated video posting.
> - Implement the Chunked Upload workflow for reliability.
> - Use the Clerk social connection token to authenticate.
> - Auto-generate trending hashtags based on the video niche using Gemini."

---

## Phase 8: Analytics & User Insights
**Objective**: Data-driven content strategy for users.

### Performance Dashboard
> "Create a high-aesthetic 'Analytics Dashboard' in the dashboard. Use Recharts to visualize:
> - Video view counts across all platforms.
> - Engagement metrics (Likes, Comments, Shares).
> - Generation success rate and credit usage.
> Fetch this data by polling social platform APIs periodically using Inngest."

---

## Phase 9: Enterprise & UX Enhancements
**Objective**: Scalability and user creative control.

### Advanced Editor UI
> "Build a 'Review & Edit' step in the creation flow. Before rendering, allow users to:
> - Edit the AI-generated script.
> - Regenerate specific images if they don't match the intent.
> - Change the background music track.
> Update the Inngest workflow to accept these manual overrides."

### Enterprise Admin Panel
> "Develop a hidden `/admin` dashboard for system operators.
> - View all active users and their current subscription tiers.
> - Monitor total API costs (Google, Deepgram, AWS).
> - Manually trigger or cancel stalled video generations."

---

## Utility Prompts
### Real-time Status Updates
> "Update the Inngest workflow to provide immediate feedback. When generation starts, insert a record with 'processing' status. As each asset (script, voice, images) is ready, update the DB so the UI can show progress."

### Error Recovery & Auto-Retry
> "Implement a robust error handling strategy in Inngest. If an image or voice generation fails, attempt an automatic retry with a fallback model (e.g., switch to a different TTS provider). Notify the user only if the final render fails after 3 attempts."
