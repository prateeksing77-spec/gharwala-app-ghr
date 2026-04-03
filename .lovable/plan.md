## Phase 1: Database Schema & RLS
- Create all 9 tables (profiles, serviceable_areas, categories, products, addresses, orders, favorites, notifications, notify_requests)
- Insert serviceable areas data
- Enable RLS on all tables with proper policies

## Phase 2: Theme & Design System
- Update index.css with green (#22c55e) primary, light/dark mode CSS variables
- Update tailwind.config.ts
- Add theme toggle provider (next-themes)

## Phase 3: Core App Structure
- Splash screen with animated logo
- Area selection screen (reads from serviceable_areas table)
- Auth screen (phone + mock OTP)
- New bottom nav (5 tabs: Home, Categories, Cart, Orders, Account)
- Framer Motion page transitions
- Loading skeletons

## Phase 4: Screens
- Home page (banners, categories, products)
- Categories page
- Cart page (with badge count)
- Orders page
- Account page

This is a large rebuild. I recommend we tackle it in 2-3 messages. Shall I start with Phases 1-3 (database + theme + core structure)?
