# Lighthouse Reports

This folder contains Lighthouse performance, accessibility, best practices, and SEO reports for all major pages of the Next.js frontend. The goal is to achieve a score of 95+ on every page.

## Pages to Audit
- /
- /login
- /register
- /dashboard
- /profile
- /mentors
- /bookings
- /bookings/new (if routed)
- /book/[mentorId]

Each report should be named after the route, e.g. `home.html`, `login.html`, etc.

## How to Generate
You can use the Chrome DevTools Lighthouse panel or the CLI:

```sh
npx lighthouse http://localhost:3000/ --output html --output-path=frontend/lighthouse/home.html
```

Repeat for each route, replacing the URL and output path accordingly. 