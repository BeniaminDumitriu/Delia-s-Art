import { useRef, useState } from 'react';
import './AboutVideoIntro.css';

interface AboutVideoIntroProps {
    onVideoComplete: () => void;
}

export function AboutVideoIntro({ onVideoComplete }: AboutVideoIntroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const videoSrc =
        'https://res.cloudinary.com/der91doo8/video/upload/v1773833646/finalMobile_hcyetv.mov';

    const handleVideoEnded = () => {
        onVideoComplete();
    };

    const handleRetry = () => {
        setVideoError(false);
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => setVideoError(true));
        }
    };

    return (
        <div className="about-video-intro">
            <video
                ref={videoRef}
                className="about-video-intro-player"
                src={videoSrc}
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setVideoReady(true)}
                onError={() => setVideoError(true)}
                onEnded={handleVideoEnded}
            />

            {(!videoReady || videoError) && (
                <div className="about-video-intro-overlay">
                    {!videoError ? (
                        <div className="about-video-intro-loading">Loading…</div>
                    ) : (
                        <button
                            type="button"
                            className="about-video-intro-retry"
                            onClick={handleRetry}
                        >
                            Tap to start
                        </button>
                    )}
                </div>
            )}

            <button
                type="button"
                className="about-video-intro-skip"
                onClick={onVideoComplete}
            >
                Skip
            </button>
        </div>
    );
}
