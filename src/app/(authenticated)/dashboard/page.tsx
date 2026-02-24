
import DashboardWrapper from "./Dashboard.wrapper";
import { UserService } from "@/backend/modules/user/services/user.service";

const userService = new UserService();

const Page = async () => {

    const result = await userService.getCountByRole();


    return (
        <DashboardWrapper adminUsers={result.adminUsers} staffUsers={result.staffUsers} memberUsers={result.memberUsers} />
    );
};

export default Page;