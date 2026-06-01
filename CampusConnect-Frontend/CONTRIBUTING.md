# 🎨 Contributing to Campus Connect Frontend

These guidelines are specific to client-side development, integration with the GraphQL Gateway, and UI maintenance.

---

## 1. Integration Standards

All data fetching must adhere to the defined API contract:

### Data Fetching
- **All complex reads** (e.g., fetching a profile and all its related events) **must use Apollo Client** and be defined as a GraphQL query
- **Direct REST calls for fetching related entities are forbidden**
- REST API should only be used for simple mutations (Register, Login, RSVP)

### Authentication
- The **JWT token** must be stored locally and automatically sent in the `Authorization` header for all REST/GraphQL requests
- For WebSocket connections, the token must be sent as a query parameter (`?token=...`)

### Global Access
- Utilize the `useNotificationSocket` hook to manage the WebSocket connection and subscribe to real-time events
- All notification-related logic should be centralized through this hook

---

## 2. Development Workflow

### A. Component Design

#### Styling
- **Use Tailwind CSS utility classes exclusively**
- Custom CSS should be minimal and only used when absolutely necessary
- Follow the existing component patterns for consistency

#### State Management
- **Prefer React Hooks** for local state management:
  - `useState` for simple state
  - `useReducer` for complex state logic
  - `useContext` for global state (e.g., `AuthContext`)
- Avoid prop drilling by using Context API when appropriate

### B. Working with Data

When fetching data, the component logic **must handle the three possible states**:

```jsx
const MyComponent = () => {
  const { loading, error, data } = useQuery(MY_QUERY);

  // 1. Loading State - Show Skeleton/Spinner
  if (loading) return <Spinner />;

  // 2. Error State - Show Error Message
  if (error) return <ErrorMessage error={error} />;

  // 3. Data State - Render Content
  return <div>{/* Render your data */}</div>;
};
```

#### GraphQL Query Example

```javascript
// filepath: src/graphql/queries/queries.js
import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      registeredEvents {
        id
        title
        date
      }
    }
  }
`;
```

#### Component Usage

```jsx
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../graphql/queries/queries';

const ProfileScreen = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { userId: user.id }
  });

  // Handle loading, error, data states...
};
```

### C. Testing and Verification

When working on a feature that involves event delivery (e.g., RSVP confirmation or notifications):

#### Local Backend Required
- Ensure the **entire backend stack is running**:
  ```bash
  docker-compose up
  ```
- Verify all services are healthy before testing frontend features

#### Verify Real-time Functionality
1. **Open Browser Console** (`F12` or `Cmd+Option+I`)
2. **Test the feature** (e.g., RSVP to an event)
3. **Check the console** to confirm:
   - The RNS successfully pushes the notification
   - The data is added to the local state
   - The WebSocket connection is functional

Example console output:
```
WebSocket connected to ws://localhost:3003
Notification received: { type: 'RSVP_CONFIRMED', eventId: '123' }
State updated successfully
```

---

## 3. Code Quality Standards

### File Organization
- Keep components small and focused (Single Responsibility Principle)
- Use index files for cleaner imports
- Group related components in folders

### Naming Conventions
- **Components**: PascalCase (e.g., `EventCard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useNotificationSocket.jsx`)
- **Utilities**: camelCase (e.g., `apiClient.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Best Practices
- ✅ Use functional components with hooks
- ✅ Destructure props for clarity
- ✅ Add PropTypes or TypeScript types
- ✅ Handle loading and error states
- ✅ Avoid inline styles (use Tailwind)
- ✅ Keep components pure when possible
- ❌ Don't mutate state directly
- ❌ Don't use direct DOM manipulation
- ❌ Don't bypass the API contract

---

## 4. Deployment

### Development Build
```bash
npm run dev
```

### Production Build
The final production build is created using:
```bash
npm run build
```

The output is served via **Nginx** in the Docker container.

### Docker Deployment
Changes to the production configuration require updating:
- `Dockerfile` - Docker build configuration
- `nginx/nginx.conf` - Nginx server configuration

After making changes:
```bash
# Rebuild Docker image
docker build -t campus-connect-frontend:latest .

# Push to registry
docker push <your-registry>/campus-connect-frontend:latest
```

### Kubernetes Deployment
Deploy via Kubernetes manifests:
```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

Verify deployment:
```bash
kubectl get pods -n campus-connect -l app=campus-connect-frontend
kubectl logs -n campus-connect -l app=campus-connect-frontend --tail=50
```

---

## 5. Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's coding standards
- [ ] All three states (loading, error, data) are handled
- [ ] Components use Tailwind CSS exclusively
- [ ] GraphQL queries are used for complex reads
- [ ] Real-time features are tested with backend running
- [ ] No console errors or warnings
- [ ] Build succeeds (`npm run build`)

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] UI improvement
- [ ] Performance optimization
- [ ] Documentation update

## Testing
- [ ] Tested locally with backend running
- [ ] WebSocket functionality verified (if applicable)
- [ ] Tested in production build (`npm run preview`)

## Screenshots (if applicable)
Add screenshots of UI changes
```

---

## 6. Getting Help

### Resources
- **Apollo Client Docs**: https://www.apollographql.com/docs/react/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev/

### Questions?
- Open an issue in the GitHub repository
- Contact the maintainers
- Check existing issues and PRs for similar problems

---

## 7. Code Review Process

All contributions go through code review:

1. **Submit PR** following the guidelines above
2. **Automated checks** run (linting, build)
3. **Reviewer feedback** is provided
4. **Address comments** and push updates
5. **Approval** from at least one maintainer required
6. **Merge** after approval

---

Thank you for contributing to Campus Connect! 🎉