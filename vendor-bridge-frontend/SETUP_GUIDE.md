# VendorBridge Landing — Setup Guide

## Step 1: Copy your Lovable files

Go to Lovable → your project → each file in the Details panel.
Copy the code and paste into the matching file in:

  src/components/landing/

| Lovable File   | Paste into                              |
|----------------|-----------------------------------------|
| Navbar.jsx     | src/components/landing/Navbar.jsx       |
| Hero.jsx       | src/components/landing/Hero.jsx         |
| Stats.jsx      | src/components/landing/Stats.jsx        |
| Features.jsx   | src/components/landing/Features.jsx     |
| HowItWorks.jsx | src/components/landing/HowItWorks.jsx   |
| Roles.jsx      | src/components/landing/Roles.jsx        |
| CTA.jsx        | src/components/landing/CTA.jsx          |
| Footer.jsx     | src/components/landing/Footer.jsx       |

NOTE: Logo.jsx — if Lovable made a separate Logo component,
      paste it into src/components/landing/Logo.jsx
      and import it inside Navbar.jsx.

## Step 2: Install and run

  npm install
  npm run dev

Open: http://localhost:5173

## Step 3: Build for production

  npm run build
  npm run preview
