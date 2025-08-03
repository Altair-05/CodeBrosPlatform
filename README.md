# 🚀 CodeBrosPlatform

A modern **LinkedIn-style networking platform for developers**, built with **React**, **TypeScript**, and **Express.js**.
**CodeBros** empowers developers to **connect**, **collaborate**, and **grow together** in a clean, responsive, and developer-focused environment.

---

## 📚 Table of Contents

* [📖 About](#-about)
* [✨ Features](#-features)
* [🗂 Project Structure](#-project-structure)
* [⚙️ Prerequisites](#️-prerequisites)
* [🚀 Installation & Setup](#-installation--setup)
* [🛠 Usage](#-usage)
* [📜 Available Scripts](#-available-scripts)
* [🤝 Contributing](#-contributing)
* [❓ FAQ](#-faq)
* [📄 License](#-license)

---

## 📖 About

**CodeBrosPlatform** is a developer-centric professional networking platform inspired by LinkedIn. It provides a place for developers to showcase their skills, grow their network, and collaborate on exciting projects — all in a stylish, theme-switchable interface powered by a modern tech stack.

Built for **rapid prototyping**, the platform uses **in-memory storage**, meaning no database setup is needed — just clone, run, and explore!

---

## ✨ Features

✅ **Developer Profiles** — Highlight skills, experience, and featured projects
🔍 **Advanced Search** — Filter developers by skills, experience, and more
🤝 **Connections** — Send, accept, and manage connection requests
🌗 **Theme Switcher** — Toggle between dark and light modes
📱 **Fully Responsive** — Smooth experience across desktop and mobile
⚡ **Instant Setup** — No database required; runs on in-memory data

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
│   ├── db.ts              # In-memory database
│   └── storage.ts         # File storage simulation
├── shared/                # Shared types and schemas
│   └── schema.ts
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

3. **Start the Development Server**

* **Windows (Recommended)**

  ```bash
  dev.bat
  ```

* **Cross-platform Manual Start**

  ```bash
  set NODE_ENV=development && tsx server/index.ts
  ```

4. **Access the App**
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

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `dev.bat`       | Starts dev server (Windows-friendly) |
| `start.bat`     | Starts production build (Windows)    |
| `npm run build` | Builds frontend for production       |
| `npm run check` | Type-check using TypeScript          |

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

> Not yet — it uses in-memory storage for rapid development. To go live, integrate a real database (e.g., PostgreSQL, MongoDB).

**Q: How do I reset all data?**

> Simply restart the server. All data is stored in-memory and will be wiped.

**Q: Can I use this for my own startup or project?**

> Yes! Just remember to provide attribution to the original repository.

---

## 📄 License

This project is licensed under the **MIT License**.
You're free to use, modify, and distribute this software with attribution.
See the full [LICENSE](LICENSE) file for more details.

---

## 🙌 Support the Project

If you found this project helpful or interesting, please consider giving it a ⭐ on GitHub. It helps others discover it too!

---

**Let’s Code. Connect. Collaborate. 🚀**

---
