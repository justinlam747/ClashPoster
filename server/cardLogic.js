/**
 * Card Logic - Handles card parsing and similarity calculations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache parsed cards
let cachedCards = null;

/**
 * Parse CSV data into an array of card objects
 * @returns {Array} Array of card objects with attributes
 */
function parseCards() {
  // Return cached cards if available
  if (cachedCards) {
    return cachedCards;
  }

  try {
    // Read cards.csv from src/assets
    const csvPath = path.join(__dirname, '../src/assets/cards.csv');
    const cardsCSV = fs.readFileSync(csvPath, 'utf-8');

    const lines = cardsCSV.trim().split('\n');
    const cards = [];

    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');

      // Create card object with relevant attributes
      const card = {
        name: values[0],
        type: values[1] || 'none',
        category: values[2] || 'none',
        element: values[3] || 'none',
        family: values[4] || 'none'
      };

      cards.push(card);
    }

    // Cache the cards
    cachedCards = cards;
    console.log(`📇 Loaded ${cards.length} cards from CSV`);

    return cards;
  } catch (error) {
    console.error('❌ Error reading cards.csv:', error);
    return [];
  }
}

/**
 * Calculate similarity score between two cards based on matching attributes
 * @param {Object} card1 - First card object
 * @param {Object} card2 - Second card object
 * @returns {number} Number of matching attributes (0-4)
 */
function calculateSimilarity(card1, card2) {
  let matches = 0;

  if (card1.type === card2.type) matches++;
  if (card1.category === card2.category) matches++;
  if (card1.element === card2.element && card1.element !== 'none') matches++;
  if (card1.family === card2.family) matches++;

  return matches;
}

/**
 * Find a similar card based on a similarity threshold
 * @param {Object} realCard - The real card assigned to most players
 * @param {number} threshold - Minimum number of attributes that must match (1-4)
 * @param {Array} allCards - Array of all available cards
 * @returns {Object} A similar card that meets the threshold
 */
function findSimilarCard(realCard, threshold, allCards) {
  // Filter out the real card itself
  const otherCards = allCards.filter(card => card.name !== realCard.name);

  // Find all cards that meet or exceed the similarity threshold
  const similarCards = otherCards.filter(card => {
    const similarity = calculateSimilarity(realCard, card);
    return similarity >= threshold;
  });

  // If no cards meet the threshold, lower it gradually
  if (similarCards.length === 0) {
    if (threshold > 1) {
      return findSimilarCard(realCard, threshold - 1, allCards);
    } else {
      // Fallback: return a random card if no similarity found
      return otherCards[Math.floor(Math.random() * otherCards.length)];
    }
  }

  // Return a random card from the similar cards
  return similarCards[Math.floor(Math.random() * similarCards.length)];
}

/**
 * Get all card names for display
 * @returns {Array} Array of card name strings
 */
function getAllCardNames() {
  const cards = parseCards();
  return cards.map(card => card.name).sort();
}

/**
 * Get a random card from the deck
 * @returns {Object} Random card object
 */
function getRandomCard() {
  const cards = parseCards();
  return cards[Math.floor(Math.random() * cards.length)];
}

export {
  parseCards,
  calculateSimilarity,
  findSimilarCard,
  getAllCardNames,
  getRandomCard
};
