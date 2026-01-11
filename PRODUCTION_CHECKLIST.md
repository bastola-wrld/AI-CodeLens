# 🚀 Production Deployment Checklist

To transition from local development to a live environment, follow this elite-grade checklist.

## 1. Security & Authentication
- [ ] **JWT Secrets**: Replace insecure default secrets with long, cryptographically secure strings in PROD environment.
- [ ] **Refresh Tokens**: Implement a database-backed refresh token rotation for long-lived sessions.
- [ ] **HTTPS**: Ensure the backend is served over TLS/SSL (mandatory for WebSockets/Secure Cookies).
- [ ] **CORS**: Restrict `origin` in `main.ts` to your production frontend domain only.

## 2. Infrastructure & DevOps
- [ ] **PostgreSQL Migration**: Switch from SQLite to the managed PostgreSQL instance provided in `docker-compose`.
- [ ] **Database Migrations**: Run `typeorm migration:run` during the build phase of your CI/CD.
- [ ] **Docker Hub**: Push the optimized Docker images to a private registry.
- [ ] **Horizontal Scaling**: Since the backend uses WebSockets, ensure your load balancer supports "Sticky Sessions" or use a Redis adapter for `socket.io`.

## 3. Performance
- [ ] **Monaco Editor**: Ensure Monaco is loaded via a CDN or optimized chunk to keep payload sizes small.
- [ ] **Gzip/Brotli**: Enable compression on your Nginx or Fly.io edge proxy.
- [ ] **Rate Limiting**: Fine-tune the NestJS `Throttler` based on expected user traffic.

## 4. Environment Variables Checklist
| Variable | Description | Recommendation |
|----------|-------------|----------------|
| `OPENAI_API_KEY` | Your OpenAI Secret | Rotate monthly |
| `JWT_SECRET` | Backend signing key | Use 256-bit hash |
| `DATABASE_URL` | PG Connection String | Use managed instances (Supabase/Fly) |

---
## Mentorship: Scaling to 10k Users
When you hit scale, the bottleneck is usually the AI streaming. 
- Use **Queueing (BullMQ/Redis)** to handle multiple concurrent AI requests gracefully.
- Decouple the AI service into a **Microservice** if the prompt-heavy logic starts eating CPU from the API gateway.
