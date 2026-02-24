"use client";
import { useCallback } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import MemberTable from "@/components/feature/members/Member.table";
import { Button } from "@/components/ui/button";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch.hook";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import TextElement from "@/components/common/TextElement";

interface IMemberWrapper {
    members: any[];
    meta: {
        totalPages: number;
        totalRecords: number;
        page: number;
    };
    currentPage: number;
}

const MemberWrapper: React.FC<IMemberWrapper> = ({ members, meta, currentPage }) => {

    const { searchInput, debouncedSearch, handleSearchChange } =
        useDebouncedSearch();
    const router = useRouter();

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
                    <TextElement as="h3" className="font-semibold">Members</TextElement>
                    <TextElement as="p" className="sm">Manage your gym members</TextElement>
                </Row>
                <Button className="bg-blue-900 hover:bg-blue-800 text-primary-foreground" onClick={() => router.push(PAGE_ROUTES.createMember)}>
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
                                className="pl-10 w-full md:w-80"
                                value={searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    <MemberTable
                        className="h-[45vh] overflow-y-auto"

                        members={members || []} />

                    {
                        members.length !== 0 &&
                        <Pagination page={currentPage} totalRecords={meta.totalRecords} onPageChange={handlePageChange} totalPage={meta.totalPages} />
                    }

                </CardContent>

            </Card>
        </div>
    );
};

export default MemberWrapper;