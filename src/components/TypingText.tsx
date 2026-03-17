import { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number; // ms per char
    className?: string;
}

export function TypingText({ text, speed = 100, className = '' }: TypingTextProps) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        let currentIndex = 0;

        if (text) {
            const interval = setInterval(() => {
                if (currentIndex < text.length - 1) {
                    setDisplayedText(text.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    setDisplayedText(text); // Ensure the full text is set
                    clearInterval(interval);
                }
            }, speed);

            return () => clearInterval(interval);
        }
    }, [text, speed]);

    return <span className={className}>{displayedText}</span>;
}
