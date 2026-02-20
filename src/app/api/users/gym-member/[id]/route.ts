
import { UserService } from "@/backend/modules/user/services/user.service";
import { NextRequest, NextResponse } from "next/server";

import "reflect-metadata";

const userService = new UserService();

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    const { id } = await params;

    try {
        // Update user using the service
        const user = await userService.findById(id);

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



