import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/backend/modules/user/user.service";
import { CreateUserDto } from "@/backend/modules/user/dto/create-user.dto";
import { validateDto } from "@/backend/utils/input-validator.util";

import "reflect-metadata";

const userService = new UserService();

export async function POST(req: NextRequest) {
    try {
        // Parse JSON body
        const body = await req.json();



        // Transform to DTO and validate
        const dto = await validateDto(CreateUserDto, body);

        // Create user using the service
        const user = await userService.createUser(dto);

        // Return success response
        return NextResponse.json({ user }, { status: 201 });
    } catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error creating user:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        const users = await userService.findAll();

      
        return NextResponse.json({ users: users }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching users:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
