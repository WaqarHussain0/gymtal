import PAGE_ROUTES from "@/constants/page-routes.constant";
import { redirect } from "next/navigation";
import ViewGymMemberWrapper from "./ViewGymMember.wrapper";
import { UserService } from "@/backend/modules/user/services/user.service";
import mongoose from "mongoose";

type SearchParams = Promise<{
    id: string;
}>;

const userService = new UserService();

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { id } = await searchParams;

    if (!id) {
        redirect(PAGE_ROUTES.members);
    }


    const member = await userService.findById(new mongoose.Types.ObjectId(id));

    if (!member) {
        return (<p>Member not found</p>)
    }


    return (
        <ViewGymMemberWrapper member={member} />
    );
};

export default Page;