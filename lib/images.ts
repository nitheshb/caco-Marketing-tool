import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "./supabase";

// COMMENTED OUT REPLICATE
/*
import Replicate from "replicate";
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
*/

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

export async function generateImages(
    scenes: { sceneId: number; imagePrompt: string }[],
    seriesId: string
) {
    const images = [];

    for (const scene of scenes) {
        console.log(`Generating image for scene ${scene.sceneId} using Google Nano Banana (gemini-2.5-flash-image)...`);

        try {
            const result = await model.generateContent(scene.imagePrompt);
            const response = await result.response;

            // Extract image from multimodal response parts
            const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

            if (!part || !part.inlineData) {
                console.error("Google AI Response:", JSON.stringify(response, null, 2));
                throw new Error(`Google Nano Banana did not return an image for scene ${scene.sceneId}`);
            }

            const buffer = Buffer.from(part.inlineData.data, 'base64');

            // Upload to Supabase Storage
            const fileName = `${seriesId}/scene-${scene.sceneId}-${Date.now()}.png`;
            const { data, error } = await supabaseAdmin.storage
                .from('images')
                .upload(fileName, buffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                console.error(`Supabase Storage Error (scene ${scene.sceneId}):`, error);
                throw new Error(`Failed to upload image to Supabase: ${error.message}`);
            }

            // Get Public URL
            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('images')
                .getPublicUrl(fileName);

            images.push({
                sceneId: scene.sceneId,
                url: publicUrl
            });
        } catch (error) {
            console.error(`Error generating image for scene ${scene.sceneId}:`, error);
            throw error;
        }
    }

    return images;
}
