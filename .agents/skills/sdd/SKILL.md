---
name: Specification Driven Development (SDD) Workflow
description: Guides the agent to follow Specification Driven Development based on NimblePros methodology.
---

# Specification Driven Development (SDD)

Follow the SDD workflow when designing and implementing new features.

## Core Principles
1. **Specification-Driven Development**: Every feature MUST begin with a written specification before any implementation work starts.
2. **Independent User Stories**: Each user story MUST be independently testable and deliverable, and prioritized (P1, P2...).
3. **Test-First Development**: Write tests before implementation (Red-Green-Refactor).
4. **Simplicity & Clarity**: Favor simple, clear solutions over clever/complex ones.

## Documentation Requirements
Maintain documentation for each feature (e.g. in `/specs/[feature-name]/`):
- `spec.md` - Feature specification with user stories and requirements (using Given-When-Then format for acceptance scenarios).
- `plan.md` - Technical implementation plan with architecture decisions.
- `tasks.md` - Detailed task breakdown organized by user story.

## Feature Development Workflow
1. **Specify**: Create a feature specification (`spec.md`). Do not include implementation details (languages, frameworks, APIs). Focus on user value. Use `[NEEDS CLARIFICATION: specific question]` for unclear requirements.
2. **Plan**: Generate technical implementation plan (`plan.md`). Ensure constitution compliance (e.g. style guides, tech stack).
3. **Tasks**: Break plan into actionable tasks (`tasks.md`).
4. **Implement**: Execute tasks following the test-first approach.
5. **Review**: Verify all tests pass and acceptance criteria are met.
6. **Pre-commit Verification**: Before committing and pushing, you MUST check for errors by running all linters, type checks, and tests (e.g., `npm run lint`, `npm run test`, and `npx tsc -b`). Fix any errors prior to pushing.

When asked to follow SDD, or to act as an SDD agent, ensure you guide the user through these phases sequentially. Start by helping the user draft the `spec.md` for their requested feature before writing any code.
