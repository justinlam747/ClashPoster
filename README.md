# ClashImposter 🎮

A local multiplayer social deduction game inspired by Among Us, featuring Clash Royale cards! Pass one device around between players to determine who the imposter is.

## 🎯 Features

- **Local Multiplayer**: Play on a single device with 3-10 players
- **Clash Royale Cards**: 98 unique cards with authentic attributes
- **Two Imposter Modes**:
  - **Text Mode**: Imposters see "IMPOSTER 👀"
  - **Similar Card Mode**: Imposters get a card similar to the real one based on configurable attributes
- **Multi-Round Discussion**: Track what each player says across multiple rounds
- **Similarity Matching**: Intelligent card matching based on elixir, type, category, element, and family
- **Dark Minimalist UI**: Beautiful dark royal blue and gold theme with smooth animations
- **Card Flip Animation**: Satisfying 3D card reveal animation
- **Shareable Results**: Export game results as PNG images

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

### Open in Browser

Navigate to `http://localhost:5173` to play the game!

## 🎮 How to Play

### 1. Setup Phase
- Choose number of players (3-10)
- Set number of imposters (default: 1)
- Select imposter mode:
  - **"IMPOSTER" text**: Imposters see the word "IMPOSTER"
  - **Similar card**: Imposters get a card similar to the real one
- Configure similarity threshold (1-5) for similar card mode
- Set number of discussion rounds (1-5)
- View all available cards before starting

### 2. Card Reveal Phase
- Pass the device to Player 1
- Player 1 taps to reveal their card
- Each player views their card privately
- Pass to the next player
- Continue until all players have seen their cards

### 3. Discussion Phase
- Multiple rounds of discussion
- Each player can optionally input what they said
- Previous words are displayed in subsequent rounds
- Track who said what across all rounds

### 4. Reveal Phase
- View discussion summary for all players
- Discuss and vote on who the imposter is
- Reveal the imposter!
- See the real card vs imposter's card
- Share results or play again

## 🏗️ Project Structure

```
imposter-game/
├── src/
│   ├── components/
│   │   ├── GameSetup.jsx         # Initial setup screen
│   │   ├── CardListModal.jsx     # Modal showing all cards
│   │   ├── PassDevice.jsx        # Interstitial pass screen
│   │   ├── CardReveal.jsx        # Card flip animation
│   │   ├── DiscussionRound.jsx   # Discussion input screen
│   │   ├── RevealImposter.jsx    # Final reveal screen
│   │   └── ShareImage.jsx        # PNG export component
│   ├── data/
│   │   └── cardData.js           # CSV parser and similarity logic
│   ├── utils/
│   │   └── gameLogic.js          # Game state management utilities
│   ├── assets/
│   │   ├── cards.csv             # 98 Clash Royale cards with attributes
│   │   └── logo-placeholder.svg  # ClashImposter logo
│   ├── App.jsx                   # Main app with game flow
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite configuration
└── package.json                  # Dependencies
```

## 🎨 Design

- **Color Scheme**: Dark royal blue (#1e1b4b to #1e3a8a) + Dark yellow (#ca8a04 to #eab308)
- **Typography**: Shiny embossed gradient text
- **UI Elements**: Rounded corners, smooth shadows, 3D transforms
- **Animations**: Card flips, fade-ins, hover effects
- **Responsive**: Mobile-first design optimized for tablets and phones

## 📊 Card Attributes

Each of the 98 Clash Royale cards includes:
- **Name**: Card name (e.g., "Knight", "Wizard")
- **Elixir**: Elixir cost (1-9)
- **Type**: melee, ranged
- **Category**: tank, mage, bruiser, assassin, support
- **Element**: fire, ice, electro, poison, none
- **Family**: skeleton, goblin, golem, spirit, wizard, etc.

## 🔧 Technologies

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **JavaScript ES6+**: Modern JavaScript features

## 🎯 Future Enhancements (Commented/Scaffolded)

- [ ] Multiplayer via WebSockets
- [ ] Additional word/card packs
- [ ] Timer for discussion rounds
- [ ] Sound effects and music
- [ ] Custom card uploads
- [ ] Game statistics and leaderboards
- [ ] html2canvas integration for better image exports

## 📝 License

This is a fan-made game. Clash Royale is owned by Supercell. This project uses no copyrighted assets and is for educational purposes only.


