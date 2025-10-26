import { useState } from 'react';
import { useSocket } from '../../context/SocketContext';

/**
 * LobbyJoin Component - Join an existing lobby with a code
 */
export default function LobbyJoin({ onLobbyJoined }) {
  const { socket, connected } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!lobbyCode.trim()) {
      setError('Please enter a lobby code');
      return;
    }

    if (lobbyCode.length !== 6) {
      setError('Lobby code must be 6 characters');
      return;
    }

    if (!connected) {
      setError('Not connected to server');
      return;
    }

    setJoining(true);
    setError('');

    // Listen for lobby join response
    socket.once('lobby-joined', ({ lobby }) => {
      setJoining(false);
      onLobbyJoined(lobbyCode.toUpperCase(), lobby);
    });

    socket.once('join-error', (data) => {
      setJoining(false);
      setError(data.message || 'Failed to join lobby');
    });

    socket.once('error', (data) => {
      setJoining(false);
      setError(data.message || 'Failed to join lobby');
    });

    // Request to join lobby
    socket.emit('join-lobby', {
      code: lobbyCode.toUpperCase(),
      playerName: playerName.trim()
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !joining) {
      handleJoin();
    }
  };

  const handleCodeChange = (e) => {
    // Auto-uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setLobbyCode(value);
  };

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
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
                Join Lobby
              </h1>
              <p className="text-yellow-200 text-sm font-medium drop-shadow">
                Enter the lobby code to join your friends
              </p>
            </div>

            {/* Connection Status */}
            {!connected && (
              <div className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl p-4">
                <p className="text-red-200 text-sm text-center">
                  🔴 Connecting to server...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl p-4">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                maxLength={20}
                disabled={joining || !connected}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all placeholder-white/50"
              />
            </div>

            {/* Lobby Code Input */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                Lobby Code
              </label>
              <input
                type="text"
                value={lobbyCode}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                placeholder="ABC123"
                maxLength={6}
                disabled={joining || !connected}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all placeholder-white/50 text-center text-2xl font-mono tracking-widest"
              />
              <p className="text-white/60 text-xs mt-2 text-center">
                6-character code (letters and numbers)
              </p>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={joining || !connected || !playerName.trim() || lobbyCode.length !== 6}
              className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <span className="relative z-10 text-blue-950 flex items-center justify-center gap-2">
                {joining ? '🔄 Joining...' : '🚪 Join Lobby'}
              </span>
            </button>

            {/* Info Text */}
            <p className="text-center text-white/70 text-sm mt-6">
              Get the lobby code from the host who created the game
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
