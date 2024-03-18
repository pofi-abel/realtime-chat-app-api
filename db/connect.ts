import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI as string);
  } catch (error) {
    throw error
  }
};

export default connectMongoDb;