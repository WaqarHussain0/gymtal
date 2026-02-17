import { UserService } from "@/backend/modules/user/user.service";
import { NextRequest, NextResponse } from "next/server";

import "reflect-metadata";

const userService = new UserService();

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {

    const { id } = await params;

    try {
        
         // Parse JSON body
         const body = await req.json();

 
         // Update user using the service
         const user = await userService.updateUser(id, body);
 
         // Return success response
         return NextResponse.json({ user }, { status: 201 });

    } catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error updating user:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
  }


  export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const { id } = await params;
    try {
        // Delete user using the service
        const user = await userService.deleteUser(id);
        return NextResponse.json({ user }, { status: 201 });
    }
    catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error deleting user:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
  }