import { Request, Response } from "express"
import { Restaurant } from "../models/restaurant.model"
import cloudinary from "cloudinary"
import mongoose from "mongoose"

export const createRestaurant = async (req: Request, res: Response) => {
  console.log(req.body)
  console.log(req.userId)
  try {
    console.log("blah")

    const existingRestaurant = await Restaurant.findOne({ user: req.userId })
    if (existingRestaurant) {
      return res.status(409).json({ message: "User Restaurant already exist" })
    }
    console.log("before clodinary")
    const imageUrl = await uploadImage(req.file as Express.Multer.File)

    console.log("after clodinary")
    const restaurant = new Restaurant(req.body)
    console.log("mongodb")

    restaurant.imageUrl = imageUrl
    restaurant.user = new mongoose.Types.ObjectId(req.userId)

    await restaurant.save()

    res.status(201).send(restaurant)
  } catch (error) {
    console.log(`Error while create restaurant : ${error}`)
    res.status(500).json({ message: "Something went wrong" })
  }
}

const uploadImage = async (file: Express.Multer.File) => {
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataURI = `data:${image.mimetype};base64,${base64Image}`

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
  console.log(uploadResponse)

  console.log(uploadResponse.url)
  return uploadResponse.url
}

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId })
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" })

    res.status(200).json(restaurant)
  } catch (error) {
    console.log(`Error while get Restaurant : ${error}`)
    res.status(500).json({ message: "Something went wrong" })
  }
}
