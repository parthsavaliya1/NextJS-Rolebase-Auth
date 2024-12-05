import { NextResponse } from 'next/server';
import Role from "../../../../../models/role";

export async function PUT(request, { params }) {
  const { id } = params;
  const { permissions } = await request.json();

  try {
    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Convert incoming permissions to a Map and merge with existing Map
    const sanitizedPermissions = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitizedPermissions.set(key, value);
      }
    }

    for (const [key, value] of role.permissions.entries()) {
      if (!sanitizedPermissions.has(key)) {
        sanitizedPermissions.set(key, value);
      }
    }

    role.permissions = sanitizedPermissions;
    await role.save();

    return NextResponse.json({ message: 'Permissions updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
