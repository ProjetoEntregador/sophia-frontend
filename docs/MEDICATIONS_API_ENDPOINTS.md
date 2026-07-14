# API Endpoints Reference

This document maps every currently implemented HTTP endpoint in this service based on the codebase as of 2026-06-17.

## Base URL

- Local default: `http://localhost:3000`
- There is no global route prefix configured in [src/main.ts](/home/lucas/Desktop/ADS/PI/sophia/sophia-medication-service/src/main.ts:1)

## Global Notes

- A global `ValidationPipe` is enabled. Invalid request payloads return `400 Bad Request`.
- `timestamp` fields are stored as JavaScript `Date` values and are serialized in JSON as ISO date strings.
- `unitPrice` is stored as a database `numeric`, and the API returns it as a string.
- Successful `DELETE` endpoints do not return an object body. They resolve with an empty response body.
- The medication batch API accepts `batchNumber` in request bodies, but returns `batchCode` in responses.

## Response Shapes

### `RootMessageResponse`

```ts
type RootMessageResponse = string;
```

Example:

```json
"Hello World!"
```

### `MedicationResponse`

```ts
type MedicationResponse = {
  id: string;
  pharmacyId: number;
  name: string;
  dosage: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  description: string | null;
  stripe: string | null;
  prescriptionRequired: boolean;
  unitPrice: string;
  createdAt: string;
};
```

### `MedicationBatchResponse`

```ts
type MedicationBatchResponse = {
  id: string;
  medicationId: string;
  batchCode: string;
  quantity: number;
  expirationDate: string;
  createdAt: string;
};
```

## 1. Root

### `GET /`

- Method: `GET`
- URL: `/`
- Request body: none
- Returns:

```json
"Hello World!"
```

## 2. Medications

### `POST /medications`

- Method: `POST`
- URL: `/medications`
- Request body:

```json
{
  "pharmacyId": 1,
  "name": "Dipirona 500mg",
  "dosage": "500mg",
  "pharmaceuticalForm": "tablet",
  "manufacturer": "EMS",
  "description": "Analgesic medication",
  "stripe": "red",
  "prescriptionRequired": false,
  "unitPrice": 12.5
}
```

- Returns: `MedicationResponse`

```json
{
  "id": "uuid",
  "pharmacyId": 1,
  "name": "Dipirona 500mg",
  "dosage": "500mg",
  "pharmaceuticalForm": "tablet",
  "manufacturer": "EMS",
  "description": "Analgesic medication",
  "stripe": "red",
  "prescriptionRequired": false,
  "unitPrice": "12.50",
  "createdAt": "2026-06-17T12:00:00.000Z"
}
```

### `GET /medications`

- Method: `GET`
- URL: `/medications`
- Request body: none
- Returns: `MedicationResponse[]`

```json
[
  {
    "id": "uuid",
    "pharmacyId": 1,
    "name": "Dipirona 500mg",
    "dosage": "500mg",
    "pharmaceuticalForm": "tablet",
    "manufacturer": "EMS",
    "description": "Analgesic medication",
    "stripe": "red",
    "prescriptionRequired": false,
    "unitPrice": "12.50",
    "createdAt": "2026-06-17T12:00:00.000Z"
  }
]
```

### `GET /medications/:id`

- Method: `GET`
- URL: `/medications/:id`
- Request body: none
- URL params:
  - `id: string`
- Returns: `MedicationResponse`

```json
{
  "id": "uuid",
  "pharmacyId": 1,
  "name": "Dipirona 500mg",
  "dosage": "500mg",
  "pharmaceuticalForm": "tablet",
  "manufacturer": "EMS",
  "description": "Analgesic medication",
  "stripe": "red",
  "prescriptionRequired": false,
  "unitPrice": "12.50",
  "createdAt": "2026-06-17T12:00:00.000Z"
}
```

### `GET /medications/pharmacy/:pharmacyId`

- Method: `GET`
- URL: `/medications/pharmacy/:pharmacyId`
- Request body: none
- URL params:
  - `pharmacyId: number`
- Returns: `MedicationResponse[]`

```json
[
  {
    "id": "uuid",
    "pharmacyId": 1,
    "name": "Dipirona 500mg",
    "dosage": "500mg",
    "pharmaceuticalForm": "tablet",
    "manufacturer": "EMS",
    "description": "Analgesic medication",
    "stripe": "red",
    "prescriptionRequired": false,
    "unitPrice": "12.50",
    "createdAt": "2026-06-17T12:00:00.000Z"
  }
]
```

### `PATCH /medications/:id`

- Method: `PATCH`
- URL: `/medications/:id`
- URL params:
  - `id: string`
- Request body: all fields are optional

```json
{
  "pharmacyId": 1,
  "name": "Dipirona 1g",
  "dosage": "1g",
  "pharmaceuticalForm": "tablet",
  "manufacturer": "EMS",
  "description": "Updated description",
  "stripe": "red",
  "prescriptionRequired": false,
  "unitPrice": 14.9
}
```

- Returns: `MedicationResponse`

