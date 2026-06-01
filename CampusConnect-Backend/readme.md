## About Campus Connect

**Campus Connect** is a modern web application designed to streamline campus life by connecting students, organizations, and event coordinators on a single platform. The app enables users to discover and RSVP to campus events, receive real-time notifications, and interact with organizations—all in one place.

Key features include:
- **Event Discovery:** Browse upcoming campus events, view details, and RSVP.
- **Organization Profiles:** Explore student organizations, their events, and contact information.
- **Real-Time Notifications:** Get instant alerts for new events, updates, and announcements via WebSockets.
- **User Onboarding & Authentication:** Secure registration, login, and verification flows.
- **Personalized Dashboard:** Track your RSVPs, attended events, and notifications.

Campus Connect is built for scalability and performance, making it easy for universities and colleges to foster engagement and community spirit.

# 💻 Campus Connect: Microservices Backend

This repository contains the complete backend architecture for the Campus Connect platform. The system is built on a **Node.js Microservices Architecture (MSA)** utilizing **Polyglot Persistence** and **Event-Driven Architecture (EDA)** to maximize scalability, resilience, and data composition capabilities.

## 1. Architectural Overview

The architecture consists of five decoupled services communicating via **Apache Kafka** for state changes and leveraging a central **GraphQL Gateway** for efficient data fetching.

### Core Stack Summary

| Component      | Tech Stack                 | Data Store          | Role                                                                 |
|----------------|----------------------------|---------------------|----------------------------------------------------------------------|
| API Framework  | Node.js (Express)          | N/A                 | REST API layer and WS host.                                          |
| Messaging      | KafkaJS / Apache Kafka     | N/A                 | Asynchronous Event Bus.                                              |
| Relational DB  | PostgreSQL / Sequelize     | Separate Instances  | Transactional integrity for core data (Identity, Events, Notifications). |
| NoSQL / Cache  | MongoDB, Redis             | Separate Instances  | Fast serving of cache data (Redis) and flexible feature storage (MongoDB). |
| Composition    | Apollo Server (GraphQL)    | N/A                 | API Composer, eliminating REST waterfalls.                           |

### Operational Principles

- **Database-per-Service**: Each PostgreSQL instance is dedicated and isolated.
- **Decoupling**: Services rely on Kafka events, not direct synchronous calls, for state updates.
- **Horizontal Scaling**: All services are designed to be stateless (or managed by Redis/PVC) and scaled via Kubernetes deployments.

## 2. Microservice Detail and Technology Use

Each service adheres to the **Single Responsibility Principle**, using the best technology for its domain.

### 2.1. User & Social Service (USS)

| Domain         | Persistence  | Key Functionality                                                                 |
|----------------|--------------|-----------------------------------------------------------------------------------|
| Identity & Auth | PostgreSQL   | **Authentication**: Handles user registration/login (JWT).<br>**Social Graph**: Manages follower/following relationships. |

**Scalability Note**: Data Enrichment - The `GET /users/{id}` profile endpoint is enriched to include the `is_following_requester` flag, demonstrating complex read logic.

### 2.2. Event Management Service (EMS)

| Domain          | Persistence  | Key Functionality                                                                 |
|-----------------|--------------|-----------------------------------------------------------------------------------|
| Event Lifecycle | PostgreSQL   | **Transactional Integrity**: Owns events and event_participants.<br>**RSVP Authority**: Manages `POST /rsvp` (synchronous update) and produces `rsvp_added` Kafka events. |

**Resilience Note**: Local Cascade - Enforces integrity for `event_id` but relies on application logic for `attendee_id` (conceptual foreign key).

### 2.3. Real-time Notification Service (RNS)

| Domain              | Persistence         | Key Functionality                                                                 |
|---------------------|---------------------|-----------------------------------------------------------------------------------|
| Real-Time Delivery  | Redis, PostgreSQL   | **Guaranteed Delivery (Dual Write)**: Writes to PostgreSQL (offline message queue) before attempting instant push via WebSockets.<br>Uses Redis to map active user sessions (`ws:map`). |

