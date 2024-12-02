import mongoose from 'mongoose';

const connectMongo = async () => {
  // Check if the code is being run in a server-side environment
  if (typeof window !== "undefined") {
    return;
  }

  // If MongoDB connection is not established, connect it
  if (mongoose.connection.readyState === 0) {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://root:root@bootcamp.379hf.mongodb.net/nextauth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else {
  }
};

export default connectMongo;
