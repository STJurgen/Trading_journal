# Database Structure

The Trading Journal application persists data in MySQL. The schema is designed around four core entities: users, strategies, trades and notes. Foreign key constraints enforce ownership and cascading behaviour to keep orphan records out of the system.

## Entity Overview

### `users`
- `id` — primary key.
- `email` — unique identifier used for login.
- `password` — bcrypt hash of the login password.
- `name` — display name shown throughout the UI.
- `role` — permission level (`trader`, `admin`).
- `created_at`, `updated_at` — audit timestamps.

### `strategies`
Strategies capture the trading playbooks defined by a user.

- `user_id` — owner (references `users.id`).
- `name`, `description`, `timeframe` — descriptive metadata.
- Cascades: deleting a user removes their strategies.

### `trades`
Each record represents a trade execution.

- `user_id` — owner (references `users.id`).
- `asset` — traded instrument (ticker or pair).
- `direction` — `long` or `short`.
- `quantity`, `entry_price`, `exit_price` — position sizing and price levels.
- `strategy_id` — optional link to the strategy used.
- `opened_at`, `closed_at` — execution timestamps.
- `notes` — free-form commentary stored inline for quick access.
- Cascades: deleting a user removes their trades; deleting a strategy sets `strategy_id` to `NULL` for related trades.

### `notes`
Notes provide richer commentary per trade.

- `trade_id` — references `trades.id` (cascade delete).
- `user_id` — redundant ownership to simplify lookups and enforce access control.
- `title`, `content` — text payload.

## Migrations

Database migrations are stored in `database/migrations/`. You can manage the directory with tools such as [Knex](https://knexjs.org/), [Prisma Migrate](https://www.prisma.io/), or Flyway. Seed data lives in `database/seed.sql` for quick demos.

## Indexing Suggestions

- Add indexes on `trades.user_id`, `trades.strategy_id`, and `strategies.user_id` for faster lookups.
- Consider composite indexes on (`user_id`, `opened_at`) when querying timelines.
