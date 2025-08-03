# 🚀 CodeBrosPlatform

A modern **LinkedIn-style networking platform for developers**, built with **React**, **TypeScript**, **Express.js**, and **MongoDB**.
**CodeBros** empowers developers to **connect**, **collaborate**, and **grow together** in a clean, responsive, and developer-focused environment.

---

## 📚 Table of Contents

- [🚀 CodeBrosPlatform](#-codebrosplatform)
  - [📚 Table of Contents](#-table-of-contents)
  - [📖 About](#-about)
  - [✨ Features](#-features)
  - [🗂 Project Structure](#-project-structure)
  - [⚙️ Prerequisites](#️-prerequisites)
  - [🚀 Installation \& Setup](#-installation--setup)
  - [🛠 Usage](#-usage)
  - [📜 Available Scripts](#-available-scripts)
  - [🤝 Contributing](#-contributing)
    - [Quick Start:](#quick-start)
  - [❓ FAQ](#-faq)
  - [📄 License](#-license)
  - [🙌 Support the Project](#-support-the-project)

---

## 📖 About

**CodeBrosPlatform** is a developer-centric professional networking platform inspired by LinkedIn. It provides a place for developers to showcase their skills, grow their network, and collaborate on exciting projects — all in a stylish, theme-switchable interface powered by a modern tech stack.

Built with **MongoDB** for persistent data storage, the platform provides robust data management with full type safety and optimized performance for production use.

---

## ✨ Features

✅ **Developer Profiles** — Highlight skills, experience, and featured projects
🔍 **Advanced Search** — Filter developers by skills, experience, and more
🤝 **Connections** — Send, accept, and manage connection requests
🌗 **Theme Switcher** — Toggle between dark and light modes
📱 **Fully Responsive** — Smooth experience across desktop and mobile
🗄️ **MongoDB Backend** — Persistent data storage with optimized indexing
⚡ **Type Safety** — Full TypeScript support with Zod validation
🔒 **Production Ready** — Scalable architecture with proper error handling

---

## 🗂 Project Structure

```
CodeBrosPlatform/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI components (cards, modals, etc.)
│   │   ├── pages/         # App pages (home, profile, network, etc.)
│   │   ├── lib/           # Utility functions and helpers
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # Main HTML template
├── server/                # Express backend
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API route handlers
│   ├── db/                # Database layer
│   │   ├── mongo.ts       # MongoDB storage implementation
│   │   └── seed.ts        # Database seeder with sample data
│   └── storage.ts         # File storage implementation
├── shared/                # Shared types and schemas
│   ├── types.ts           # TypeScript type definitions
│   └── mongo-schema.ts    # Zod schemas for validation
├── dev.bat                # Windows development startup script
├── start.bat              # Windows production startup script
├── drizzle.config.ts      # ORM config (optional/future use)
├── tailwind.config.ts     # TailwindCSS configuration
├── package.json           # Project metadata and scripts
└── README.md              # You're reading it!
```

---

## ⚙️ Prerequisites

Before getting started, make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (v5.0 or higher) or [MongoDB Atlas](https://www.mongodb.com/atlas) account
* [Git](https://git-scm.com/)

---

## 🚀 Installation & Setup

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/CodeBrosPlatform.git
cd CodeBrosPlatform
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up MongoDB**

   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB locally (varies by OS)
   # Windows: choco install mongodb
   # macOS: brew install mongodb-community
   # Linux: sudo apt-get install mongodb
   
   # Start MongoDB service
   mongod
   ```

   **Option B: MongoDB Atlas (Recommended for production)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

4. **Configure Environment**

   Create a `.env` file in the root directory:
   ```bash
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=codebros
   NODE_ENV=development
   PORT=5000
   
   # Or for MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codebros?retryWrites=true&w=majority
   ```

5. **Seed the Database**

   ```bash
   npm run db:seed
   ```

6. **Start the Development Server**

   * **Windows (Recommended)**
     ```bash
     dev.bat
     ```

   * **Cross-platform Manual Start**
     ```bash
     set NODE_ENV=development && tsx server/index.ts
     ```

7. **Access the App**
   Open your browser and go to:
   [http://localhost:5000](http://localhost:5000)

---

## 🛠 Usage

* 🧑 Create or log in as a developer
* 📝 Set up your profile with skills, bio, and experience
* 🔍 Discover and connect with fellow developers
* 📩 Send and manage connection requests
* 🌗 Toggle between dark/light themes
* 💬 Start networking and collaborating!

---

## 📜 Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `dev.bat`         | Starts dev server (Windows-friendly) |
| `start.bat`       | Starts production build (Windows)    |
| `npm run build`   | Builds frontend for production       |
| `npm run check`   | Type-check using TypeScript          |
| `npm run db:seed` | Seeds MongoDB with sample data       |

---

## 🤝 Contributing

We welcome all kinds of contributions — bug reports, feature requests, documentation updates, and code!

### Quick Start:

1. 🍴 Fork the repository
2. 🔧 Create a feature branch:

   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. 💾 Make your changes and commit:

   ```bash
   git commit -m "Add my awesome feature"
   ```
4. 🚀 Push to your fork and create a PR

Check out the [CONTRIBUTION.md](CONTRIBUTION.md) for full guidelines.

---

## ❓ FAQ

**Q: Is this production-ready?**

> Yes! The platform uses a persistent MongoDB backend with proper indexing, type safety, and error handling. It's designed for scalability and production deployment.

**Q: How do I reset all data?**

> You can drop the MongoDB database or run the seeder again. For local development: `mongo codebros --eval "db.dropDatabase()"` then `npm run db:seed`.

**Q: Can I use this for my own startup or project?**

> Yes! Just remember to provide attribution to the original repository.

**Q: Do I need MongoDB Atlas or can I use local MongoDB?**

> Both work! Local MongoDB is fine for development, but MongoDB Atlas is recommended for production deployment.

**Q: How do I add new database features?**

> Update the schemas in `shared/mongo-schema.ts`, add methods to `server/db/mongo.ts`, update routes, and run migrations if needed.

---

## 📄 License

This project is licensed under the **MIT License**.
You're free to use, modify, and distribute this software with attribution.
See the full [LICENSE](LICENSE) file for more details.

---

## 🙌 Support the Project

If you found this project helpful or interesting, please consider giving it a ⭐ on GitHub. It helps others discover it too!

---

**Let's Code. Connect. Collaborate. 🚀**

---

git commit -m "docs: update readme to reflect mongodb backend Corrects outdated references to "in-memory storage" in the main README file, accurately reflecting the project's persistent MongoDB implementation."