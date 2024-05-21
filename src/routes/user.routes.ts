import express from "express"
import { createUser, updateUser } from "../controllers/user.controller"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import { validateUserRequest } from "../middlewares/validation"

const router = express.Router()

router.post("/create", jwtCheck, createUser)
router.put("/update", jwtCheck, jwtParse, validateUserRequest, updateUser)

export default router
