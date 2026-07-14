# Pharmacy Management Frontend Technical Specification

## Summary

This document defines how the pharmacy management product described in `docs/pharmacy-management-spec.md` should be implemented in the frontend.

The product specification remains the source of truth for business behavior. This document translates that behavior into application architecture, route structure, UI composition, validation rules, API integration boundaries, and delivery requirements for the frontend.

Version 1 must be built with:

- Next.js 16
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- ESLint

Version 1 does not require dedicated automated testing tools. Validation relies on ESLint, TypeScript checks, and manual verification of the product acceptance scenarios.

## Technical Goals

- Build the application with the Next.js 16 App Router.
- Keep the route structure simple and aligned with the product specification.
- Use reusable shared components for cross-page UI.
- Use a consistent form and validation strategy across all user input flows.
- Keep backend integration isolated behind a frontend service layer.
- Enforce role-aware access at both navigation and page-behavior levels.
- Preserve pharmacy context while navigating inside a pharmacy workspace.

## Core Stack Decisions

### Framework

- Use Next.js 16 with the App Router.
- Prefer Server Components for route shells, layouts, and non-interactive page composition.
- Use Client Components only for interactive UI, form handling, local state, and browser-only behavior.

### Forms

- All forms must use React Hook Form.
- Each form must be backed by a Zod schema for validation.
- Validation rules must live close to the feature they belong to.
- Types should be inferred from Zod schemas when possible to avoid duplicated type definitions.

### Styling

- Use Tailwind CSS for all styling.
- Reusable UI patterns should be implemented as shared components instead of repeated utility class blocks across pages.
- Layouts and components must support desktop and mobile usage.

### API Communication

- Use Axios for all HTTP communication.
- API calls must not be made directly inside page files when the call belongs to a reusable domain operation.
- Domain calls must be grouped into dedicated service modules.

### Code Quality and Formatting

- ESLint is required and must be the project entrypoint for static quality enforcement.
- Formatting rules, if enforced automatically, must be enforced through the ESLint configuration rather than a separate formatter requirement in v1.
- TypeScript type-checking is required as part of implementation validation.

## Architecture

### Application Model

The application has three main areas:

1. Public authentication area
2. Authenticated cross-pharmacy dashboard area
3. Pharmacy workspace area

Each area must be isolated through App Router layouts so navigation and page behavior remain predictable.

### Rendering Boundaries

- Layouts and route-level page composition should default to Server Components.
- Interactive sections such as forms, dialogs, client-only filtering, and mutation actions should be Client Components.
- The pharmacy workspace layout must persist while moving between pharmacy pages.

### Pharmacy Context

- The current pharmacy context is determined by the route parameter `pharmacyId`.
- Pharmacy-scoped data must always be requested with the active `pharmacyId`.
- The application must not rely on a global mutable pharmacy selection store for core routing behavior.

### Session Model

- Authentication is owned by an external backend API.
- Session transport uses HTTP-only cookies.
- The frontend must rely on browser-managed authenticated requests.
- Access tokens must not be persisted in `localStorage` or `sessionStorage`.

## Recommended Project Structure

The exact folder naming can vary slightly, but the project must preserve the following responsibilities:

- `app/`
  - App Router pages, route groups, layouts, loading states, and access-oriented route composition
- `components/`
  - Reusable UI shared across multiple pages or features
- `services/` or `lib/services/`
  - Axios instance and domain service modules
- `schemas/` or feature-local schema files
  - Zod validation schemas used by forms and frontend DTO validation
- `lib/`
  - Shared utilities, constants, guards, formatters, and helpers
- `types/`
  - Shared types only when they cannot be inferred directly from schemas or service responses

The `components/` directory is required for UI that is shared across multiple pages.

## Route Structure

### Public Routes

- `/login`
- `/register`
- `/invite/[token]`

### Authenticated Root Route

- `/`

This route acts as the authenticated home dashboard listing every pharmacy related to the current user.

### Pharmacy Routes

- `/pharmacies/[pharmacyId]`
- `/pharmacies/[pharmacyId]/medicines`
- `/pharmacies/[pharmacyId]/users`

### Route Grouping

The route tree should be organized with App Router route groups so responsibilities are clear:

- Public auth group for login, register, and invite entry
- Authenticated app group for the root dashboard
- Pharmacy workspace group for pharmacy-scoped layouts and pages

