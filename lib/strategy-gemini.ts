import { model } from './gemini';

export interface StrategyPostInput {
  day: number;
  platform: string;
  content_type: string;
  theme: string;
  idea: string;
  caption: string;
  goal: string;
  status: string;
}

export interface GenerateStrategyInput {
  businessType: string;
  brandName: string;
  targetAudience: string;
  goal: string;
  platforms: string[];
  theme?: string;
  durationDays: number;
}

export function getStrategyGeneratePrompt(input: GenerateStrategyInput): string {
  const { businessType, brandName, targetAudience, goal, platforms, theme, durationDays } = input;
  const platformList = platforms.join(', ');
  const themeHint = theme ? `Campaign theme/focus: ${theme}. ` : '';

  return `
You are an expert social media marketing strategist. Generate a ${durationDays}-day content strategy for the following:

Business Type: ${businessType}
Brand Name: ${brandName}
Target Audience: ${targetAudience}
Goal: ${goal}
Platforms: ${platformList}
${themeHint}

Requirements:
- Create exactly ${durationDays} days of content. Distribute posts across the platforms. Not every day needs a post; vary the posting schedule naturally.
- Each post must have: day (1-${durationDays}), platform, content_type, theme, idea, caption, goal, status
- content_type must be one of: reel, carousel, image, video, text_post
- platform must be one of: ${platforms.map(p => p.toLowerCase()).join(', ')}
- goal must be one of: increase_followers, increase_sales, brand_awareness, engagement
- status must be: planned
- theme examples: festival, educational, promotion, behind_the_scenes, product_launch, seasonal, etc.
- idea: short catchy title for the post concept (e.g. "Holi outfit styling tips")
- caption: 1-2 sentence caption suggestion

Return ONLY a valid JSON object. No markdown, no code blocks, no extra text.
{
  "posts": [
    {
      "day": 1,
      "platform": "instagram",
      "content_type": "reel",
      "theme": "festival",
      "idea": "Example idea title",
      "caption": "Short caption suggestion",
      "goal": "engagement",
      "status": "planned"
    }
  ]
}
`;
}

export async function generateStrategyPosts(input: GenerateStrategyInput): Promise<StrategyPostInput[]> {
  const prompt = getStrategyGeneratePrompt(input);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text) throw new Error('No response from AI');

  // Strip markdown code blocks if present
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(clean);
  const posts = Array.isArray(parsed.posts) ? parsed.posts : [];
  if (!posts.length) throw new Error('No posts generated');

  return posts.map((p: Record<string, unknown>) => ({
    day: Number(p.day) || 1,
    platform: String(p.platform || 'instagram').toLowerCase(),
    content_type: String(p.content_type || 'image').toLowerCase().replace(/\s/g, '_'),
    theme: String(p.theme || 'general'),
    idea: String(p.idea || ''),
    caption: String(p.caption || ''),
    goal: String(p.goal || 'engagement').toLowerCase().replace(/\s/g, '_'),
    status: 'planned',
  }));
}
