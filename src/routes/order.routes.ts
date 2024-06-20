import express from "express"
import { jwtCheck, jwtParse } from "../middlewares/auth"
import {
  createCheckoutSession,
  stripeWebHookHandler,
} from "../controllers/order.controller"

const router = express.Router()

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession
)

router.post("/checkout/webhook", stripeWebHookHandler)
export default router
