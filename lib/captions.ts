import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function generateCaptions(voiceUrl: string) {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            { url: voiceUrl },
            {
                model: "nova-2",
                smart_format: true,
                punctuate: true,
                utterances: true
            }
        );

        if (error) {
            throw new Error(`Deepgram transcription error: ${error.message}`);
        }

        // Extract words with timestamps
        // Deepgram returns results -> channels -> alternatives -> words
        const words = result.results?.channels[0]?.alternatives[0]?.words;

        if (!words || words.length === 0) {
            throw new Error("No words found in transcription result");
        }

        return {
            words: words.map((w: any) => ({
                text: w.word,
                start: w.start,
                end: w.end,
                confidence: w.confidence
            })),
            duration: result.metadata?.duration || 0
        };

    } catch (error) {
        console.error("Caption Generation Error:", error);
        throw error;
    }
}
