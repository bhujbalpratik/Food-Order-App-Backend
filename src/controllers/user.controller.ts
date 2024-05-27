import { Request, Response } from "express"
import { User } from "../models/user.model"

export const createUser = async (req: Request, res: Response) => {
  try {
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.name = name
    user.addressLine1 = addressLine1
    user.city = city
    user.country = country

    await user.save()
    return res.status(200).json({ message: "User Updated" })
  } catch (error) {
    console.log(`Error while update User : ${error}`)
    res.status(500).json({ message: "Error while update user" })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.userId)
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.json(currentUser)
  } catch (error) {
    console.log(`Error while get Current User : ${error}`)
    return res.status(500).json({ message: `Something went wrong !` })
  }
}
