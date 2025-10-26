import { useState, useEffect } from 'react';
import { useSocket } from './context/SocketContext';

// Multiplayer components
import MainMenu from './components/multiplayer/MainMenu';
import LobbyCreate from './components/multiplayer/LobbyCreate';
import LobbyJoin from './components/multiplayer/LobbyJoin';
import WaitingRoom from './components/multiplayer/WaitingRoom';
import GameChat from './components/multiplayer/GameChat';

// Game components
import CardReveal from './components/CardReveal';
import DiscussionRound from './components/DiscussionRound';
import RevealImposter from './components/RevealImposter';

/**
 * Main App Component - ClashImposter Multiplayer
 * Manages multiplayer game flow through different screens
 */
function App() {
  const { socket, connected } = useSocket();

  // Screen state: 'menu' | 'create' | 'join' | 'waiting' | 'card-reveal' | 'discussion' | 'reveal'
  const [screen, setScreen] = useState('menu');

  // Lobby state
  const [lobbyCode, setLobbyCode] = useState('');
  const [lobby, setLobby] = useState(null);
  const [myCard, setMyCard] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);

  // Game state
  const [currentRound, setCurrentRound] = useState(0);
  const [gamePhase, setGamePhase] = useState('waiting'); // 'waiting' | 'card-reveal' | 'discussion' | 'reveal'
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [roundSubmissions, setRoundSubmissions] = useState([]); // Track all submissions for current round

  // Socket event listeners - set up once when socket connects
  useEffect(() => {
    if (!socket || !socket.connected) return;

    console.log('🔧 Setting up socket listeners for socket:', socket.id);

    // Game started - transition to card reveal
    const handleGameStartedEvent = (data) => {
      console.log('🎮 GAME STARTED EVENT RECEIVED:', data);
      setCurrentRound(data.currentRound || 0);
      setCurrentPlayerIndex(data.currentPlayerIndex);
      setCurrentPlayerName(data.currentPlayerName || '');
      setGamePhase('card-reveal');
      setScreen('card-reveal');
      setRoundSubmissions([]); // Reset submissions
    };

    // Card assigned to this player
    const handleCardAssigned = ({ card, playerIndex }) => {
      console.log('🃏 Card assigned:', card);
      setMyCard(card);
      setMyPlayerIndex(playerIndex);
    };

    // Discussion submitted confirmation
    const handleDiscussionSubmitted = ({ roundIndex, input }) => {
      console.log('✅ Discussion submitted for round', roundIndex);
      setHasSubmitted(true);
    };

    // Round advanced
    const handleRoundAdvanced = ({ currentRound, phase, gameState, currentPlayerIndex, currentPlayerName }) => {
      console.log('⏭️ Round advanced:', { currentRound, phase, gameState });
      setCurrentRound(currentRound);
      setHasSubmitted(false); // Reset for next round
      setRoundSubmissions([]); // Reset submissions for new round

      if (currentPlayerIndex !== undefined) {
        setCurrentPlayerIndex(currentPlayerIndex);
        setCurrentPlayerName(currentPlayerName || '');
      }

      if (phase === 'discussion') {
        setGamePhase('discussion');
        setScreen('discussion');
      } else if (phase === 'reveal') {
        setGamePhase('reveal');
        setScreen('reveal');
      }
    };

    // Turn changed - next player's turn
    const handleTurnChanged = ({ currentPlayerIndex, currentPlayerName }) => {
      console.log('👉 Turn changed to:', currentPlayerName);
      setCurrentPlayerIndex(currentPlayerIndex);
      setCurrentPlayerName(currentPlayerName);
    };

    // Player submitted their word
    const handlePlayerSubmitted = ({ playerIndex, playerName, input, roundIndex }) => {
      console.log(`✍️ ${playerName} submitted:`, input);
      setRoundSubmissions(prev => [...prev, { playerIndex, playerName, input, roundIndex }]);
    };

    // Game restarted - return to waiting room
    const handleGameRestarted = () => {
      console.log('🔄 Game restarted, returning to waiting room');
      setScreen('waiting');
      setGamePhase('waiting');
      setMyCard(null);
      setCurrentRound(0);
      setHasSubmitted(false);
      setRoundSubmissions([]);
    };

    // Returned to lobby
    const handleReturnedToLobby = () => {
      console.log('⬅️ Returned to lobby');
      setScreen('waiting');
      setGamePhase('waiting');
      setMyCard(null);
      setCurrentRound(0);
      setHasSubmitted(false);
      setRoundSubmissions([]);
    };

    // Lobby closed
    const handleLobbyClosed = ({ reason }) => {
      console.log('🚪 Lobby closed:', reason);
      alert(`Lobby closed: ${reason}`);
      setScreen('menu');
      setLobbyCode('');
      setLobby(null);
      setMyCard(null);
      setGamePhase('waiting');
    };

    // Player left
    const handlePlayerLeft = ({ playerId, players }) => {
      console.log('👋 Player left:', playerId);
      setLobby(prev => prev ? { ...prev, players } : null);
    };

    // Attach listeners
    socket.on('game-started', handleGameStartedEvent);
    socket.on('card-assigned', handleCardAssigned);
    socket.on('discussion-submitted', handleDiscussionSubmitted);
    socket.on('round-advanced', handleRoundAdvanced);
    socket.on('turn-changed', handleTurnChanged);
    socket.on('player-submitted', handlePlayerSubmitted);
    socket.on('game-restarted', handleGameRestarted);
    socket.on('returned-to-lobby', handleReturnedToLobby);
    socket.on('lobby-closed', handleLobbyClosed);
    socket.on('player-left', handlePlayerLeft);

    console.log('✅ Socket listeners attached');

    // Debug: Log ALL events (add this AFTER specific listeners)
    socket.onAny((eventName, ...args) => {
      console.log(`📩 Socket event received: ${eventName}`, args);
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.offAny(); // Remove debug listener
      socket.off('game-started', handleGameStartedEvent);
      socket.off('card-assigned', handleCardAssigned);
      socket.off('discussion-submitted', handleDiscussionSubmitted);
      socket.off('round-advanced', handleRoundAdvanced);
      socket.off('turn-changed', handleTurnChanged);
      socket.off('player-submitted', handlePlayerSubmitted);
      socket.off('game-restarted', handleGameRestarted);
      socket.off('returned-to-lobby', handleReturnedToLobby);
      socket.off('lobby-closed', handleLobbyClosed);
      socket.off('player-left', handlePlayerLeft);
    };
  }, [socket?.connected]); // Only re-run when socket connection state changes

  // Handlers
  const handleBackToMenu = () => {
    setScreen('menu');
    setLobbyCode('');
    setLobby(null);
    setMyCard(null);
    setGamePhase('waiting');
  };

  const handleLobbyCreated = (code, lobbyData) => {
    console.log('✅ Lobby created:', code);
    setLobbyCode(code);
    setLobby(lobbyData);
    setScreen('waiting');
  };

  const handleLobbyJoined = (code, lobbyData) => {
    console.log('✅ Joined lobby:', code);
    setLobbyCode(code);
    setLobby(lobbyData);
    setScreen('waiting');
  };

  const handleCardRevealed = () => {
    console.log('🃏 Card revealed, moving to discussion...');
    // Move directly to discussion after seeing card
    setGamePhase('discussion');
    setScreen('discussion');
  };

  const handleDiscussionSubmit = (input) => {
    if (!socket || !lobbyCode) return;

    console.log('💬 Submitting discussion:', input);

    // Submit to server
    socket.emit('submit-discussion', {
      code: lobbyCode,
      roundIndex: currentRound,
      input: input
    });

    // Confirmation handled by socket event
  };

  const handleRequestRevealData = () => {
    if (!socket || !lobbyCode) return;

    socket.emit('get-reveal-data', { code: lobbyCode });

    socket.once('reveal-data', (data) => {
      console.log('📊 Reveal data received:', data);
      // Data will be used by RevealImposter component
    });
  };

  // Connection indicator
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl text-white font-bold mb-2">Connecting to server...</h2>
          <p className="text-white/60">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Menu */}
      {screen === 'menu' && (
        <MainMenu
          onCreateLobby={() => setScreen('create')}
          onJoinLobby={() => setScreen('join')}
        />
      )}

      {/* Create Lobby */}
      {screen === 'create' && (
        <LobbyCreate onLobbyCreated={handleLobbyCreated} />
      )}

      {/* Join Lobby */}
      {screen === 'join' && (
        <LobbyJoin onLobbyJoined={handleLobbyJoined} />
      )}

      {/* Waiting Room */}
      {screen === 'waiting' && lobby && (
        <WaitingRoom
          lobbyCode={lobbyCode}
          lobby={lobby}
        />
      )}

      {/* Card Reveal */}
      {screen === 'card-reveal' && myCard && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <CardReveal
              card={myCard}
              playerName="You"
              onNext={handleCardRevealed}
            />
            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm">
                Waiting for all players to see their cards...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Round */}
      {screen === 'discussion' && lobbyCode && lobby && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
          {/* Back to Lobby Button */}
          <div className="max-w-6xl mx-auto mb-4">
            <button
              onClick={() => socket.emit('back-to-lobby', { code: lobbyCode })}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
            >
              ← Back to Lobby
            </button>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Discussion Input - Takes 2 columns */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Turn Indicator */}
                <div className="mb-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-center">
                  <p className="text-white/70 text-sm mb-1">Current Turn</p>
                  <p className="text-white text-xl font-bold">{currentPlayerName}</p>
                  {currentPlayerIndex === myPlayerIndex && (
                    <p className="text-yellow-400 text-sm mt-1">It's your turn!</p>
                  )}
                  {currentPlayerIndex !== myPlayerIndex && (
                    <p className="text-white/60 text-sm mt-1">Waiting...</p>
                  )}
                </div>

                {!hasSubmitted && currentPlayerIndex === myPlayerIndex ? (
                  <DiscussionRound
                    roundNumber={currentRound + 1}
                    playerName="You"
                    previousWords=""
                    onSubmit={handleDiscussionSubmit}
                  />
                ) : (
                  <div className="card-base card-noise p-8 text-center">
                    <div className="text-6xl mb-6">
                      {hasSubmitted ? '✅' : '⏳'}
                    </div>
                    <h2 className="text-3xl text-white font-bold mb-4">
                      {hasSubmitted ? 'Submitted!' : 'Waiting...'}
                    </h2>
                    <p className="text-white/70 text-lg">
                      {hasSubmitted
                        ? 'Waiting for other players to submit their answers...'
                        : `Waiting for ${currentPlayerName} to submit...`
                      }
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submissions Sidebar - 1 column */}
            <div className="lg:col-span-1">
              <div className="card-base card-noise p-4 h-full">
                <h3 className="text-white font-bold text-lg mb-4">Round {currentRound + 1} Submissions</h3>
                <div className="space-y-2">
                  {roundSubmissions.map((sub, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <p className="text-yellow-400 text-sm font-semibold">{sub.playerName}</p>
                      <p className="text-white text-base mt-1">{sub.input}</p>
                    </div>
                  ))}
                  {roundSubmissions.length === 0 && (
                    <p className="text-white/50 text-sm text-center py-4">
                      No submissions yet...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Sidebar - 1 column */}
            <div className="lg:col-span-1">
              <GameChat lobbyCode={lobbyCode} />
            </div>
          </div>
        </div>
      )}

      {/* Final Reveal */}
      {screen === 'reveal' && socket && (
        <RevealComponent
          socket={socket}
          lobbyCode={lobbyCode}
          onPlayAgain={() => socket.emit('play-again', { code: lobbyCode })}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

/**
 * Reveal Component - Fetches and displays final reveal data
 */
function RevealComponent({ socket, lobbyCode, onPlayAgain, onBackToMenu }) {
  const [revealData, setRevealData] = useState(null);

  useEffect(() => {
    // Request reveal data from server
    socket.emit('get-reveal-data', { code: lobbyCode });

    socket.once('reveal-data', (data) => {
      console.log('📊 Reveal data:', data);
      setRevealData(data);
    });
  }, [socket, lobbyCode]);

  if (!revealData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-2xl text-white font-bold mb-2">Loading results...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back to Menu Button - Top left */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
        >
          ← Main Menu
        </button>
      </div>

      {/* Play Again Button - Top right */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-blue-950 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          🔄 Play Again
        </button>
      </div>

      <RevealImposter
        discussionSummary={revealData.discussionSummary}
        imposterIndices={revealData.imposters.map(i => i.index)}
        realCard={revealData.realCard}
        imposterCard={revealData.imposterCard}
        imposterMode={revealData.imposterMode}
        skipToReveal={false}
        playerNames={revealData.playerNames}
        onRestart={onPlayAgain}
        onShare={() => {}}
      />
    </div>
  );
}

export default App;
