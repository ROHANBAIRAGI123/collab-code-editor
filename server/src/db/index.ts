import mongoose from "mongoose";
import "@dotenvx/dotenvx/config";

const DB_NAME = process.env.DB_NAME;
const MONGODB_URI = process.env.MONGODB_URI;
const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(
      `Database connected succesfully ! \n Name: ${connection.connection.name}`
    );
  } catch (error) {
    console.log(`Database not connected, ${error}`);
    process.exit(1);
  }
};

export default connectDB;
