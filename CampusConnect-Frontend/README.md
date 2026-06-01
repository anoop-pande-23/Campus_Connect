# About Campus Connect

**Campus Connect** is a modern web application designed to streamline campus life by connecting students, organizations, and event coordinators on a single platform. The app enables users to discover and RSVP to campus events, receive real-time notifications, and interact with organizations—all in one place.

Key features include:
- **Event Discovery:** Browse upcoming campus events, view details, and RSVP.
- **Organization Profiles:** Explore student organizations, their events, and contact information.
- **Real-Time Notifications:** Get instant alerts for new events, updates, and announcements via WebSockets.
- **User Onboarding & Authentication:** Secure registration, login, and verification flows.
- **Personalized Dashboard:** Track your RSVPs, attended events, and notifications.

Campus Connect is built for scalability and performance, making it easy for universities and colleges to foster engagement and community spirit.

# Campus Connect: Frontend Application

This repository contains the complete source code for the **Campus Connect** single-page application (SPA), built using **React**. This client is designed to consume data efficiently from a Microservices Backend via a **Hybrid API Architecture**.

---

## 1. Technologies and Architecture

The frontend is a modern SPA designed for high performance and low-latency interaction.

- **Framework**: React (Functional Components, Hooks)
- **Styling**: Tailwind CSS (for rapid, utility-first UI development)
- **State Management**: React Context API
- **Build Tool**: Vite
- **Production Server**: Nginx (for serving static assets in production)

### Key API Communication Strategy

The client uses a **Hybrid API Model** to optimize network traffic:

| API Style    | Library Used           | Use Case                                                                                                      | Rationale                                                                 |
|--------------|------------------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **GraphQL**  | Apollo Client          | Complex Reads (e.g., loading the Dashboard, My Events, or Event Details). Fetches all nested data in one request. | Eliminates the N+1 Problem and prevents over-fetching.                    |
| **REST API** | Axios / Fetch          | Mutations (e.g., Register, Login, RSVP).                                                                      | Used for simple, transactional actions where immediate server response is required. |
| **WebSockets** | Browser API (`ws://`) | Real-Time Delivery. Establishes a persistent channel to receive instant notifications from the RNS.          | Enables Guaranteed Delivery and low-latency alerts.                       |

---

## 2. Local Development Setup

To run the frontend, you must have the backend microservices running (either locally via Docker Compose or deployed in your Kubernetes cluster).

### 2.1. Prerequisites

- **Node.js** (LTS version) and **npm** installed
- The **Backend Microservices** (USS, EMS, GQL, DRS, RNS) must be running and accessible at `localhost:3000` through `localhost:3004`

### 2.2. Installation and Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd campus-connect
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Host**: 
   Ensure your application uses the correct local port for the GraphQL Gateway (3004). Create a `.env.local` file:
   ```env
   VITE_APP_API_BASE_URL=http://localhost:3004
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

The application will start, and the GraphQL/REST calls will automatically proxy to the running backend containers.

---

## 3. Production Build

### 3.1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3.2. Preview Production Build Locally

```bash
npm run preview
```

---

## 4. Docker Deployment

### 4.1. Build Docker Image

```bash
docker build -t campus-connect-frontend:latest .
```

### 4.2. Run Docker Container Locally

```bash
docker run -p 8080:80 campus-connect-frontend:latest
```

Access the application at `http://localhost:8080`

### 4.3. Push to Container Registry

```bash
docker tag campus-connect-frontend:latest <your-registry>/campus-connect-frontend:latest
docker push <your-registry>/campus-connect-frontend:latest
```

---

## 5. Kubernetes Deployment

### 5.1. Prerequisites

- Kubernetes cluster with **nginx-ingress-controller** installed
- Backend services deployed in the `campus-connect` namespace

### 5.2. Deploy to Kubernetes

```bash
# Apply frontend deployment and service
kubectl apply -f k8s/frontend-deployment.yaml

# Apply ingress configuration
kubectl apply -f k8s/ingress.yaml
```

### 5.3. Verify Deployment

```bash
# Check pods
kubectl get pods -n campus-connect -l app=campus-connect-frontend

# Check service
kubectl get svc -n campus-connect campus-connect-frontend

# Check ingress
kubectl get ingress -n campus-connect

# View logs
kubectl logs -n campus-connect -l app=campus-connect-frontend --tail=50
```

### 5.4. Access the Application

The application will be accessible at:
```
http://campus-connect.ingress.cc.vg-project.shoot.canary.k8s-hana.ondemand.com
```

---

## 6. Project Structure

```
campus-connect/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── auth/           # Authentication components
│   │   ├── EventCard/      # Event display components
│   │   ├── Header/         # Navigation header
│   │   ├── modal/          # Modal dialogs
│   │   ├── NotificationPanel/
│   │   ├── OrgCard/        # Organization card
│   │   └── screens/        # Main application screens
│   ├── contexts/           # React Context providers
│   ├── graphql/            # GraphQL queries and mutations
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions and API clients
├── nginx/                  # Nginx configuration for production
├── k8s/                    # Kubernetes manifests
├── public/                 # Static assets
├── Dockerfile              # Docker build configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Node.js dependencies
```

---

## 7. Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 8. Environment Variables

Create a `.env.local` file for local development:

```env
VITE_APP_API_BASE_URL=http://localhost:3004
VITE_GRAPHQL_ENDPOINT=/graphql
VITE_WS_ENDPOINT=ws://localhost:3003
```

For production (Kubernetes), these are configured to use the same domain via the ingress gateway.

---

## 9. Troubleshooting

### Assets not loading (404 errors)

1. Verify build output:
   ```bash
   npm run build
   ls -la dist/assets/
   ```

2. Check Docker build:
   ```bash
   docker build -t test . --progress=plain
   docker run -p 8080:80 test
   ```

3. Verify files in container:
   ```bash
   docker exec -it <container-id> ls -la /usr/share/nginx/html/
   ```

### CORS errors

- Ensure the ingress configuration has correct CORS headers
- Check that API requests use the same domain as the frontend

### WebSocket connection issues

- Verify the notification service is running
- Check WebSocket endpoint in `useNotificationSocket.jsx`

---

## 10. License

MIT License

---

## 11. Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 12. Support

For issues and questions, please open an issue in the GitHub repository.
