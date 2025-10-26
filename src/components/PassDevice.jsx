/**
 * PassDevice component - Interstitial screen between player reveals
 * Shows "Pass device to [Player Name]" message
 */
export default function PassDevice({ playerName, onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="relative rounded-3xl shadow-2xl p-12 overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #facc15 100%)',
          }}>
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Glowing orb effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon/Emoji */}
            <div className="text-8xl mb-6 drop-shadow-2xl animate-bounce">🔄</div>

            {/* Message */}
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
              Pass Device
            </h2>

            <div className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <p className="text-yellow-200 text-xl mb-2">
                Hand the device to
              </p>
              <p className="text-3xl font-bold text-white drop-shadow-lg">
                {playerName}
              </p>
            </div>

            <p className="text-white/80 text-sm mb-8 font-medium">
              🔒 Make sure no one else is looking at the screen!
            </p>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <span className="relative z-10 text-blue-950 flex items-center justify-center gap-2">
                <span>👁️</span>
                {playerName}, tap to reveal your card
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
