# Redis Quick Start for Windows

## Installation

### Option 1: Using Chocolatey (Recommended)

```powershell
# Install Chocolatey if not already installed
# Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Redis
choco install redis-64 -y

# Start Redis Server
redis-server
```

### Option 2: Manual Download

1. Download Redis for Windows: https://github.com/tporadowski/redis/releases
2. Extract the ZIP file to `C:\Redis`
3. Run `redis-server.exe` from the extracted folder

### Option 3: Docker (Alternative)

```powershell
# Pull Redis image
docker pull redis:latest

# Run Redis container
docker run -d -p 6379:6379 --name redis redis:latest

# Stop Redis
docker stop redis

# Start Redis
docker start redis
```

## Verify Installation

```powershell
# Test Redis is running
redis-cli ping
# Should return: PONG

# Check Redis version
redis-cli --version

# Connect to Redis CLI
redis-cli
```

## Basic Redis Commands

```bash
# In redis-cli:
PING                    # Test connection
SET key value           # Set a key
GET key                 # Get a key
DEL key                 # Delete a key
KEYS *                  # List all keys
FLUSHDB                 # Clear current database
INFO                    # Server information
```

## Running Redis with Backend

### 1. Start Redis Server

```powershell
# In a new terminal window
redis-server
```

### 2. Start Backend Server

```powershell
# In another terminal window
cd backend
npm run dev
```

You should see:

```
🔌 Connecting to Redis...
✅ Redis connected: localhost:6379 (DB: 0)
```

## Test Redis Integration

```powershell
# Run the test script
npm run test:redis
```

Expected output:

```
🧪 Testing Redis Connection and Operations...

1️⃣ Testing connection...
   ✅ PING: PONG

2️⃣ Testing basic operations...
   ✅ SET/GET: world

3️⃣ Testing TTL...
   ✅ TTL: 59 seconds remaining

...

✅ All Redis tests passed!
```

## Redis GUI Tools (Optional)

### RedisInsight (Official)

- Download: https://redis.com/redis-enterprise/redis-insight/
- Free visual Redis client with monitoring

### Another Redis Desktop Manager

- Download: https://github.com/qishibo/AnotherRedisDesktopManager/releases
- Open source Redis client

## Troubleshooting

### Redis Won't Start

```powershell
# Check if Redis is already running
netstat -ano | findstr :6379

# Kill existing Redis process
taskkill /PID <PID> /F

# Restart Redis
redis-server
```

### Connection Refused Error

1. Make sure Redis server is running
2. Check firewall settings
3. Verify port 6379 is not blocked

### Memory Issues

Edit `redis.windows.conf`:

```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Production Considerations

For production, consider:

1. Redis as a Windows Service
2. Redis password protection
3. Redis persistence (RDB/AOF)
4. Redis Sentinel for high availability
5. Redis Cluster for scaling

## Quick Reference

```powershell
# Start Redis
redis-server

# Start Redis with config
redis-server redis.conf

# Redis CLI
redis-cli

# Monitor Redis activity
redis-cli monitor

# Check memory usage
redis-cli info memory

# Benchmark Redis
redis-benchmark -q -n 10000
```

## Environment Variables

Already configured in `.env.local`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=rnh:
```

## Next Steps

- ✅ Redis is now integrated in your backend
- ✅ Rate limiting uses Redis
- ✅ Cache service is ready to use
- 📚 See `REDIS_SETUP.md` for usage examples
