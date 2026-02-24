"use client";
import Row from "@/components/common/Row";
import TextElement from "@/components/common/TextElement";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCog, Users } from "lucide-react";
import { useSession } from "next-auth/react";


interface IDashboardWrapperProps {
    adminUsers: number;
    staffUsers: number;
    memberUsers: number;
}

const DashboardWrapper: React.FC<IDashboardWrapperProps> = ({  adminUsers, staffUsers, memberUsers }) => {

    const { data: session } = useSession();
    const currentUser = session?.user;

    const userStats = [{
        label: "Total Gym Members",
        description: "Total number of members in the gym",
        value: memberUsers,
        icon: Users,
    }, {
        label: "Total Staff",
        description: "Total number of staff in the gym",
        value: staffUsers,
        icon: UserCog,
    },
    {
        label: "Total Admins",
        description: "Total number of admins in the gym",
        value: adminUsers,
        icon: Shield,
    },

    ]

    return (
        <div className="w-full space-y-3">

            <Row className="flex-col items-start">
                <TextElement as="h3" className="">Dashboard</TextElement>
                <TextElement as="p" className="sm">Welcome back, {currentUser?.name || "User"}!</TextElement>
            </Row>

            <div className="w-full gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                {userStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="w-full hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle>
                                    <Row className="justify-between">
                                        <Row className="gap-1 items-end">
                                            <Icon className="size-5 text-blue-700" />
                                            <TextElement as="h4" className="m-0 p-0">
                                                {stat.label}
                                            </TextElement>
                                        </Row>

                                        <TextElement as="h3">

                                            {stat.value}
                                        </TextElement>


                                    </Row>
                                </CardTitle>

                                <CardDescription className="">
                                    {stat.description}
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    )
                })}
            </div>

        </div>
    )
}

export default DashboardWrapper;