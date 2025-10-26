# 🚀 Quick Start Guide

## Get Running in 3 Steps

### Step 1: Start the Backend Server

Open Terminal 1 and run:

```bash
npm run server:dev
```

You should see:
```
✅ Server running on port 3001
🔗 WebSocket endpoint: ws://localhost:3001
💡 Waiting for connections...
```

### Step 2: Start the Frontend

Open Terminal 2 and run:

```bash
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 3: Open Multiple Browser Windows

1. **Window 1**: http://localhost:5173
   - Click "Create Lobby"
   - Enter name (e.g., "Alice")
   - Copy the lobby code (e.g., "ABC123")

2. **Window 2**: http://localhost:5173
   - Click "Join Lobby"
   - Enter name (e.g., "Bob")
   - Enter the lobby code
   - You should see both players in the waiting room!

3. **Window 3+**: Repeat step 2 with different names

4. **Back to Window 1** (Host):
   - Click "Start Game" when ready

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Can create a lobby and get a code
- [ ] Can join lobby with the code
- [ ] Multiple players appear in waiting room
- [ ] Host can start the game
- [ ] Each player sees their card
- [ ] Chat works during discussion
- [ ] Can submit round answers
- [ ] Final reveal shows imposters

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Kill any process on port 3001
kill -9 $(lsof -ti:3001)
npm run server:dev
```

**Frontend can't connect?**
- Check `.env` file exists with `VITE_SERVER_URL=http://localhost:3001`
- Restart the frontend: `npm run dev`

**"Socket not connected"?**
- Make sure backend is running first
- Check browser console for errors
- Verify no firewall blocking localhost:3001

## 📝 Next: Update App.jsx

Once you verify everything works:

1. Open `MULTIPLAYER_TRANSFORMATION.md`
2. Follow the "App.jsx Integration" section
3. Wire up the multiplayer components
4. Test the full game flow!

## 🎮 Game Flow

```
MainMenu
   ↓
LobbyCreate/Join
   ↓
WaitingRoom
   ↓
[Game Started]
   ↓
CardReveal (each player sees their card)
   ↓
DiscussionRound 1 (with Chat)
   ↓
DiscussionRound 2 (with Chat)
   ↓
...
   ↓
RevealImposter (show results)
```

## 💡 Tips

- **Testing Solo**: Open 3+ browser windows to simulate multiplayer
- **Private/Incognito**: Use incognito windows to avoid session conflicts
- **Mobile Testing**: Access from phone using your computer's IP
- **Debug**: Check browser console and server logs for detailed info

---

**Ready to play? Let's find the imposter!** 🎭
