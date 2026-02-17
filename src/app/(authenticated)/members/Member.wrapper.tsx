"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import MemberTable from "@/components/feature/members/Member.table";
import { Button } from "@/components/ui/button";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { PlusIcon } from "lucide-react";

interface IMemberWrapper {
    members: any[];
}

const MemberWrapper: React.FC<IMemberWrapper> = ({ members }) => {
    return (
        <div className="w-full space-y-3">


            <Row className="justify-between">
                <Row className="flex-col gap-2 items-start">

                    <h1 className="text-2xl font-bold">
                        Members
                    </h1>
                    <p>Manage your gym members</p>
                </Row>


                <Button>
                    <PlusIcon className="size-4" />
                    Add Member

                </Button>

                </Row>
                <CustomBreadcrumb
                    items={[
                        { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                        { label: "Members" },
                    ]}
                />

<MemberTable members={members || []} />

        </div>
    )
}

export default MemberWrapper;