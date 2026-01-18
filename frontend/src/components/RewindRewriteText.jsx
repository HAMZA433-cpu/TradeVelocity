import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RewindRewriteText = ({
    text,
    className,
    highlightWords = [], // Words to glow in the final state
    delay = 0
}) => {
    const [displayedText, setDisplayedText] = useState(text);
    const [phase, setPhase] = useState('waiting'); // waiting, rewinding, pause, typing, done

    useEffect(() => {
        let timeout;
        let interval;

        // Start sequence
        timeout = setTimeout(() => {
            setPhase('rewinding');

            // Phase 1: Rewind (Retract R to L)
            let currentIndex = text.length;
            interval = setInterval(() => {
                currentIndex--;
                if (currentIndex <= 0) {
                    setDisplayedText('');
                    clearInterval(interval);
                    setPhase('pause');

                    // Pause before typing
                    setTimeout(() => {
                        setPhase('typing');
                        startTyping();
                    }, 300);
                } else {
                    setDisplayedText(text.slice(0, currentIndex));
                }
            }, 50); // Speed of rewind
        }, delay * 1000);

        const startTyping = () => {
            let currentIndex = 0;
            interval = setInterval(() => {
                currentIndex++;
                setDisplayedText(text.slice(0, currentIndex));

                if (currentIndex >= text.length) {
                    clearInterval(interval);
                    setPhase('done');
                }
            }, 30); // Speed of typing (faster)
        };

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay]);

    // Helper to render text with highlights
    const renderContent = () => {
        if (!displayedText) return <span className="invisible">|</span>;

        // If we are rewinding, show simple text with distortion
        if (phase === 'rewinding') {
            return (
                <span className="inline-block opacity-50 blur-[1px] scale-x-110 tracking-widest text-shadow-glitch">
                    {displayedText}
                </span>
            );
        }

        // If typing or done, we need to handle word highlighting
        const currentString = displayedText;
        const words = text.split(' ');
        let charCount = 0;

        return (
            <span>
                {words.map((word, wordIndex) => {
                    const isHighlight = highlightWords.includes(word);
                    // Check how much of this word is visible in the currentString
                    const wordStart = charCount;
                    const wordEnd = wordStart + word.length;

                    // If word is not yet reached by currentString
                    if (currentString.length <= wordStart) {
                        charCount += word.length + 1; // +1 for space
                        return null;
                    }

                    // Calculate visible part of the word
                    const visibleLen = Math.min(word.length, currentString.length - wordStart);
                    const visiblePart = word.slice(0, visibleLen);

                    charCount += word.length + 1; // +1 for space

                    const space = wordIndex < words.length - 1 ? ' ' : '';
                    const spaceVisible = currentString.length >= charCount;

                    return (
                        <React.Fragment key={wordIndex}>
                            <span className={`${isHighlight && phase !== 'rewinding' ? 'text-neon-green glow-text drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]' : 'text-white'}`}>
                                {visiblePart}
                            </span>
                            {spaceVisible && <span>{space}</span>}
                        </React.Fragment>
                    );
                })}
                {phase === 'typing' && (
                    <span className="inline-block w-2 h-[1em] bg-neon-green ml-1 animate-pulse align-middle" />
                )}
            </span>
        );
    };

    return (
        <span className={`${className} min-h-[1.2em] block`}>
            {renderContent()}
        </span>
    );
};

export default RewindRewriteText;
