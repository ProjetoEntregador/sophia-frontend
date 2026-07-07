# Sophia Pharmacy Service API

This document maps every REST endpoint currently exposed by the Spring application.

## Base URL

- No `server.servlet.context-path` is configured in the repository.
- All paths below are relative to the application root.
- If no external port override exists, Spring Boot uses port `8080` by default.

Example base URL:

```text
http://localhost:8080
```

## Authentication

Public endpoints:

- `POST /auth/registration`
- `POST /auth/login`
- `POST /auth/google`
- `GET /pharmacy/nearby`

Protected endpoints:

- All other endpoints require `Authorization: Bearer <jwt>`

Extra permission rules:

- `PUT /pharmacy/{id}`, `DELETE /pharmacy/{id}`, and `POST /invites/pharmacy/{id}/send` require the authenticated user to be `OWNER` of that pharmacy.

## Standard success response wrapper

Most controller responses use this format:

```json
{
  "status": "success",
  "data": {},
  "message": "Human-readable message"
}
```

Type shape:

```ts
type ApiResponse<T> = {
  status: string;
  data: T | null;
  message: string;
};
```

## Error responses

Application exceptions handled by `GlobalExceptionHandler` return:

```json
{
  "status": "error: RunTime",
  "data": null,
  "message": "Error message"
}
```

Possible HTTP statuses from the handler:

- `400 Bad Request`
- `401 Unauthorized`
- `409 Conflict`

Invalid or missing JWTs intercepted by the JWT filter can return a different shape:

```json
{
  "timestamp": "2026-06-17T10:15:30",
  "status": 401,
  "error": "Unauthorized",
  "message": "Faça login para acessar este recurso"
}
```

---

## 1. Register user

- URL: `POST /auth/registration`
- Auth: Public
- Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "provider": "GOOGLE | LOCAL"
}
```

Request object shape:

```ts
type UserDto = {
  username: string;
  email: string;
  password: string;
  provider?: "GOOGLE" | "LOCAL";
};
```

Notes:

- In the service layer, `provider` is forced to `LOCAL` during registration.

Success response: `201 Created`

```json
{
  "status": "success",
  "data": null,
  "message": "Usuário criado com sucesso"
}
```

Returned object shape:

```ts
type RegisterResponse = ApiResponse<null>;
```

---

## 2. Login with email and password

- URL: `POST /auth/login`
- Auth: Public
- Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Request object shape:

```ts
type LoginDto = {
  email: string;
  password: string;
};
```

Success response: `200 OK`

```json
{
  "status": "success",
  "data": "jwt-token-string",
  "message": "Login efetuado com sucessso"
}
```

Returned object shape:

```ts
type LoginResponse = ApiResponse<string>;
```

---

## 3. Login with Google

- URL: `POST /auth/google`
- Auth: Public
- Request body:

```json
{
  "idToken": "string"
}
```

Request object shape:

```ts
type GoogleLoginDto = {
  idToken: string;
};
```

Success response: `200 OK`

```json
{
  "status": "success",
  "data": "jwt-token-string",
  "message": "Login Google efetuado com sucessso"
}
```

Returned object shape:

```ts
type GoogleLoginResponse = ApiResponse<string>;
```

---

## 4. List pharmacies available to the authenticated user

- URL: `GET /pharmacy/list`
- Auth: Bearer token required
- Request body: none

Success response: `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Farmacia Central",
      "phone": "85999999999"
    }
  ],
  "message": "Requisição completada com sucesso"
}
```

Returned object shape:

```ts
type PharmacyListDto = {
  id: number;
  name: string;
  phone: string;
};

type ListPharmaciesResponse = ApiResponse<PharmacyListDto[]>;
```

---

## 5. Get one pharmacy by ID

- URL: `GET /pharmacy/{id}`
- Auth: Bearer token required
- Path params:

```ts
type GetPharmacyParams = {
  id: number;
};
```

- Request body: none

Success response: `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Farmacia Central",
    "phone": "85999999999",
    "address": "Rua A, 123",
    "city": "Fortaleza",
    "latitude": -3.7319,
    "longitude": -38.5267
  },
  "message": "Requisição completada com sucesso"
}
```

Returned object shape:

```ts
type PharmacyDetailDto = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

type GetPharmacyResponse = ApiResponse<PharmacyDetailDto>;
```

---

## 6. Create pharmacy

- URL: `POST /pharmacy/create`
- Auth: Bearer token required
- Request body:

```json
{
  "name": "Farmacia Central",
  "phone": "85999999999",
  "address": "Rua A, 123",
  "city": "Fortaleza",
  "latitude": -3.7319,
  "longitude": -38.5267
}
```

Request object shape:

```ts
type PharmacyEntryDto = {
  name: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};
