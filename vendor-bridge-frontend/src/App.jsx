import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      
      {/* Premium Dark-themed toast configurations */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F9FAFB',
            border: '1px solid #1F2937',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#111827',
            },
          },
        }}
      />
    </>
  );
}

export default App;