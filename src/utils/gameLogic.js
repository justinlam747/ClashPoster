import { parseCards, findSimilarCard } from '../data/cardData.js';

/**
 * Create a randomized play order for players
 * @param {number} numPlayers - Total number of players
 * @returns {Array} Array of player indices in randomized order
 */
export function createRandomPlayerOrder(numPlayers) {
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
export function assignImposters(numPlayers, numImposters) {
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
export function assignCards(numPlayers, imposterIndices, imposterMode, similarityThreshold) {
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
export function initializeDiscussion(numPlayers, numRounds) {
  return Array(numRounds)
    .fill(null)
    .map(() => Array(numPlayers).fill(''));
}

/**
 * Format discussion data for display
 * @param {Array} discussionInputs - 2D array [round][player] of discussion inputs
 * @param {number} numPlayers - Total number of players
 * @param {Array} playerNames - Array of player names
 * @param {Array} playerOrder - Randomized order of player indices
 * @returns {Array} Array of player discussion strings
 */
export function formatDiscussionForDisplay(discussionInputs, numPlayers, playerNames, playerOrder) {
  const formatted = [];

  // Display in the order players took turns (randomized order)
  for (let orderIndex = 0; orderIndex < numPlayers; orderIndex++) {
    const playerIndex = playerOrder[orderIndex];
    const playerWords = discussionInputs
      .map(round => round[playerIndex])
      .filter(word => word.trim() !== '');

    formatted.push({
      playerIndex: playerIndex,
      playerName: playerNames[playerIndex] || `Player ${playerIndex + 1}`,
      words: playerWords.join(', ')
    });
  }

  return formatted;
}

/**
 * Get previous words said by a player in earlier rounds
 * @param {Array} discussionInputs - 2D array [round][player] of discussion inputs
 * @param {number} playerIndex - Current player index (0-based)
 * @param {number} currentRound - Current round index (0-based)
 * @returns {string} Comma-separated string of previous words
 */
export function getPreviousWords(discussionInputs, playerIndex, currentRound) {
  const previousWords = [];

  for (let roundIndex = 0; roundIndex < currentRound; roundIndex++) {
    const word = discussionInputs[roundIndex][playerIndex];
    if (word && word.trim() !== '') {
      previousWords.push(word);
    }
  }

  return previousWords.join(', ');
}
