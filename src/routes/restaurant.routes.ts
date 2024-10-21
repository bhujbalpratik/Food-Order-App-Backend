import express from "express"
import multer from "multer"
import {
  createRestaurant,
  getRestaurant,
  getRestaurantDetails,
  getRestaurantOrders,
  searchRestaurant,
  updateOrderStatus,
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

router.get("/orders", jwtCheck, jwtParse, getRestaurantOrders)
router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus)

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId parameter must be valid string"),
  getRestaurantDetails
)

export default router
