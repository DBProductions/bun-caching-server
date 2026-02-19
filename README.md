# bun-caching-server

This project demonstrates how Bun v1.3.9 — a fast all-in-one JavaScript runtime with native bindings for SQL databases and Redis — can be used to build a simple caching server.

The server fetches user data from a PostgreSQL database and caches it in Redis.  
Subsequent requests for the same data are served from the cache, improving response times and reducing database load.  
Any updates, inserts, or deletions automatically invalidate or refresh the relevant cache entries.

## 🚀 Quick Start

### 1. Start Dependencies with Docker Compose

The included docker-compose.yml file spins up:

- PostgreSQL (preloaded with sample user data via initdb/init.sql)
- Redis (for caching)
- Redis Commander (web-based Redis GUI)

Access Redis Commander at: http://localhost:8081

```bash
docker-compose up
```

### 2. Install & Run the Service

```bash
bun install
bun server.ts
```

The API will be available at: `http://localhost:3000`

### 3. Run tests  

```bash
bun test
bun test --coverage
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PATCH | `/users/:id` | Update user (partial) |
| PUT | `/users/:id` | Replace user |
| DELETE | `/users/:id` | Delete user |
| GET | `/health` | Health check |

---

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `DATABASE_URL` | postgres://bun:bun@localhost:5432/bun | PostgreSQL connection |
| `REDIS_URL` | redis://:secret_password@localhost:6379 | Redis connection |

---

## 👤 User Object

```json
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "mobile": "1234567890",
  "city": "Berlin",
  "country": "Germany"
}
```

**Note:** `city` and `country` are optional fields. If provided, they will be automatically created in the database if they don't already exist.

---

## 📖 Example Requests

### Get a user
```bash
curl http://localhost:3000/users/10
```

### Create a user (POST)
```bash
curl --request POST \
  --url http://localhost:3000/users \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Test",
  "email": "test0@test.de",
  "mobile": "72478787787"
}'
```

### Create a user with city and country (POST)
```bash
curl --request POST \
  --url http://localhost:3000/users \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Test",
  "email": "test0@test.de",
  "mobile": "72478787787",
  "city": "Berlin",
  "country": "Germany"
}'
```

### Update a user (PATCH)
```bash
curl --request PATCH \
  --url http://localhost:3000/users/10 \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "testpatch@test.de"
}'
```

### Replace a user (PUT)
```bash
curl --request PUT \
  --url http://localhost:3000/users/10 \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Testput",
  "email": "testput@test.de",
  "mobile": "2424234234234",
  "city": "Berlin",
  "country": "Germany"
}'
```

### Delete a user (DELETE)
```bash
curl --request DELETE \
  --url http://localhost:3000/users/10
```

### Health check
```bash
curl http://localhost:3000/health
```

---

## 💬 Feedback

Star ⭐ this repo if you found it useful. Use the github issue tracker to give feedback on this repo.
