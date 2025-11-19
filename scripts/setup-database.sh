#!/bin/bash
# Berjak FRE Database Setup Script
# This script sets up PostgreSQL database for the FRE system

set -e

echo "🔱 Berjak FRE - Database Setup (Trident Agile)"
echo "=============================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "📦 Installing PostgreSQL via Homebrew..."
    brew install postgresql@16
    brew services start postgresql@16
fi

# Database configuration
DB_NAME="berjak_fre"
DB_USER="berjak_user"
DB_PASSWORD=$(openssl rand -base64 32)

echo "📊 Creating PostgreSQL database: $DB_NAME"
echo ""

# Create database and user
psql postgres <<EOF
-- Create user if not exists
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo "✅ Database created successfully"
echo ""

# Generate DATABASE_URL
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

echo "📝 Updating .env.local file..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
fi

# Update DATABASE_URL in .env.local
if grep -q "^DATABASE_URL=" .env.local; then
    # macOS compatible sed
    sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env.local
else
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
fi

echo "✅ Environment configured"
echo ""

echo "🔄 Installing Prisma dependencies..."
npm install prisma @prisma/client --save

echo ""
echo "🔄 Running Prisma migrations..."
npx prisma generate
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Database Connection Details:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo "Connection URL: $DATABASE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔍 To view database:"
echo "   npx prisma studio"
echo ""
echo "📊 To view schema:"
echo "   psql $DB_NAME"
echo ""
