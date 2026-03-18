import { useState, useRef, useEffect } from 'react';
import './StoryViewer.css';

interface StoryViewerProps {
    onStoryComplete: () => void;
}

export function StoryViewer({ onStoryComplete }: StoryViewerProps) {
    const [requiredAction, setRequiredAction] = useState<'tap' | 'hold' | 'swipe' | null>(null);
    const [canInteract, setCanInteract] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [videoReady, setVideoReady] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [checkpointIndex, setCheckpointIndex] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const holdTimerRef = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);

    const videoSrc =
        'https://res.cloudinary.com/der91doo8/video/upload/v1773833646/finalMobile_hcyetv.mov';

    const checkpoints: Array<{ time: number; action: 'tap' | 'hold' }> = [
        { time: 3, action: 'tap' },
        { time: 10, action: 'tap' },
        { time: 14, action: 'hold' },
    ];

    const resumePlayback = () => {
        const video = videoRef.current;
        if (!video) return;
        setCanInteract(false);
        setRequiredAction(null);
        video.play().catch(() => {
            setVideoError(true);
        });
    };

    // Interaction handlers
    const handleTapOrSwipe = (type: 'tap' | 'swipe') => {
        if (!canInteract) return; // Locked until final second
        if (requiredAction !== type) return;
        if (type === 'swipe') onStoryComplete();
        if (type === 'tap') {
            setCheckpointIndex((i) => Math.min(i + 1, checkpoints.length));
            resumePlayback();
        }
    };

    // Hold interaction logic
    const startHold = () => {
        if (!canInteract || requiredAction !== 'hold') return;

        holdStartTimeRef.current = Date.now();

        const holdDurationMs = 1400;

        const updateProgress = () => {
            if (!holdStartTimeRef.current) return;
            const elapsed = Date.now() - holdStartTimeRef.current;
            const progress = Math.min(elapsed / holdDurationMs, 1);
            setHoldProgress(progress);

            if (progress >= 1) {
                cancelHold();
                setCheckpointIndex((i) => Math.min(i + 1, checkpoints.length));
                resumePlayback();
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
        setRequiredAction(null);
        setCheckpointIndex(0);
        setVideoReady(false);
        setVideoError(false);
        cancelHold();

        const video = videoRef.current;
        if (!video) return;

        video.currentTime = 0;
        video.play().catch(() => {
            setVideoError(true);
        });
    }, []);

    // Video time updates and completion logic
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const { currentTime } = videoRef.current;

        const next = checkpoints[checkpointIndex];
        if (!next) return;

        if (currentTime >= next.time && requiredAction === null) {
            videoRef.current.pause();
            setHoldProgress(0);
            setRequiredAction(next.action);
            setCanInteract(true);
        }
    };

    const handleVideoEnded = () => {
        // Final interaction is swipe up to enter gallery
        setRequiredAction('swipe');
        setCanInteract(true);
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
                src={videoSrc}
                autoPlay
                muted
                preload="auto"
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onLoadedData={() => setVideoReady(true)}
                onError={() => setVideoError(true)}
            />

            {/* UI Overlays */}
            <div className="ui-overlay">
                {(!videoReady || videoError) && (
                    <div className="video-loading-overlay">
                        {!videoError ? (
                            <div className="video-loading-text">Loading…</div>
                        ) : (
                            <button
                                type="button"
                                className="video-retry-btn"
                                onClick={() => {
                                    setVideoError(false);
                                    resumePlayback();
                                }}
                            >
                                Tap to start
                            </button>
                        )}
                    </div>
                )}

                {/* Instructions appear only when canInteract is true */}
                <div className={`instruction-container ${canInteract ? 'visible' : ''}`}>
                    {requiredAction === 'tap' && <div className="overlay-text">Tap to continue</div>}
                    {requiredAction === 'swipe' && <div className="overlay-text">Swipe up to enter gallery</div>}
                    {requiredAction === 'hold' && (
                        <div className="overlay-text">
                            Press and hold
                            <div className="hold-indicator">
                                <div
                                    className="hold-indicator-fill"
                                    style={{ transform: `scale(${holdProgress})`, opacity: holdProgress > 0 ? 1 : 0.5 }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Subtle hotspot for tap */}
                    {requiredAction === 'tap' && (
                        <div className="hotspot" style={{ top: '50%', left: '50%' }}></div>
                    )}
                </div>
            </div>
        </div>
    );
}
