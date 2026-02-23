import { redirect } from "next/navigation";
import UserWrapper from "./User.wrapper";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { UserRoleEnum } from "@/backend/modules/user/entity/user.entity";
import { UserService } from "@/backend/modules/user/services/user.service";


type SearchParams = Promise<{
    page?: string;
    search?: string;
}>;


const userService = new UserService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { page = 1, search } = await searchParams;

    const data = await userService.findAll({
        page: Number(page),
        limit: 5,
        search: search || "",
    });


    if (data.data.length !== 0 && data?.meta?.totalPages < Number(page) && !search) {
        return redirect(`${PAGE_ROUTES.users}`);
    }


    return (
        <UserWrapper users={data?.data || []} meta={data?.meta || {}} currentPage={Number(page)} />
    )
}

export default Page;