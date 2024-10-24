import Stripe from "stripe"
import { Request, Response } from "express"
import { MenuItemType, Restaurant } from "../models/restaurant.model"
import { Order } from "../models/order.model"

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string


export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user")

    res.json(orders)
  } catch (error) {
    console.log(`Error while get orders :`, error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string
    name: string
    quantity: string
  }[]
  deliveryDetails: {
    email: string
    name: string
    addressLine: string
    city: string
  }
  restaurantId: string
}

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const CheckoutSessionRequest: CheckoutSessionRequest = req.body
    const restaurant = await Restaurant.findById(
      CheckoutSessionRequest.restaurantId
    )

    if (!restaurant) {
      throw new Error("Restaurant not found")
    }

    const newOrder = new Order({
      restaurant: restaurant,
      deliveryDetails: CheckoutSessionRequest.deliveryDetails,
      user: req.userId,
      status: "placed",
      cartItems: CheckoutSessionRequest.cartItems,
      createdAt: new Date(),
    })

    const lineItems = createLineItems(
      CheckoutSessionRequest,
      restaurant.menuItems
    )

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    )

    if (!session.url) {
      return res.status(500).json({ message: `Error creating stripe session` })
    }

    await newOrder.save()
    res.json({ url: session.url })
  } catch (error: any) {
    console.log(`Error While create checkout session :${error}`)
    res.status(500).json({ message: error.raw.message })
  }
}

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    )

    if (!menuItem) {
      throw new Error(`Menu Item not found : ${cartItem.menuItemId}`)
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    }
    return line_item
  })

  return lineItems
}

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: { amount: deliveryPrice, currency: "inr" },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  })

  return sessionData
}

export const stripeWebHookHandler = async (req: Request, res: Response) => {
  let event
  try {
    const sig = req.headers["stripe-signature"]
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (error: any) {
    console.log(`Error While run stripe web hook :${error}`)
    return res.status(500).send(`Webhook error :${error.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.totalAmount = event.data.object.amount_total
    order.status = "paid"

    await order.save()
  }
  res.status(200).send()
}
