import { useState } from 'react';
import GameSetup from './components/GameSetup';
import PassDevice from './components/PassDevice';
import CardReveal from './components/CardReveal';
import DiscussionRound from './components/DiscussionRound';
import RevealImposter from './components/RevealImposter';
import {
  assignImposters,
  assignCards,
  initializeDiscussion,
  formatDiscussionForDisplay,
  getPreviousWords,
  createRandomPlayerOrder,
} from './utils/gameLogic';

/**
 * Main App Component - ClashImposter Game
 * Manages game state and flow through different phases
 */
function App() {
  // Game phase state: 'setup' | 'pass' | 'reveal' | 'discussion' | 'finalReveal'
  const [gamePhase, setGamePhase] = useState('setup');

  // Game settings (from setup screen)
  const [numPlayers, setNumPlayers] = useState(5);
  const [numImposters, setNumImposters] = useState(1);
  const [imposterMode, setImposterMode] = useState('text'); // 'text' or 'similar'
  const [similarityThreshold, setSimilarityThreshold] = useState(3);
  const [numRounds, setNumRounds] = useState(2);
  const [skipToReveal, setSkipToReveal] = useState(false);

  // Game state
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0-based index into playerOrder
  const [currentRound, setCurrentRound] = useState(0); // 0-based index
  const [imposters, setImposters] = useState([]); // Array of imposter indices
  const [playerCards, setPlayerCards] = useState([]); // Array of card objects for each player
  const [realCard, setRealCard] = useState(null); // The real card most players have
  const [imposterCard, setImposterCard] = useState(null); // The similar card imposters have (if mode is 'similar')
  const [discussionInputs, setDiscussionInputs] = useState([]); // 2D array [round][player]
  const [showingCard, setShowingCard] = useState(false); // Whether we're showing the card or pass screen
  const [playerNames, setPlayerNames] = useState([]); // Array of player names
  const [playerOrder, setPlayerOrder] = useState([]); // Randomized order of player indices

  /**
   * Start the game with configured settings
   */
  const handleStartGame = (settings) => {
    const { numPlayers, numImposters, imposterMode, similarityThreshold, numRounds, skipToReveal, playerNames } =
      settings;

    // Store settings
    setNumPlayers(numPlayers);
    setNumImposters(numImposters);
    setImposterMode(imposterMode);
    setSimilarityThreshold(similarityThreshold);
    setNumRounds(numRounds);
    setSkipToReveal(skipToReveal);
    setPlayerNames(playerNames);

    // Create randomized player order
    const randomOrder = createRandomPlayerOrder(numPlayers);
    setPlayerOrder(randomOrder);

    // Assign imposters
    const imposterIndices = assignImposters(numPlayers, numImposters);
    setImposters(imposterIndices);

    // Assign cards
    const { playerCards, realCard, imposterCard } = assignCards(
      numPlayers,
      imposterIndices,
      imposterMode,
      similarityThreshold
    );
    setPlayerCards(playerCards);
    setRealCard(realCard);
    setImposterCard(imposterCard);

    // Initialize discussion inputs
    const discussion = initializeDiscussion(numPlayers, numRounds);
    setDiscussionInputs(discussion);

    // Reset state
    setCurrentPlayer(0);
    setCurrentRound(0);
    setShowingCard(false);

    // Start with pass screen for first player in randomized order
    setGamePhase('pass');
  };

  /**
   * Player taps to reveal their card
   */
  const handleRevealCard = () => {
    setShowingCard(true);
    setGamePhase('reveal');
  };

  /**
   * Move to next player after viewing card
   */
  const handleNextPlayer = () => {
    const nextPlayer = currentPlayer + 1;

    if (nextPlayer < numPlayers) {
      // More players to reveal
      setCurrentPlayer(nextPlayer);
      setShowingCard(false);
      setGamePhase('pass');
    } else {
      // All players have seen cards
      if (skipToReveal) {
        // Skip directly to final reveal
        setGamePhase('finalReveal');
      } else {
        // Start discussion rounds
        setCurrentPlayer(0);
        setCurrentRound(0);
        setGamePhase('discussion');
      }
    }
  };

  /**
   * Handle discussion input submission
   */
  const handleDiscussionSubmit = (input) => {
    // Get the actual player index from randomized order
    const actualPlayerIndex = playerOrder[currentPlayer];

    // Update discussion inputs
    const updatedInputs = [...discussionInputs];
    updatedInputs[currentRound][actualPlayerIndex] = input;
    setDiscussionInputs(updatedInputs);

    // Move to next player in order
    const nextPlayer = currentPlayer + 1;

    if (nextPlayer < numPlayers) {
      // More players in this round
      setCurrentPlayer(nextPlayer);
    } else {
      // Round complete, check if more rounds
      const nextRound = currentRound + 1;

      if (nextRound < numRounds) {
        // Start next round
        setCurrentPlayer(0);
        setCurrentRound(nextRound);
      } else {
        // All rounds complete, show final reveal
        setGamePhase('finalReveal');
      }
    }
  };

  /**
   * Restart the game
   */
  const handleRestart = () => {
    setGamePhase('setup');
    setCurrentPlayer(0);
    setCurrentRound(0);
    setShowingCard(false);
  };

  /**
   * Handle share button (placeholder for now)
   */
  const handleShare = () => {
    // For now, just alert - ShareImage component handles actual sharing
    alert('Share functionality! Take a screenshot or use the download button.');
  };

  // Get current player index from randomized order
  const currentPlayerIndex = playerOrder[currentPlayer] || 0;
  const currentPlayerName = playerNames[currentPlayerIndex] || `Player ${currentPlayerIndex + 1}`;

  // Render appropriate screen based on game phase
  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {gamePhase === 'setup' && <GameSetup onStartGame={handleStartGame} />}

        {gamePhase === 'pass' && (
          <PassDevice
            playerName={currentPlayerName}
            onContinue={handleRevealCard}
          />
        )}

        {gamePhase === 'reveal' && (
          <CardReveal
            card={playerCards[currentPlayerIndex]}
            playerName={currentPlayerName}
            onNext={handleNextPlayer}
          />
        )}

        {gamePhase === 'discussion' && (
          <DiscussionRound
            roundNumber={currentRound + 1}
            playerName={currentPlayerName}
            previousWords={getPreviousWords(
              discussionInputs,
              currentPlayerIndex,
              currentRound
            )}
            onSubmit={handleDiscussionSubmit}
          />
        )}

        {gamePhase === 'finalReveal' && (
          <RevealImposter
            discussionSummary={formatDiscussionForDisplay(
              discussionInputs,
              numPlayers,
              playerNames,
              playerOrder
            )}
            imposterIndices={imposters}
            realCard={realCard}
            imposterCard={imposterCard}
            imposterMode={imposterMode}
            skipToReveal={skipToReveal}
            playerNames={playerNames}
            onRestart={handleRestart}
            onShare={handleShare}
          />
        )}
      </div>
    </div>
  );
}

export default App;
