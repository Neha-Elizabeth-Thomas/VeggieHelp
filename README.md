# SubziSahayak 🥬

**Connecting farmers directly to local buyers, powered by AI.**

SubziSahayak is a full-stack MERN application designed to tackle food waste and empower small-scale farmers in India. It provides a hyperlocal marketplace that bridges the gap between farmers with surplus produce and local bulk buyers like restaurants and hotels, ensuring fair prices and reducing post-harvest losses.

---

## ✨ Key Features

* **AI-Powered Smart Listings:** Farmers don't fill out complex forms. They simply provide a text description and an image of their produce. The Gemini AI analyzes this input to:
    * Categorize the product, quantity, and unit.
    * Assess the quality of the produce from the image.
    * Suggest a fair market price based on local trends.
    * Generate a catchy advertisement to attract buyers.
* **Hyperlocal Matching:** The platform uses geospatial queries to instantly notify nearby buyers about new, fresh listings, creating a rapid and efficient local supply chain.
* **Real-time Chatbot:** An integrated AI chatbot, also powered by Gemini, provides 24/7 assistance to users.
* **Secure Authentication:** Uses a robust, cookie-based JWT authentication system to protect user accounts and data.
* **Integrated Payments:** A seamless checkout experience for buyers powered by the Razorpay payment gateway.
* **Role-Based Dashboards:** Separate, intuitive dashboards for farmers (to manage listings) and buyers (to discover produce).

---

## 🛠️ Tech Stack

| Category         | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, React Router, Axios                          |
| **Backend** | Node.js, Express.js                                                     |
| **Database** | MongoDB (with Mongoose)                                                 |
| **Authentication**| JWT (JSON Web Tokens), bcrypt.js, cookie-parser                         |
| **AI / NLP** | Google Gemini API (for vision analysis and chat)                        |
| **Image Storage**| Cloudinary                                                              |
| **Payments** | Razorpay                                                                |
| **Deployment** | **Frontend:** Vercel, **Backend:** Render                               |

---

## 🚀 Installation and Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/subzisahayak.git](https://github.com/your-username/subzisahayak.git)
cd subzisahayak
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory and add the following variables:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env file in the /client directory and add the following:
VITE_API_BASE_URL=/api
```

---

## 🏃‍♂️ Usage

You need to run both the backend and frontend servers simultaneously in two separate terminals.

**Terminal 1 (Backend):**

```bash
cd server
npm run dev
# Server will be running on http://localhost:3000
```

**Terminal 2 (Frontend):**

```bash
cd client
npm run dev
# Application will open on http://localhost:5173 (or another available port)
```

The frontend is configured to proxy API requests to the backend, so everything should work seamlessly.

---

## 🌐 Deployment

This application is designed to be deployed with a split architecture:

* **Backend (Render):** The Node.js server is deployed as a "Web Service" on Render. All environment variables must be configured in the Render dashboard.
* **Frontend (Vercel):** The React application is deployed on Vercel. The `VITE_API_BASE_URL` environment variable must be set to the live Render backend URL.

Remember to update the CORS configuration in `server/server.js` to allow requests from your live Vercel domain.
