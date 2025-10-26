/**
 * MainMenu Component - Choose between creating or joining a lobby
 */
export default function MainMenu({ onCreateLobby, onJoinLobby }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden"
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
            {/* Logo/Title */}
            <div className="text-center mb-12">
              <div className="text-7xl mb-6 drop-shadow-2xl">🎭</div>
              <div className="flex justify-center items-baseline gap-2 mb-4">
                <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                  Clash
                </h1>
                <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg tracking-tight">
                  Imposter
                </h1>
              </div>
              <p className="text-yellow-200 text-lg font-medium drop-shadow">
                Find the imposter among you!
              </p>
              <p className="text-white/70 text-sm mt-2">
                Multiplayer Edition
              </p>
            </div>

            {/* Menu Options */}
            <div className="space-y-4">
              {/* Create Lobby Button */}
              <button
                onClick={onCreateLobby}
                className="w-full relative overflow-hidden rounded-2xl font-bold py-6 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 text-blue-950 flex items-center justify-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <span>Create Lobby</span>
                </span>
              </button>

              {/* Join Lobby Button */}
              <button
                onClick={onJoinLobby}
                className="w-full relative overflow-hidden rounded-2xl font-bold py-6 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group bg-white/10 backdrop-blur-md border border-white/20"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 text-white flex items-center justify-center gap-3">
                  <span className="text-2xl">🚪</span>
                  <span>Join Lobby</span>
                </span>
              </button>
            </div>

            {/* Info */}
            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                Create a lobby to start a new game or join an existing one with a code
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
