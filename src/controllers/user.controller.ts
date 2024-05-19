import { Request, Response } from "express"
import { User } from "../models/user.model"

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { auth0Id } = req.body
    const existUser = await User.findOne({ auth0Id })

    if (existUser) {
      return res.status(200).send()
    }
    const newUser = new User(req.body)
    await newUser.save()
    res.status(201).json(newUser.toObject())
  } catch (error) {
    console.log("Error While create User ", error)
    res.status(500).json({ message: "Error creating user" })
  }
}
