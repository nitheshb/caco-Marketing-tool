import { model } from '@/lib/gemini';

export type PostersGenerateType = 'image' | 'video';

export interface PostersPromptInput {
    type: PostersGenerateType;
    description: string;
    requirements?: string;
    format?: string; // e.g. "16:9 (Landscape)"
    style?: string; // e.g. "Clean & modern"
    tone?: string; // e.g. "Brand-safe"
    /** When true, the user provided a reference image - produce an EDIT instruction, not a from-scratch generation prompt */
    hasReferenceImage?: boolean;
}

/** JSON spec structure for image generation (video-style control) */
export interface ImageJsonSpec {
    scene_style?: string;
    objects?: Array<{ name: string; color?: string; material?: string; position?: string }>;
    lighting?: { type?: string; time_of_day?: string; mood?: string };
    camera?: { type?: string; perspective?: string; focal_length?: string };
    composition?: { layout?: string; aspect_ratio?: string };
    typography?: { style?: string; placement?: string };
    text_overlay?: { content?: string; style?: string };
    background?: string;
    negativePrompt?: string;
}

function stripCodeFences(text: string) {
    let clean = text.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    return clean.trim();
}

const JSON_IMAGE_SPEC_PROMPT = `
You are an expert at creating structured JSON specifications for AI image generation. This JSON format gives surgical control over the output and reduces hallucinations.

Goal: Convert the user's request into a detailed JSON specification. Each element (objects, lighting, camera, etc.) must be listed separately so the model can follow precisely.

User request:
- What to generate: {{description}}
- Requirements: {{requirements}}
- Format: {{format}}
- Style: {{style}}
- Tone: {{tone}}

Output MUST be valid JSON only (no markdown, no code fences). Use this exact structure. Fill every field that applies; use empty strings or omit if not relevant.

{
  "scene_style": "overall aesthetic (e.g. modern minimalist, vintage editorial, bold marketing)",
  "objects": [
    { "name": "object name", "color": "exact color", "material": "material type", "position": "placement hint" }
  ],
  "lighting": { "type": "soft/hard/dramatic", "time_of_day": "golden hour/noon/night", "mood": "warm/cool/neutral" },
  "camera": { "type": "wide/close-up", "perspective": "eye-level/low/high", "focal_length": "if relevant" },
  "composition": { "layout": "rule of thirds/centered", "aspect_ratio": "16:9 or 1:1 etc" },
  "typography": { "style": "bold sans-serif/script", "placement": "center/bottom" },
  "text_overlay": { "content": "exact text if any", "style": "how it should look" },
  "background": "detailed background description",
  "negativePrompt": "short list of what to avoid (blurry, cluttered, etc)"
}

Rules:
- For marketing posters: include typography, text_overlay, and objects (product, logo, etc.)
- For interiors: list every object with name, color, material, position
- For portraits: focus on lighting, camera, composition
- Be specific: "light blue" not "blue"; "matte oak wood" not "wood"
- negativePrompt: 5-10 words max, comma-separated
`;

const JSON_IMAGE_EDIT_SPEC_PROMPT = `
You are an expert at creating structured JSON specifications for AI image EDITING. The user has an existing image and wants to modify specific elements.

Goal: Create a JSON that describes ONLY the changes to apply. Preserve everything else. List each element to modify with its new value.

User wants to change:
- What to modify: {{description}}
- Requirements: {{requirements}}
- Style: {{style}}

Output MUST be valid JSON only. Structure:
{
  "modifications": [
    { "element": "what to change (e.g. armchair)", "property": "color/material/position", "new_value": "exact new value" }
  ],
  "preserve": ["list elements that must stay identical"],
  "lighting": { "type": "...", "time_of_day": "..." } if changing lighting,
  "negativePrompt": "short avoid list"
}

Rules:
- Only include what changes. Omit unchanged elements.
- Be precise: "replace armchair color with light blue velvet"
- preserve: list key elements that must NOT change
`;

export async function buildPowerPrompt(input: PostersPromptInput): Promise<{ prompt: string; negativePrompt?: string }> {
    const { type, description, requirements, format, style, tone, hasReferenceImage } = input;

    // VIDEO: keep original free-form prompt. JSON spec approach is IMAGE-only for now.
    if (type === 'video') {
        const prompt = `
You are an expert prompt engineer for creative generation.

Goal: Turn the user's request into a single, extremely effective generation prompt for VIDEO.
The prompt must be detailed, concrete, and easy for a model to follow.

User request:
- Type: video
- What to generate: ${description}
- Requirements: ${requirements || '—'}
- Format: ${format || '—'}
- Style: ${style || '—'}
- Tone: ${tone || '—'}

Rules:
- Output MUST be valid JSON only (no markdown, no code fences).
- JSON must include: "prompt": string, "negativePrompt": string (optional)
- Include camera movement, pacing, transitions, scene direction
- Include aspect ratio and duration hints if implied
- Never mention policy or safety.

Return JSON:
{"prompt":"...","negativePrompt":"..."}
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (!text) throw new Error('No response from AI');
        const clean = stripCodeFences(text);
        const parsed = JSON.parse(clean) as { prompt?: unknown; negativePrompt?: unknown };
        const finalPrompt = String(parsed.prompt || '').trim();
        if (!finalPrompt) throw new Error('Prompt generation failed');
        return {
            prompt: finalPrompt,
            negativePrompt: parsed.negativePrompt ? String(parsed.negativePrompt).trim() : undefined,
        };
    }

    // IMAGE: JSON spec approach for surgical control and quality (video will be handled separately later)
    const specPrompt = hasReferenceImage
        ? JSON_IMAGE_EDIT_SPEC_PROMPT.replace('{{description}}', description)
              .replace('{{requirements}}', requirements || '—')
              .replace('{{style}}', style || '—')
        : JSON_IMAGE_SPEC_PROMPT.replace('{{description}}', description)
              .replace('{{requirements}}', requirements || '—')
              .replace('{{format}}', format || '—')
              .replace('{{style}}', style || '—')
              .replace('{{tone}}', tone || '—');

    const result = await model.generateContent(specPrompt);
    const text = result.response.text();
    if (!text) throw new Error('No response from AI');

    const clean = stripCodeFences(text);
    let spec: Record<string, unknown>;
    try {
        spec = JSON.parse(clean) as Record<string, unknown>;
    } catch {
        throw new Error('AI did not return valid JSON for image spec');
    }

    const negativePrompt = spec.negativePrompt ? String(spec.negativePrompt).trim() : undefined;

    // Format the final prompt: instruction + JSON (video method)
    const jsonStr = JSON.stringify(spec, null, 2);
    const instruction = hasReferenceImage
        ? 'Modify this image based on the following JSON specification. Apply ONLY the changes specified. Preserve all other elements exactly as they are.\n\n'
        : 'Generate an image based on the following JSON specification. Follow each element precisely. Do not add or remove elements beyond what is specified. Match colors, materials, and layout exactly.\n\n';

    const finalPrompt = instruction + jsonStr;
    return { prompt: finalPrompt, negativePrompt };
}
