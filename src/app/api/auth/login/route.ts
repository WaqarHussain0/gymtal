

import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";
import { validateDto } from "@/backend/utils/input-validator.util";
import { LoginDto } from "@/backend/modules/auth/dto/login.dto";
import { AuthService } from "@/backend/modules/auth/auth.service";
import jwt from "jsonwebtoken";

const authService = new AuthService();


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Transform to DTO and validate
        const dto = await validateDto(LoginDto, body);

        const user = await authService.login(dto);

        // Prepare payload for JWT
        const payload = {
            id: user._id || "",
            email: user.email || "",
            role: user.role || "",
        };


        // Get JWT secret from env
        const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your_super_secret";
        const JWT_EXPIRY_HOURS = Number(process.env.NEXT_PUBLIC_JWT_EXPIRY_HOURS || "1");


        // Convert hours to seconds
        const expiresInSeconds = JWT_EXPIRY_HOURS * 60 * 60;

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });

        // Return only necessary user details + token
        const userData = {
            id: user._id || "",
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return NextResponse.json({ user: userData, accessToken: token }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
