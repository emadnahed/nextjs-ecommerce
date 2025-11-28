# Debug Container Health Check

## The Problem
- Docker image is correct (contains full Next.js app)
- Containers are starting (logs show "Ready in XXms")
- BUT: CapRover nginx returns 502 (not routing to containers)

**Most likely cause**: Health checks are failing, so CapRover marks containers as "unhealthy" and doesn't route traffic to them.

## Option 1: Test Health Endpoint from CapRover CLI

Run this in CapRover's terminal/shell:

```bash
# Find your container ID
docker ps | grep zeyrey

# Test health endpoint from inside container
docker exec <CONTAINER_ID> wget -O- http://localhost:3000/api/health

# OR use curl if available
docker exec <CONTAINER_ID> curl http://localhost:3000/api/health
```

**Expected result**: `{"status":"ok"}`

**If you get an error**: The health endpoint isn't working inside the container

## Option 2: Check Docker Health Check Status

```bash
# Check container health status
docker ps | grep zeyrey

# Look for the "(healthy)" or "(unhealthy)" status
```

If it shows `(unhealthy)`, that's your problem!

## Option 3: Temporarily Disable HEALTHCHECK

This will help us determine if the health check is the issue.

**Do this:**
1. Comment out the HEALTHCHECK in Dockerfile (lines 87-89)
2. Commit and redeploy
3. If the site works WITHOUT healthcheck, we know that's the issue

## Option 4: Check CapRover Container Logs in Real-Time

Instead of looking at app logs, look at the DOCKER logs:

```bash
# Get container ID
docker ps | grep zeyrey

# Watch logs in real-time
docker logs -f <CONTAINER_ID>
```

Then in another terminal, trigger the health check:

```bash
curl https://www.zeyrey.online/api/health
```

Watch if the request reaches the container. If you see NO incoming request in the logs, CapRover isn't routing to it.

## What to Tell Me

After trying these, please share:
1. Container health status (healthy/unhealthy/starting)
2. Does the health endpoint work from inside the container?
3. Do you see incoming HTTP requests in the container logs when you curl the site?

This will tell us exactly what's blocking the traffic.
