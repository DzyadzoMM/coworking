# 🏢 Coworking Space Management System & Telegram Bot

![NestJS](https://img.shields.io/badge/framework-NestJS-red?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Telegraf](https://img.shields.io/badge/bot-Telegraf-blue?style=for-the-badge&logo=telegram)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=for-the-badge&logo=typescript)

A professional ecosystem for coworking space automation. It features a robust NestJS API and an interactive Telegram bot for real-time user engagement. Developed and optimized for mobile development environments like **Termux**.

---

## 🌟 Key Features

* **⚡️ Smart Booking**: Double-booking protection algorithm prevents overlapping reservations for the same workspace.
* **🤖 Interactive Bot**: Full user lifecycle management via Telegram, including account linking and history retrieval.
* **🔔 Instant Notifications**: Detailed automated confirmations sent to Telegram immediately after booking via API.
* **🔐 Enterprise Security**: Secure access using JWT tokens and Passport.js strategies.

---

## 🛠 Tech Stack (Dependencies)

Based on the project configuration, the following technologies are utilized:

* **Core**: `NestJS 11`, `TypeScript 5.7`
* **Database**: `PostgreSQL`, `TypeORM 0.3`
* **Bot Engine**: `Telegraf`, `nestjs-telegraf`
* **Security**: `Passport.js`, `JWT`, `bcryptjs`
* **Communication**: `Nodemailer`, `@nestjs-modules/mailer`
* **Validation**: `class-validator`, `class-transformer`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user account |
| **POST** | `/api/auth/login` | User login (returns JWT token) |
| **GET** | `/api/workspaces` | Get a list of available workspaces with filters |
| **POST** | `/api/bookings` | Create a booking (includes availability check) |
| **GET** | `/api/bookings/my` | List bookings for the currently authenticated user |
---

## 📊 Database Schema

| Entity | Description | Key Fields |
| :--- | :--- | :--- |
| **User** | System Users | `email`, `password`, `telegramId` |
| **Location** | Office Clusters | `name`, `address` |
| **Workspace** | Desks/Meeting Rooms | `name`, `type`, `locationId` |
| **Booking** | Reservations | `startTime`, `endTime`, `status`, `userId`, `workspaceId` |

---
## 🚀 Management Commands (Scripts)

Use `npm` to manage the project lifecycle:

```bash
# Install all dependencies
npm install

# Start in development mode (with watch)
npm run start:dev

# Build the project for production
npm run build

# Run the production build
npm run start:prod

# Run unit tests
npm run test

# Format code using Prettier
npm run format


---

## 📱 User Guide: Telegram Bot

### 1. Account Linking
* **Start the Conversation**: Open the bot and send the `/start` command.
* **Link Profile**: Provide your registered email address; the bot will then link your `telegramId` to your database profile.
* **Get Notified**: Once linked, you will receive real-time notifications for all your bookings.

### 2. Bot Commands
* `/my_bookings` — View a detailed list of your active and past reservations.
* `/help` — View information about available bot features.


Чудовий вибір! Цей проект покаже роботодавцю, що ти вмієш працювати з бізнес-логікою (уникнення подвійних бронювань) та складними структурами даних.
Ось детальний план розробки:
1. Архітектура бази даних (PostgreSQL/MongoDB)
Це серце твого проекту. Тобі знадобляться такі сутності:
 * Users: ID, email, password, role (admin/user).
 * Locations: Назва коворкінгу, адреса, опис, фото.
 * Workspaces: Конкретні столи або кімнати.
   * type: 'hot-desk', 'dedicated-desk', 'meeting-room'.
   * price_per_hour: ціна.
 * Bookings: Зв'язок користувача та місця.
   * start_time, end_time (важливо використовувати тип DateTime).
   * status: 'active', 'cancelled', 'completed'.
2. Основний функціонал (Back-end: Express.js)
Головний виклик тут — валідація доступності. Користувач не може забронювати стіл №5, якщо він уже зайнятий на цей час.
Алгоритм перевірки (Pseudo-logic):
При створенні нового бронювання, ти робиш запит до БД:
ExistingBookings \cap NewBooking \neq \emptyset
Якщо запит повертає хоча б один запис, де час перетинається — видавай помилку 409 Conflict.
Ендпоінти:
 * GET /api/workspaces — отримати список доступних місць із фільтрами.
 * POST /api/bookings — створити бронювання (з перевіркою доступності).
 * GET /api/bookings/my — список бронювань поточного користувача.
3. Фронтенд (Next.js)
Використовуй App Router для кращої продуктивності та SEO.
 * Головна сторінка: Пошук за датою та типом місця.
 * Сторінка вибору: Картки робочих місць. Використовуй React Query або SWR для кешування даних з API.
 * Форма бронювання: Інтерактивний календар (бібліотека react-datepicker або date-fns).
 * Dashboard: Таблиця з активними бронюваннями користувача та можливістю їх скасувати.
4. Дизайн та макети (Де знайти)
Оскільки ти фулстек, не витрачай тижні на малювання дизайну з нуля. Візьми готовий:
 * Figma Community: Зайди на Figma і введи в пошук:
   * “Coworking Space App”
   * “Hotel Booking UI Kit” (логіка ідентична, просто заміни ліжка на столи).
   * “Desk Booking Dashboard”
 * Готовий UI: Використовуй бібліотеку компонентів Shadcn UI або Tailwind UI. Вони виглядають дуже професійно "з коробки" і зекономлять тобі 50% часу на верстку.
5. "Кілер-фіча" для резюме (Advanced)
Щоб проект не виглядав як "студентський", додай одну з цих функцій:
 * Interactive Map: Зроби просту схему офісу на SVG. Коли стіл зайнятий — він стає червоним, коли вільний — зеленим і клікабельним.
 * Email Confirmation: Відправка листа через Nodemailer з деталями бронювання та QR-кодом (його можна згенерувати бібліотекою qrcode).
 * Export to iCal: Кнопка "Додати в календар", яка генерує файл для Google/Apple Calendar.
З чого почнемо?
Можу допомогти спроектувати схему бази даних (SQL таблиці) більш детально або написати приклад функції перевірки перетину часу для бекенда. Що скажеш?
