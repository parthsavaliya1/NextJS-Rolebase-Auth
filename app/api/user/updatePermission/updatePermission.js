import connectMongo from '../../../../lib/mongo';
import User from '../../../../models/user';

export default async function handler(req, res) {
  const { userId } = req.query;
  const { permissions } = req.body;

  await connectMongo();

  if (req.method === 'POST') {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.permissions = permissions;  // Update permissions
      await user.save();
      res.status(200).json({ message: 'User permissions updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update permissions' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
