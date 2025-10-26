/**
 * Lobby Manager - Handles lobby creation, joining, and lifecycle
 */

// In-memory storage for active lobbies
const activeLobbies = new Map();

// Lobby timeout duration (1 hour)
const LOBBY_TIMEOUT = 60 * 60 * 1000;

/**
 * Generate a random 6-character lobby code
 */
function generateLobbyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, I, 1)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new lobby
 * @param {string} hostId - Socket ID of the host
 * @param {string} hostName - Name of the host player
 * @returns {object} - Lobby data
 */
function createLobby(hostId, hostName) {
  let code = generateLobbyCode();

  // Ensure unique code
  while (activeLobbies.has(code)) {
    code = generateLobbyCode();
  }

  const lobby = {
    code,
    hostId,
    players: [
      {
        id: hostId,
        name: hostName,
        isHost: true,
        connected: true
      }
    ],
    gameState: 'waiting', // 'waiting' | 'playing' | 'ended'
    settings: {
      numImposters: 1,
      imposterMode: 'text',
      similarityThreshold: 3,
      numRounds: 2,
      skipToReveal: false
    },
    playerCards: [],
    playerOrder: [],
    imposters: [],
    realCard: null,
    imposterCard: null,
    currentRound: 0,
    currentPlayer: 0,
    discussionOrders: [],
    chatMessages: [],
    discussionInputs: [],
    createdAt: Date.now(),
    lastActivity: Date.now(),
    timeoutId: null
  };

  // Set auto-close timeout
  lobby.timeoutId = setTimeout(() => {
    closeLobby(code, 'Lobby timed out after 1 hour of inactivity');
  }, LOBBY_TIMEOUT);

  activeLobbies.set(code, lobby);
  console.log(`✅ Lobby created: ${code} by ${hostName} (${hostId})`);

  return lobby;
}

/**
 * Join an existing lobby
 * @param {string} code - Lobby code
 * @param {string} playerId - Socket ID of the player
 * @param {string} playerName - Name of the player
 * @returns {object|null} - Lobby data or null if failed
 */
function joinLobby(code, playerId, playerName) {
  const lobby = activeLobbies.get(code);

  if (!lobby) {
    return { error: 'Lobby not found' };
  }

  if (lobby.gameState !== 'waiting') {
    return { error: 'Game already in progress' };
  }

  if (lobby.players.length >= 10) {
    return { error: 'Lobby is full (max 10 players)' };
  }

  // Check if player already in lobby
  const existingPlayer = lobby.players.find(p => p.id === playerId);
  if (existingPlayer) {
    existingPlayer.connected = true;
    console.log(`🔄 Player reconnected: ${playerName} (${playerId}) to ${code}`);
  } else {
    lobby.players.push({
      id: playerId,
      name: playerName,
      isHost: false,
      connected: true
    });
    console.log(`➕ Player joined: ${playerName} (${playerId}) to ${code}`);
  }

  lobby.lastActivity = Date.now();

  return lobby;
}

/**
 * Remove a player from a lobby
 * @param {string} playerId - Socket ID of the player
 * @returns {object|null} - Lobby data or null
 */
function removePlayer(playerId) {
  for (const [code, lobby] of activeLobbies.entries()) {
    const playerIndex = lobby.players.findIndex(p => p.id === playerId);

    if (playerIndex !== -1) {
      const player = lobby.players[playerIndex];
      console.log(`➖ Player left: ${player.name} (${playerId}) from ${code}`);

      // Mark as disconnected instead of removing immediately
      player.connected = false;

      // If host left, assign new host
      if (player.isHost && lobby.players.length > 1) {
        const newHost = lobby.players.find(p => p.connected && !p.isHost);
        if (newHost) {
          newHost.isHost = true;
          lobby.hostId = newHost.id;
          console.log(`👑 New host: ${newHost.name} (${newHost.id}) in ${code}`);
        }
      }

      // If all players disconnected, close lobby after delay
      const connectedPlayers = lobby.players.filter(p => p.connected);
      if (connectedPlayers.length === 0) {
        setTimeout(() => {
          const currentLobby = activeLobbies.get(code);
          if (currentLobby && currentLobby.players.every(p => !p.connected)) {
            closeLobby(code, 'All players disconnected');
          }
        }, 30000); // 30 second grace period
      }

      lobby.lastActivity = Date.now();
      return lobby;
    }
  }

  return null;
}

/**
 * Get lobby by code
 * @param {string} code - Lobby code
 * @returns {object|null} - Lobby data or null
 */
function getLobby(code) {
  return activeLobbies.get(code) || null;
}

/**
 * Get lobby by player ID
 * @param {string} playerId - Socket ID of the player
 * @returns {object|null} - Lobby data or null
 */
function getLobbyByPlayer(playerId) {
  for (const lobby of activeLobbies.values()) {
    if (lobby.players.some(p => p.id === playerId)) {
      return lobby;
    }
  }
  return null;
}

/**
 * Update lobby settings (host only)
 * @param {string} code - Lobby code
 * @param {string} hostId - Socket ID of the host
 * @param {object} settings - New settings
 * @returns {object|null} - Updated lobby or null
 */
function updateSettings(code, hostId, settings) {
  const lobby = activeLobbies.get(code);

  if (!lobby || lobby.hostId !== hostId) {
    return null;
  }

  lobby.settings = { ...lobby.settings, ...settings };
  lobby.lastActivity = Date.now();

  return lobby;
}

/**
 * Close a lobby
 * @param {string} code - Lobby code
 * @param {string} reason - Reason for closing
 */
function closeLobby(code, reason = 'Lobby closed') {
  const lobby = activeLobbies.get(code);

  if (lobby) {
    if (lobby.timeoutId) {
      clearTimeout(lobby.timeoutId);
    }

    activeLobbies.delete(code);
    console.log(`🗑️  Lobby closed: ${code} - ${reason}`);
  }
}

/**
 * Get all active lobbies (for debugging)
 */
function getAllLobbies() {
  return Array.from(activeLobbies.entries()).map(([code, lobby]) => ({
    code,
    players: lobby.players.length,
    gameState: lobby.gameState,
    createdAt: lobby.createdAt
  }));
}

export {
  createLobby,
  joinLobby,
  removePlayer,
  getLobby,
  getLobbyByPlayer,
  updateSettings,
  closeLobby,
  getAllLobbies
};
