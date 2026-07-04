import { useState, useEffect } from 'react';
import './MobileLogoIntro.css';

interface MobileLogoIntroProps {
    onIntroComplete: () => void;
}

export function MobileLogoIntro({ onIntroComplete }: MobileLogoIntroProps) {
    const [phase, setPhase] = useState<'fade-in-1' | 'fade-out' | 'fade-in-2' | 'done'>('fade-in-1');

    useEffect(() => {
        // Phase 1: Fade in (0 → 800ms)
        const t1 = setTimeout(() => setPhase('fade-out'), 1200);
        // Phase 2: Fade out (800ms → 1600ms)
        const t2 = setTimeout(() => setPhase('fade-in-2'), 2200);
        // Phase 3: Fade in again (1600ms → 2400ms)
        const t3 = setTimeout(() => setPhase('done'), 3400);
        // Done: transition to main page
        const t4 = setTimeout(() => onIntroComplete(), 4200);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [onIntroComplete]);

    return (
        <div className={`mobile-logo-intro ${phase}`}>
            <img
                className="mobile-logo-intro-image"
                src="/logo/1logo.png"
                alt="Delia's Art"
            />
        </div>
    );
}