```

Success response: `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Farmacia Central",
    "phone": "85999999999",
    "address": "Rua A, 123",
    "city": "Fortaleza",
    "latitude": -3.7319,
    "longitude": -38.5267
  },
  "message": "Farmácia criada com sucesso"
}
```

Returned object shape:

```ts
type CreatePharmacyResponse = ApiResponse<PharmacyDetailDto>;
```

---

## 7. Update pharmacy

- URL: `PUT /pharmacy/{id}`
- Auth: Bearer token required
- Extra rule: authenticated user must be `OWNER` of the pharmacy
- Path params:

```ts
type UpdatePharmacyParams = {
  id: number;
};
```

- Request body:

```json
{
  "name": "Farmacia Central",
  "phone": "85999999999",
  "address": "Rua A, 123",
  "city": "Fortaleza",
  "latitude": -3.7319,
  "longitude": -38.5267
}
```

Request object shape:

```ts
type UpdatePharmacyBody = PharmacyEntryDto;
```

Success response: `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Farmacia Central",
    "phone": "85999999999",
    "address": "Rua A, 123",
    "city": "Fortaleza",
    "latitude": -3.7319,
    "longitude": -38.5267
  },
  "message": "Farmácia atualizada com sucesso"
}
```

Returned object shape:

```ts
type UpdatePharmacyResponse = ApiResponse<PharmacyDetailDto>;
```

---

## 8. Delete pharmacy

- URL: `DELETE /pharmacy/{id}`
- Auth: Bearer token required
- Extra rule: authenticated user must be `OWNER` of the pharmacy
- Path params:

```ts
type DeletePharmacyParams = {
  id: number;
};
```

- Request body: none

Success response: `200 OK`

```json
{
  "status": "succes",
  "data": null,
  "message": "Farmácia deletada com sucesso"
}
```

Returned object shape:

```ts
type DeletePharmacyResponse = ApiResponse<null>;
```

Notes:

- The backend currently returns `"succes"` with one `s` missing. This is the literal value in the controller.

---

## 9. Find nearby pharmacies

- URL: `GET /pharmacy/nearby`
- Auth: Public
- Query params:

```ts
type NearbyPharmaciesQuery = {
  latitude: number;
  longitude: number;
  radiusKm: number;
};
```

Example:

```text
GET /pharmacy/nearby?latitude=-3.7319&longitude=-38.5267&radiusKm=5
```

- Request body: none

Success response: `200 OK`

```json
{
  "status": "succes",
  "data": [
    {
      "id": 1,
      "name": "Farmacia Central",
      "phone": "85999999999",
      "address": "Rua A, 123",
      "city": "Fortaleza",
      "distanceKm": 1.42,
      "medications": [
        {
          "id": "med-1",
          "name": "Dipirona",
          "dosage": "500mg",
          "pharmaceuticalForm": "Comprimido",
          "manufacturer": "Fabricante X",
          "description": "Analgesico",
          "stripe": "sem-tarja",
          "prescriptionRequired": false,
          "unitPrice": 12.5,
          "createdAt": "2026-06-17T10:15:30.000+00:00"
        }
      ]
    }
  ],
  "message": "Requisição completada com sucesso"
}
```

Returned object shape:

```ts
type MedicationDto = {
  id: string;
  name: string;
  dosage: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  description: string;
  stripe: string;
  prescriptionRequired: boolean;
  unitPrice: number;
  createdAt: string;
};

type NearbyPharmaciesDto = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  distanceKm: number;
  medications: MedicationDto[];
};

type NearbyPharmaciesResponse = ApiResponse<NearbyPharmaciesDto[]>;
```

Notes:

- `latitude` must be between `-90` and `90`.
- `longitude` must be between `-180` and `180`.
- `radiusKm` must be greater than `0`.
- The backend currently returns `"succes"` with one `s` missing. This is the literal value in the controller.

---

## 10. Send pharmacy invitation

- URL: `POST /invites/pharmacy/{id}/send`
- Auth: Bearer token required
- Extra rule: authenticated user must be `OWNER` of the pharmacy
- Path params:

```ts
type SendInviteParams = {
  id: number;
};
```

- Request body:

```json
{
  "email": "employee@example.com"
}
```

Request object shape:

```ts
type InviteDto = {
  email: string;
};
```

Success response: `200 OK`

```json
{
  "status": "success",
  "data": null,
  "message": "Email enviado com sucesso"
}
```

Returned object shape:

```ts
type SendInviteResponse = ApiResponse<null>;
```

---

## 11. Accept invitation

- URL: `POST /invites/accept`
- Auth: Bearer token required
- Request body:

```json
{
  "token": "uuid-or-random-token"
}
```

Request object shape:

```ts
type InviteAcceptDto = {
  token: string;
};
```

Success response: `200 OK`

```json
{
  "status": "success",
  "data": null,
  "message": "Convite aceito com sucesso"
}
```

Returned object shape:

```ts
type AcceptInviteResponse = ApiResponse<null>;
```

Notes:

- The authenticated user email must match the email originally invited.
- Successful acceptance creates `EMPLOYEE` access to the pharmacy.
