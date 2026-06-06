import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#F9FAFB',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
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