```json
{
  "id": "uuid",
  "pharmacyId": 1,
  "name": "Dipirona 1g",
  "dosage": "1g",
  "pharmaceuticalForm": "tablet",
  "manufacturer": "EMS",
  "description": "Updated description",
  "stripe": "red",
  "prescriptionRequired": false,
  "unitPrice": "14.90",
  "createdAt": "2026-06-17T12:00:00.000Z"
}
```

### `DELETE /medications/:id`

- Method: `DELETE`
- URL: `/medications/:id`
- Request body: none
- URL params:
  - `id: string`
- Returns: empty body on success (`200 OK`)

```ts
undefined
```

Notes:

- If the medication does not exist, the API returns `404 Not Found`.
- If the medication has linked batches, the API returns `400 Bad Request` with the message: `Não é possível excluir este medicamento, pois existem lotes vinculados a ele.`

## 3. Medication Batches

### `POST /medication-batches`

- Method: `POST`
- URL: `/medication-batches`
- Request body:

```json
{
  "medicationId": "uuid",
  "batchNumber": "LOT-2026-001",
  "quantity": 100,
  "expirationDate": "2027-12-31T00:00:00.000Z"
}
```

- Returns: `MedicationBatchResponse`

```json
{
  "id": "uuid",
  "medicationId": "uuid",
  "batchCode": "LOT-2026-001",
  "quantity": 100,
  "expirationDate": "2027-12-31T00:00:00.000Z",
  "createdAt": "2026-06-17T12:00:00.000Z"
}
```

### `GET /medication-batches`

- Method: `GET`
- URL: `/medication-batches`
- Request body: none
- Returns: `MedicationBatchResponse[]`

```json
[
  {
    "id": "uuid",
    "medicationId": "uuid",
    "batchCode": "LOT-2026-001",
    "quantity": 100,
    "expirationDate": "2027-12-31T00:00:00.000Z",
    "createdAt": "2026-06-17T12:00:00.000Z"
  }
]
```

### `GET /medication-batches/:id`

- Method: `GET`
- URL: `/medication-batches/:id`
- Request body: none
- URL params:
  - `id: string`
- Returns: `MedicationBatchResponse`

```json
{
  "id": "uuid",
  "medicationId": "uuid",
  "batchCode": "LOT-2026-001",
  "quantity": 100,
  "expirationDate": "2027-12-31T00:00:00.000Z",
  "createdAt": "2026-06-17T12:00:00.000Z"
}
```

### `GET /medication-batches/medication/:medicationId`

- Method: `GET`
- URL: `/medication-batches/medication/:medicationId`
- Request body: none
- URL params:
  - `medicationId: string`
- Returns: `MedicationBatchResponse[]`

```json
[
  {
    "id": "uuid",
    "medicationId": "uuid",
    "batchCode": "LOT-2026-001",
    "quantity": 100,
    "expirationDate": "2027-12-31T00:00:00.000Z",
    "createdAt": "2026-06-17T12:00:00.000Z"
  }
]
```

### `PATCH /medication-batches/:id`

- Method: `PATCH`
- URL: `/medication-batches/:id`
- URL params:
  - `id: string`
- Request body: all fields are optional

```json
{
  "medicationId": "uuid",
  "batchNumber": "LOT-2026-002",
  "quantity": 80,
  "expirationDate": "2028-01-31T00:00:00.000Z"
}
```

- Returns: `MedicationBatchResponse` when the update succeeds

Important:

- The DTO accepts `batchNumber`, but the repository update uses the database field name `batchCode` in responses.
- Based on the current implementation, the request/response field naming is inconsistent and should be treated carefully by the frontend team.
- Updating only `batchNumber` is not mapped explicitly to `batchCode` in the repository update flow.

### `DELETE /medication-batches/:id`

- Method: `DELETE`
- URL: `/medication-batches/:id`
- Request body: none
- URL params:
  - `id: string`
- Returns: empty body on success (`200 OK`)

```ts
undefined
```

## 4. Request Body Rules

### `CreateMedicationDto`

```ts
type CreateMedicationDto = {
  pharmacyId: number;
  name: string;
  dosage: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  description?: string;
  stripe?: string;
  prescriptionRequired: boolean;
  unitPrice: number;
};
```

Rules:

- `pharmacyId` must be an integer
- `name` must be a string
- `dosage` must be a string
- `pharmaceuticalForm` must be a string
- `manufacturer` must be a string
- `description` is optional
- `stripe` is optional
- `prescriptionRequired` must be a boolean
- `unitPrice` must be a number greater than or equal to `0`

### `UpdateMedicationDto`

Same fields as `CreateMedicationDto`, but all fields are optional.

### `CreateMedicationBatchDto`

```ts
type CreateMedicationBatchDto = {
  medicationId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
};
```

Rules:

- `medicationId` must be a string
- `batchNumber` must be a string
- `quantity` must be a positive integer
- `expirationDate` must be a valid ISO date string

### `UpdateMedicationBatchDto`

Same fields as `CreateMedicationBatchDto`, but all fields are optional.
