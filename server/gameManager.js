/**
 * Game Manager - Handles game state and logic
 */

import { parseCards, findSimilarCard, calculateSimilarity } from './cardLogic.js';

/**
 * Create a randomized play order for players
 * @param {number} numPlayers - Total number of players
 * @returns {Array} Array of player indices in randomized order
 */
function createRandomPlayerOrder(numPlayers) {
  const order = Array.from({ length: numPlayers }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return order;
}

/**
 * Randomly assign imposters from the player pool
 * @param {number} numPlayers - Total number of players
 * @param {number} numImposters - Number of imposters to assign
 * @returns {Array} Array of imposter indices (0-based)
 */
function assignImposters(numPlayers, numImposters) {
  const imposters = [];
  const availableIndices = Array.from({ length: numPlayers }, (_, i) => i);

  // Randomly select imposters
  for (let i = 0; i < numImposters; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    imposters.push(availableIndices[randomIndex]);
    availableIndices.splice(randomIndex, 1);
  }

  return imposters.sort((a, b) => a - b);
}

/**
 * Assign cards to all players based on game settings
 * @param {number} numPlayers - Total number of players
 * @param {Array} imposterIndices - Array of imposter player indices
 * @param {string} imposterMode - 'text' or 'similar'
 * @param {number} similarityThreshold - Number of attributes that must match (1-4)
 * @returns {Object} { playerCards: Array, realCard: Object, imposterCard: Object|null }
 */
function assignCards(numPlayers, imposterIndices, imposterMode, similarityThreshold) {
  const allCards = parseCards();

  // Select a random card as the "real" card for normal players
  const realCard = allCards[Math.floor(Math.random() * allCards.length)];

  // Initialize player cards array
  const playerCards = Array(numPlayers).fill(null).map(() => ({ ...realCard }));

  // Handle imposter card assignment
  let imposterCard = null;

  if (imposterMode === 'similar') {
    // Find a similar card for the imposter
    imposterCard = findSimilarCard(realCard, similarityThreshold, allCards);

    // Assign the similar card to all imposters
    imposterIndices.forEach(index => {
      playerCards[index] = { ...imposterCard };
    });
  } else {
    // Mode is 'text' - imposters will see "IMPOSTER" text instead
    imposterIndices.forEach(index => {
      playerCards[index] = { name: 'IMPOSTER 👀', isImposter: true };
    });
  }

  return {
    playerCards,
    realCard,
    imposterCard
  };
}

/**
 * Initialize discussion inputs array
 * @param {number} numPlayers - Total number of players
 * @param {number} numRounds - Total number of discussion rounds
 * @returns {Array} 2D array [round][player] initialized to empty strings
 */
function initializeDiscussion(numPlayers, numRounds) {
  return Array(numRounds)
    .fill(null)
    .map(() => Array(numPlayers).fill(''));
}

/**
 * Start a game in a lobby
 * @param {object} lobby - Lobby object
 * @returns {object} Updated lobby with game state
 */
function startGame(lobby) {
  const numPlayers = lobby.players.length;
  const { numImposters, imposterMode, similarityThreshold, numRounds } = lobby.settings;

  // Create randomized player order for card reveals (randomized ONCE)
  lobby.playerOrder = createRandomPlayerOrder(numPlayers);

  // Create randomized orders for each discussion round
  lobby.discussionOrders = [];
  for (let i = 0; i < numRounds; i++) {
    lobby.discussionOrders.push(createRandomPlayerOrder(numPlayers));
  }

  // Assign imposters
  lobby.imposters = assignImposters(numPlayers, numImposters);

  // Assign cards
  const { playerCards, realCard, imposterCard } = assignCards(
    numPlayers,
    lobby.imposters,
    imposterMode,
    similarityThreshold
  );

  lobby.playerCards = playerCards;
  lobby.realCard = realCard;
  lobby.imposterCard = imposterCard;

  // Initialize discussion inputs
  lobby.discussionInputs = initializeDiscussion(numPlayers, numRounds);

  // Set game state
  lobby.gameState = 'playing';
  lobby.currentRound = 0;
  lobby.currentTurnIndex = 0; // Index in the current round's order (0 to numPlayers-1)
  lobby.lastActivity = Date.now();

  console.log(`🎮 Game started in lobby ${lobby.code} with ${numPlayers} players`);

  return lobby;
}

/**
 * Get the player index whose turn it is for the current round
 * @param {object} lobby - Lobby object
 * @returns {number} Player index whose turn it is
 */
function getCurrentTurnPlayer(lobby) {
  const roundOrder = lobby.discussionOrders[lobby.currentRound];
  return roundOrder[lobby.currentTurnIndex];
}

/**
 * Check if it's a specific player's turn
 * @param {object} lobby - Lobby object
 * @param {number} playerIndex - Player index to check
 * @returns {boolean} True if it's this player's turn
 */
function isPlayersTurn(lobby, playerIndex) {
  return getCurrentTurnPlayer(lobby) === playerIndex;
}

/**
 * Advance to the next player's turn
 * @param {object} lobby - Lobby object
 * @returns {object} { nextPlayer: number, roundComplete: boolean }
 */
function advanceTurn(lobby) {
  lobby.currentTurnIndex++;

  const roundComplete = lobby.currentTurnIndex >= lobby.players.length;

  if (roundComplete) {
    lobby.currentTurnIndex = 0; // Reset for next round
  }

  return {
    nextPlayer: roundComplete ? null : getCurrentTurnPlayer(lobby),
    roundComplete
  };
}

/**
 * Submit discussion input for a player
 * @param {object} lobby - Lobby object
 * @param {number} playerIndex - Player's index in the lobby
 * @param {number} roundIndex - Current round index
 * @param {string} input - Discussion input
 * @returns {object} Updated lobby
 */
function submitDiscussionInput(lobby, playerIndex, roundIndex, input) {
  if (!lobby.discussionInputs[roundIndex]) {
    lobby.discussionInputs[roundIndex] = Array(lobby.players.length).fill('');
  }

  lobby.discussionInputs[roundIndex][playerIndex] = input;
  lobby.lastActivity = Date.now();

  console.log(`💬 Player ${playerIndex} submitted input for round ${roundIndex} in ${lobby.code}`);

  return lobby;
}

/**
 * Check if all players have submitted for current round
 * @param {object} lobby - Lobby object
 * @param {number} roundIndex - Current round index
 * @returns {boolean} True if all submitted
 */
function hasAllPlayersSubmitted(lobby, roundIndex) {
  if (!lobby.discussionInputs[roundIndex]) {
    return false;
  }

  // All players must have submitted (even if empty)
  const connectedPlayers = lobby.players.filter(p => p.connected);
  return connectedPlayers.every((player, idx) => {
    return lobby.discussionInputs[roundIndex][idx] !== undefined;
  });
}

/**
 * Advance to next round or end game
 * @param {object} lobby - Lobby object
 * @returns {object} Updated lobby with phase info
 */
function advanceRound(lobby) {
  const nextRound = lobby.currentRound + 1;

  if (nextRound < lobby.settings.numRounds) {
    lobby.currentRound = nextRound;
    lobby.currentTurnIndex = 0; // Reset turn index for new round
    console.log(`⏭️  Advanced to round ${nextRound + 1} in ${lobby.code}`);
    return { ...lobby, phase: 'discussion' };
  } else {
    lobby.gameState = 'ended';
    console.log(`🏁 Game ended in ${lobby.code}`);
    return { ...lobby, phase: 'reveal' };
  }
}

/**
 * Restart the game with the same players and settings
 * @param {object} lobby - Lobby object
 * @returns {object} Updated lobby ready for new game
 */
function restartGame(lobby) {
  // Keep players and settings, reset everything else
  lobby.gameState = 'waiting';
  lobby.currentRound = 0;
  lobby.currentTurnIndex = 0;
  lobby.playerCards = null;
  lobby.realCard = null;
  lobby.imposterCard = null;
  lobby.imposters = null;
  lobby.discussionInputs = [];
  lobby.discussionOrders = [];
  lobby.playerOrder = null;
  lobby.chatMessages = [];
  lobby.lastActivity = Date.now();

  console.log(`🔄 Game restarted in lobby ${lobby.code}, returning to waiting room`);

  return lobby;
}

/**
 * Add a chat message to the lobby
 * @param {object} lobby - Lobby object
 * @param {string} playerId - Socket ID of the player
 * @param {string} message - Chat message
 * @returns {object} Chat message object
 */
function addChatMessage(lobby, playerId, message) {
  const player = lobby.players.find(p => p.id === playerId);
  if (!player) return null;

  const chatMessage = {
    id: `${Date.now()}-${playerId}`,
    playerId,
    playerName: player.name,
    message,
    timestamp: Date.now()
  };

  lobby.chatMessages.push(chatMessage);
  lobby.lastActivity = Date.now();

  return chatMessage;
}

/**
 * Format discussion data for display
 * @param {object} lobby - Lobby object
 * @returns {Array} Array of player discussion strings
 */
function formatDiscussionForDisplay(lobby) {
  const formatted = [];
  const numPlayers = lobby.players.length;

  // Display in the order players took turns in first round
  const displayOrder = lobby.discussionOrders.length > 0 ? lobby.discussionOrders[0] : lobby.playerOrder;

  for (let orderIndex = 0; orderIndex < numPlayers; orderIndex++) {
    const playerIndex = displayOrder[orderIndex];
    const player = lobby.players[playerIndex];

    const playerWords = lobby.discussionInputs
      .map(round => round[playerIndex])
      .filter(word => word && word.trim() !== '');

    formatted.push({
      playerIndex: playerIndex,
      playerName: player.name,
      words: playerWords.join(', ')
    });
  }

  return formatted;
}

export {
  createRandomPlayerOrder,
  assignImposters,
  assignCards,
  initializeDiscussion,
  startGame,
  getCurrentTurnPlayer,
  isPlayersTurn,
  advanceTurn,
  submitDiscussionInput,
  hasAllPlayersSubmitted,
  advanceRound,
  restartGame,
  addChatMessage,
  formatDiscussionForDisplay
};
