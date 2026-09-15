import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alighs-ware';
    await mongoose.connect(connUri);
    console.log(`[Database] MongoDB Connected to ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[Database Error]', error);
    process.exit(1);
  }
}
