import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import MemberForm from "@/components/feature/members/Member.form";
import PAGE_ROUTES from "@/constants/page-routes.constant";

const Page = () => {

    return (

        <Row className="flex-col w-full items-start">
            <Row className="flex-col gap-2 items-start">
                <h1 className="text-2xl font-bold">Members</h1>
                <p>Manage your gym members</p>
            </Row>
            <CustomBreadcrumb
                items={[
                    { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                    { label: "Members", linkTo: PAGE_ROUTES.members },
                    { label: "Create Member" },
                ]}
            />

            <MemberForm />
        </Row>
    );
};

export default Page;
