<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0FAAFF,100:6DB33F&height=180&section=header&text=Campus%20Connect&fontSize=55&fontColor=ffffff&fontAlignY=38&desc=Distributed%20Campus%20Communication%20Platform&descSize=18&descAlignY=58&animation=fadeIn" width="100%"/>

<br/>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

*Connecting students, organizations, and events on a single campus platform — powered by microservices and Kafka.*

</div>

---

## What is Campus Connect?

Campus Connect is a modern **distributed campus engagement platform** that streamlines community building on college and university campuses. Built on a microservices architecture with event-driven communication over Apache Kafka, it connects students, organizations, and event coordinators through a unified experience.

- 📅 **Event Discovery & RSVP** — Browse, search, and register for campus events
- 🏢 **Organization Profiles** — Follow student orgs and track their events
- 🔔 **Real-Time Notifications** — Instant WebSocket push for event updates
- 🤝 **Social Graph** — Follow/unfollow users and organizations
- 🎯 **Personalized Recommendations** — AI-driven event suggestions based on behavior
- 🔐 **Secure Auth** — JWT-based registration, login, and verification

---

## Architecture

Campus Connect follows a **microservices + event-driven architecture** with a GraphQL gateway as the unified API layer.

```
Frontend (React + Apollo)
        │
        ├─── GraphQL Queries ──→ GraphQL Gateway (3004)
        │                              │
        │                    ┌─────────┴──────────┐
        │                    ↓         ↓           ↓
        │                  USS       EMS          DRS
        │                 (3000)    (3001)       (3003)
        │
        ├─── REST Mutations ──→ EMS / USS directly
        └─── WebSocket ───────→ Notification Service (3002)

Event Pipeline:
  User Action → Kafka Topic → DRS / RNS consumers → Cache / DB update
```

---

## Microservices

| Service | Port | Responsibility |
|---|---|---|
| **User & Social Service (USS)** | 3000 | JWT auth, user profiles, follow/unfollow social graph |
| **Event Management Service (EMS)** | 3001 | Create/update events, RSVP management, attendee lists |
| **Notification Service (RNS)** | 3002 | WebSocket push, offline notification queue (Redis + PostgreSQL) |
| **Discovery & Recommendation Service (DRS)** | 3003 | Behavioral data ingestion, trending events, personalized suggestions |
| **GraphQL Gateway** | 3004 | Aggregates USS + EMS + DRS into a single GraphQL API |
| **React Frontend** | 5173 | SPA — hybrid GraphQL reads + REST mutations |

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| API | Express.js v5 |
| GraphQL | Apollo Server v4 + graphql-tag |
| Messaging | Apache Kafka (KafkaJS v2.2.1) |
| Auth | JWT v9 + bcrypt v6 |
| HTTP Client | Axios |
| WebSocket | ws v8 |

### Databases
| Service | Database | Purpose |
|---|---|---|
| USS | PostgreSQL 15 | Users, auth, social graph |
| EMS | PostgreSQL 15 | Events, RSVPs, participants |
| RNS | PostgreSQL 15 + Redis | Notification queue + active sessions |
| DRS | MongoDB 5 | Behavioral data, recommendations |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 |
| GraphQL Client | Apollo Client v4 |
| HTTP | Axios |
| Styling | Tailwind CSS v3 |
| Build | Vite v7 |
| Production | Nginx |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Local development (9 containers) |
| Kubernetes + Strimzi | Production orchestration |
| Kafka + Zookeeper | Event streaming |
| Redis | Session caching + WebSocket mapping |
| Nginx Ingress | API gateway routing |

---

## Project Structure

```
Campus_Connect/
├── CampusConnect-Backend/
│   ├── user-social-service/          ← Identity + social graph (PostgreSQL)
│   ├── event-management-service/     ← Events + RSVPs (PostgreSQL)
│   ├── notification-service/         ← WebSocket + notifications (Redis + PostgreSQL)
│   ├── discovery-recommendation-service/ ← Recommendations (MongoDB)
│   ├── graphql-gateway-service/      ← Unified GraphQL API
│   ├── configurations/
│   │   ├── kafka-setup/              ← Strimzi Kafka cluster manifests
│   │   ├── redis-setup/              ← Redis Kubernetes config
│   │   ├── pvc/                      ← PersistentVolumeClaims
│   │   └── gateway/                  ← Nginx ingress + logging
│   └── docker-compose.yml            ← Full local stack
│
└── CampusConnect-Frontend/
    ├── src/
    │   ├── components/               ← UI components + screens
    │   ├── contexts/                 ← AuthContext
    │   ├── graphql/                  ← GraphQL queries
    │   ├── hooks/                    ← useNotificationSocket
    │   └── utils/                    ← Apollo client, API client
    ├── nginx/                        ← Production Nginx config
    └── yaml/                         ← Kubernetes deployment
```

