import mongoose from "mongoose"; // import mongoose

// Connect to database
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Server connected to database ${connection.host}`); // if connection is successful, log the host name
  } catch (error) {
    console.log("some error has occurred!", error);
    process.exit(1);
  }
};

// To avoid deprecation warnings
mongoose.set("strictQuery", false);
