import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "dotenv"
import { DatabaseConnection } from "./data/database"
import userRoutes from "./routes/user.routes"
import myRestaurantRoutes from "./routes/restaurant.routes"
import { v2 as cloudinary } from "cloudinary"

DatabaseConnection()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
config({ path: ".env" })
app.use(cors())

app.use(express.json())

app.get("/api", async (req: Request, res: Response) => {
  res.json({ message: "Api working" })
})

app.use("/api/user", userRoutes)
app.use("/api/restaurant", myRestaurantRoutes)

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`)
})
