# Protuctive Project

A full-stack web application featuring user authentication, product management, and dynamic web interfaces.

---

## 📋 Features & Enhancements
- **User Authentication**: Login & Registration with input validation.
  - Email format validation using regular expressions.
  - Strict password policy enforcing a minimum of 8 characters.
  - Server-side and Client-side safety checks.
- **Product Management**: Endpoints and templates for viewing and managing products.
- **Cart & Dashboard**: Dynamic interactive components built with modular JavaScript and CSS.

---

## 🛠️ Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MySQL](https://www.mysql.com/) or target database instance
- Git

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/protuctive.git
cd protuctive
```

---

### 2. Configure Backend Environment

#### Auth & Login Backend
```bash
cd protuctive/BACKEND/LOGIN_HTML_BACKEND
cp env.example .env
```
Edit the `.env` file with your database connection parameters and JWT credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=protuctive_db
JWT_SECRET=your_jwt_secret_key
```

#### Dependencies Installation
Install dependencies for all backend microservices/modules as needed:

```bash
# Login Service
cd protuctive/BACKEND/LOGIN_HTML_BACKEND
npm install

# Products Service
cd ../PRODUCTS_HTML_BACKEND
npm install
```

---

### 3. Database Setup

Import the database schemas into your SQL database:

```bash
mysql -u root -p protuctive_db < protuctive/BACKEND/LOGIN_HTML_BACKEND/DATABASE/schema.sql
mysql -u root -p protuctive_db < protuctive/BACKEND/LOGIN_HTML_BACKEND/DATABASE/roles_and_privileges.sql
```

---

### 4. Running the Servers

Start the Authentication Backend service:
```bash
cd protuctive/BACKEND/LOGIN_HTML_BACKEND
npm start
```

*(Optional)* Start the Product Backend service in a separate terminal:
```bash
cd protuctive/BACKEND/PRODUCTS_HTML_BACKEND
npm start
```

---

### 5. Running the Frontend

To view and interact with the application frontend:

#### Option A: Node Static Server (`serve`)
From the project root directory:
```bash
npx serve protuctive/FRONTEND
```
Open `http://localhost:3000` in your web browser.

#### Option B: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `protuctive/FRONTEND/index.html` or `login.html`.
3. Select **"Open with Live Server"**.

---

## 🧪 Testing Validation Rules
1. Open `login.html` or the authentication form.
2. Enter an invalid email format (e.g. `user@test`) to observe regex errors.
3. Enter a password with fewer than 8 characters to observe length check enforcement.