import { PlanService } from "@/backend/modules/plan/plan.service";
import { NextRequest, NextResponse } from "next/server";

import "reflect-metadata";

const planService = new PlanService();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const plan = await planService.updatePlan(id, body);

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err: any) {
    console.error("Error updating plan:", err);
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
    const plan = await planService.deletePlan(id);
    return NextResponse.json({ plan }, { status: 201 });
  } catch (err: any) {
    console.error("Error deleting plan:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

