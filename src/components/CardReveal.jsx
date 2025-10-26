import { useState, useEffect } from 'react';

/**
 * CardReveal component - Shows the player's card with flip animation
 * Displays either the card name or "IMPOSTER 👀" based on role
 */
export default function CardReveal({ card, playerName, onNext }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-flip after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Add arrow key navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if card is flipped
      if (!isFlipped) return;

      // Arrow keys: ArrowRight, ArrowDown, ArrowLeft, ArrowUp, or Space, Enter
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === ' ' ||
        e.key === 'Enter'
      ) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, onNext]);

  const isImposter = card.name === 'IMPOSTER 👀' || card.isImposter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Player Name Header - Modern pill badge */}
        <div className="mb-8">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-yellow-400 mr-3 animate-pulse"></div>
            <h3 className="text-white text-sm font-semibold tracking-wide">
              {playerName.toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Card Container with 3D Flip - Modern glassmorphic design */}
        <div className="perspective-1000 w-full" style={{ minHeight: '400px' }}>
          <div
            className={`relative transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Card Back - Modern gradient design */}
            <div
              className="absolute w-full backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="relative rounded-3xl shadow-2xl p-12 aspect-[3/4] flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #facc15 100%)',
                }}>
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                {/* Glowing orb effect */}
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl"></div>

                <div className="text-center relative z-10">
                  <div className="text-7xl mb-4 drop-shadow-lg">🃏</div>
                  <p className="text-white font-bold text-3xl tracking-tight drop-shadow-lg">
                    Clash<span className="text-yellow-300">Imposter</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card Front - Modern gradient with glassmorphism */}
            <div
              className="backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div
                className="relative rounded-3xl shadow-2xl p-12 aspect-[3/4] flex items-center justify-center overflow-hidden"
                style={{
                  background: isImposter
                    ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #facc15 100%)',
                }}
              >
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                {/* Glowing effects */}
                <div className={`absolute top-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl ${
                  isImposter ? 'bg-red-500/30' : 'bg-yellow-400/30'
                }`}></div>
                <div className={`absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full blur-3xl ${
                  isImposter ? 'bg-red-700/30' : 'bg-blue-400/30'
                }`}></div>

                <div className="text-center relative z-10">
                  {isImposter ? (
                    <>
                      <div className="text-8xl mb-6 drop-shadow-2xl">👀</div>
                      <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
                        IMPOSTER
                      </h2>
                      <p className="text-red-100 text-base font-medium drop-shadow">
                        Blend in with the group!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                          <span className="text-yellow-200 text-xs font-semibold tracking-widest">YOUR CARD</span>
                        </div>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                        {card.name}
                      </h2>
                      <p className="text-yellow-100 text-base font-medium drop-shadow">
                        Remember this card!
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button - Modern glassmorphic button */}
        <div className="w-full mt-8 space-y-4">
          {isFlipped && (
            <>
              <button
                onClick={onNext}
                className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-lg animate-fade-in transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 text-blue-950 flex items-center justify-center gap-2">
                  Next Player
                  <span className="text-xl">→</span>
                </span>
              </button>

              {/* Instructions - Modern style */}
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">↑</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">↓</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">←</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">→</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Space</kbd>
                  <span className="text-xs">or</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Enter</kbd>
                </div>
                <p className="text-center text-white/70 text-sm">
                  Remember your card and pass the device to the next player
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
