# 🎫 Realtime Support Ticketing System

A full-featured **Support Ticketing System** with real-time capabilities, built using **Laravel 12**, **React**, **GraphQL**, and other modern technologies. It includes role-based access, live chat, email notifications, Google Sign-In, OTP authentication, and magic link support for password resets.

---

## 🚀 Features

- 🧑‍💼 Role-based access (Admins & Users)
- 💬 Real-time chat inside tickets
- 🔔 Real-time notifications for ticket updates and new messages
- 🔐 Google Sign-In via OAuth
- 📩 Email OTP for secure login and verification
- 🪄 Magic link support for forgotten password recovery
- ✅ Mark notifications as read
- 📂 Open/Close ticket management
- 🎨 Responsive and clean UI with TailwindCSS
- 🔄 GraphQL Subscriptions using Laravel Broadcasting

---

## 🛠️ Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Backend      | Laravel 12                             |
| Auth         | Sanctum (session-based)                |
| API          | Lighthouse GraphQL                     |
| Frontend     | React + Vite                           |
| GraphQL      | Apollo Client                          |
| Styles       | TailwindCSS                            |
| Notifications| Laravel Notifications + GraphQL        |
| Realtime     | Laravel Broadcasting + WebSockets      |
| Icons        | React Icons                            |
| Email        | Laravel Mail for OTP & Magic Links     |


---

## 🚀 Getting Started

The project is structured into two main parts:

- `support-ticket-system-laravel` → Laravel 12 backend with Lighthouse GraphQL
- `support-ticket-system-react` → React frontend with Apollo Client

### 📦 Backend Setup (Laravel 12 + Lighthouse)

```bash
# Navigate to the backend directory
cd support-ticket-system-laravel

# Install PHP dependencies
composer install

# Create environment file and generate app key
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve
```

---

### 💻 Frontend Setup (React + Apollo)

```bash
# Open a new terminal and navigate to the frontend directory
cd support-ticket-system-react

# Install JS dependencies
npm install

# Start the React development server
npm run dev
```

---

## 🔐 Authentication

- **Google Sign-In** for users who prefer social login.
- **OTP via Email** sent during login or registration.
- **Magic Link** for password recovery with expiration control.
- **Sanctum session-based** authentication handled by Laravel.

---

## 📸 Screenshots

![App Screenshot](readmeImage.png)


---

## 💡 Use Cases

- Customer support ticketing inside web applications
- Internal team communication & issue tracking
- Real-time admin-user collaboration for problem solving

---

## 👤 Author

**Heba Elgohary**  
🔗 [GitHub Profile](https://github.com/HebaAbdElhamed)

---

## 📄 License

This project is not open-source. All rights are reserved to Heba Elgohary.  
For inquiries or access to the full version, please contact me directly.

🔗 [LinkedIn – Heba Elgohary](https://www.linkedin.com/in/heba-elgohary-a13074167/)


---

### 🔍 Note

This repository demonstrates only basic parts of a larger real-time support ticketing system.  
For access to the full version or collaboration inquiries, feel free to reach out via:

- 🔗 [LinkedIn – Heba Elgohary](https://www.linkedin.com/in/heba-elgohary-a13074167/)
- 🐙 [GitHub – Heba Elgohary](https://github.com/HebaAbdElhamed)



## 🏷️ Tags / Topics

`laravel` `react` `graphql` `apollo-client` `support-system` `ticketing` `realtime` `notifications` `sanctum` `lighthouse` `google-login` `otp` `magic-link` `tailwindcss`

---
