import { mongoStorage } from "./mongo.js";
import { InsertUser, InsertConnection, InsertMessage } from "@shared/mongo-schema";
import { ObjectId } from "mongodb";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoStorage.connect();

    console.log("Seeding database...");

    // Sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "Dakshata_Borse",
        email: "Dakshata@example.com",
        password: "password123",
        firstName: "Dakshata",
        lastName: "Borse",
        title: "Full-Stack Developer",
        bio: "Passionate about React, Node.js, and building scalable web applications. Currently working on open-source projects and mentoring junior developers.",
        experienceLevel: "intermediate",
        skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        profileImage: "https://images.unsplash.com/photo-1536625979259-edbae645c7c3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        openToCollaborate: true,
      },
      {
        username: "Meghana_khotare",
        email: "meghana@example.com",
        password: "password123",
        firstName: "Meghana",
        lastName: "Khotare",
        title: "Backend Engineer",
        bio: "Specializing in Python, Django, and cloud architecture. Love working on API design and database optimization. Always eager to learn new technologies.",
        experienceLevel: "intermediate",
        skills: ["Python", "Django", "AWS", "Docker"],
        profileImage: "https://images.unsplash.com/photo-1592188657297-c6473609e988?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        openToCollaborate: true,
      },
      {
        username: "Visishta",
        email: "Visishta@example.com",
        password: "password123",
        firstName: "Visishta",
        lastName: "B",
        title: "Frontend Developer",
        bio: "New to the field but very enthusiastic! Learning React and JavaScript. Looking for mentorship and collaboration opportunities on beginner-friendly projects.",
        experienceLevel: "beginner",
        skills: ["JavaScript", "React", "HTML/CSS", "Git"],
        profileImage: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?q=80&w=716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        openToCollaborate: true,
      },
      {
        username: "Komal",
        email: "Komal@example.com",
        password: "password123",
        firstName: "Komal",
        lastName: "S",
        title: "DevOps Engineer",
        bio: "Infrastructure specialist with expertise in Kubernetes, CI/CD, and cloud platforms. Passionate about automation and helping teams ship faster.",
        experienceLevel: "professional",
        skills: ["Kubernetes", "Docker", "Jenkins", "Terraform"],
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        openToCollaborate: false,
      },
      {
        username: "Alex_Developer",
        email: "alex@example.com",
        password: "password123",
        firstName: "Alex",
        lastName: "Chen",
        title: "Senior Software Engineer",
        bio: "Experienced full-stack developer with 8+ years in the industry. Specialized in microservices, cloud-native applications, and team leadership.",
        experienceLevel: "professional",
        skills: ["Java", "Spring Boot", "Kubernetes", "AWS", "Microservices"],
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        openToCollaborate: true,
      },
      {
        username: "Sarah_Designer",
        email: "sarah@example.com",
        password: "password123",
        firstName: "Sarah",
        lastName: "Johnson",
        title: "UX/UI Designer",
        bio: "Creative designer focused on user-centered design principles. Passionate about creating intuitive and beautiful user experiences.",
        experienceLevel: "intermediate",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        openToCollaborate: true,
      },
    ];

    // Create users and collect their IDs
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await mongoStorage.createUser(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.firstName} ${user.lastName}`);
    }

    // Create some sample connections
    if (createdUsers.length >= 4) {
      const connections: InsertConnection[] = [
        {
          requesterId: createdUsers[0]._id,
          receiverId: createdUsers[1]._id,
          status: "accepted",
          message: "Would love to collaborate on some projects!",
        },
        {
          requesterId: createdUsers[1]._id,
          receiverId: createdUsers[2]._id,
          status: "pending",
          message: "Interested in learning more about your work!",
        },
        {
          requesterId: createdUsers[0]._id,
          receiverId: createdUsers[3]._id,
          status: "accepted",
          message: "Great to connect with another developer!",
        },
        {
          requesterId: createdUsers[4]._id,
          receiverId: createdUsers[0]._id,
          status: "accepted",
          message: "Looking forward to potential collaborations!",
        },
      ];

      for (const connectionData of connections) {
        const connection = await mongoStorage.createConnection(connectionData);
        console.log(`Created connection between users`);
      }

      // Create some sample messages
      const messages: InsertMessage[] = [
        {
          senderId: createdUsers[0]._id,
          receiverId: createdUsers[1]._id,
          content: "Hey! I saw your profile and loved your work with Python and Django. Would you be interested in collaborating on a project?",
        },
        {
          senderId: createdUsers[1]._id,
          receiverId: createdUsers[0]._id,
          content: "Absolutely! I'd love to work together. What kind of project do you have in mind?",
        },
        {
          senderId: createdUsers[0]._id,
          receiverId: createdUsers[1]._id,
          content: "I'm thinking of building a developer networking platform. It would be perfect for our skills!",
        },
        {
          senderId: createdUsers[1]._id,
          receiverId: createdUsers[0]._id,
          content: "That sounds amazing! I can handle the backend with Django and you can work on the React frontend. When can we start?",
        },
        {
          senderId: createdUsers[0]._id,
          receiverId: createdUsers[3]._id,
          content: "Hi Komal! I'm impressed by your DevOps expertise. Would you be interested in helping us set up CI/CD for our project?",
        },
        {
          senderId: createdUsers[3]._id,
          receiverId: createdUsers[0]._id,
          content: "Of course! I'd be happy to help with the CI/CD setup. What tech stack are you planning to use?",
        },
      ];

      for (const messageData of messages) {
        const message = await mongoStorage.createMessage(messageData);
        console.log(`Created message`);
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoStorage.disconnect();
    process.exit(0);
  }
}

// Run the seeder
seedDatabase(); 