import mongoose from "mongoose"

export const DatabaseConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log(`Database Connected Successfully`))
    .catch((e) => console.log(`Error while database connection : ${e}`))
}
