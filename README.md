# InventAI — AI-Assisted Inventory & Business Operations Platform

InventAI is a full-stack business management platform designed for small and medium-sized businesses (SMEs). It centralizes inventory, customers, orders, invoicing, notifications, analytics, and business insights in a single dashboard.

The project uses a React + TypeScript frontend, an Express/Node.js REST API, MongoDB Atlas for persistent data, and JWT-based authentication.

> **Project status:** Functional full-stack prototype suitable for hackathons, portfolio work, and further production hardening. The current AI Assistant uses rule-based business-data responses; it is intentionally described as an AI-assistance prototype rather than a connected LLM system.

---

## ✨ Features

### 🔐 Authentication & User Accounts
- Business-owner registration and login
- JWT authentication
- Protected API routes
- Password hashing with `bcryptjs`
- Profile update and password change
- User-scoped data access

### 📦 Inventory Management
- Create, update, and delete products
- SKU and category management
- Purchase and selling price tracking
- Stock quantity tracking
- Configurable reorder thresholds
- Automatic `In Stock`, `Low Stock`, and `Out of Stock` status calculation
- Low-stock notifications

### 👥 Customer Management
- Customer records
- Contact information
- Address and notes
- Create, update, and delete operations

### 🛒 Order Management
- Create and manage orders
- Customer-order relationships
- Order statuses:
  - Pending
  - Confirmed
  - Completed
  - Cancelled
- Automatic stock deduction when an order becomes confirmed/completed
- Notifications for important inventory changes

### 🧾 Invoicing
- Generate invoices from orders
- Payment-status tracking
- Paid / Unpaid / Partially Paid states
- Payment method tracking
- Invoice deletion
- PDF invoice generation on the frontend

### 📊 Analytics Dashboard
- Revenue metrics
- Order counts
- Low-stock counts
- Unpaid invoice totals
- Top-selling products
- Revenue by category
- Six-month revenue trends
- Interactive charts

### 🔔 Notifications
- Low-stock alerts
- Order notifications
- Read/unread state
- Mark one or all notifications as read
- Delete notifications

### 🤖 Business Assistant
- Business-data-aware assistant interface
- Stock/restock insights
- Unpaid invoice insights
- Sales insights
- Daily business summary
- Suggested prompts for common business questions

> The current assistant is a deterministic/rule-based prototype. It does not currently call an external LLM API.

---

## 🏗️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- jsPDF
- jsPDF AutoTable

### Backend
- Node.js
- Express.js
- REST API
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Database
- MongoDB Atlas

### Development
- Git / GitHub
- Nodemon
- ESLint

---

## 🧩 Architecture

```text
┌───────────────────────────────┐
│        React + TypeScript     │
│          Vite Frontend        │
│          localhost:5173       │
└───────────────┬───────────────┘
                │
                │ REST / Axios
                ▼
┌───────────────────────────────┐
│       Node.js + Express       │
│            REST API           │
│          localhost:5000       │
└───────────────┬───────────────┘
                │
                │ Mongoose
                ▼
┌───────────────────────────────┐
│        MongoDB Atlas          │
│   Persistent Cloud Database   │
└───────────────────────────────┘
```

Authentication flow:

```text
React
  │
  ├── Signup/Login
  ▼
Express API
  │
  ├── bcrypt password hashing
  ├── JWT generation
  ▼
MongoDB Atlas

Subsequent requests:
React → Bearer JWT → Express middleware → user-scoped MongoDB query
```

---

## 📁 Project Structure

