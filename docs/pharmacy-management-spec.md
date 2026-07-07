# Pharmacy Management System Specification

## Summary

This document defines the product behavior and frontend structure for the first version of the pharmacy management system.

The system allows a user to register or log in, view all pharmacies they are related to, enter a selected pharmacy, and manage medicines or users according to their role inside that pharmacy.

This file is intended to be the main reference for understanding the product and building the frontend. It does not define strict backend API contracts, but it does define the expected behavior the backend must support.

## Product Goals

- Provide a simple authentication flow with self-service access.
- Allow one account to belong to multiple pharmacies.
- Provide a clear home dashboard listing all related pharmacies.
- Provide a pharmacy workspace with a persistent aside navigation layout.
- Allow pharmacy admins to manage users and medicines.
- Allow pharmacy staff to manage medicines but not users.

## Version 1 Scope

Included in v1:

- Register with email and password.
- Log in with email and password.
- Log in with Google.
- Accept pharmacy invites by email link.
- Home dashboard showing related pharmacies.
- Create pharmacy flow.
- Pharmacy overview page.
- Medicine catalog CRUD.
- Pharmacy user invitation, member listing, and member removal.

Explicitly out of scope for v1:

- Inventory quantity tracking.
- Lot control.
- Expiration tracking.
- Sales and purchase workflows.
- Billing and subscription management.
- Audit logs.
- Advanced permission matrices beyond `admin` and `staff`.

## Core Concepts

### User

A user is a platform account. The same user can be related to multiple pharmacies.

Supported authentication methods:

- Email and password.
- Google login.
- Invite-driven onboarding, which still ends in either email/password registration or Google login.

### Pharmacy

A pharmacy is a workspace containing its own users and medicine catalog.

Each pharmacy has isolated membership and permissions. Access to one pharmacy does not imply access to any other pharmacy.

### Membership

A membership connects one user to one pharmacy.

Version 1 roles:

- `admin`
- `staff`

## Role Permissions

### Admin

An admin has full access inside the pharmacy.

Admin permissions:

- View the pharmacy dashboard.
- View, create, edit, and delete medicines.
- View pharmacy users.
- Invite users to the pharmacy.
- Remove users from the pharmacy.

### Staff

A staff member can operate medicine management but cannot manage pharmacy users.

Staff permissions:

- View the pharmacy dashboard.
- View, create, edit, and delete medicines.

Staff restrictions:

- Cannot access pharmacy user management.
- Cannot invite users.
- Cannot remove users.

## Authentication and Access Flows

### Public Auth Entry Points

The system must provide:

- A register page.
- A login page.
- An invite acceptance entry flow.

### Self Registration

When a person registers without an invite:

1. They create an account with email and password, or sign in with Google.
2. They are authenticated into the platform.
3. They land on the home dashboard.
4. If they do not belong to any pharmacy yet, they see an empty state with a clear `Create pharmacy` action.

### Standard Login

When a person logs in:

1. They authenticate with email/password or Google.
2. They land on the home dashboard.
3. The home dashboard lists every pharmacy they are related to.

### Invite Flow

Invite links are pharmacy-specific.

Expected behavior:

1. An admin invites a person to one specific pharmacy using an email address.
2. The invited person receives an email with a link.
3. Opening the link sends the person into the auth flow.
4. The invite can only be accepted by an account using the exact invited email address.
5. After successful authentication, the invited user gains access to that pharmacy with the role assigned by the invite.

If the authenticated email does not match the invited email, the system must block acceptance and explain the problem clearly.

## Pharmacy Creation Flow

Authenticated users can create a pharmacy from the home dashboard.

When a user creates a pharmacy:

1. The pharmacy is created.
2. The creator becomes the initial `admin` of that pharmacy.
3. The new pharmacy immediately appears on the home dashboard.
4. The user can enter the pharmacy workspace.

## Navigation and Information Architecture

### Public Routes

Minimum public routes:

- `/login`
- `/register`
- `/invite/[token]` or equivalent invite entry route

### Authenticated Root Area

Minimum authenticated route:

- `/`

This route acts as the home dashboard for authenticated users.

### Pharmacy Area

Recommended route structure:

- `/pharmacies/[pharmacyId]`
- `/pharmacies/[pharmacyId]/medicines`
- `/pharmacies/[pharmacyId]/users`

The pharmacy area must use a shared layout with:

- An aside navigation on the left.
- Main content on the rest of the screen.
- Persistent pharmacy context while navigating between pharmacy pages.

The aside navigation should provide direct access to:

- Overview
- Medicines
- Users

The `Users` item must not be available to `staff`.

## Frontend Structure Guidance

The frontend should be organized around the App Router.

Recommended layout separation:

- Public auth area for login, register, and invite entry.
- Authenticated home area for the cross-pharmacy dashboard.
- Pharmacy shell area for the aside navigation and pharmacy-scoped pages.

Recommended App Router grouping:

- `(public)` for login, register, and invite entry pages.
- `(app)` for the authenticated home dashboard.
- `(pharmacy)` or an equivalent shared pharmacy layout for pharmacy-scoped routes.

The pharmacy shell should be reusable across all pharmacy pages so navigation and context remain consistent.

## Page Specifications

### Register Page

Purpose:

- Allow a new user to create an account.

Requirements:

- Email field.
- Password field.
- Submit action.
- Link to login page.
- Google sign-in option.
- Validation messaging for invalid or missing fields.

### Login Page

Purpose:

