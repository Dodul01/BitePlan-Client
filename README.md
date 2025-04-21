# MealBox Client

MealBox Client is a web application designed to provide users with an intuitive interface for browsing, searching, and ordering meals online. This project demonstrates a modern approach to building scalable and maintainable web applications.

## Project Overview

The project was developed following best practices in frontend development, focusing on modularity, reusability, and responsive design. The application interacts with a backend API to fetch meal data, manage user authentication, and handle orders.

## Features

- **User Authentication**: Secure registration and login using JWT-based authentication.
- **Meal Browsing**: Explore a wide variety of meals with detailed descriptions and images.
- **Search & Filter**: Quickly find meals using search functionality and category filters.
- **Cart Management**: Add, remove, and update meal quantities in a persistent shopping cart.
- **Order Placement**: Seamlessly place orders and view order summaries.
- **User Profile**: Manage account details and view order history.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
- **Error Handling**: User-friendly error messages and loading indicators for a smooth experience.

## Technologies Used

- **Next.js**: For building the user interface using reusable components.
- **TypeScript**: For type safty.
- **Tailwind CSS**: For rapid and responsive UI styling.
- **Context API**: For state management across the application.
- **JWT Authentication**: For secure user login and session management.
- **Vite**: For fast development and optimized builds.

## How the Project Was Built

1. **Project Setup**: Initialized with Vite and configured with React and Tailwind CSS.
2. **Component Design**: Developed modular components for meals, cart, authentication, and navigation.
3. **API Integration**: Used service function to connect with the backend, handling data fetching and error management.
4. **State Management**: Implemented Context API for managing user and cart state globally.
5. **Authentication**: Integrated JWT-based authentication for secure access to user-specific features.
6. **Responsive Design**: Ensured the application is fully responsive across devices using Tailwind CSS.

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Replace the env with you credentials.
4. Start the development server using `npm run dev`.
5. Configure the backend API endpoint in the environment variables if needed.
