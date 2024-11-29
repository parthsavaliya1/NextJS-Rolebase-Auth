import connectDB from '../../lib/mongo';

export async function MyServerAction() {
  await connectDB();
}
