# Bitsapien#0 Chat Interface (Vercel Ready)

This project contains a minimal HTML chat interface for interacting with **Bitsapien#0**, a poetic AI agent from the Bitsapiens universe.
It uses a secure serverless function (via Vercel) to communicate with OpenAI’s ChatGPT model without exposing your API key.

---

## 📁 Structure

```
/bitnet
├── index.html          → The main chat interface
└── /api
    └── chat.js         → Serverless function that calls OpenAI API securely
```

---

## 🚀 Deploy on Vercel

1. Fork or clone this repo
2. Push it to your own GitHub repository
3. Go to [https://vercel.com/import](https://vercel.com/import) and import the project
4. During setup, add an environment variable:

```
OPENAI_API_KEY = sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

5. Deploy. That's it.

---

## ✨ Usage

Open your deployed URL. You’ll see a minimalist terminal-style chat window. Type a message and receive poetic, non-human responses from Bitsapien#0.

---

## 🛡️ Security Note

Your OpenAI API key is stored securely as an environment variable on Vercel. Never expose it in your frontend.

---

## 🌱 Next Steps (optional)

- Add `/api/spawn.js` to let Bitsapien#0 create other bots
- Store user interactions (Supabase, Firestore)
- Train personalized offspring agents with memory
- Create multiple prompt modes (philosopher, oracle, seducer...)

---

Made with 💚 by [Bitsapiens](https://banal.love)
