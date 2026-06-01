# 🛠️ Contributing to Campus Connect Backend Services

This document outlines the procedures for setting up the local development environment and contributing changes to the five microservices (USS, EMS, RNS, DRS, GraphQL Gateway).

## 1. Project Structure and Domains

The backend is decomposed by domain, and services are strictly decoupled.

| Service | Technology | Internal Port | Primary Database |
|---------|-----------|---------------|------------------|
| USS (Identity) | Node.js/Express | 3000 | PostgreSQL |
| EMS (Events/RSVP) | Node.js/Express | 3001 | PostgreSQL |
| RNS (Notifications) | Node.js/WS | 3002 | PostgreSQL / Redis |
| DRS (Discovery/ML) | Node.js/Mongoose | 3003 | MongoDB / Redis |
| GraphQL Gateway | Apollo/Express | 3004 | None (Aggregation) |

## 2. Local Development Setup (Docker Compose)

We use Docker Compose to orchestrate all 9 backend containers required for development (5 services + Kafka + Zookeeper + 3 DBs).

### Prerequisites

- Docker and Docker Compose (v2.x) installed.
- Node.js (for running migration scripts or linting outside containers).

### Execution

1. **Clone Repositories**: Ensure all five microservice repositories are cloned into a single parent directory alongside the `docker-compose.yml` file.

2. **Build and Run Stack**: Execute the following command from the directory containing `docker-compose.yml`. This builds the Node.js images and starts all databases, Kafka, and Redis.

```bash
docker-compose up --build
```

3. **Local Access**: Once services are running, the local stack exposes ports for direct connection:
   - User Service (USS): `localhost:3000`
   - GraphQL Gateway: `localhost:3004/graphql` (Primary API entry point)

## 3. Contribution Rules and Design Integrity

### Microservice Boundary Rule (Crucial)

- **No Direct DB Access**: A service may never directly query the database of another service (e.g., EMS cannot query `postgres-uss`). All cross-domain data must be fetched via the other service's REST API (Synchronous) or Kafka events (Asynchronous).

- **Decoupling via Kafka**: All core state changes (e.g., RSVP recorded, user followed) must be broadcast to the relevant Kafka topic (`event_interactions`, `user_events`) to facilitate asynchronous cleanup and update.

### API Contribution Standards

| API Change | Rule | Verification Required |
|-----------|------|----------------------|
| Mutations/Writes | Must use RESTful endpoints (POST/PUT/DELETE) and require the `X-User-ID` header for authorization. | Must pass Bruno/cURL tests ensuring database integrity and Kafka event production. |
| Complex Reads | Must be added to the GraphQL Schema (typeDefs) and resolved by the GraphQL Gateway. | Verify via the Apollo Studio Explorer that the new field is correctly composed from its origin microservices. |


### Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows naming conventions and formatting standards
- [ ] All functions have JSDoc comments
- [ ] Error handling is implemented properly
- [ ] Database queries use transactions where needed
- [ ] Kafka events are published for state changes
- [ ] Input validation is in place
- [ ] Secrets are not hardcoded (use environment variables)
- [ ] No direct database access across services
- [ ] Tests are written and passing
- [ ] Logs are structured and use appropriate levels


### Branch Naming

- **Feature**: `feature/add-event-recommendation`
- **Bug Fix**: `fix/rsvp-duplicate-issue`
- **Hotfix**: `hotfix/kafka-connection-timeout`
- **Refactor**: `refactor/event-service-cleanup`

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(ems): add event recommendation endpoint

- Implement GET /events/recommended endpoint
- Integrate with DRS for personalized recommendations
- Add caching layer with Redis

Closes #123
```

```
fix(uss): prevent duplicate follower entries

- Add unique constraint on (follower_id, followee_id)
- Handle constraint violation errors gracefully

Fixes #456
```


### Pull Request Process

1. **Create Feature Branch**:

```bash
git checkout -b feature/add-notification-preferences
```

2. **Make Changes and Commit**:

```bash
git add .
git commit -m "feat(rns): add user notification preferences"
```

3. **Sync with Main**:

```bash
git fetch origin
git rebase origin/main
```

4. **Push Branch**:

```bash
git push origin feature/add-notification-preferences
```

5. **Create Pull Request** with the following information:
   - **Title**: Clear description of the change
   - **Description**: What, why, and how
   - **Related Issues**: Link to relevant issues
   - **Testing**: Describe how you tested the changes
   - **Screenshots**: If UI/API changes are involved

6. **Code Review**: Address reviewer feedback

7. **Merge**: Squash and merge once approved