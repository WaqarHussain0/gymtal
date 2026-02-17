"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import PlanDialog from "@/components/feature/plans/Plan.dialog";
import PlanTable from "@/components/feature/plans/Plan.table";
import { Button } from "@/components/ui/button";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface IPlanWrapper {
    plans: any[];
}

const PlanWrapper: React.FC<IPlanWrapper> = ({ plans }) => {

    const [showPlanDialog, setShowPlanDialog] = useState<boolean>(false);
    const handleCloseDialog = useCallback(() => setShowPlanDialog((prev) => !prev), [])
    return (
        <div className="w-full space-y-3">


            <Row className="justify-between">
                <Row className="flex-col gap-2 items-start">

                    <h1 className="text-2xl font-bold">
                        Membership Plans
                    </h1>
                    <p>Manage your gym membership plans and pricing</p>
                </Row>


                <Button onClick={handleCloseDialog}>
                    <PlusIcon className="size-4" />
                    Add Plan

                </Button>

            </Row>
            <CustomBreadcrumb
                items={[
                    { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                    { label: "Membership Plans" },
                ]}
            />

            <PlanTable plans={plans || []} />


            <PlanDialog
                open={showPlanDialog}
                onClose={handleCloseDialog}
            />
        </div>
    )
}

export default PlanWrapper;