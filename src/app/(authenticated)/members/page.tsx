import PAGE_ROUTES from "@/constants/page-routes.constant";
import MemberWrapper from "./Member.wrapper";
import { redirect } from "next/navigation";

type SearchParams = Promise<{
    page?: string;
    search?: string;
}>;


const Page = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { page = 1, search } = await searchParams;


    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/members/get-all`, {
        method: "POST",
        body: JSON.stringify({
            page: Number(page),
            limit: 5,
            search: search || "",
        }),
        cache: "no-store",
    });

    const data = await res.json();

    if (data.meta.totalPages < Number(page) && !search) {
        return redirect(`${PAGE_ROUTES.members}`);
    }



    return (
        <MemberWrapper members={data?.data || []} meta={data?.meta || {}} currentPage={Number(page)} />
    );
};

export default Page;