import Role from '../../../../../models/role';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ error: 'role not found' }, { status: 404 });
    }

    // Return the user data along with the populated role
    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
