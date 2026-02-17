import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const dummyMembers = [
            {
                _id: "1",
                name: "Basic",
                email: "john.doe@example.com",
                phone: "1234567890",
                plan: {
                    _id: "1",
                    name: "Basic",
                }
                
            },
           {
            _id: "2",
            name: "Jane Doe",
            email: "jane.doe@example.com",
            phone: "1234567890",
            plan: {
                _id: "1",
                name: "Premium",
            }
           },
           {
            _id: "3",
            name: "Jim Beam",
            email: "jim.beam@example.com",
            phone: "1234567890",    
            plan: {
                _id: "1",
                name: "Pro",
            }
           },
           {
            _id: "4",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            plan: {
                _id: "1",
                name: "Enterprise",
            }
           },
           {
            _id: "5",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            plan: {
                _id: "1",
                name: "Gold",
            }
           },
           {
            _id: "6",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            plan: {
                _id: "1",
                name: "Gold",
            }
           },
          
          
        ];
        return NextResponse.json({ members: dummyMembers }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching users:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
