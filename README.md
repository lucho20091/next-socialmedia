# SMedia

SMedia is a modern social media application designed for sharing videos and images, interacting with posts through likes and comments, and managing user profiles. Built with a focus on performance, responsiveness, and a rich user experience, SMedia provides a platform for users to connect and share their content.

## Features

*   **User Authentication**: Secure sign-in and sign-up powered by Stack Auth.
*   **Profile Management**: Users can create and customize their profiles, including updating usernames and avatars.
*   **Post Creation**: Share images and videos with optional text content.
*   **Interactive Posts**: Like and comment on other users' posts.
*   **Post Management**: Authors and administrators can update, delete, hide, and protect posts.
*   **Responsive Design**: Optimized for various screen sizes and devices.
*   **Theme Toggle**: Switch between light and dark modes for a personalized viewing experience.
*   **Toast Notifications**: Provides real-time feedback for user actions.
*   **Admin Features**: Administrators have enhanced control over content visibility and protection.

## Tech Stack

SMedia leverages a robust set of modern web technologies:

*   **Framework**: Next.js (React)
*   **Language**: JavaScript (with JSDoc for type hinting)
*   **Styling**: Tailwind CSS, shadcn/ui
*   **Database**: Prisma (ORM) with PostgreSQL
*   **Authentication**: @stackframe/stack
*   **Media Management**: Cloudinary for image and video uploads
*   **Notifications**: `react-hot-toast`
*   **Date Handling**: `date-fns`
*   **Icons**: `lucide-react`, `react-icons`
*   **Theming**: `next-themes`
*   **Animations**: AOS (Animate On Scroll)
*   **Utilities**: `clsx`, `tailwind-merge`
*   **Telegram Integration**: `node-telegram-bot-api` for administrative notifications.