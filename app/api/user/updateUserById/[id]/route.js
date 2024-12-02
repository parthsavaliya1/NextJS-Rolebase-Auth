import User from '../../../../../models/user';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    const { id } = params;
    const { roleId } = await request.json();
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // If 'role' is a reference to another collection (MongoDB ObjectId)
      user.role = roleId;  // Just store the roleId directly, if it's a reference to a Role model
  
      // If 'role' contains an object with more data, assign the whole object
      // user.role = { _id: roleId };  // Or fetch the role and assign its object
  
      await user.save();
  
      return NextResponse.json({ message: 'User role updated successfully' }, { status: 200 });
  
    } catch (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }