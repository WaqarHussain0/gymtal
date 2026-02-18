import { CreateMemberDto } from "@/backend/modules/member/dto/create-member.dto";
import { MemberService } from "@/backend/modules/member/member.service";
import { validateDto } from "@/backend/utils/input-validator.util";
import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";

const memberService = new MemberService();



export async function POST(req: NextRequest) {
    try {
        // Parse JSON body
        const body = await req.json();



        // Transform to DTO and validate
        const dto = await validateDto(CreateMemberDto, body);

        // Create user using the service
        const member = await memberService.createMember(dto);

        // Return success response
        return NextResponse.json({ member }, { status: 201 });
    } catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error creating member:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}



