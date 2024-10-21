import express from "express"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import {
  createCheckoutSession,
  getMyOrders,
  stripeWebHookHandler,
} from "../controllers/order.controller"

const router = express.Router()

router.get("/", jwtCheck, jwtParse, getMyOrders)
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession
)

router.post("/checkout/webhook", stripeWebHookHandler)
export default router
