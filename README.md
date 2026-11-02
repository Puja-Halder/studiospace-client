# StudioSpace — Creative Workspace Marketplace

StudioSpace is a peer-to-peer marketplace where photographers, filmmakers, podcasters, musicians, and other creators can discover and book creative workspaces. Studio owners can list and manage their spaces, while creators can explore available studios and manage their reservations.

## Live Website

**Live URL:** [Add your deployed website URL]

## Features

- **User Authentication:** Secure registration, login, and session management using Better Auth.
- **Explore Studios:** Browse available creative spaces and search or filter studio listings.
- **Studio Details:** View studio information, pricing, location, and availability.
- **Studio Management:** Hosts can create, edit, deactivate, reactivate, and permanently delete their listings.
- **Booking System:** Customers can reserve studios and view their booking history.
- **Booking Management:** Hosts can review booking requests and confirm or reject reservations.
- **Responsive Design:** Interface designed for desktop, tablet, and mobile devices.
- **Notifications:** User feedback through toast notifications and custom dialogs.

## Technology Stack

### Frontend
- Next.js (App Router)
- JavaScript
- Tailwind CSS
- Shadcn UI
- Lucide React
- Sonner
- Swiper.js

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Better Auth

## Project Repositories

- **Client:** [Add client GitHub repository URL]
- **Server:** [Add server GitHub repository URL]

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or MongoDB connection
- Git

### 1. Clone the repositories

Clone the client and server repositories into your local machine.

### 2. Configure the Backend

Open a terminal in the server project directory:

```bash
cd studiospace-server
npm install
```

Create a `.env` file in the server directory and configure:

```env
PORT=5000
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret
MONGODB_URI=your_mongodb_connection_string
```

Use your own secure values. Never publish your actual environment variables.

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal in the client project directory:

```bash
cd studiospace-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

Visit:

http://localhost:3000

Make sure both the frontend and backend development servers are running.



## Author