The exact group folder names are implementation details, but the separation must exist.

## Layout Specification

### Public Layout

Responsibilities:

- Present auth-related pages without authenticated navigation
- Provide links between login and register flows
- Keep invite entry consistent with the auth experience

### Authenticated Root Layout

Responsibilities:

- Gate access to authenticated-only routes
- Provide the shell for the home dashboard
- Handle redirect or fallback behavior when no valid session exists

### Pharmacy Workspace Layout

Responsibilities:

- Persist pharmacy context while navigating between pharmacy pages
- Render the aside navigation
- Render the active pharmacy page content
- Load enough pharmacy metadata to label the workspace clearly

Required navigation items:

- Overview
- Medicines
- Users

The `Users` navigation item must be hidden for `staff`.

## Access Control

### Authentication Rules

- Unauthenticated users cannot access authenticated routes.
- Unauthenticated access attempts must redirect or resolve into a clear unauthenticated state.

### Pharmacy Membership Rules

- Users can only access pharmacies they belong to.
- If a user attempts to access a pharmacy they do not belong to, the UI must resolve into a clear unauthorized or not-found state.

### Role Rules

- `admin` can access overview, medicines, and users.
- `staff` can access overview and medicines only.
- `staff` must not see the `Users` navigation item.
- `staff` attempting to open the users route directly must be blocked by page-level access handling.

### Invite Acceptance Rule

- Invite acceptance must validate that the authenticated account email exactly matches the invited email.
- If the email does not match, acceptance must be blocked and the UI must explain the issue clearly.

## Feature Specifications

### Authentication

Supported entry methods:

- Email and password
- Google login
- Invite-driven onboarding

Required frontend flows:

- Register page
- Login page
- Invite token entry page

Expected frontend responsibilities:

- Collect credentials or trigger Google login entry
- Handle success and failure states
- Route the user into the authenticated area after successful authentication
- In invite flows, continue into invite validation after authentication succeeds

### Home Dashboard

Responsibilities:

- List all pharmacies related to the authenticated user
- Display the user's role in each pharmacy
- Provide a `Create pharmacy` action
- Show an empty state when the user has no pharmacies

Minimum displayed information:

- Pharmacy name
- Role in that pharmacy
- Entry action

### Create Pharmacy Flow

Requirements:

- Accessible from the home dashboard
- Single required input: pharmacy name
- On success, the new pharmacy must be visible in the dashboard and the creator must be considered the initial `admin`

The implementation may return to the dashboard or redirect directly into the created pharmacy, as long as the resulting state is consistent with the product specification.

### Pharmacy Overview

Responsibilities:

- Serve as the landing page inside a pharmacy
- Show summary information relevant to the current pharmacy
- Provide clear shortcuts to medicines and users

Minimum summary requirements:

- Medicine count or equivalent medicine summary
- User count or equivalent membership summary

The users shortcut must respect role rules and must not behave like an available action for `staff`.

### Medicines

Responsibilities:

- List medicines
- Create medicines
- Edit medicines
- Delete medicines

Roles allowed:

- `admin`
- `staff`

Version 1 medicine fields:

- Name
- Description
- Price

UI requirements:

- Visible create action
- Visible edit and delete actions in the list
- Clear feedback for loading, empty, success, validation failure, and submission failure states

### Users

Responsibilities:

- List current pharmacy members
- Invite a user to the pharmacy
- Remove a user from the pharmacy

Roles allowed:

- `admin` only

Minimum member information:

- User email
- Role
- Membership status if needed for clarity

Removal behavior:

- Removal affects only the current pharmacy membership
- Removal must not imply account deletion or cross-pharmacy removal

## Forms and Validation

All forms must follow the same implementation pattern:

1. React Hook Form manages form state and submission.
2. Zod defines the validation schema.
3. Errors are surfaced as field-level or form-level feedback.
4. Submission states are explicit: idle, submitting, success, failure.

### Required Forms

- Login form
- Register form
- Create pharmacy form
- Create medicine form
- Edit medicine form
- Invite user form

### Required Validation Rules

- Email fields must validate email format.
- Password fields must be required.
- Pharmacy name must be required.
- Medicine name must be required.
- Medicine price must validate as a monetary value acceptable to the backend contract.
- Invite role must be limited to `admin` or `staff`.

The technical specification must not define password reset, email verification, invite expiration, resend behavior, or advanced role logic because these remain outside the current product scope.

