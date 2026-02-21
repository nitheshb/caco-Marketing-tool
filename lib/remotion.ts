import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda-client';

const region = (process.env.REMOTION_LAMBDA_REGION as any) || 'us-east-1';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-3-3-95';
const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL || '';

export const triggerVideoRender = async (props: any) => {
    try {
        if (!serveUrl) {
            throw new Error('REMOTION_LAMBDA_SERVE_URL is not set');
        }

        const { renderId, bucketName } = await renderMediaOnLambda({
            region,
            functionName,
            serveUrl,
            composition: 'MainVideo',
            inputProps: props,
            codec: 'h264',
            concurrency: 5, // Keep low to avoid AWS account concurrency limits
            downloadBehavior: {
                type: 'download',
                fileName: `video-${Date.now()}.mp4`,
            },
        });

        console.log(`Render started: ${renderId}`);
        return { renderId, bucketName };
    } catch (error) {
        console.error('Error triggering video render:', error);
        throw error;
    }
};

export const pollRenderStatus = async (renderId: string, bucketName: string) => {
    const maxAttempts = 120; // 10 minutes (5s interval)
    let attempts = 0;

    while (attempts < maxAttempts) {
        const progress = await getRenderProgress({
            renderId,
            bucketName,
            region,
            functionName,
        });

        if (progress.fatalErrorEncountered) {
            throw new Error(`Render failed: ${progress.errors[0]?.message}`);
        }

        if (progress.done) {
            console.log('Render completed successfully');
            return progress.outputFile;
        }

        console.log(`Render progress: ${Math.floor(progress.overallProgress * 100)}%`);

        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
    }

    throw new Error('Render timed out');
};