- Allow an existing user to access the platform.

Requirements:

- Email field.
- Password field.
- Submit action.
- Link to register page.
- Google sign-in option.
- Error messaging for invalid credentials.

### Home Dashboard

Purpose:

- Show all pharmacies the authenticated user is related to.
- Provide the entry point to create a pharmacy.

Requirements:

- List or grid of pharmacy cards.
- Each card must allow the user to enter that pharmacy.
- A visible `Create pharmacy` action.
- Empty state when the user has no pharmacies.

Suggested card contents:

- Pharmacy name.
- User role in that pharmacy.
- Direct access action.

Empty state behavior:

- Explain that the user has no pharmacy yet.
- Provide a primary action to create the first pharmacy.

### Create Pharmacy Flow

Purpose:

- Allow an authenticated user to create a pharmacy from the home dashboard.

Minimum inputs:

- Pharmacy name.

Behavior:

- Validate required input.
- Create the pharmacy.
- Assign the creator as `admin`.
- Return the user to the home dashboard or redirect directly into the created pharmacy.

### Pharmacy Overview Page

Purpose:

- Act as the landing page after entering a pharmacy.

Layout:

- Shared pharmacy aside navigation.
- Main content area for overview widgets and shortcuts.

Required content:

- Summary widgets or panels.
- At minimum, count or summarize medicines and users.
- Clear shortcuts to medicines and users pages.

### Medicines Page

Purpose:

- Manage the medicine catalog for one pharmacy.

Who can access:

- `admin`
- `staff`

Version 1 fields:

- Name
- Description
- Price

Required features:

- View medicine list.
- Create medicine.
- Edit medicine.
- Delete medicine.

Medicine list expectations:

- Show key fields clearly.
- Provide visible actions for edit and delete.

Form expectations:

- Validate required fields.
- Validate price as a valid monetary value.
- Show submission success and error states clearly.

### Users Page

Purpose:

- Manage membership for one pharmacy.

Who can access:

- `admin` only

Required features:

- View member list.
- Invite a user by email.
- Remove a user from the pharmacy.

Minimum information in the member list:

- User email.
- Role in the pharmacy.
- Membership status if needed for clarity.

Invite behavior:

- Admin enters an email address.
- Admin selects the role to assign.
- System sends a pharmacy-specific invite link.

Removal behavior:

- Admin can remove a user from the pharmacy.
- Removal only affects that pharmacy membership.

## Entity Requirements

### User

Minimum product-level fields:

- Email
- Authentication method support

### Pharmacy

Minimum product-level fields:

- Name

### Membership

Minimum product-level fields:

- User reference
- Pharmacy reference
- Role

### Medicine

Minimum product-level fields:

- Name
- Description
- Price
- Pharmacy reference

## Deletion Policy

Version 1 uses hard delete where deletion is allowed through the UI.

This applies to:

- Medicines
- Pharmacy memberships when removing a user from a pharmacy

If permanent pharmacy deletion is added later, it must be separately specified before implementation.

## Access Control Rules

- Unauthenticated users cannot access authenticated routes.
- Users can only access pharmacies they belong to.
- `staff` cannot access pharmacy user management.
- Pharmacy data must always be scoped to the current pharmacy.
- Invitation acceptance must enforce exact invited email matching.

If a user attempts to access a pharmacy they do not belong to, the UI must show an appropriate unauthorized or not-found state.

## UI States

Every major page or flow should account for:

- Loading state
- Empty state
- Validation error state
- Submission failure state
- Success feedback
- Unauthorized access state where applicable

Important examples:

- Home dashboard with no pharmacies
- Medicines list with no medicines
- Users list with no members beyond the current admin
- Invite opened with the wrong authenticated email
- Attempt to access the users page as `staff`

## Non-Functional Frontend Guidance

- Keep the route structure simple and predictable.
- Preserve pharmacy context while moving between pharmacy pages.
- Make role-based navigation differences obvious.
- Prioritize clarity over dense dashboards in version 1.
- Ensure the layout works on desktop and mobile.

## Acceptance Criteria

The implementation should satisfy the following scenarios:

1. A user registers with email and password and lands on the authenticated home dashboard.
2. A user logs in with Google and sees every pharmacy they are related to.
3. A newly registered user with no pharmacies sees an empty state and can create a pharmacy.
4. A user who creates a pharmacy becomes that pharmacy's `admin`.
5. An admin entering a pharmacy sees the aside navigation with overview, medicines, and users.
6. A staff user entering a pharmacy sees overview and medicines but cannot access users.
7. An admin can create, edit, and delete medicines.
8. A staff user can create, edit, and delete medicines.
9. An admin can invite a user to one specific pharmacy.
10. An invited person can accept the invite only through an account using the invited email address.
11. An admin can view the pharmacy member list.
12. An admin can remove a user from a pharmacy without affecting the user's other pharmacy memberships.
13. A user cannot access a pharmacy they are not related to.

## Open Items for Future Revisions

These topics are intentionally not defined in this version and should be clarified before implementation if they become necessary:

- Password reset and email verification rules
- Detailed Google account linking behavior
- Invite expiration and resend behavior
- Pharmacy profile details beyond name
- Search, filtering, and pagination rules
- Advanced roles or fine-grained permissions
- Backend API contracts and error payload formats

## Implementation Notes

This document is intended to guide both product understanding and frontend implementation.

If future requirements introduce new business rules, update this file before implementing the related behavior so the specification remains the reference point for the system.