```text
InventAi-Genisys-hackathon-/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── MetricCard.tsx
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── AIAssistant.tsx
│   │   ├── Analytics.tsx
│   │   ├── Auth.tsx
│   │   ├── Customers.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Invoices.tsx
│   │   ├── Notifications.tsx
│   │   ├── Orders.tsx
│   │   └── Settings.tsx
│   │
│   ├── services/
│   │   ├── analyticsService.ts
│   │   ├── authService.ts
│   │   ├── customerService.ts
│   │   ├── invoiceService.ts
│   │   ├── notificationService.ts
│   │   ├── orderService.ts
│   │   ├── productService.ts
│   │   └── settingsService.ts
│   │
│   ├── store/
│   │   └── MockAppStore.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── invoiceController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── settingsController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Invoice.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── StoreSetting.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── invoiceRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── settingsRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js 18+
- npm
- A MongoDB Atlas account

---

### 1. Clone the repository

```bash
git clone https://github.com/sabhya1290/InventAi-Genisys-hackathon-.git
cd InventAi-Genisys-hackathon-
```

---

### 2. Install frontend dependencies

```bash
npm install
```

---

### 3. Install backend dependencies

```bash
cd server
npm install
```

---

### 4. Configure environment variables

Create:

```text
server/.env
```

Add:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=your_long_random_secret
PORT=5000
```

Never commit `.env` or database credentials to GitHub.

---

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

Expected output:

```text
InventAI Server running on port 5000
MongoDB Connected: <cluster-host>
```

---

### 6. Start the frontend

Open a second terminal from the project root:

```bash
npm run dev
```

Vite will normally start at:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the Express server on port `5000`.

---

## 🔌 API Overview

All protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a business account |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

### Invoices

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | List invoices |
| POST | `/api/invoices` | Generate invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/mark-read` | Mark notification as read |
| PUT | `/api/notifications/mark-all-read` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Get business analytics |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/settings` | Get store settings |
| PUT | `/api/settings` | Update store settings |

### Health Check

```http
GET /health
```

Returns:

```json
{
  "status": "OK",
  "timestamp": "..."
}
```

---

## 🔒 Security

The project includes several backend security fundamentals:

- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- User-scoped database queries
- Environment variables for secrets
- CORS configuration
- Mongoose validation
- No database credentials in source code

### Production hardening still recommended

Before production deployment, consider adding:

- Rate limiting
- Helmet security headers
- Stronger request validation
- Refresh-token strategy or secure cookie-based authentication
- More restrictive CORS
- Restricted MongoDB Atlas network access
- Request logging/monitoring
- API pagination
- Role-based authorization for admin/staff actions

---

## 📈 Current Strengths

InventAI demonstrates practical full-stack engineering rather than being only a frontend dashboard:

- End-to-end React → REST API → MongoDB integration
- Authentication and authorization middleware
- Multiple MongoDB collections and relationships
- Inventory business logic
- Automatic stock deduction
- Notification generation
- Aggregation-based analytics
- Invoice workflow
- PDF generation
- Responsive business dashboard
- Modular service/controller/model architecture

---

## 🔮 Future Improvements

Potential next steps:

1. Connect the Business Assistant to an LLM with tool/function calling.
2. Allow the assistant to execute safe business queries against live MongoDB data.
3. Add CSV/Excel inventory import and export.
4. Add supplier and purchase-order management.
5. Add advanced role-based permissions for staff.
6. Add automated low-stock reorder recommendations.
7. Add email/WhatsApp invoice and payment reminders.
8. Add pagination, filtering, and search to large datasets.
9. Add automated tests for API routes and business logic.
10. Add Docker-based development and deployment.
11. Add CI/CD with GitHub Actions.
12. Add production observability and error tracking.

---

## 🧠 Key Engineering Concepts Demonstrated

- RESTful API design
- MVC-style backend organization
- JWT authentication
- Password hashing
- MongoDB/Mongoose data modeling
- MongoDB aggregation pipelines
- React state management with Context
- Axios interceptors
- Protected client-side routes
- Frontend/backend separation
- Business-rule implementation
- PDF document generation
- TypeScript interfaces and typed API services
- Environment-based configuration

---

## 📌 Project Positioning

InventAI is intended to solve a practical SME problem: bringing inventory, sales operations, customer management, billing, and business insights into one application instead of relying on disconnected spreadsheets and tools.

The project is particularly suitable as a portfolio/hackathon project because it demonstrates a complete application workflow from authentication and database persistence to business logic, analytics, and document generation.

---

## 👨‍💻 Author

**Sabhya Singh**

GitHub: https://github.com/sabhya1290

---
