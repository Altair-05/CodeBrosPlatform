# CodeBrosPlatform

A modern **LinkedIn-style networking platform for developers**, built using **React**, **TypeScript**, and **Express.js**.  
CodeBros helps developers **connect**, **collaborate**, and **grow together**. 🚀

---

## 📚 Table of Contents
- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)


---

## 📝 About
**CodeBrosPlatform** is a professional networking platform tailored for developers. Inspired by LinkedIn, it allows developers to showcase their skills, connect with peers, and grow their professional network. Built with a modern tech stack (React, TypeScript, Express), it features a clean UI, responsive design, and a focus on developer-centric features.

---

## 🌟 Features
- **Developer Profiles:** Showcase skills, experience, and projects.
- **Search & Filter:** Find developers by skills, experience, and more.
- **Connection Requests:** Send, accept, and manage professional connections.
- **Dark/Light Themes:** Switch between professional themes for comfort.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **In-Memory Storage:** Fast prototyping and testing (no DB setup required).

---


---

## 📁 Project Structure
```
CodeBrosPlatform/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI components (cards, modals, etc.)
│   │   ├── pages/         # App pages (home, profile, network, etc.)
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # Main HTML file
├── server/                # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # In-memory data storage
│   └── storage.ts         # File storage logic
├── shared/                # Shared types & schemas
│   └── schema.ts
├── dev.bat                # Windows dev script
├── start.bat              # Windows production script
├── drizzle.config.ts      # Drizzle ORM config (if used)
├── tailwind.config.ts     # Tailwind CSS config
├── package.json           # Project metadata and scripts
└── README.md              # This file
```

---

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

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
   - **Windows (recommended):**
     ```bash
dev.bat
     ```
   - **Manual (cross-platform):**
     ```bash
set NODE_ENV=development && tsx server/index.ts
     ```

4. **Open in Browser**
   - Visit: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Usage
- Register or log in as a developer.
- Create and update your profile (add skills, experience, etc.).
- Browse/search for other developers.
- Send and manage connection requests.
- Switch between dark and light themes.
- Explore the platform and connect with the community!

---

## 🔧 Available Scripts
- `dev.bat` - Start development server (Windows-friendly)
- `npm run build` - Build frontend for production
- `start.bat` - Start production server (Windows-friendly)
- `npm run check` - Type checking (TypeScript)

---

## 🤝 Contributing
Contributions are welcome! To get started:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -m 'Add feature' && git push origin feature/your-feature`)
5. Open a Pull Request

Please read the [CONTRIBUTION.md](CONTRIBUTION.md) for more details.

---

## ❓ FAQ
**Q: Is this production-ready?**
> No, this is a prototype with in-memory storage. For production, integrate a persistent database.

**Q: How do I reset the data?**
> Restarting the server will reset all in-memory data.

**Q: Can I use this as a template for my own project?**
> Yes! Please credit the original repo.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
You are free to use, modify, and distribute this project with attribution.


---


> _If you like this project, please ⭐ the repo!_

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>
