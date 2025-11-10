# Reflection — My Learning Experience

Working on the **FuelEU Maritime Compliance Platform** has been one of the most insightful projects I’ve completed so far. It brought together many areas — from designing a database to implementing backend APIs and building the frontend — and taught me how to integrate AI assistance without becoming reliant on it.

I learned how to properly structure a full-stack project using the **Hexagonal Architecture**, where each layer has its own clear purpose. Earlier, I used to jump straight into coding, but this time I realized the importance of separating business logic from framework-specific code. This approach made the system cleaner, easier to debug, and more scalable.  
I also explored database modeling with PostgreSQL and Prisma, built REST APIs with Node.js, and connected them to a React + Tailwind-based frontend.

Beyond coding, this project helped me think more like an engineer — breaking complex problems into smaller, testable components and ensuring each part worked before moving ahead.

---

## How AI Helped

Throughout development, I used tools like **ChatGPT** and **GitHub Copilot** mainly for guidance and quick scaffolding.  
For instance, ChatGPT helped me design the backend folder structure and initial Prisma setup, while Copilot handled repetitive parts like interfaces and small React snippets.

These tools significantly reduced setup time and gave me space to focus on understanding and improving the logic.  
However, I didn’t just copy the generated code — I went through every line, tested it, debugged errors, and built my own version. That process improved my confidence in analyzing and refining AI-generated code.

---

## Challenges and What I Learned

Not everything worked perfectly the first time.  
Some challenges included:
- Environment variable issues with Prisma’s `DATABASE_URL`.
- Routing problems that caused a few API calls to fail.
- Handling empty or error-prone API responses in the frontend.

Instead of getting frustrated, I learned to troubleshoot properly — checking server logs, testing endpoints through Postman, and validating data directly in Prisma Studio. These debugging steps deepened my understanding of how all parts of the system connect.

---

## What I Plan to Improve

If I revisit this project, I would like to:
- Add proper testing — both unit and integration tests.  
- Implement role-based authentication for users and admins.  
- Deploy the entire system using Docker for easier scalability.  
- Use real-world maritime data to bring more relevance and accuracy.

---

## Final Thoughts

Working with AI made the development process smoother and faster, but it also taught me that **AI can assist — not replace — human problem-solving**.  
It’s great for structuring and automating routine work, but the core logic, design decisions, and debugging still rely on developer insight.

Overall, this project helped me grow both technically and analytically, and showed me how to collaborate effectively with AI as a tool — not a shortcut.
