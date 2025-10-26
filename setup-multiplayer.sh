#!/bin/bash

echo "🎮 ClashImposter Multiplayer Setup Script"
echo "=========================================="
echo ""

# Step 1: Install backend dependencies
echo "📦 Step 1/4: Installing backend dependencies..."
echo "   - express: Web server framework"
echo "   - socket.io: Real-time WebSocket communication"
echo "   - cors: Cross-Origin Resource Sharing support"
npm install express socket.io cors
echo "✅ Backend dependencies installed"
echo ""

# Step 2: Create server directory structure
echo "📁 Step 2/4: Creating server directory..."
mkdir -p server
echo "   Created: server/ (backend code will go here)"
echo "✅ Server directory created"
echo ""

# Step 3: Create frontend multiplayer directories
echo "📁 Step 3/4: Creating frontend directories..."
mkdir -p src/components/multiplayer
echo "   Created: src/components/multiplayer/ (new multiplayer components)"
mkdir -p src/context
echo "   Created: src/context/ (Socket.io context provider)"
echo "✅ Frontend directories created"
echo ""

# Step 4: Verify installation
echo "🔍 Step 4/4: Verifying installation..."
if [ -d "server" ] && [ -d "src/components/multiplayer" ] && [ -d "src/context" ]; then
    echo "✅ All directories created successfully"
else
    echo "❌ Error: Some directories were not created"
    exit 1
fi

if npm list express socket.io cors > /dev/null 2>&1; then
    echo "✅ All dependencies installed successfully"
else
    echo "⚠️  Warning: Some dependencies may not have installed correctly"
fi

echo ""
echo "=========================================="
echo "✨ Setup Complete! Ready for implementation"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Backend files will be created in server/"
echo "2. Multiplayer components will be created in src/components/multiplayer/"
echo "3. Socket context will be created in src/context/"
echo ""
echo "🚀 Ready to start building!"
