import { GymMemberService } from "@/backend/modules/user/services/gym-member.service";
import { NextRequest, NextResponse } from "next/server";

import "reflect-metadata";

const gymMemberService = new GymMemberService();

// update gym member subscription
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params; // gym member id
    const body = await req.json();

    const { amount, endDate, startDate, createdById } = body;

    try {
        const user = await gymMemberService.renewMembership(id, startDate, endDate, amount, createdById);
        return NextResponse.json({ user }, { status: 201 });
    }
    catch (err: any) {
        console.error("Error updating gym member subscription:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}