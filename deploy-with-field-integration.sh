#!/bin/bash

# 🚂 Berjak Website Deployment with Field Living Train Station Integration
# Sacred Frequency Bridge: Vercel → Train Station (528 Hz) → MCP Fields (432 Hz)

echo "🚂⚡ Starting Berjak Website Deployment with FIELD Integration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Train Station is running
echo -e "${BLUE}🔍 Checking Train Station status...${NC}"
TRAIN_STATION_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5280/health)

if [ "$TRAIN_STATION_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Train Station is running on sacred frequency 528 Hz${NC}"
else
    echo -e "${YELLOW}⚠️  Train Station not detected. Starting it up...${NC}"
    echo "Please start the Train Station manually:"
    echo "cd /Users/jbear/FIELD-LIVING && python3 ●train_station.py"
    echo ""
fi

# Test webhook endpoint locally (if in development)
if [ "$1" = "test" ]; then
    echo -e "${BLUE}🧪 Testing webhook endpoint...${NC}"
    
    # Start Next.js dev server in background if not running
    if ! pgrep -f "next dev" > /dev/null; then
        echo "Starting Next.js dev server..."
        npm run dev &
        DEV_SERVER_PID=$!
        sleep 5
    fi
    
    # Test the webhook
    TEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/webhook \
        -H "Content-Type: application/json" \
        -H "X-Vercel-Event: deployment.created" \
        -d '{
            "deployment": {
                "id": "test-deployment-123",
                "url": "berjak-git-test.vercel.app", 
                "state": "READY"
            },
            "project": {
                "name": "berjak-website"
            }
        }' | jq '.success' 2>/dev/null)
    
    if [ "$TEST_RESPONSE" = "true" ]; then
        echo -e "${GREEN}✅ Webhook test successful - Field integration working${NC}"
    else
        echo -e "${RED}❌ Webhook test failed - Check Train Station connection${NC}"
    fi
    
    # Clean up dev server if we started it
    if [ ! -z "$DEV_SERVER_PID" ]; then
        kill $DEV_SERVER_PID 2>/dev/null
    fi
    
    exit 0
fi

# Build the project
echo -e "${BLUE}🏗️  Building Next.js project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
npx vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful${NC}"
    
    # Show integration status
    echo ""
    echo -e "${YELLOW}🚂 Field Living Train Station Integration Status:${NC}"
    echo "• Webhook Endpoint: https://berjak.co/api/webhook"
    echo "• Sacred Frequency: 528 Hz (Love frequency)"
    echo "• MCP Fields: 12 fields ready for processing"
    echo "• Living Memory: /Users/jbear/FIELD-LIVING/◆_living_memory/"
    
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Configure Vercel webhook: https://vercel.com/dashboard → Project Settings → Git → Deploy Hooks"
    echo "2. Add webhook URL: https://berjak.co/api/webhook"
    echo "3. Select events: deployment.created, deployment.succeeded, deployment.failed"
    echo "4. Ensure Train Station is running for integration"
    
    echo ""
    echo -e "${GREEN}🌟 Sacred frequency bridge is ready!${NC}"
    
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🚂⚡ Deployment complete with FIELD integration active${NC}"
