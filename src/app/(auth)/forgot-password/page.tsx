import PAGE_ROUTES from "@/constants/page-routes.constant";
import { redirect } from "next/navigation";
import { getServerSideSession } from "@/lib/auth.util";
import ForgotPasswordWrapper from "./ForgotPassword.wrapper";

const Page = async () => {
    // Get the user session on the server
    const session = await getServerSideSession();

    // If user is already authenticated, redirect to dashboard
    if (session?.user) {
        redirect(PAGE_ROUTES.dashboard);
    }

    return (
        <ForgotPasswordWrapper />
    );
};

export default Page;