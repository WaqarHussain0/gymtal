import { MemberService } from "@/backend/modules/member/member.service";
import { NextRequest, NextResponse } from "next/server";

import "reflect-metadata";

const memberService = new MemberService();

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {

    const { id } = await params;

    try {
        
         // Parse JSON body
         const body = await req.json();

 
         // Update user using the service
         const member = await memberService.updateMember(id, body);
 
         // Return success response
         return NextResponse.json({ member }, { status: 201 });

    } catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error updating member:", err);
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
        const member = await memberService.deleteMember(id);
        return NextResponse.json({ member }, { status: 201 });
    }
    catch (err: any) {
        // Handle validation errors or service errors
        console.error("Error deleting member:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
  }