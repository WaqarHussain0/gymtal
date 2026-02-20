import { NextRequest, NextResponse } from "next/server";
import { CreateUserDto } from "@/backend/modules/user/dto/create-user.dto";

import "reflect-metadata";
import { GymMemberService } from "@/backend/modules/user/services/gym-member.service";
import { validateDto } from "@/backend/utils/input-validator.util";


const gymMemberService = new GymMemberService();
export async function POST(req: NextRequest) {
    try {
        // Parse JSON body
        const body = await req.json();
        const { user, membershipPeriod, paymentTransaction, createdByUserId } = body;

        if (!user || !membershipPeriod || !paymentTransaction || !createdByUserId) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const {
            startDate,
            endDate
        } = membershipPeriod;


        const { amount, paymentMethod, paymentDate } = paymentTransaction;




        // Transform to DTO and validate
        const userDto = await validateDto(CreateUserDto, user);

        // Create user using the service
        const response = await gymMemberService.enrollNewMember(userDto, amount, createdByUserId);

        // Return success response
        return NextResponse.json({ user: response }, { status: 201 });
    } catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error creating user:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}