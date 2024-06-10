import express from "express"
import multer from "multer"
import {
  createRestaurant,
  getRestaurant,
  searchRestaurant,
  updateRestaurant,
} from "../controllers/restaurant.controller"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import { validateMyRestaurantRequest } from "../middlewares/validation"
import { param } from "express-validator"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
})

router
  .route("/")
  .post(
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    createRestaurant
  )
  .get(jwtCheck, jwtParse, getRestaurant)
  .put(
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    updateRestaurant
  )

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city param must be valid string"),
  searchRestaurant
)

export default router
