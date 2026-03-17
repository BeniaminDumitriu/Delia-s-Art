import { useRef, useState } from 'react';
import { TypingText } from './TypingText';
import './WebIntro.css';

interface WebIntroProps {
    onIntroComplete: () => void;
}

export function WebIntro({ onIntroComplete }: WebIntroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [overlayText, setOverlayText] = useState('It all started with a dream');

    const handleVideoEnded = () => {
        onIntroComplete();
    };

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
                onEnded={handleVideoEnded}
            />

            <div className="web-text-overlay">
                <TypingText key={overlayText} text={overlayText} speed={85} className="cinematic-text" />
            </div>

            <button className="skip-btn" onClick={onIntroComplete}>
                Skip Intro
            </button>
        </div>
    );
}
