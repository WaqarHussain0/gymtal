import { NextRequest, NextResponse } from "next/server";
import { PlanService } from "@/backend/modules/plan/plan.service";
import { CreatePlanDto } from "@/backend/modules/plan/dto/create-plan.dto";
import { validateDto } from "@/backend/utils/input-validator.util";

import "reflect-metadata";

const planService = new PlanService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const dto = await validateDto(CreatePlanDto, body);

        const plan = await planService.createPlan(dto);

        return NextResponse.json({ plan }, { status: 201 });
    } catch (err: any) {
        console.error("Error creating plan:", err);
        return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const plans = await planService.findAll();

        return NextResponse.json({ plans }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching plans:", err);
        return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 400 });
    }
}
