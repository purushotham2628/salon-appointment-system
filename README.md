# 💇‍♂️ Salon Appointment Management System

A full-stack web application for booking, managing, and tracking salon appointments, featuring:

* 📅 User appointment booking
* 👨‍💼 Admin login dashboard
* 📧 Automated email notifications (Booking / Confirmation / Rejection)
* 🛠 Built using Node.js, Express, SQLite, and vanilla JS

---

## 🚀 Features

### 👥 User Side

* Book appointments with name, email, phone, date, time, and service
* Receive confirmation or rejection email

### 🛠 Admin Side

* Secure admin login (with environment variable-based credentials)
* Dashboard with all appointments (pending, confirmed, rejected)
* Confirm or reject appointments with 1-click
* See statistics (total/pending/confirmed)

---

## 🧰 Tech Stack

* **Backend**: Node.js + Express
* **Database**: SQLite
* **Frontend**: HTML, CSS, JavaScript
* **Email**: Nodemailer with Gmail App Password

---

## 📦 Installation & Setup

### 🔧 Prerequisites

* Node.js installed
* Gmail account with App Password enabled

### 🔌 Clone the project

```bash
git clone https://github.com/yourusername/salon-appointment-system.git
cd salon-appointment-system
```

### 📦 Install dependencies

```bash
npm install
```

### 🔐 Create `.env` file

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=yourapppassword
ADMIN_USER=purush
ADMIN_PASS=purush
```

### ▶️ Start the server

```bash
node server.js
```

Visit: [http://localhost:8000](http://localhost:8000)

---

## 📂 Folder Structure

```
project/
├── admin.html          # Admin dashboard
├── index.html          # Booking form UI
├── admin.js            # Admin logic (login, confirm/reject)
├── server.js           # Express backend
├── salon.db            # SQLite database (auto-generated)
├── .env                # Environment variables (ignored by Git)
└── .gitignore          # Ignore sensitive/unnecessary files
```

---

## 📸 Screenshots

(Add screenshots of your booking page & admin panel here if needed)

---

## 📬 Email Setup Notes

* Use Gmail with **App Passwords** (from [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))
* Make sure you **don't push your `.env` file** to GitHub

---

## 💡 Future Improvements

* JWT-based login for admin
* SMS alerts via Twilio
* Daily/weekly appointment summary emails
* Better UI/UX using Tailwind or Bootstrap

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 🌐 GitHub Project Stats

![GitHub Repo stars](https://img.shields.io/github/stars/yourusername/salon-appointment-system?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/salon-appointment-system?style=social)
![Node.js version](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)
