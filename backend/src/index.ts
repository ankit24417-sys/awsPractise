import "dotenv/config";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { prisma } from "./config/db.js";
import { user } from "./utils/dto.js";
const app: Application = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on the port:${port}`);
});

app.use(express.json());

app.post("/create", async (req: Request, res: Response) => {
  const { name, email, password, mob, age } = req.body;
  if (!name || !email || !password) return res.json("all fields are required");
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      age,
      mob,
    },
  });
});
