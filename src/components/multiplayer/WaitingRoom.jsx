import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

/**
 * WaitingRoom Component - Shows players waiting to start the game
 */
export default function WaitingRoom({ lobbyCode, lobby }) {
  const { socket } = useSocket();
  const [players, setPlayers] = useState(lobby.players || []);
  const [settings, setSettings] = useState(lobby.settings || {});
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if current player is host
    setIsHost(socket.id === lobby.hostId);

    // Listen for player updates
    socket.on('players-updated', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    // Listen for settings updates
    socket.on('settings-updated', ({ settings: updatedSettings }) => {
      setSettings(updatedSettings);
    });

    // Listen for player leaving
    socket.on('player-left', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('players-updated');
      socket.off('settings-updated');
      socket.off('player-left');
    };
  }, [socket, lobby.hostId]);

  const handleStartGame = () => {
    if (players.length < 3) {
      setError('Need at least 3 players to start');
      return;
    }

    setError('');
    socket.emit('start-game', { code: lobbyCode });
  };

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    socket.emit('update-settings', { code: lobbyCode, settings: newSettings });
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #facc15 100%)',
          }}>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Lobby Code */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg mb-4">
                Waiting Room
              </h1>
              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-4">
                <p className="text-yellow-200 text-sm mb-2">Lobby Code</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-white tracking-widest font-mono">
                    {lobbyCode}
                  </span>
                  <button
                    onClick={copyCodeToClipboard}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-blue-950 font-semibold text-sm transition-all"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl p-4">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}

            {/* Players List */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-xl mb-4 drop-shadow">
                Players ({players.length}/10)
              </h3>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3"
                    >
                      <span className="text-2xl">
                        {player.isHost ? '👑' : '👤'}
                      </span>
                      <span className="text-white font-semibold flex-1">
                        {player.name}
                      </span>
                      {player.isHost && (
                        <span className="text-yellow-300 text-sm">Host</span>
                      )}
                      {!player.connected && (
                        <span className="text-red-300 text-sm">Disconnected</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings (Host Only) */}
            {isHost && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-4 drop-shadow">
                  Game Settings
                </h3>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-4">
                  <div>
                    <label className="block text-white mb-2">Number of Imposters</label>
                    <input
                      type="number"
                      min="1"
                      max={Math.floor(players.length / 2)}
                      value={settings.numImposters}
                      onChange={(e) => handleSettingsChange('numImposters', parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Discussion Rounds</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={settings.numRounds}
                      onChange={(e) => handleSettingsChange('numRounds', parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Start Button (Host Only) */}
            {isHost && (
              <button
                onClick={handleStartGame}
                disabled={players.length < 3}
                className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 text-blue-950">
                  🎮 Start Game
                </span>
              </button>
            )}

            {!isHost && (
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <p className="text-white text-lg">
                  ⏳ Waiting for host to start the game...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
