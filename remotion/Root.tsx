import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { MainComposition, CompositionProps } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MainVideo"
                component={MainComposition}
                durationInFrames={1200} // Default value, will be overridden by props
                fps={30}
                width={1080}
                height={1920}
                schema={CompositionProps}
                defaultProps={{
                    images: [],
                    audioUrl: '',
                    captions: [],
                    durationInFrames: 1200,
                    fps: 30,
                    videoStyle: 'cinematic',
                    captionStyle: 'modern'
                }}
            />
        </>
    );
};

registerRoot(RemotionRoot);
