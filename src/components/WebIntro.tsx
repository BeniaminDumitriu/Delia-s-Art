import { useEffect, useRef, useState } from 'react';
import { TypingText } from './TypingText';
import './WebIntro.css';

interface WebIntroProps {
    onIntroComplete: () => void;
}

export function WebIntro({ onIntroComplete }: WebIntroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [overlayText, setOverlayText] = useState('It all started with a dream');
    const [showLogoLoader, setShowLogoLoader] = useState(true);
    const [needsUserStart, setNeedsUserStart] = useState(false);

    const handleVideoEnded = () => {
        onIntroComplete();
    };

    useEffect(() => {
        const t = window.setTimeout(() => {
            // If it still hasn't started, allow tap-to-start (autoplay might be blocked).
            if (showLogoLoader) setNeedsUserStart(true);
        }, 1800);
        return () => window.clearTimeout(t);
    }, [showLogoLoader]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        const { currentTime, duration } = video;
        if (!duration || Number.isNaN(duration)) return;

        // Switch text near the end of the web intro video.
        if (currentTime >= duration - 4) {
            setOverlayText('Step into the world of painted dreams');
        }
    };

    const tryStart = async () => {
        const video = videoRef.current;
        if (!video) return;
        try {
            await video.play();
            setNeedsUserStart(false);
        } catch {
            setNeedsUserStart(true);
        }
    };

    return (
        <div className="web-intro-container fade-transition">
            <video
                ref={videoRef}
                className="web-intro-video"
                src="/webVideos/webnice1.mp4"
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onCanPlay={() => setShowLogoLoader(true)}
                onPlaying={() => {
                    setShowLogoLoader(false);
                    setNeedsUserStart(false);
                }}
                onLoadedData={() => setShowLogoLoader(true)}
                onError={() => setNeedsUserStart(true)}
                onEnded={handleVideoEnded}
            />

            {showLogoLoader && (
                <div
                    className={`video-logo-loader ${needsUserStart ? 'is-interactive' : ''}`}
                    onClick={needsUserStart ? tryStart : undefined}
                >
                    <img src="/logo/1logo.jpg" alt="Delia’s Art" />
                </div>
            )}

            <div className="web-text-overlay">
                <TypingText key={overlayText} text={overlayText} speed={85} className="cinematic-text" />
            </div>

            <button className="skip-btn" onClick={onIntroComplete}>
                Skip Intro
            </button>
        </div>
    );
}