**Resilience Note**: Kafka Consumer - Listens to all topics to trigger delivery, ensuring resilience against EMS/USS outages.

### 2.4. Discovery & Recommendation Service (DRS)

| Domain              | Persistence      | Key Functionality                                                                 |
|---------------------|------------------|-----------------------------------------------------------------------------------|
| Data Intelligence   | MongoDB, Redis   | **Behavioral Ingestion**: Consumes Kafka events (`user_followed`, `rsvp_added`) to update the UserProfile (MongoDB).<br>**Recommendation**: Serves personalized and trending lists from Redis cache. |

**Polyglot Note**: Uses MongoDB for flexible schema and Redis for high-speed cache serving, demonstrating read offloading from PostgreSQL.

### 2.5. GraphQL Gateway

| Domain           | Persistence  | Key Functionality                                                                 |
|------------------|--------------|-----------------------------------------------------------------------------------|
| API Composition  | None         | **Data Stitching**: Aggregates user profile data (from USS) with event data (from EMS) and intelligence data (from DRS) into single GraphQL objects. |

## 3. Distributed Patterns and Observability

### A. Event-Driven Reliability (Saga Pattern)

The system implements **Distributed Cascade on Delete** (a form of the Saga pattern) when a core entity is removed.

**Example**: Deleting an Event (`DELETE /events/{id}`) triggers the EMS to publish an `event_deleted` Kafka event.

**Cleanup Chain**: The DRS consumes this event and executes a compensating transaction, deleting the associated event feature record from its MongoDB collection.

- **Verification**: Logs can be filtered in Kibana by `kubernetes.namespace_name: campus-connect` to isolate application activity and debug service interaction failures.

## 4. Local Development

To run the entire backend locally, the stack is orchestrated via **Docker Compose**, eliminating the need for a full Kubernetes deployment during development.

```bash
# Command to build and run all 9 containers (5 services + 4 DBs)
docker-compose up --build
```

## Kubernetes Commands Reference

```bash
# Kafka port forward
kubectl port-forward svc/campus-kafka-cluster-broker-0 9094:9094 -n kafka

# PostgreSQL Event Service port forward
kubectl port-forward svc/postgres-event-service 5434:5432 -n campus-connect

# PostgreSQL User Service port forward
kubectl port-forward svc/postgres-user-service 5433:5432 -n campus-connect

# PostgreSQL RNS Service port forward
kubectl port-forward svc/postgres-rns-service 5435:5432 -n campus-connect
```

### Database Operations

```bash
# Set database credentials
DB_USER=event_service_admin
DB_NAME=campus_connect_events

# Get the current pod name
POD_NAME=$(kubectl get pods -n campus-connect -l app=postgres-event-service -o jsonpath='{.items[0].metadata.name}')

# Execute database commands
kubectl exec -it $POD_NAME -n campus-connect -- psql -U $DB_USER -d $DB_NAME

# Drop foreign key constraint
kubectl exec -it $POD_NAME -n campus-connect -- psql -U $DB_USER -d $DB_NAME -c \
  "ALTER TABLE event_participants DROP CONSTRAINT event_participants_attendee_id_fkey;"
```

### Install Strimzi Kafka Operator

```bash
kubectl apply -f "https://strimzi.io/install/latest?namespace=kafka" -n kafka
```

### Database Maintenance

```bash
# Get the postgres pod name
kubectl get pods -n campus-connect | grep postgres-event-service

# Connect to PostgreSQL
kubectl exec -it <postgres-pod-name> -n campus-connect -- psql -U event_service_admin -d campus_connect_events

# Delete test events
DELETE FROM events WHERE title LIKE 'LT Event%';

# Check how many were deleted
SELECT COUNT(*) FROM events WHERE title LIKE 'LT Event%';

# Exit psql
\q
```

### Multi-platform Docker Build

```bash
# Build and push multi-architecture Docker images
docker buildx build --platform linux/amd64,linux/arm64 \
  -t vipul710/uss-service:latest \
  --push .
```
