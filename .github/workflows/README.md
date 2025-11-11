# CI/CD Pipeline Setup Guide

This guide will help you set up the GitHub Actions CI/CD pipeline for deploying to AWS EC2.

## Prerequisites

1. AWS EC2 instance running (Ubuntu/Amazon Linux recommended)
2. Docker and Docker Compose installed on EC2
3. GitHub repository with this code
4. AWS IAM user with appropriate permissions

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Required Secrets

- `AWS_ACCESS_KEY_ID`: Your AWS IAM access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS IAM secret access key
- `AWS_REGION`: AWS region (e.g., `us-east-1`)
- `EC2_HOST`: Your EC2 instance public IP or domain (e.g., `54.123.45.67`)
- `EC2_USER`: SSH user for EC2 (e.g., `ubuntu` for Ubuntu, `ec2-user` for Amazon Linux)
- `EC2_SSH_KEY`: Your EC2 private SSH key (entire content of .pem file)

## EC2 Instance Setup

### 1. Connect to your EC2 instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### 2. Install Docker

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Docker
sudo yum install docker -y  # For Amazon Linux
# OR
sudo apt install docker.io -y  # For Ubuntu

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Install Git

```bash
sudo yum install git -y  # For Amazon Linux
# OR
sudo apt install git -y  # For Ubuntu
```

### 5. Clone your repository

```bash
cd /home/$USER
git clone https://github.com/your-username/your-repo.git event-management
cd event-management
```

### 6. Create .env file

```bash
nano .env
```

Add your environment variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
RESET_TOKEN_SECRET=your_reset_token_secret
RESET_TOKEN_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
ADMIN_NAME=Admin
```

### 7. Configure Security Group

Ensure your EC2 security group allows:
- Port 22 (SSH) from GitHub Actions IP ranges
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Your database port (if external)

## Deployment Process

The pipeline automatically:

1. **On Pull Request**: Builds and tests the application
2. **On Push to main/develop**: Builds, tests, and deploys to EC2

### Manual Deployment

To deploy manually from your local machine:

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
cd /home/$USER/event-management
git pull origin main
docker-compose down
docker-compose up -d --build
docker-compose exec app npx prisma migrate deploy
```

## Troubleshooting

### Check container logs
```bash
docker-compose logs -f app
```

### Check container status
```bash
docker-compose ps
```

### Restart containers
```bash
docker-compose restart
```

### View GitHub Actions logs
Go to your repository → Actions tab → Select the workflow run

## Security Best Practices

1. Use AWS Secrets Manager or Parameter Store for sensitive data
2. Rotate SSH keys regularly
3. Use IAM roles instead of access keys when possible
4. Enable CloudWatch monitoring
5. Set up automated backups for your database
6. Use HTTPS with valid SSL certificates
7. Implement rate limiting and security headers

## Monitoring

Consider setting up:
- CloudWatch for EC2 metrics
- Application logs aggregation
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Error tracking (e.g., Sentry)
