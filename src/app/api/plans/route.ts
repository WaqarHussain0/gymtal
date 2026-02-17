import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const dummyPlans = [
            {
                _id: "1",
                name: "Basic",
                duration: 30,
                price: 1000,
                members:21,
                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            {
                _id: "2",
                name: "Premium",
                duration: 30,
                price: 1000,
                members:11,

                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            
            {
                _id: "3",
                name: "Pro",
                duration: 30,
                price: 1000,
                members:10,

                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            {
                _id: "4",
                name: "Enterprise",
                duration: 30,
                price: 1000,
                members:14,
                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            {
                _id: "5",
                name: "Gold",
                duration: 30,
                price: 1000,
                members:14,
                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            {
                _id: "6",
                name: "Platinum",
                duration: 30,
                price: 1500,
                members:14,
                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
            {
                _id: "7",
                name: "Silver",
                duration: 30,
                price: 1200,
                members:14,
                features:['Access to all classes', 'Access to all equipment', 'Access to all amenities'],
            },
        ];
        return NextResponse.json({ plans: dummyPlans }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching users:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
