import PAGE_ROUTES from "@/constants/page-routes.constant";
import MemberWrapper from "./Member.wrapper";
import { redirect } from "next/navigation";
import { UserRoleEnum } from "@/backend/modules/user/entity/user.entity";

type SearchParams = Promise<{
    page?: string;
    search?: string;
}>;


const Page = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { page = 1, search } = await searchParams;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const payload = {
        page: Number(page),
        limit: 5,
        search: search || "",
        role: UserRoleEnum.MEMBER,
    }


    const res = await fetch(`${baseUrl}/api/users/get-all`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const data = await res.json();




    if (data.data.length !== 0 && data?.meta?.totalPages < Number(page) && !search) {
        return redirect(`${PAGE_ROUTES.members}`);
    }



    return (
        <MemberWrapper members={data?.data || []} meta={data?.meta || {}} currentPage={Number(page)} />
    );
};

export default Page;