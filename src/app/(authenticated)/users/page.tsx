import { redirect } from "next/navigation";
import UserWrapper from "./User.wrapper";
import PAGE_ROUTES from "@/constants/page-routes.constant";


type SearchParams = Promise<{
    page?: string;
    search?: string;
}>;


const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { page = 1, search } = await searchParams;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/users/get-all`, {
        method: "POST",
        body: JSON.stringify({
            page: Number(page),
            limit: 5,
            search: search || "",
        }),
    });

    const data = await res.json();

    if (data.data.length !== 0 && data?.meta?.totalPages < Number(page) && !search) {
        return redirect(`${PAGE_ROUTES.users}`);
    }


    return (
        <UserWrapper users={data?.data || []} meta={data?.meta || {}} currentPage={Number(page)} />
    )
}

export default Page;