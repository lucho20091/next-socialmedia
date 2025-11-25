"use client";

import React from 'react';

export default function PostSkeleton() {
  return (
    <div className="border-y border-gray-200 dark:border-gray-800 px-4 py-6 animate-pulse">
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
        </div>
      </div>

      
      <div className="sm:ml-13 my-3 sm:mt-0">
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
      </div>

      
      <div className="sm:ml-13 mb-4 rounded-2xl bg-gray-200 dark:bg-neutral-700 h-60 w-full"></div>

      
      <div className="grid grid-cols-[2fr_2fr_1fr] sm:grid-cols-3 sm:ml-13">
        <div className="flex items-center justify-start gap-2 sm:gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-8"></div>
        </div>
        <div className="flex items-center justify-start gap-2 sm:gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>
  );
}