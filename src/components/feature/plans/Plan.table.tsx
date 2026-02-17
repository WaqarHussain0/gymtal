"use client";

import Row from "@/components/common/Row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, Edit2, Trash2 } from "lucide-react";

interface IPlanTable {
    plans: any[];
}

const PlanTable: React.FC<IPlanTable> = ({ plans }) => {
    const handleEdit = (plan: any) => {
        console.log("Edit:", plan);
    };
    const handleDelete = (plan: any) => {
        console.log("Delete:", plan);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {plans.map((plan) => (
                <Card
                    key={plan._id}
                    className="relative gap-2 pt-4 pb-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out border border-gray-100 rounded-xl overflow-hidden"
                >
                    <CardHeader className="">
                        <CardTitle className="text-lg font-semibold">{plan?.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-2xl md:text-3xl font-bold text-indigo-600">{plan?.price} PKR</span>
                                <Badge variant="outline">{plan?.duration} days</Badge>
                                <Badge variant="secondary">{plan?.members} members</Badge>
                            </div>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-2">
                            <h2>Features:</h2>
                            {plan?.features.map((feature: string) => (
                                <Row key={feature} className="gap-2">
                                    <CircleCheck className="text-green-400 size-5" />
                                    <p>{feature}</p>
                                </Row>
                            ))}
                        </div>
                    </CardContent>

                    <div className=" w-full flex justify-end gap-2 bg-gray-50 p-2 border-t border-gray-100">
                        <Button onClick={() => handleEdit(plan)} variant="outline">
                            <Edit2 size={18} />
                        </Button>
                        <Button onClick={() => handleDelete(plan)} variant="destructive">
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default PlanTable;
