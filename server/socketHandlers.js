/**
 * Socket Event Handlers - Handles all Socket.io events
 */

import * as lobbyManager from './lobbyManager.js';
import * as gameManager from './gameManager.js';

/**
 * Setup socket event handlers
 * @param {object} io - Socket.io instance
 * @param {object} socket - Socket connection
 */
function setupSocketHandlers(io, socket) {
  console.log(`🔌 Client connected: ${socket.id}`);

  /**
   * Create a new lobby
   */
  socket.on('create-lobby', ({ playerName }) => {
    try {
      const lobby = lobbyManager.createLobby(socket.id, playerName);

      // Join the socket room
      socket.join(lobby.code);

      // Send lobby data back to creator
      socket.emit('lobby-created', {
        code: lobby.code,
        lobby: sanitizeLobbyForClient(lobby, socket.id)
      });

      console.log(`✅ Lobby ${lobby.code} created by ${playerName}`);
    } catch (error) {
      console.error('❌ Error creating lobby:', error);
      socket.emit('error', { message: 'Failed to create lobby' });
    }
  });

  /**
   * Join an existing lobby
   */
  socket.on('join-lobby', ({ code, playerName }) => {
    try {
      const result = lobbyManager.joinLobby(code, socket.id, playerName);

      if (result.error) {
        socket.emit('join-error', { message: result.error });
        return;
      }

      // Join the socket room
      socket.join(code);

      // Notify the player
      socket.emit('lobby-joined', {
        lobby: sanitizeLobbyForClient(result, socket.id)
      });

      // Broadcast updated player list to all in lobby
      io.to(code).emit('players-updated', {
        players: result.players
      });

      console.log(`✅ ${playerName} joined lobby ${code}`);
    } catch (error) {
      console.error('❌ Error joining lobby:', error);
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  });

  /**
   * Update lobby settings (host only)
   */
  socket.on('update-settings', ({ code, settings }) => {
    try {
      const lobby = lobbyManager.updateSettings(code, socket.id, settings);

      if (!lobby) {
        socket.emit('error', { message: 'Only host can update settings' });
        return;
      }

      // Broadcast updated settings to all players
      io.to(code).emit('settings-updated', {
        settings: lobby.settings
      });

      console.log(`⚙️  Settings updated in lobby ${code}`);
    } catch (error) {
      console.error('❌ Error updating settings:', error);
      socket.emit('error', { message: 'Failed to update settings' });
    }
  });

  /**
   * Start the game (host only)
   */
  socket.on('start-game', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      if (lobby.hostId !== socket.id) {
        socket.emit('error', { message: 'Only host can start the game' });
        return;
      }

      if (lobby.players.length < 3) {
        socket.emit('error', { message: 'Need at least 3 players to start' });
        return;
      }

      // Start the game
      gameManager.startGame(lobby);

      console.log(`🎮 Starting game in lobby ${code} with ${lobby.players.length} players`);

      // Send each player their card (one at a time, in order)
      lobby.players.forEach((player, index) => {
        const card = lobby.playerCards[index];
        console.log(`🃏 Sending card to player ${player.name} (${player.id}):`, card.name);
        io.to(player.id).emit('card-assigned', {
          card: card,
          playerIndex: index
        });
      });

      // Notify all players that game started
      const firstPlayer = gameManager.getCurrentTurnPlayer(lobby);
      const gameData = {
        gameState: lobby.gameState,
        numPlayers: lobby.players.length,
        currentRound: 0,
        currentPlayerIndex: firstPlayer,
        currentPlayerName: lobby.players[firstPlayer].name
      };
      console.log(`📢 Broadcasting game-started event to room ${code}:`, gameData);
      io.to(code).emit('game-started', gameData);

      console.log(`✅ Game started successfully in lobby ${code}`);
    } catch (error) {
      console.error('❌ Error starting game:', error);
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  /**
   * Send a chat message
   */
  socket.on('send-chat', ({ code, message }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      const chatMessage = gameManager.addChatMessage(lobby, socket.id, message);

      if (!chatMessage) {
        socket.emit('error', { message: 'Failed to send message' });
        return;
      }

      // Broadcast chat message to all players in lobby
      io.to(code).emit('chat-message', chatMessage);

    } catch (error) {
      console.error('❌ Error sending chat:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Submit discussion input for current round
   */
  socket.on('submit-discussion', ({ code, roundIndex, input }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      // Find player index
      const playerIndex = lobby.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) {
        socket.emit('error', { message: 'Player not in lobby' });
        return;
      }

      // Check if it's this player's turn
      if (!gameManager.isPlayersTurn(lobby, playerIndex)) {
        socket.emit('error', { message: 'Not your turn!' });
        return;
      }

      // Submit discussion input
      gameManager.submitDiscussionInput(lobby, playerIndex, roundIndex, input);

      // Broadcast the submission to all players in real-time
      io.to(code).emit('player-submitted', {
        playerIndex,
        playerName: lobby.players[playerIndex].name,
        input,
        roundIndex
      });

      // Confirm submission to submitting player
      socket.emit('discussion-submitted', {
        roundIndex,
        input
      });

      // Advance to next player's turn
      const { nextPlayer, roundComplete } = gameManager.advanceTurn(lobby);

      if (roundComplete) {
        // All players submitted, advance round
        const result = gameManager.advanceRound(lobby);

        if (result.phase === 'discussion') {
          // New round started, send first player info
          const firstPlayer = gameManager.getCurrentTurnPlayer(lobby);
          io.to(code).emit('round-advanced', {
            currentRound: lobby.currentRound,
            phase: result.phase,
            gameState: lobby.gameState,
            currentPlayerIndex: firstPlayer,
            currentPlayerName: lobby.players[firstPlayer].name
          });
        } else {
          // Game ended, no current player
          io.to(code).emit('round-advanced', {
            currentRound: lobby.currentRound,
            phase: result.phase,
            gameState: lobby.gameState
          });
        }

        console.log(`⏭️  Round ${roundIndex} completed in lobby ${code}`);
      } else {
        // Notify all players whose turn it is now
        io.to(code).emit('turn-changed', {
          currentPlayerIndex: nextPlayer,
          currentPlayerName: lobby.players[nextPlayer].name,
          roundIndex: lobby.currentRound
        });

        console.log(`⏭️  Turn advanced to player ${nextPlayer} (${lobby.players[nextPlayer].name}) in ${code}`);
      }

    } catch (error) {
      console.error('❌ Error submitting discussion:', error);
      socket.emit('error', { message: 'Failed to submit discussion' });
    }
  });

  /**
   * Request final reveal data
   */
  socket.on('get-reveal-data', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      const discussionSummary = gameManager.formatDiscussionForDisplay(lobby);

      socket.emit('reveal-data', {
        discussionSummary,
        imposters: lobby.imposters.map(idx => ({
          index: idx,
          name: lobby.players[idx].name
        })),
        realCard: lobby.realCard,
        imposterCard: lobby.imposterCard,
        imposterMode: lobby.settings.imposterMode,
        chatMessages: lobby.chatMessages,
        playerNames: lobby.players.map(p => p.name)
      });

    } catch (error) {
      console.error('❌ Error getting reveal data:', error);
      socket.emit('error', { message: 'Failed to get reveal data' });
    }
  });

  /**
   * Play again - restart game with same players
   */
  socket.on('play-again', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      // Restart the game
      gameManager.restartGame(lobby);

      // Notify all players to return to waiting room
      io.to(code).emit('game-restarted', {
        lobby: sanitizeLobbyForClient(lobby, socket.id)
      });

      console.log(`🔄 Game restarted in lobby ${code}`);

    } catch (error) {
      console.error('❌ Error restarting game:', error);
      socket.emit('error', { message: 'Failed to restart game' });
    }
  });

  /**
   * Back to lobby - return to waiting room without closing lobby
   */
  socket.on('back-to-lobby', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      // Restart the game (returns to waiting state)
      gameManager.restartGame(lobby);

      // Notify all players to return to waiting room
      io.to(code).emit('returned-to-lobby', {
        lobby: sanitizeLobbyForClient(lobby, socket.id)
      });

      console.log(`⬅️  Players returned to lobby ${code}`);

    } catch (error) {
      console.error('❌ Error returning to lobby:', error);
      socket.emit('error', { message: 'Failed to return to lobby' });
    }
  });

  /**
   * End game and close lobby
   */
  socket.on('end-game', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        return;
      }

      // Notify all players
      io.to(code).emit('lobby-closed', {
        reason: 'Game ended'
      });

      // Close the lobby
      lobbyManager.closeLobby(code, 'Game ended by player');

    } catch (error) {
      console.error('❌ Error ending game:', error);
    }
  });

  /**
   * Handle disconnection
   */
  socket.on('disconnect', () => {
    try {
      const lobby = lobbyManager.removePlayer(socket.id);

      if (lobby) {
        // Notify remaining players
        io.to(lobby.code).emit('player-left', {
          playerId: socket.id,
          players: lobby.players
        });

        // Check if lobby should be closed
        const connectedPlayers = lobby.players.filter(p => p.connected);
        if (connectedPlayers.length === 0) {
          io.to(lobby.code).emit('lobby-closed', {
            reason: 'All players left'
          });
        }
      }

      console.log(`🔌 Client disconnected: ${socket.id}`);
    } catch (error) {
      console.error('❌ Error handling disconnect:', error);
    }
  });

  /**
   * Get lobby info (for debugging/rejoining)
   */
  socket.on('get-lobby-info', ({ code }) => {
    try {
      const lobby = lobbyManager.getLobby(code);

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      socket.emit('lobby-info', sanitizeLobbyForClient(lobby, socket.id));
    } catch (error) {
      console.error('❌ Error getting lobby info:', error);
      socket.emit('error', { message: 'Failed to get lobby info' });
    }
  });
}

/**
 * Sanitize lobby data before sending to client
 * Removes sensitive data like other players' cards
 * @param {object} lobby - Lobby object
 * @param {string} socketId - Socket ID of the requesting client
 * @returns {object} Sanitized lobby data
 */
function sanitizeLobbyForClient(lobby, socketId) {
  const playerIndex = lobby.players.findIndex(p => p.id === socketId);

  return {
    code: lobby.code,
    hostId: lobby.hostId,
    players: lobby.players,
    gameState: lobby.gameState,
    settings: lobby.settings,
    currentRound: lobby.currentRound,
    numRounds: lobby.settings.numRounds,
    // Only include player's own card
    myCard: lobby.playerCards && playerIndex >= 0 ? lobby.playerCards[playerIndex] : null,
    myIndex: playerIndex,
    chatMessages: lobby.chatMessages,
    createdAt: lobby.createdAt
  };
}

export { setupSocketHandlers };
