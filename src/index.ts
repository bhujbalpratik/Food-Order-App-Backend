import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "dotenv"
import { DatabaseConnection } from "./data/database"
import userRoutes from "./routes/user.routes"

config({ path: ".env" })
DatabaseConnection()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/user", userRoutes)

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`)
})