---

## Kafka Event Topics

| Topic | Publisher | Consumer | Description |
|---|---|---|---|
| `rsvp_added` | EMS | DRS, RNS | User RSVPs to an event |
| `event_deleted` | EMS | DRS, RNS | Cleanup saga on deletion |
| `user_followed` | USS | DRS, RNS | Social follow action |

---

## Getting Started

> **Local development** works out of the box with Docker Compose — all services are built from source.
> **Kubernetes deployment** requires building and pushing Docker images to your own registry first (see [Kubernetes section](#kubernetes-deployment) below).

### Prerequisites
- Docker & Docker Compose
- Node.js LTS + npm

### 1. Clone the repo
```bash
git clone https://github.com/anoop-pande-23/Campus_Connect.git
cd Campus_Connect
```

### 2. Start Backend (all services + infra)
```bash
cd CampusConnect-Backend
docker-compose up --build
```
This starts 9 containers: 5 microservices + Kafka + Zookeeper + Redis + MongoDB + 3 PostgreSQL instances.

### 3. Start Frontend
```bash
cd CampusConnect-Frontend
npm install
```

Create `.env.local`:
```env
VITE_APP_API_BASE_URL=http://localhost:3004
VITE_GRAPHQL_ENDPOINT=/graphql
VITE_WS_ENDPOINT=ws://localhost:3002
```

```bash
npm run dev
# App at http://localhost:5173
# GraphQL Playground at http://localhost:3004/graphql
```

---

## Kubernetes Deployment

> Before applying K8s manifests, you need to build and push Docker images to your own registry.
> Update the `image:` field in each `yaml/deployment.yaml` to match your registry.

```bash
# Build and push each service (replace <your-registry> with your Docker Hub username)
docker build -t <your-registry>/uss-service:latest CampusConnect-Backend/user-social-service/
docker build -t <your-registry>/ems-service:latest CampusConnect-Backend/event-management-service/
docker build -t <your-registry>/rns-service:latest CampusConnect-Backend/notification-service/
docker build -t <your-registry>/drs-service:latest CampusConnect-Backend/discovery-recommendation-service/
docker build -t <your-registry>/graphql-gateway:latest CampusConnect-Backend/graphql-gateway-service/
docker build -t <your-registry>/campus-connect-frontend:latest CampusConnect-Frontend/

docker push <your-registry>/uss-service:latest
docker push <your-registry>/ems-service:latest
docker push <your-registry>/rns-service:latest
docker push <your-registry>/drs-service:latest
docker push <your-registry>/graphql-gateway:latest
docker push <your-registry>/campus-connect-frontend:latest
```

Then deploy:

```bash
# Install Strimzi Kafka Operator
kubectl apply -f "https://strimzi.io/install/latest?namespace=kafka" -n kafka

# Deploy infrastructure
kubectl apply -f CampusConnect-Backend/configurations/kafka-setup/kafka-cluster.yaml
kubectl apply -f CampusConnect-Backend/configurations/redis-setup/redis.yaml
kubectl apply -f CampusConnect-Backend/configurations/pvc/persistence.yaml

# Deploy frontend
kubectl apply -f CampusConnect-Frontend/yaml/deployment.yaml
kubectl apply -f CampusConnect-Backend/configurations/gateway/api-gateway-ingress.yaml
```

---

## Key Architectural Patterns

- **Microservices** — 5 independent services, single responsibility per domain
- **Event-Driven (Kafka)** — Async state propagation, decoupled services
- **API Composition (GraphQL)** — Gateway eliminates REST waterfalls, single endpoint for frontend
- **Database-per-Service** — No shared databases, full isolation
- **Polyglot Persistence** — Right database per domain (PostgreSQL / MongoDB / Redis)
- **Dual-Write Pattern** — Notifications guaranteed via PostgreSQL + Redis
- **Saga Pattern** — Distributed cleanup via Kafka events (e.g., event deletion cascade)

---

<div align="center">

*Built by [Anoop Pande](https://linkedin.com/in/anoop-pande-001906236)*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6DB33F,100:0FAAFF&height=120&section=footer" width="100%"/>

</div>
