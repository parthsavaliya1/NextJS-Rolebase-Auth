import Role from '../../../../../models/role';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = params;
  const { permissions } = await request.json();

  try {
    
    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    role.permissions = permissions;

    await role.save();

    return NextResponse.json({ message: 'Permissions updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
