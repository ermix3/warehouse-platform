# Warehouse Management Platform Project Guidelines

This document defines conventions, patterns, and best practices for building and maintaining the **Warehouse Management Platform**.  
It complements `AGENTS.md` by focusing on **how we build** rather than **what we build**.

---

## Project Structure

- **Backend**: Laravel 12
  - Routes: `routes/web.php` for web routes, `routes/api.php` for API endpoints.
  - Controllers follow **RESTful resource conventions**.
  - Business logic goes into **Services** or **Actions**, not controllers.
  - Reusable validation in **Form Requests**.
  - Database migrations + factories + seeders for all schema changes.

- **Frontend**: React (via Inertia.js)
  - Each page corresponds to a Laravel route.
  - Components should use **Shadcn UI** for consistency.
  - State management: keep it minimal; prefer server-driven state via Inertia props.
  - Avoid prop drilling → use context/hooks when needed.

- **Database**: MySQL
  - All schema changes through **migrations** only.
  - Relationships should be explicitly defined in models.
  - Use **soft deletes** only when required.

---

## Code Style

- **Laravel (PHP)**  
  - Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards.  
  - Controllers → thin, delegate to Services.  
  - Models → no business logic beyond relationships + casts.  
  - Use **Enums** for status fields (`OrderStatus`, `ShippingStatus`).

- **React (JS/TS)**  
  - Prefer **TypeScript** for type safety.  
  - Functional components only.  
  - Use hooks for state and side effects.  
  - Keep components small and composable.

---

## Naming Conventions

- **Database Tables**: plural snake_case (`customers`, `order_items`).  
- **Models**: singular PascalCase (`Customer`, `OrderItem`).  
- **Foreign Keys**: `{model}_id` (`customer_id`, `supplier_id`).  
- **Pivot Tables**: singular_singular (`order_product` if simple, but here `order_items` since it carries extra fields).  
- **Enums**: use lowercase string values (`pending`, `delivered`, etc.).

---

## Frontend UI Rules

- Use shadcn UI is the default component library
- Use react-hook-form + zod for form validation
- Use flash messages → consistent `sonner` with toast or <Alert />
- Use responsive-first design → mobile layouts must be tested

---

## API & Inertia Conventions

- Use Laravel Resource classes to shape JSON responses consistent response `props` format:

```json
{
  "auth": {},
  "<T>": {
      "data": {}
  },
  "enums": {},
  "errors": {},
  "filters": {},
  "flash": {}
}
```

- Inertia actions (Inertia.post, etc.) must handle success + error states
- Flash messages standardized: success, error, warning
