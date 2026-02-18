import { NextRequest, NextResponse } from "next/server";
import { MemberService } from "@/backend/modules/member/member.service";

const memberService = new MemberService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { search, page, limit } = body;

        const result = await memberService.findAll({ search, page, limit });

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching users:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
