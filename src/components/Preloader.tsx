import { useState, useEffect } from 'react';

const videosToPreload = [
    '/mobileVideos/1.mp4',
    '/mobileVideos/2.mp4',
    '/mobileVideos/3.mp4',
    '/mobileVideos/4.mp4',
    '/mobileVideos/5.mp4'
];

interface PreloaderProps {
    onLoaded: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let loadedCount = 0;

        const loadVideo = async (src: string) => {
            try {
                // Fetch the asset so the browser caches it fully
                const response = await fetch(src);
                // Consume the body to ensure it's fully downloaded before resolving
                await response.blob();
            } catch (e) {
                console.warn(`Failed to preload ${src}`, e);
            }
        };

        const preloadAll = async () => {
            const promises = videosToPreload.map(async (src) => {
                await loadVideo(src);
                if (!isCancelled) {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / videosToPreload.length) * 100));
                }
            });

            await Promise.all(promises);
            if (!isCancelled) {
                // Short deliberate delay for visual smoothness when 100% is reached
                setTimeout(() => {
                    if (!isCancelled) {
                        setIsFadingOut(true);
                        // Wait for the CSS fade-out transition to complete
                        setTimeout(onLoaded, 1000);
                    }
                }, 800);
            }
        };

        preloadAll();

        return () => {
            isCancelled = true;
        };
    }, [onLoaded]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#050505',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            color: '#fff',
            opacity: isFadingOut ? 0 : 1,
            transition: 'opacity 1s ease-in-out',
            pointerEvents: 'none'
        }}>
            <h1 style={{
                fontFamily: '"Pinyon Script", cursive',
                fontSize: '2.5rem',
                marginBottom: '30px',
                fontWeight: 400,
                letterSpacing: '0.05em'
            }}>
                Entering the dream...
            </h1>
            <div style={{
                width: '150px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#fff',
                    transition: 'width 0.4s ease-out'
                }} />
            </div>
        </div>
    );
}
