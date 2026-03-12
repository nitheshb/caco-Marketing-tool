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

function stripCodeFences(text: string) {
    let clean = text.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    return clean.trim();
}

export async function buildPowerPrompt(input: PostersPromptInput): Promise<{ prompt: string; negativePrompt?: string }> {
    const { type, description, requirements, format, style, tone, hasReferenceImage } = input;

    const editHint = hasReferenceImage
        ? '\nIMPORTANT: The user will attach an image. Your prompt must be an EDIT instruction: describe changes to apply TO THAT IMAGE (e.g. replace background, change lighting, add overlay). Preserve the main subject; only modify what the user asks for.'
        : '';

    const prompt = `
You are an expert prompt engineer for creative generation.

Goal: Turn the user's request into a single, extremely effective generation prompt.
The prompt must be detailed, concrete, and easy for a model to follow.

User request:
- Type: ${type}
- What to generate: ${description}
- Requirements: ${requirements || '—'}
- Format: ${format || '—'}
- Style: ${style || '—'}
- Tone: ${tone || '—'}

Rules:
- Output MUST be valid JSON only (no markdown, no code fences).
- JSON must include:
  - "prompt": string (the full final prompt)
  - "negativePrompt": string (optional; keep short, avoid unsafe content)
- For IMAGE:${editHint}
  - ${hasReferenceImage ? 'Write as an edit instruction (e.g. "Replace the background with...", "Change X to Y"). Keep the subject. ' : ''}include composition, layout, typography, background, lighting, rendering style
  - include constraints for legible text and avoid clutter
- For VIDEO:
  - include camera movement, pacing, transitions, and scene direction in a compact way
  - include aspect ratio and duration hints if the user implied them
- Never mention policy or safety in the output.

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

    const negativePrompt = parsed.negativePrompt ? String(parsed.negativePrompt).trim() : undefined;
    return { prompt: finalPrompt, negativePrompt: negativePrompt || undefined };
}

