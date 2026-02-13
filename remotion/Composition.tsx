import React from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    Sequence,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    spring,
    Easing
} from 'remotion';
import { z } from 'zod';

// Use a robust font stack for maximum compatibility
const FONT_FAMILY = '"Outfit", "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif';

export const CompositionProps = z.object({
    images: z.array(z.string()),
    audioUrl: z.string(),
    captions: z.array(z.object({
        text: z.string(),
        start: z.number(),
        end: z.number()
    })),
    durationInFrames: z.number(),
    fps: z.number(),
    videoStyle: z.string().optional(),
    captionStyle: z.string().optional()
});

export type CompositionPropsType = z.infer<typeof CompositionProps>;

export const MainComposition: React.FC<CompositionPropsType> = ({
    images = [],
    audioUrl = '',
    captions = [],
    videoStyle = 'cinematic',
    captionStyle = 'modern'
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Group captions into chunks of 2 words for maximum impact and readability
    const groupedCaptions = React.useMemo(() => {
        if (!captions || captions.length === 0) return [];
        const chunks = [];
        const chunkSize = 2;
        for (let i = 0; i < captions.length; i += chunkSize) {
            const chunk = captions.slice(i, i + chunkSize);
            chunks.push({
                text: chunk.map(c => c.text).join(' '),
                start: chunk[0].start,
                end: chunk[chunk.length - 1].end
            });
        }
        return chunks;
    }, [captions]);

    const framesPerImage = images.length > 0 ? Math.floor(durationInFrames / images.length) : durationInFrames;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Audio Track */}
            <Audio src={audioUrl} />

            {/* Images Layer */}
            {images.map((imgUrl, index) => {
                const from = index * framesPerImage;
                return (
                    <Sequence
                        key={`${imgUrl}-${index}`}
                        from={from}
                        durationInFrames={framesPerImage}
                    >
                        <ImageLayer
                            src={imgUrl}
                            index={index}
                            duration={framesPerImage}
                        />
                    </Sequence>
                );
            })}

            {/* Top-level Caption Layer - Rendered after everything to be ON TOP */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingBottom: '25%', // Positioned in lower third
                pointerEvents: 'none',
                zIndex: 9999 // Maximum visibility
            }}>
                {groupedCaptions.map((cap, i) => {
                    const startFrame = Math.round(cap.start * fps);
                    const endFrame = Math.round(cap.end * fps);

                    if (frame >= startFrame && frame < endFrame) {
                        return (
                            <CaptionComponent
                                key={`cap-${i}`}
                                text={cap.text}
                                styleType={captionStyle}
                                startFrame={startFrame}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </AbsoluteFill>
    );
};

const CaptionComponent: React.FC<{
    text: string;
    styleType: string;
    startFrame: number
}> = ({ text, styleType, startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Smooth entrance spring
    const springValue = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: {
            damping: 10,
            stiffness: 120,
            mass: 0.6
        }
    });

    const scale = interpolate(springValue, [0, 1], [0.7, 1]);
    const opacity = interpolate(springValue, [0, 1], [0, 1]);

    const getStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            fontSize: 120, // Bigger size as requested
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            textAlign: 'center',
            textTransform: 'uppercase',
            padding: '20px 60px',
            opacity,
            lineHeight: 1,
            letterSpacing: '-3px',
            wordWrap: 'break-word',
            maxWidth: '90%',
            textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.9)'
        };

        const currentTransform = `scale(${scale})`;

        switch (styleType.toLowerCase()) {
            case 'neon':
                return {
                    ...base,
                    color: '#fff',
                    textShadow: '0 0 10px #f0f, 0 0 20px #f0f, 0 0 40px #f0f, 0 10px 20px rgba(0,0,0,1)',
                    WebkitTextStroke: '3px #f0f',
                    transform: currentTransform
                };
            case 'highlight':
                return {
                    ...base,
                    color: '#000',
                    backgroundColor: '#FFD700',
                    padding: '10px 40px',
                    borderRadius: 25,
                    boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
                    transform: currentTransform,
                    textShadow: 'none'
                };
            case 'pop':
                const bounce = Math.sin((frame - startFrame) / 3) * 0.05;
                return {
                    ...base,
                    color: '#FF1493',
                    textShadow: '10px 10px 0px #000, 0 10px 20px rgba(0,0,0,0.5)',
                    transform: `scale(${scale * (1 + bounce)}) rotate(${Math.sin(frame / 5) * 2}deg)`
                };
            case 'classic':
                return {
                    ...base,
                    color: '#fff',
                    textShadow: '6px 6px 0px #000, 0 10px 20px rgba(0,0,0,0.5)',
                    transform: currentTransform
                };
            case 'modern':
            default:
                return {
                    ...base,
                    color: '#fff',
                    textShadow: '0 10px 40px rgba(0,0,0,1), 0 5px 15px rgba(0,0,0,0.8)',
                    transform: currentTransform
                };
        }
    };

    return <div style={getStyles()}>{text}</div>;
};

const ImageLayer: React.FC<{ src: string, index: number, duration: number }> = ({ src, index, duration }) => {
    const frame = useCurrentFrame();

    // Fast movement using local sequence frames
    const scale = interpolate(
        frame,
        [0, duration],
        index % 2 === 0 ? [1, 1.4] : [1.4, 1.15],
        {
            easing: Easing.bezier(0.33, 1, 0.68, 1),
            extrapolateRight: 'clamp'
        }
    );

    const translateX = interpolate(
        frame,
        [0, duration],
        index % 3 === 0 ? [-60, 60] : [30, -30],
        {
            easing: Easing.linear,
            extrapolateRight: 'clamp'
        }
    );

    const opacity = interpolate(
        frame,
        [0, 12, duration - 12, duration],
        [0, 1, 1, 0]
    );

    return (
        <AbsoluteFill style={{ opacity }}>
            <Img
                src={src}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale}) translateX(${translateX}px)`
                }}
            />
        </AbsoluteFill>
    );
};
