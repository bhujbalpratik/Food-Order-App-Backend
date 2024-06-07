import express from "express"
import {
  createUser,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controller"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import { validateMyUserRequest } from "../middlewares/validation"

const router = express.Router()

router.post("/create", jwtCheck, createUser)
router.put("/update", jwtCheck, jwtParse, validateMyUserRequest, updateUser)
router.get("/currentuser", jwtCheck, jwtParse, getCurrentUser)

export default router
