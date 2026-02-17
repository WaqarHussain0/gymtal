"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import UserDialog from "@/components/feature/users/User.dialog";
import UserTable from "@/components/feature/users/User.table";
import { Button } from "@/components/ui/button";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface IUserWrapper {
    users: any[];
}

const UserWrapper: React.FC<IUserWrapper> = ({ users }) => {

    const [showUserDialog, setShowUserDialog] = useState<boolean>(false);
    const handleCloseDialog = useCallback(() => setShowUserDialog((prev) => !prev), [])

    return (
        <div className="w-full space-y-3">


            <Row className="justify-between">
                <Row className="flex-col gap-2 items-start">

                    <h1 className="text-2xl font-bold">
                        Staff Users
                    </h1>
                    <p>Manage your gym staff users</p>
                </Row>


                <Button onClick={handleCloseDialog}>
                    <PlusIcon className="size-4" />
                    Add User

                </Button>

                </Row>
                <CustomBreadcrumb
                    items={[
                        { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                        { label: "Staff Users" },
                    ]}
                />

<UserTable users={users || []} />

            <UserDialog
                open={showUserDialog}
                onClose={handleCloseDialog}
            />

        </div>
    )
}

export default UserWrapper;