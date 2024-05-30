import express from "express"
import multer from "multer"
import { createRestaurant } from "../controllers/restaurant.controller"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import { validateRestaurantRequest } from "../middlewares/validation"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
})
router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  createRestaurant
)

export default router
