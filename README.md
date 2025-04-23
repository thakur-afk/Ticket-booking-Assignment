# 🎫 Train Seat Booking System

This is a full-stack **seat booking application** built using **Next.js** and **Prisma with PostgreSQL**, where users can sign up, log in, and book train seats with intelligent logic to optimize seat proximity.

---

## 🚀 Features

- ✅ User Authentication (Signup & Login)
- ✅ Book up to **7 seats** at once
- ✅ Seats are booked in the **same row if available**
- ✅ If not, **closest seats** are chosen using **pairwise distance**
- ✅ Real-time seat updates
- ✅ Built with **Next.js App Router** and **Prisma ORM**

---

## 🧠 Booking Logic

1. A user can request 1 to 7 seats.
2. The backend first looks for **available seats in the same row**.
3. If not possible, it calculates all **combinations** of available seats and picks the group with the **lowest total pairwise distance** (closest proximity).
4. Once booked, those seats are marked as `isBooked: true`.

---

## setup in local machine
1. clone the repo
2. install dependency.
3. create .env file with below variables:
    TOKEN_SECRET=""
    DATABASE_URL="" // your postgresSQL (setup prisma as well).
4. npm run dev.