## Shared UI Components

Shared UI used across multiple pages must be placed in `components/`.

The shared component layer should cover the reusable primitives needed for v1, including:

- Buttons
- Text inputs
- Text areas if needed
- Select inputs for role selection
- Form field wrappers and validation messages
- Page headers
- Empty state blocks
- Feedback banners or notices
- Cards or list containers
- Navigation items for the pharmacy aside

These components should remain presentation-focused. Domain behavior belongs in feature-level components or route-level client components.

## API Integration Layer

### General Rules

- All HTTP requests must use Axios.
- A shared Axios instance must centralize common configuration.
- Requests that need authenticated cookies must be configured to send credentials.
- Domain operations must be grouped by business area, not by page file.

### Required Service Domains

- Auth service
- Pharmacy service
- Medicine service
- Membership or user management service
- Invite service if kept separate from membership operations

### Contract Strategy

Backend API contracts are not finalized in this repository. The frontend technical specification must therefore define a frontend contract layer instead of a full backend endpoint specification.

Each service definition should document:

- The operation purpose
- The minimum request inputs required by the frontend
- The minimum response data required by the UI
- Expected error categories that affect frontend behavior

### Minimum Frontend Data Shapes

The frontend must be able to consume at least the following product-level data:

#### User

- Email

#### Pharmacy

- Id
- Name

#### Membership

- User reference
- Pharmacy reference
- Role

#### Medicine

- Id
- Name
- Description
- Price
- Pharmacy reference

Invite tokens and auth session payload structure are backend-defined and should only be specified in the frontend document to the degree needed to drive the UI.

## State and Data Handling

Version 1 does not include a dedicated client-side query or cache library.

The implementation should therefore use:

- Server-driven page composition where practical
- Local client state for interactive UI
- Explicit reload or revalidation behavior after mutations
- Service-layer abstractions so data access remains replaceable if a cache layer is added later

The specification must not require TanStack Query or any equivalent library in v1.

## UI States

Each major route and mutation flow must define handling for:

- Loading state
- Empty state
- Validation error state
- Submission failure state
- Success feedback
- Unauthorized state where applicable

Minimum required examples:

- Home dashboard with no pharmacies
- Medicines page with no medicines
- Users page with no removable members beyond the current admin
- Invite opened with mismatched authenticated email
- `staff` attempting to access the users page

## ESLint and TypeScript Requirements

The implementation must keep ESLint configured as a required project check.

The technical specification should require:

- A project lint script
- TypeScript-enabled development
- No duplication between validation schemas and TypeScript types when schema inference can be used

The document should treat ESLint as both the static quality baseline and the formatting enforcement entrypoint for v1.

## Delivery and Verification

Version 1 verification is manual plus static checks.

Required validation activities:

- ESLint passes
- TypeScript type-check passes
- Manual verification of the acceptance scenarios defined in `docs/pharmacy-management-spec.md`

### Manual Verification Focus

At minimum, manual verification must cover:

1. Register with email and password
2. Login with Google
3. Empty dashboard for a user with no pharmacies
4. Pharmacy creation and automatic `admin` membership
5. Admin pharmacy navigation
6. Staff pharmacy navigation restrictions
7. Medicine create, edit, and delete
8. User invite flow
9. Invite acceptance with matching email
10. Invite rejection when authenticated email does not match
11. Member listing for admins
12. Member removal limited to one pharmacy
13. Rejection of access to unrelated pharmacies

## Explicit Non-Scope Items

The technical specification must preserve the product-scope exclusions already defined in the product specification, including:

- Inventory quantity tracking
- Lot control
- Expiration tracking
- Sales and purchase workflows
- Billing and subscription management
- Audit logs
- Advanced permission matrices
- Password reset and email verification rules
- Detailed Google account linking behavior
- Invite expiration and resend behavior
- Search, filtering, and pagination rules

## Implementation Defaults Locked for Version 1

- The product specification remains in `docs/pharmacy-management-spec.md`.
- This technical specification lives in `docs/technical-specification.md`.
- Authentication is backend-owned.
- Google login is supported as part of the external authentication flow.
- Session transport uses HTTP-only cookies.
- Axios is the only required HTTP client.
- No dedicated cache or query library is included in v1.
- Shared cross-page UI belongs in `components/`.
- Dedicated automated testing tools are not required in v1.
