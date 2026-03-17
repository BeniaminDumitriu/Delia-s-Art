import { useState, useRef, useEffect } from 'react';
import type { SceneState } from '../types';
import { TypingText } from './TypingText';
import './StoryViewer.css';

interface StoryViewerProps {
    onStoryComplete: () => void;
}

export function StoryViewer({ onStoryComplete }: StoryViewerProps) {
    const [currentScene, setCurrentScene] = useState<SceneState>('intro_1');
    const [canInteract, setCanInteract] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [showLogoLoader, setShowLogoLoader] = useState(true);
    const [needsUserStart, setNeedsUserStart] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const holdTimerRef = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);

    // Scene definitions matching the provided videos. Looping removed.
    const scenes: Record<SceneState, { src: string; nextAction: 'tap' | 'swipe' | 'auto' | 'hold'; nextScene?: SceneState; mapText?: string }> = {
        intro_1: { src: '/mobileVideos/1.mp4', nextAction: 'tap', nextScene: 'intro_2', mapText: "It all started with a dream" },
        intro_2: { src: '/mobileVideos/2.mp4', nextAction: 'tap', nextScene: 'intro_3', mapText: "A simple piece of paper" },
        intro_3: { src: '/mobileVideos/3.mp4', nextAction: 'hold', nextScene: 'intro_4', mapText: "And the courage to begin" },
        intro_4: { src: '/mobileVideos/4.mp4', nextAction: 'auto', nextScene: 'intro_5', mapText: "Dreams slowly became paintings" }, // auto implies it transitions at the end
        intro_5: { src: '/mobileVideos/5.mp4', nextAction: 'swipe', nextScene: 'gallery', mapText: "Until the dreams filled the room.." },
        gallery: { src: '', nextAction: 'auto' }
    };

    const handleNext = () => {
        const sceneInfo = scenes[currentScene];
        if (sceneInfo.nextScene) {
            if (sceneInfo.nextScene === 'gallery') {
                onStoryComplete();
            } else {
                setCurrentScene(sceneInfo.nextScene);
            }
        }
    };

    // Interaction handlers
    const handleTapOrSwipe = (type: 'tap' | 'swipe') => {
        if (!canInteract) return; // Locked until final second
        const sceneInfo = scenes[currentScene];
        if (sceneInfo.nextAction === type) {
            handleNext();
        }
    };

    // Hold interaction logic
    const startHold = () => {
        if (!canInteract || scenes[currentScene].nextAction !== 'hold') return;

        holdStartTimeRef.current = Date.now();

        const updateProgress = () => {
            if (!holdStartTimeRef.current) return;
            const elapsed = Date.now() - holdStartTimeRef.current;
            const progress = Math.min(elapsed / 3000, 1);
            setHoldProgress(progress);

            if (progress >= 1) {
                handleNext();
                cancelHold();
            } else {
                holdTimerRef.current = requestAnimationFrame(updateProgress);
            }
        };

        holdTimerRef.current = requestAnimationFrame(updateProgress);
    };

    const cancelHold = () => {
        if (holdTimerRef.current) {
            cancelAnimationFrame(holdTimerRef.current);
            holdTimerRef.current = null;
        }
        holdStartTimeRef.current = null;
        setHoldProgress(0);
    };

    // Touch handlers for swipe and hold
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
        if ('touches' in e && e.touches.length > 0) {
            setTouchStart(e.touches[0].clientY);
        }
        startHold();
    };

    const handlePointerUp = (e: React.TouchEvent | React.MouseEvent) => {
        cancelHold();

        // Check for swipe vs tap
        if ('changedTouches' in e && touchStart !== null) {
            const distance = touchStart - e.changedTouches[0].clientY;
            const isUpSwipe = distance > 50;

            if (isUpSwipe) {
                handleTapOrSwipe('swipe');
            } else if (distance >= -10 && distance <= 10) {
                handleTapOrSwipe('tap'); // Small movements or zero movement is a tap
            }
            setTouchStart(null);
        } else {
            // It's a mouse click
            handleTapOrSwipe('tap');
        }
    };

    // Video playback side-effects
    useEffect(() => {
        setCanInteract(false);
        setHoldProgress(0);
        cancelHold();
        setShowLogoLoader(true);
        setNeedsUserStart(false);

        if (videoRef.current) {
            videoRef.current.src = scenes[currentScene]?.src || '';
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => setNeedsUserStart(true));
        }
    }, [currentScene]);

    useEffect(() => {
        const t = window.setTimeout(() => {
            if (showLogoLoader) setNeedsUserStart(true);
        }, 1800);
        return () => window.clearTimeout(t);
    }, [showLogoLoader]);

    // Video time updates and completion logic
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const { currentTime, duration } = videoRef.current;

        // Unlock interaction in the final 1 second of the video
        if (duration > 0 && currentTime >= duration - 1.0 && !canInteract) {
            setCanInteract(true);
        }
    };

    const handleVideoEnded = () => {
        setCanInteract(true);
        const sceneInfo = scenes[currentScene];

        // Auto transition handlers (e.g. video 4 -> 5)
        if (sceneInfo.nextAction === 'auto') {
            if (currentScene === 'intro_4') {
                setCurrentScene('intro_5');
            }
        }
    };

    if (currentScene === 'gallery') return null;
    const sceneInfo = scenes[currentScene];

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
        <div
            className="story-viewer"
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={cancelHold}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            onTouchCancel={cancelHold}
        >
            {/* Primary Video Player */}
            <video
                ref={videoRef}
                className="scene-video"
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={() => setShowLogoLoader(true)}
                onPlaying={() => {
                    setShowLogoLoader(false);
                    setNeedsUserStart(false);
                }}
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

            {/* Cinematic Text Overlay */}
            {sceneInfo.mapText && (
                <div className="text-overlay-container">
                    <TypingText text={sceneInfo.mapText} speed={85} className="cinematic-text" />
                </div>
            )}

            {/* UI Overlays */}
            <div className="ui-overlay">
                {/* Instructions appear only when canInteract is true */}
                <div className={`instruction-container ${canInteract ? 'visible' : ''}`}>
                    {sceneInfo.nextAction === 'tap' && <div className="overlay-text">Tap to continue</div>}
                    {sceneInfo.nextAction === 'swipe' && <div className="overlay-text">Swipe up to enter gallery</div>}
                    {sceneInfo.nextAction === 'hold' && (
                        <div className="overlay-text">
                            Hold for 3 seconds
                            <div className="hold-indicator">
                                <div
                                    className="hold-indicator-fill"
                                    style={{ transform: `scale(${holdProgress})`, opacity: holdProgress > 0 ? 1 : 0.5 }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Subtle hotspot for tap */}
                    {sceneInfo.nextAction === 'tap' && (
                        <div className="hotspot" style={{ top: '50%', left: '50%' }}></div>
                    )}
                </div>
            </div>
        </div>
    );
}
