import { useState } from 'react';
import CardListModal from './CardListModal';

/**
 * Game setup screen component
 * Allows players to configure game settings before starting
 */
export default function GameSetup({ onStartGame }) {
  // Game settings state
  const [numPlayers, setNumPlayers] = useState(5);
  const [numImposters, setNumImposters] = useState(1);
  const [imposterMode, setImposterMode] = useState('text'); // 'text' or 'similar'
  const [similarityThreshold, setSimilarityThreshold] = useState(3);
  const [numRounds, setNumRounds] = useState(2);
  const [skipToReveal, setSkipToReveal] = useState(false);
  const [showCardList, setShowCardList] = useState(false);
  const [playerNames, setPlayerNames] = useState(Array(5).fill('').map((_, i) => `Player ${i + 1}`));
  const [showNameInput, setShowNameInput] = useState(false);

  // Update player names array when numPlayers changes
  const handleNumPlayersChange = (newNum) => {
    setNumPlayers(newNum);
    const newNames = Array(newNum).fill('').map((_, i) => {
      if (i < playerNames.length) {
        return playerNames[i];
      }
      return `Player ${i + 1}`;
    });
    setPlayerNames(newNames);
  };

  // Update a specific player's name
  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  // Validate and start the game
  const handleStartGame = () => {
    if (numImposters >= numPlayers) {
      alert('Number of imposters must be less than number of players!');
      return;
    }

    if (numPlayers < 3 || numPlayers > 10) {
      alert('Number of players must be between 3 and 10!');
      return;
    }

    onStartGame({
      numPlayers,
      numImposters,
      imposterMode,
      similarityThreshold,
      numRounds,
      skipToReveal,
      playerNames
    });
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
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-baseline gap-2 mb-3">
                <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                  Clash
                </h1>
                <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg tracking-tight">
                  Imposter
                </h1>
              </div>

              <p className="text-yellow-200 text-sm font-medium drop-shadow">
                Find the imposter among you!
              </p>
            </div>

            {/* Settings Form */}
            <div className="space-y-5">
              {/* Number of Players */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                  Number of Players
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={numPlayers}
                  onChange={(e) => handleNumPlayersChange(parseInt(e.target.value))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                />
              </div>

              {/* Player Names */}
              <div>
                <button
                  onClick={() => setShowNameInput(!showNameInput)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-between px-4"
                >
                  <span>Set Player Names</span>
                  <span>{showNameInput ? '▲' : '▼'}</span>
                </button>
                {showNameInput && (
                  <div className="mt-3 space-y-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    {playerNames.map((name, index) => (
                      <div key={index}>
                        <label className="block text-white text-xs mb-1">
                          Player {index + 1}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder={`Player ${index + 1}`}
                          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Number of Imposters */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                  Number of Imposters
                </label>
                <input
                  type="number"
                  min="1"
                  max={numPlayers - 1}
                  value={numImposters}
                  onChange={(e) => setNumImposters(parseInt(e.target.value))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                />
              </div>

              {/* Imposter Mode */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                  Imposter Sees
                </label>
                <div className="space-y-2">
                  <label className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="imposterMode"
                      value="text"
                      checked={imposterMode === 'text'}
                      onChange={(e) => setImposterMode(e.target.value)}
                      className="mr-3 accent-yellow-400"
                    />
                    <span className="text-white font-medium">"IMPOSTER" text</span>
                  </label>
                  <label className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="imposterMode"
                      value="similar"
                      checked={imposterMode === 'similar'}
                      onChange={(e) => setImposterMode(e.target.value)}
                      className="mr-3 accent-yellow-400"
                    />
                    <span className="text-white font-medium">Similar card</span>
                  </label>
                </div>
              </div>

              {/* Similarity Threshold (only if similar mode) */}
              {imposterMode === 'similar' && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <label className="block text-white font-semibold mb-3 text-sm tracking-wide drop-shadow">
                    Similarity Threshold: <span className="text-yellow-300">{similarityThreshold}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                  <div className="flex justify-between text-xs text-white/70 mt-2">
                    <span>Less similar</span>
                    <span>More similar</span>
                  </div>
                </div>
              )}

              {/* Number of Discussion Rounds */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm tracking-wide drop-shadow">
                  Discussion Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={numRounds}
                  onChange={(e) => setNumRounds(parseInt(e.target.value))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                />
              </div>

              {/* Skip to Reveal */}
              <div>
                <label className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition-all">
                  <input
                    type="checkbox"
                    checked={skipToReveal}
                    onChange={(e) => setSkipToReveal(e.target.checked)}
                    className="mr-3 accent-yellow-400"
                  />
                  <span className="text-white font-medium">Skip to Reveal (no discussion rounds)</span>
                </label>
              </div>

              {/* View Card List Button */}
              <button
                onClick={() => setShowCardList(true)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                📋 View All Cards
              </button>

              {/* Start Game Button */}
              <button
                onClick={handleStartGame}
                className="w-full relative overflow-hidden rounded-2xl font-bold py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group mt-6"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 text-blue-950 flex items-center justify-center gap-2">
                  🎮 Start Game
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Card List Modal */}
        <CardListModal isOpen={showCardList} onClose={() => setShowCardList(false)} />
      </div>
    </div>
  );
}
