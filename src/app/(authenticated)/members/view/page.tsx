import PAGE_ROUTES from "@/constants/page-routes.constant";
import { redirect } from "next/navigation";
import ViewGymMemberWrapper from "./ViewGymMember.wrapper";

type SearchParams = Promise<{
    id: string;
}>;


const Page = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { id } = await searchParams;

    if (!id) {
        redirect(PAGE_ROUTES.members);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


    const member = await fetch(`${baseUrl}/api/users/gym-member/${id}`);

    if (!member.ok) {
        return (<p>Member not found</p>)
    }

    const memberData = await member.json();




    if (!memberData) {
        redirect(PAGE_ROUTES.members);
    }

    return (
        <ViewGymMemberWrapper member={memberData.user} />
    );
};

export default Page;