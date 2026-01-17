# 🏨 Hotel Room Reservation System

A full-stack algorithmic reservation system designed to optimize room allocation based on travel time constraints. Built for the SDE 3 Assessment.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://hotel-reservation-assessment.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Render-black?style=for-the-badge&logo=render)](https://hotel-backend.onrender.com/docs)

> **⚠️ Note:** The backend is hosted on a generic Free Tier instance. Please allow **30-60 seconds** for the first request (cold start).

## 🚀 Key Features

* **Smart Allocation Algorithm:** Prioritizes same-floor proximity first, then minimizes vertical/horizontal travel time using a weighted graph approach ($Cost = \Delta H + 2 \times \Delta V$).
* **Visual Grid System:** Interactive 10x10 grid representing the 97-room layout (including the irregular 7-room 10th floor).
* **Real-time Feedback:** Instant visual cues for booked (Red), available (Green), and just-allocated (Blue) rooms.
* **Thread-Safe State:** Implements a singleton pattern with mutex locks to handle concurrent booking requests safely in memory.

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS
* **State:** React Hooks (Context API not required for this scope)
* **Deployment:** Vercel

### **Backend**
* **Runtime:** Python 3.10+
* **Framework:** FastAPI
* **Validation:** Pydantic
* **Deployment:** Render

## 🧠 The Algorithm

The core logic (`optimizer.py`) handles requests for $K$ rooms (Max 5) using a strict priority hierarchy:

1.  **Priority A (Same Floor):**
    * Scans floors 1-10 for contiguous blocks of available rooms.
    * **Tie-breaker:** Selects the set with the smallest **horizontal span** ($Room_{max} - Room_{min}$).

2.  **Priority B (Cross-Floor / Gap Filling):**
    * If contiguous rooms aren't available, the system calculates the "Travel Cost" for every possible combination of nearest neighbors.
    * **Weights:** Horizontal moves cost **1 unit**, Vertical moves cost **2 units**.
    * *Goal:* Minimize the total pairwise distance within the cluster.

## 📦 Local Installation

### Prerequisites
* Node.js 18+
* Python 3.9+

### 1. Clone the Repo
```bash
git clone [https://github.com/karthixcarlo/hotel-reservation-assessment.git](https://github.com/karthixcarlo/hotel-reservation-assessment.git)
cd hotel-reservation-assessment
