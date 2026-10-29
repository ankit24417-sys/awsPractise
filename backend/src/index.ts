import "dotenv/config";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { prisma } from "./config/db.js";
import type { user } from "./utils/dto.js";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Register / Create user route
app.post(["/create", "/register"], async (req: Request, res: Response) => {
  try {
    const { name, email, password, mob, age } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: String(password),
        age: age !== undefined && age !== "" && age !== null ? Number(age) : null,
        mob: mob ? String(mob).trim() : null,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user", details: error.message });
  }
});

// Login route
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const foundUser = await prisma.user.findFirst({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!foundUser || foundUser.password !== String(password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: foundUser,
    });
  } catch (error: any) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to login", details: error.message });
  }
});

// Get user by ID route (completed)
app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = Number(id);

    let foundUser;
    if (!isNaN(userId)) {
      foundUser = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else {
      // Allow lookup by email if id is not numeric
      foundUser = await prisma.user.findFirst({
        where: { email: id },
      });
    }

    if (!foundUser) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    return res.json(foundUser);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user", details: error.message });
  }
});

// Get all users route
app.get("/allUsers", async (_req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });
    return res.json(allUsers);
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
