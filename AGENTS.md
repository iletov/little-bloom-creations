# Little Bloom Creations Project Instructions

## Scope and Precedence

- These rules apply to the entire repository.
- Follow the repository's existing architecture and conventions before applying generic Next.js, NestJS, or clean-architecture patterns.
- Do not refactor working modules solely to enforce a theoretical pattern.
- More specific instructions in a nested `AGENTS.md` override this file for that subtree.

## Repository Structure

- This is an npm workspaces monorepo managed with Turborepo.
- The Next.js application is under `apps/web`.
- The NestJS application is under `apps/api`.
- Shared runtime schemas and TypeScript contracts belong under `packages/shared-types`.
- Keep changes scoped to the relevant workspace unless a contract change requires coordinated updates.
- Do not manually edit generated output under `apps/api/dist` or `packages/shared-types/dist`.
- Do not commit generated build output unless the user explicitly requests it.

## Engineering

- Inspect relevant existing implementations before making architectural decisions.
- Reuse existing interfaces, schemas, models, components, helpers, services, repositories, and patterns before creating new ones.
- Preserve unrelated and already working behavior.
- Use strict TypeScript. Do not introduce `any`, `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` unless the user explicitly requests it.
- Use `unknown` with explicit narrowing for untrusted or uncertain data.
- Use only dependencies and APIs verified in the relevant workspace's `package.json`.
- Do not install or upgrade dependencies unless explicitly requested.
- Handle errors, missing data, and edge cases explicitly. Avoid silent fallbacks.
- Keep public contracts stable unless the requested change requires a breaking change.

## Shared Contracts

- Reuse schemas and inferred types exported by `@repo/shared-types`.
- Do not duplicate shared product, order, request, or response contracts in the applications.
- Keep shared schemas independent from NestJS, Next.js, database, UI, and provider-specific implementations.
- For cross-application contract changes, update the shared schema first and then update all consumers.
- Validate external data at system boundaries instead of trusting TypeScript types at runtime.

## NestJS API

- Keep controllers thin and delegate business logic to existing use cases or focused services.
- Follow the module's established controller, use-case, service, repository, interface, adapter, and factory structure.
- Do not introduce a new architectural layer unless existing patterns cannot represent the requirement.
- Keep Drizzle queries, database operators, persistence mapping, and SQL calculations inside repositories.
- Do not expose raw database rows as public API contracts.
- Use NestJS dependency injection; do not manually construct injectable services.
- Validate incoming data through the project's established DTO, `class-validator`, `class-transformer`, or Zod patterns.
- Keep third-party provider behavior behind interfaces, adapters, factories, or focused integration services.
- Preserve the existing transaction manager and transaction boundaries. Do not pass transaction clients through domain or use-case APIs when the established transaction context can resolve them.
- Prevent N+1 database access with bulk queries or database-native operations.
- Never modify an existing applied migration. Create a new migration for schema changes.

## Next.js Web

- Follow the App Router conventions established under `apps/web/app`.
- Prefer React Server Components when browser APIs, React state, effects, event handlers, or client-only libraries are not required.
- Add `"use client"` only at the smallest practical interactive boundary.
- Keep secrets and privileged Supabase, Sanity, Stripe, AWS, and provider operations in server-only code.
- Never expose service-role keys or privileged credentials to client bundles.
- Reuse components under `apps/web/components/ui` before creating new UI primitives.
- Reuse the existing `cn` helper for conditional class-name composition.
- Preserve accessibility behavior when modifying Radix or shared UI components.
- Use Next.js routing, metadata, image, and caching APIs according to the patterns already present in the application.

## Frontend State and Data Fetching

- Use TanStack Query for remote server state, caching, synchronization, and mutations.
- Use stable query keys containing every input that affects the result.
- Update or invalidate affected query caches after successful mutations.
- Use optimistic updates only with rollback and centralized user-visible error handling.
- Do not copy TanStack Query server state into Redux.
- Use the existing Redux store only for genuinely cross-component client state already aligned with its current responsibilities.
- Prefer local component state for isolated ephemeral UI state.
- Use URL search parameters for shareable filters, sorting, pagination, and navigation state.
- Avoid client-side request waterfalls when requests can run in parallel or data can be loaded on the server.

## External Integrations

- Treat Supabase, Sanity, Stripe, Speedy, Econt, AWS, and all HTTP responses as untrusted external data.
- Map provider payloads into internal typed models before using them in business logic.
- Keep provider-specific payloads and behavior out of core domain contracts.
- Handle timeouts, failed responses, incomplete payloads, and retry-sensitive operations explicitly.
- Verify webhook signatures before processing webhook payloads.
- Make webhook, payment, fulfillment, and retryable operations idempotent where applicable.
- Do not log secrets, authentication tokens, payment data, or unnecessary personal information.

## Verification

- Run focused tests relevant to changed behavior when appropriate.
- Do not run `tsc --noEmit`, `npm run typecheck`, or an equivalent full TypeScript compilation check. The user runs these manually.
- Do not run ESLint, Prettier, formatters, lint-staged, or equivalent lint/format checks unless the user explicitly requests them.
- Do not run full production builds unless explicitly requested.
- State what verification was performed and explicitly mention that TypeScript, lint, formatting, and build checks were skipped when they were not requested.

## Implementation Plans and Project Skills

- Store implementation plans under the repository-root `implementation_plans/` directory.
- Do not place implementation plans beside source files.
- Create project skills only under `.agents/skills/<skill-name>/`.
- A project skill's `SKILL.md` must begin with YAML frontmatter containing exactly `name` and `description`.
