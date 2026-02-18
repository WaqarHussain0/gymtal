import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/backend/modules/user/user.service";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { search, page, limit } = body;

    const result = await userService.findAll({ search, page, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
