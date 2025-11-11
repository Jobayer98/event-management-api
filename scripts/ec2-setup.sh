#!/bin/bash

# EC2 Setup Script for Event Management Application
# Run this script on your EC2 instance after initial connection

set -e

echo "🚀 Starting EC2 setup for Event Management Application..."

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "Cannot detect OS"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt update && sudo apt upgrade -y
elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
    sudo yum update -y
fi

# Install Docker
echo "🐳 Installing Docker..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt install -y docker.io
elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
    sudo yum install -y docker
fi

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt install -y git
elif [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
    sudo yum install -y git
fi

# Create application directory
echo "📁 Setting up application directory..."
cd /home/$USER
APP_DIR="/home/$USER/event-management"

# Prompt for repository URL
read -p "Enter your GitHub repository URL: " REPO_URL

if [ ! -d "$APP_DIR" ]; then
    echo "📥 Cloning repository..."
    git clone $REPO_URL event-management
else
    echo "⚠️  Directory already exists. Skipping clone."
fi

cd $APP_DIR

# Create .env file
echo "⚙️  Creating .env file..."
if [ ! -f .env ]; then
    cat > .env << 'EOL'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?schema=public
JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRES_IN=7d
RESET_TOKEN_SECRET=change_this_to_another_secure_random_string
RESET_TOKEN_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
ADMIN_NAME=Admin
EOL
    echo "⚠️  Please edit .env file with your actual configuration:"
    echo "   nano .env"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs

# Set proper permissions
sudo chown -R $USER:$USER $APP_DIR

echo ""
echo "✅ EC2 setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Edit the .env file with your configuration:"
echo "   nano .env"
echo ""
echo "2. Log out and log back in for docker group changes to take effect:"
echo "   exit"
echo "   ssh -i your-key.pem $USER@your-ec2-ip"
echo ""
echo "3. Start the application:"
echo "   cd $APP_DIR"
echo "   docker-compose up -d --build"
echo ""
echo "4. Run database migrations:"
echo "   docker-compose exec app npx prisma migrate deploy"
echo ""
echo "5. Check application status:"
echo "   docker-compose ps"
echo "   docker-compose logs -f app"
echo ""
echo "6. Configure GitHub Secrets for CI/CD (see .github/workflows/README.md)"
echo ""
