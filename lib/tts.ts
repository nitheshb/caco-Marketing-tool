import { createClient } from "@deepgram/sdk";
import { supabaseAdmin } from "./supabase";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function generateTTS(
    text: string,
    voice: string,
    modelName: string,
    language: string,
    seriesId: string
) {
    let audioBuffer: Buffer;

    if (modelName === 'deepgram') {
        const response = await deepgram.speak.request(
            { text },
            { model: voice, encoding: 'linear16', container: 'wav' }
        );
        const stream = await response.getStream();
        if (!stream) throw new Error("Failed to get audio stream from Deepgram");

        audioBuffer = await streamToBuffer(stream);
    } else if (modelName === 'fonadalab') {
        const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.FONADA_API_KEY}`
            },
            body: JSON.stringify({
                input: text,
                voice,
                language
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fonadalabs API error: ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
    } else {
        throw new Error(`Unsupported model: ${modelName}`);
    }

    // Upload to Supabase Storage
    const fileName = `${seriesId}/${Date.now()}.mp3`;
    const { data, error } = await supabaseAdmin.storage
        .from('voiceovers')
        .upload(fileName, audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: true
        });

    if (error) {
        // If bucket doesn't exist, this might fail. In a real app, you'd ensure it exists.
        console.error("Supabase Storage Error:", error);
        throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('voiceovers')
        .getPublicUrl(fileName);

    return publicUrl;
}

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
    }
    return Buffer.concat(chunks.map(c => Buffer.from(c)));
}
