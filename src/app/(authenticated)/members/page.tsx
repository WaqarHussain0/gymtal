import PAGE_ROUTES from "@/constants/page-routes.constant";
import MemberWrapper from "./Member.wrapper";
import { redirect } from "next/navigation";
import { UserRoleEnum } from "@/backend/modules/user/entity/user.entity";
import { UserService } from "@/backend/modules/user/services/user.service";
import connectToDB from "@/backend/utils/database.util";

type SearchParams = Promise<{
    page?: string;
    search?: string;
}>;

const userService = new UserService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { page = 1, search } = await searchParams;

    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gymtal";
    await connectToDB(MONGODB_URI);

    const payload = {
        page: Number(page),
        limit: 5,
        search: search || "",
        role: UserRoleEnum.MEMBER,
    }

    const data = await userService.findAll(payload);


    if (data.data.length !== 0 && data?.meta?.totalPages < Number(page) && !search) {
        return redirect(`${PAGE_ROUTES.members}`);
    }



    return (
        <MemberWrapper members={data?.data || []} meta={data?.meta || {}} currentPage={Number(page)} />
    );
};

export default Page;