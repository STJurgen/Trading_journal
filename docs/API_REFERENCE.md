# API Reference

The Trading Journal backend exposes a RESTful API under the `/api` prefix. All endpoints, unless noted otherwise, accept and return JSON payloads. Authenticated routes require a valid JWT access token supplied in the `Authorization: Bearer <token>` header.

## Authentication

| Method | Endpoint           | Description                     |
| ------ | ------------------ | ------------------------------- |
| POST   | `/api/auth/register` | Create a new user account.      |
| POST   | `/api/auth/login`    | Authenticate and retrieve tokens. |
| POST   | `/api/auth/refresh`  | Exchange a refresh token for a new access token. |

### POST `/api/auth/register`

**Request Body**
```json
{
  "email": "trader@example.com",
  "password": "string",
  "name": "Ava Trader"
}
```

**Response 201**
```json
{
  "user": {
    "id": 1,
    "email": "trader@example.com",
    "name": "Ava Trader",
    "role": "trader"
  },
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

### POST `/api/auth/login`

Accepts the same payload as registration (without the `name`). Returns the authenticated user and issued tokens.

### POST `/api/auth/refresh`

Provide `{ "token": "<refreshToken>" }` to obtain a new access/refresh pair.

## Trades

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/trades`        | List trades for the authenticated user. |
| GET    | `/api/trades/:id`    | Retrieve a single trade with its notes. |
| POST   | `/api/trades`        | Create a new trade entry. |
| PUT    | `/api/trades/:id`    | Update an existing trade. |
| DELETE | `/api/trades/:id`    | Remove a trade. |

### Trade Payload

```json
{
  "asset": "EUR/USD",
  "direction": "long",
  "quantity": 10000,
  "entryPrice": 1.0725,
  "exitPrice": 1.0798,
  "strategyId": 1,
  "openedAt": "2024-01-05T09:00:00Z",
  "closedAt": "2024-01-05T15:00:00Z",
  "notes": "Optional notes"
}
```

## Strategies

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/api/strategies`        | List strategies for the user.      |
| GET    | `/api/strategies/:id`    | Fetch a single strategy.           |
| POST   | `/api/strategies`        | Create a new strategy definition.  |
| PUT    | `/api/strategies/:id`    | Update a strategy.                 |
| DELETE | `/api/strategies/:id`    | Delete a strategy.                 |

## Users

| Method | Endpoint           | Description                                      |
| ------ | ------------------ | ------------------------------------------------ |
| GET    | `/api/users/me`      | Retrieve the authenticated user profile.        |
| PUT    | `/api/users/me`      | Update profile details (name, settings).        |
| GET    | `/api/users/stats`   | Summary statistics (total trades, PnL, win rate). |

## Error Handling

Errors are returned in the following format:

```json
{
  "message": "Description of what went wrong"
}
```

For validation errors, expect a `400` status code; unauthorized requests return `401`; forbidden actions return `403`; and missing records respond with `404`.
