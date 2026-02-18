"use client";
import { useCallback, useState } from "react";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import MemberTable from "@/components/feature/members/Member.table";
import MemberDialog from "@/components/feature/members/Member.dialog";
import { Button } from "@/components/ui/button";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { PlusIcon, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch.hook";
import Pagination from "@/components/common/Pagination";
import { useRouter } from "next/navigation";

interface IMemberWrapper {
    members: any[];
    currentPage: number;
    meta: {
        totalPages: number;
        totalRecords: number;
        page: number;
    };
}

const MemberWrapper: React.FC<IMemberWrapper> = ({ members, currentPage, meta }) => {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);



    const { searchInput, debouncedSearch, handleSearchChange } =
        useDebouncedSearch();


    // Function to update URL query params
    const updateQueryParams = useCallback(
        (page: number, search?: string) => {
            const params = new URLSearchParams();
            if (page) params.set("page", page.toString());
            if (search) params.set("search", search);
            router.replace(`${PAGE_ROUTES.members}?${params.toString()}`);
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
            <Row className="justify-between">
                <Row className="flex-col gap-2 items-start">
                    <h1 className="text-2xl font-bold">Members</h1>
                    <p>Manage your gym members</p>
                </Row>
                <Button onClick={() => setIsDialogOpen(true)}>
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

            <Card className="gap-3">
                <CardHeader>
                    <CardTitle>Gym Members</CardTitle>


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
                                className="pl-10 w-80"
                                value={searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </form>
                    </div>
                    <MemberTable
                        className="h-[45vh] overflow-y-auto"
                        members={members || []} />
                    <Pagination page={currentPage} totalRecords={meta.totalRecords} onPageChange={handlePageChange} totalPage={meta.totalPages} />

                </CardContent>
            </Card>

            <MemberDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </div>
    );
};

export default MemberWrapper;