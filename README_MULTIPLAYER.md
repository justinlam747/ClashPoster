# 🎭 ClashImposter - Multiplayer Edition

A real-time multiplayer social deduction game where players try to find the imposter among them, powered by Socket.io and React.

## 🎮 Features

- **Real-time Multiplayer**: Play with friends on separate devices
- **Lobby System**: Create or join games with 6-character codes
- **Live Chat**: Discuss and strategize during rounds
- **Randomized Gameplay**: Player order randomized each round
- **Configurable Settings**: Adjust imposters, rounds, and game modes
- **Auto-disconnect Handling**: Graceful reconnection and lobby management

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Modern web browser with WebSocket support

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

In one terminal, run:

```bash
npm run server
```

The server will start on `http://localhost:3001`

### 3. Start the Frontend Development Server

In another terminal, run:

```bash
npm run dev
```

The client will start on `http://localhost:5173`

### 4. Open Your Browser

Navigate to `http://localhost:5173` and start playing!

## 🎯 How to Play

### Creating a Lobby

1. Click "Create Lobby"
2. Enter your name
3. Share the 6-character lobby code with friends
4. Wait for players to join
5. Adjust game settings (host only)
6. Click "Start Game" when ready

### Joining a Lobby

1. Click "Join Lobby"
2. Enter your name
3. Enter the 6-character lobby code
4. Wait for the host to start

### During the Game

1. **Card Reveal**: Each player sees their card on their own device
2. **Discussion Rounds**: Chat freely and submit your official answer once per round
3. **Final Reveal**: See who the imposters were and review all submissions

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server (Vite) |
| `npm run server` | Start backend server (production mode) |
| `npm run server:dev` | Start backend server (development mode with nodemon) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |
| `npm start` | Start backend server (alias for deployment) |

## 📁 Project Structure

```
ClashImposter/
├── server/
│   ├── index.js              # Express + Socket.io server
│   ├── lobbyManager.js       # Lobby creation/management
│   ├── gameManager.js        # Game logic and state
│   ├── cardLogic.js          # Card parsing and similarity
│   └── socketHandlers.js     # Socket event handlers
├── src/
│   ├── components/
│   │   ├── multiplayer/      # New multiplayer components
│   │   │   ├── MainMenu.jsx
│   │   │   ├── LobbyCreate.jsx
│   │   │   ├── LobbyJoin.jsx
│   │   │   ├── WaitingRoom.jsx
│   │   │   └── GameChat.jsx
│   │   └── ...               # Existing game components
│   ├── context/
│   │   └── SocketContext.jsx # Socket.io connection provider
│   ├── App.jsx               # Main app router
│   └── main.jsx              # App entry point
├── .env                      # Environment variables
├── render.yaml               # Render deployment config
└── package.json              # Dependencies and scripts
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Development
VITE_SERVER_URL=http://localhost:3001

# Production (update with your Render URL)
# VITE_SERVER_URL=https://your-app-name.onrender.com
```

## 🚢 Deployment to Render

### Prerequisites

1. Create a [Render account](https://render.com)
2. Push your code to GitHub

### Deploy Steps

1. **Create New Web Service** on Render
2. **Connect Your Repository**
3. **Configure Service**:
   - Name: `clashimposter` (or your choice)
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: `Free`

4. **Add Environment Variable**:
   - Key: `CLIENT_URL`
   - Value: Your Render app URL (e.g., `https://clashimposter.onrender.com`)

5. **Deploy**!

6. **Update Frontend `.env`**:
   ```env
   VITE_SERVER_URL=https://your-app-name.onrender.com
   ```

7. **Rebuild and Deploy Frontend**

### Important Notes

- **Free Tier Sleep**: Render free tier sleeps after 15 minutes of inactivity
- **WebSockets**: Automatically supported on Render
- **CORS**: Configured to allow your frontend domain

## 🔧 Configuration

### Game Settings (Host Only)

- **Number of Imposters**: 1 to (players/2)
- **Imposter Mode**:
  - `text`: Imposters see "IMPOSTER" text
  - `similar`: Imposters see a similar card
- **Similarity Threshold**: 1-4 (how similar the imposter card should be)
- **Discussion Rounds**: 1-5 rounds of discussion
- **Skip to Reveal**: Skip discussion and go straight to reveal

### Lobby Limits

- **Min Players**: 3
- **Max Players**: 10
- **Lobby Timeout**: 1 hour of inactivity
- **Auto-close**: When all players leave or game ends

## 🐛 Troubleshooting

### Server Won't Start

```bash
# Check if port 3001 is in use
lsof -ti:3001

# Kill the process if needed
kill -9 $(lsof -ti:3001)
```

### Connection Issues

1. Ensure both frontend and backend are running
2. Check `.env` file has correct `VITE_SERVER_URL`
3. Verify firewall isn't blocking WebSocket connections
4. Check browser console for errors

### Players Can't Join

1. Verify lobby code is correct (6 characters)
2. Check lobby hasn't timed out (1 hour limit)
3. Ensure game hasn't already started
4. Verify lobby isn't full (10 player max)

## 📊 API Endpoints

### Health Check

```
GET /health
```

Returns server status and uptime.

### Stats

```
GET /api/stats
```

Returns active lobby count and details (for monitoring).

## 🔌 Socket Events

### Client → Server

| Event | Description |
|-------|-------------|
| `create-lobby` | Create a new lobby |
| `join-lobby` | Join an existing lobby |
| `update-settings` | Update lobby settings (host only) |
| `start-game` | Start the game (host only) |
| `send-chat` | Send a chat message |
| `submit-discussion` | Submit round answer |
| `get-reveal-data` | Request final reveal data |
| `end-game` | End game and close lobby |

### Server → Client

| Event | Description |
|-------|-------------|
| `lobby-created` | Lobby creation confirmed |
| `lobby-joined` | Successfully joined lobby |
| `players-updated` | Player list updated |
| `settings-updated` | Settings changed |
| `game-started` | Game has begun |
| `card-assigned` | Player's card revealed |
| `chat-message` | New chat message |
| `discussion-submitted` | Round submission confirmed |
| `round-advanced` | Moved to next round |
| `reveal-data` | Final game results |
| `player-left` | Player disconnected |
| `lobby-closed` | Lobby ended |

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🎉 Credits

Built with:
- React + Vite
- Socket.io
- Express
- Tailwind CSS

---

**Have fun finding the imposter!** 🎭
