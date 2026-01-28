# FormVibe 🚀

**FormVibe** is a minimal, serverless-first form backend for modern web developers. Simple, fast, and Vercel-native.

## ✨ Features
- **Zero-Config Endpoint**: Point your form `action` and start collecting data.
- **Edge Performance**: Ultra-low latency submission processing on the Vercel Edge.
- **Vercel-Native**: 100% serverless architecture with No DevOps overhead.
- **Spam Protection**: Built-in honeypot and rate limiting via Upstash.
- **Glassmorphism Dashboard**: A premium UI to manage forms and review submissions.

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: Drizzle ORM + PostgreSQL (Neon/Supabase)
- **KV Store**: Upstash Redis (Rate Limiting)
- **Auth**: Auth.js v5
- **Styling**: Tailwind CSS + Framer Motion

## 🚀 Deployment (Vercel)

### 1. Environment Variables
Add these to your Vercel Project Settings:
- `DATABASE_URL`: PostgreSQL connection string.
- `UPSTASH_REDIS_URL`: URL from your Upstash console.
- `UPSTASH_REDIS_TOKEN`: Token from your Upstash console.
- `AUTH_SECRET`: Generate using `npx auth secret`.
- `INTERNAL_API_SECRET`: A secure random string for Edge-to-Serverless communication.
- `NEXT_PUBLIC_APP_URL`: Your production URL.

### 2. Implementation
1. Copy your unique endpoint URL from the Dashboard.
2. Update your form:
```html
<form action="https://your-formvibe-app.com/api/f/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" required>
  <input type="text" name="_gotcha" style="display:none"> <!-- Optional Honeypot -->
  <button type="submit">Submit</button>
</form>
```

## 📦 SDKs
- **React**: Use the `useFormVibe` hook in `sdk/react`.
- **Vanilla JS**: Include `sdk/js/vibe.js` for auto-initialization of `data-formvibe` forms.

---
Built with 💜 for developers who want zero-hassle form handling.
