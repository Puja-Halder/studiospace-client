# StudioSpace — Creative Workspace & Production Studio Marketplace

StudioSpace is a peer-to-peer marketplace where creators can discover, book, and manage creative workspaces and production studios. It connects studio owners with photographers, filmmakers, musicians, podcasters, and other creative professionals.

## Live Project

Coming soon.

## Features

- **User Authentication:** Register and log in using email and Google.
- **Customer and Host Roles:** Different experiences for customers and studio owners.
- **Studio Discovery:** Browse creative studios and production spaces.
- **Search and Filtering:** Find studios based on categories and search criteria.
- **Studio Details:** View studio descriptions, images, locations, pricing, and amenities.
- **Studio Management:** Hosts can create and manage their studio listings.
- **Booking System:** Customers can reserve available creative spaces.
- **My Bookings:** Customers can view and manage their bookings.
- **Host Dashboard:** Hosts can view and manage customer bookings.
- **Responsive Design:** Designed for desktop, tablet, and mobile devices.

## Studio Categories

- Photography Studio
- Recording Studio
- Podcast Studio
- Film Production Studio
- Music Studio
- Event & Exhibition Space
- Dance & Rehearsal Studio
- Fashion Studio
- Video Editing Suite
- Art & Painting Studio
- Green Screen Studio
- Creative Workshop Space

## Technology Stack

**Frontend**
- Next.js
- React
- JavaScript
- Tailwind CSS
- Lucide React
- Swiper
- Sonner
- shadcn/ui

**Backend**
- Node.js
- Express.js
- MongoDB
- Better Auth

## Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas database
- Backend server configured and running

### 1. Clone the repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd studiospace-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, replace the URL with your deployed backend API URL.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Backend Configuration

StudioSpace requires its Express backend to be running.

The backend handles authentication, database operations, and API requests.

See the backend repository for installation and configuration instructions.

## Project Structure

```text
studiospace-client/
├── app/
│   ├── add-studio/
│   ├── explore/
│   ├── host-bookings/
│   ├── login/
│   ├── my-bookings/
│   ├── my-listings/
│   ├── register/
│   ├── studio/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
├── lib/
├── public/
├── .env.local
├── next.config.mjs
├── package.json
└── README.md
```

## Future Improvements

- Production deployment
- Additional studio discovery filters
- Enhanced booking management
- Improved user profile management

## Author

Puja Halder

## License

This project was developed for educational purposes.