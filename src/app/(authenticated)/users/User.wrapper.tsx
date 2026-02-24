"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Pagination from "@/components/common/Pagination";
import Row from "@/components/common/Row";
import TextElement from "@/components/common/TextElement";
import UserDialog from "@/components/feature/users/User.dialog";
import UserTable from "@/components/feature/users/User.table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch.hook";
import { PlusIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface IUserWrapper {
    users: any[];
    meta: {
        totalPages: number;
        totalRecords: number;
        page: number;
    };
    currentPage: number;
}

const UserWrapper: React.FC<IUserWrapper> = ({ users, meta, currentPage }) => {

    const router = useRouter();

    const { searchInput, debouncedSearch, handleSearchChange } =
        useDebouncedSearch();

    const [showUserDialog, setShowUserDialog] = useState<boolean>(false);
    const handleCloseDialog = useCallback(() => setShowUserDialog((prev) => !prev), [])


    // Function to update URL query params
    const updateQueryParams = useCallback(
        (page: number, search?: string) => {
            const params = new URLSearchParams();
            if (page) params.set("page", page.toString());
            if (search) params.set("search", search);
            router.replace(`${PAGE_ROUTES.users}?${params.toString()}`);
        },
        [router]
    );



    const handlePageChange = (newPage: number) => {
        updateQueryParams(newPage, debouncedSearch);
    };

    const handleSearch = useCallback(
        (value: string) => {
            handleSearchChange(value);
            updateQueryParams(1, value);
        }, [handleSearchChange, updateQueryParams])


    return (
        <div className="w-full space-y-3">


            <Row className="justify-between flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0">
                <Row className="flex-col items-start">

                    <TextElement as="h3" className=""> Staff Users</TextElement>
                    <TextElement as="p" className="sm">Manage your gym staff users</TextElement>


                </Row>

                <Button className="bg-blue-900 hover:bg-blue-800 text-primary-foreground" onClick={handleCloseDialog}>
                    <PlusIcon className="size-4" />
                    Add Staff

                </Button>

            </Row>
            <CustomBreadcrumb
                items={[
                    { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                    { label: "Staff Users" },
                ]}
            />


            <Card className="gap-3">

                <CardHeader>
                    <CardTitle>Staff Users</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // prevent page reload
                            }}
                        >
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 w-full md:w-80"
                                value={searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </form>
                    </div>
                    <UserTable
                        className="h-[45vh] overflow-y-auto"
                        users={users || []} />

                    {
                        users.length !== 0 &&
                        <Pagination page={currentPage} totalRecords={meta.totalRecords} onPageChange={handlePageChange} totalPage={meta.totalPages} />
                    }
                </CardContent>
            </Card>

            <UserDialog
                open={showUserDialog}
                onClose={handleCloseDialog}
            />

        </div>
    )
}

export default UserWrapper;