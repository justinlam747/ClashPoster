import { useState } from 'react';

/**
 * RevealImposter component - Final screen showing discussion summary and imposter reveal
 */
export default function RevealImposter({
  discussionSummary,
  imposterIndices,
  realCard,
  imposterCard,
  imposterMode,
  skipToReveal,
  onRestart,
  onShare,
}) {
  const [showReveal, setShowReveal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #facc15 100%)',
          }}>
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Glowing orb effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          {/* Content - positioned above effects */}
          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                  {showReveal ? '🎭 Imposter Revealed!' : skipToReveal ? '🎯 Ready to Reveal?' : '💬 Discussion Summary'}
                </h1>
              </div>
            </div>

            {/* Discussion Summary */}
            {!showReveal && !skipToReveal && (
              <div className="mb-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-h-96 overflow-y-auto">
                  {discussionSummary.map((entry, index) => (
                    <div
                      key={index}
                      className="mb-4 pb-4 border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-yellow-300 font-bold text-lg drop-shadow">
                          Player {entry.player}:
                        </span>
                        <span className="text-white text-lg">
                          {entry.words || <em className="text-white/50">No input</em>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-yellow-200 text-xl font-medium drop-shadow">
                    Discuss who you think the imposter is!
                  </p>
                </div>
              </div>
            )}

            {/* Imposter Reveal */}
            {showReveal && (
              <div className="mb-8">
                {/* Discussion Summary in Reveal */}
                {!skipToReveal && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 max-h-64 overflow-y-auto">
                    <h3 className="text-yellow-300 font-bold mb-4 text-xl drop-shadow">
                      What players said:
                    </h3>
                    {discussionSummary.map((entry, index) => (
                      <div key={index} className="mb-3 text-lg">
                        <span className="text-yellow-300 font-bold drop-shadow">
                          Player {entry.player}:
                        </span>{' '}
                        <span className="text-white">
                          {entry.words || <em className="text-white/50">No input</em>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Imposter Reveal Cards */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-6">
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 drop-shadow-2xl">🎭</div>
                    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
                      The Imposter{imposterIndices.length > 1 ? 's' : ''} {imposterIndices.length > 1 ? 'were' : 'was'}...
                    </h2>
                    <div className="text-5xl font-bold text-yellow-300 mb-6 drop-shadow-lg">
                      {imposterIndices.map((idx) => `Player ${idx + 1}`).join(' & ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                      <p className="text-yellow-300 text-lg font-bold mb-2 drop-shadow">
                        Real Card:
                      </p>
                      <p className="text-white text-2xl font-bold drop-shadow">{realCard.name}</p>
                    </div>

                    {imposterMode === 'similar' && imposterCard && (
                      <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
                        <p className="text-red-200 text-lg font-bold mb-2 drop-shadow">
                          Imposter's Card:
                        </p>
                        <p className="text-white text-2xl font-bold drop-shadow">{imposterCard.name}</p>
                      </div>
                    )}

                    {imposterMode === 'text' && (
                      <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
                        <p className="text-red-200 text-lg font-bold mb-2 drop-shadow">
                          Imposter saw:
                        </p>
                        <p className="text-white text-2xl font-bold drop-shadow">IMPOSTER 👀</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {!showReveal ? (
                <button
                  onClick={() => setShowReveal(true)}
                  className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
                  }}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <span className="relative z-10 text-blue-950">
                    Reveal Imposter 🎭
                  </span>
                </button>
              ) : (
                <button
                  onClick={onRestart}
                  className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group bg-white/10 backdrop-blur-md border border-white/20"
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <span className="relative z-10 text-white flex items-center justify-center gap-2">
                    <span>🔄</span>
                    Play Again
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
