import connectMongo from '../../../../lib/mongo';
import User from '../../../../models/user';
import Role from '../../../../models/role';

export default async function handler(req, res) {
  const { userId } = req.query;
  const { roleId } = req.body;

  await connectMongo();

  if (req.method === 'POST') {
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = roleId;  // Set the new role
      await user.save();
      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update role' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
