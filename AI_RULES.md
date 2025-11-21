# AI Rules for SMedia Application

This document outlines the technical stack and specific library usage guidelines for the SMedia application. Adhering to these rules ensures consistency, maintainability, and efficient development.

## Tech Stack Overview

The SMedia application is built using the following core technologies:

*   **Next.js**: A React framework for building full-stack web applications, enabling server-side rendering, static site generation, and API routes.
*   **React**: The primary JavaScript library for building user interfaces.
*   **TypeScript**: Used for type safety and improved developer experience. All new code should be written in TypeScript.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling components with highly customizable classes.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI primitives.
*   **Prisma**: An open-source ORM (Object-Relational Mapper) for Node.js and TypeScript, used for database access and management.
*   **Stack Auth (@stackframe/stack)**: The chosen solution for authentication and user management.
*   **Cloudinary**: A cloud-based image and video management service, used for handling media uploads and transformations.
*   **`react-hot-toast`**: A lightweight and customizable library for displaying toast notifications.
*   **`date-fns`**: A modern JavaScript date utility library for parsing, validating, manipulating, and formatting dates.
*   **`lucide-react` / `react-icons`**: Libraries for incorporating scalable vector icons into the application.
*   **AOS (Animate On Scroll)**: A JavaScript library to animate elements on scroll.
*   **`next-themes`**: A library for managing light and dark themes in Next.js applications.
*   **`node-telegram-bot-api`**: Used for integrating with Telegram to send notifications or messages.

## Library Usage Guidelines

To maintain consistency and leverage the strengths of each library, please follow these guidelines:

*   **UI Components**:
    *   **Primary Choice**: Always prioritize `shadcn/ui` components for common UI elements (buttons, dialogs, forms, etc.).
    *   **Custom Components**: If a `shadcn/ui` component doesn't fit the exact requirement or needs extensive modification, create a new, dedicated component in `src/components/` using Tailwind CSS. Do not modify `shadcn/ui` source files directly.
*   **Styling**:
    *   **Framework**: Use Tailwind CSS exclusively for all styling.
    *   **Utility**: Utilize `clsx` and `tailwind-merge` for conditionally applying and merging Tailwind classes.
*   **Authentication**:
    *   **Library**: All authentication-related functionalities (sign-in, sign-up, user sessions) must use `@stackframe/stack`.
*   **Database Interactions**:
    *   **ORM**: Use Prisma for all database queries, migrations, and schema management.
    *   **Server Actions**: All database operations should be encapsulated within Next.js Server Actions (`"use server"`).
*   **Media Management**:
    *   **Uploads**: Cloudinary is the designated service for all image and video uploads. Ensure proper API key handling and signature generation.
*   **Notifications**:
    *   **Toasts**: Use `react-hot-toast` for all in-app notifications (success, error, loading messages). The `showToast` utility in `lib/utils/toast.js` should be used.
*   **Icons**:
    *   **Preference**: Prefer `lucide-react` for icons, especially when integrating with `shadcn/ui` components.
    *   **Fallback**: If a specific icon is not available in `lucide-react`, `react-icons` can be used as an alternative.
*   **Date & Time**:
    *   **Utility**: Use `date-fns` for all date and time formatting, manipulation, and calculations.
*   **Theming**:
    *   **Library**: `next-themes` is used for managing light and dark modes. The `ThemeProvider` component should wrap the application.
*   **Animations**:
    *   **Scroll Animations**: Use AOS (Animate On Scroll) for elements that should animate into view as the user scrolls.
*   **Telegram Integration**:
    *   **API**: Use `node-telegram-bot-api` for sending messages to Telegram, primarily for administrative notifications or logging.
*   **File Structure**:
    *   `app/`: Next.js App Router pages and layouts.
    *   `src/components/`: For reusable UI components.
    *   `src/lib/actions/`: For Next.js Server Actions.
    *   `src/lib/utils/`: For general utility functions.
    *   `stack/`: For Stack Auth client/server configurations.
*   **Code Quality**:
    *   **TypeScript**: All new files and significant modifications should be written in TypeScript for type safety.
    *   **Responsiveness**: Always design and implement components with responsiveness in mind, utilizing Tailwind's responsive utilities.
    *   **Simplicity**: Prioritize simple, elegant, and maintainable code. Avoid over-engineering.
    *   **Error Handling**: Allow errors to bubble up naturally; do not use `try/catch` blocks unless specifically requested or for user-facing toast notifications.
    *   **Component Granularity**: Create small, focused components (ideally <= 100 lines of code) in their own files.