# StockInvent - Inventory Management System

A robust and scalable business management system built with React and Node.js. StockInvent offers intuitive modules for inventory control, billing, order tracking, and a flexible archiving system — ideal for small to mid-sized businesses.

---

## 🚀 Key Features

### 📊 Dashboard

* Live business metrics and performance indicators
* Interactive charts powered by Chart.js

### 📦 Inventory Management

* Add, update, and delete products
* Real-time stock level monitoring
* Filter by categories and price ranges
* Archive discontinued items without deletion
* View detailed product specifications

### 📑 Order Management

* Create and track purchase orders
* Update and view order statuses
* Detailed shipment and product information per order

## 📁 Project Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Billing.jsx
│   ├── Orders.jsx
│   └── Archive.jsx
├── styles/
│   ├── Dashboard.css
│   ├── Inventory.css
│   ├── Billing.css
│   ├── Orders.css
│   └── Archive.css
├── utils/
│   ├── api.js
│   └── helpers.js
└── App.jsx
```

---

## 🧰 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/business-management-system.git
```

2. **Install dependencies:**

```bash
cd business-management-system
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Then edit .env with your actual values
```

4. **Run the development server:**

```bash
npm start
```

5. **Build for production:**

```bash
npm run build
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root and define the following variables:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MONGODB_URI=your_mongodb_uri
REACT_APP_JWT_SECRET=your_jwt_secret
```

---
HAPPY CODING!🚀✨
