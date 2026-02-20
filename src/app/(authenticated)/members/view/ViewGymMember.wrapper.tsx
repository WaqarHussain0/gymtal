import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import Row from "@/components/common/Row";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentHistoryTable from "@/components/feature/members/PaymentHistory.table";
import MembershipPeriodTable from "@/components/feature/members/MembershipPeriods.table";

interface IViewGymMemberWrapper {
    member: any;
}

const ViewGymMemberWrapper: React.FC<IViewGymMemberWrapper> = ({ member }) => {


    const profileInfo = [{
        label: "Email",
        value: member.email,
    }, {
        label: "Phone",
        value: member.phone,
    }, {
        label: "Gender",
        value: member.gender,
    }, {
        label: "Status",
        value: member.isActive ? "Active" : "Inactive",
    }, {
        label: "Joined At",
        value: new Date(member.createdAt).toLocaleDateString(),
    }]



    return (
        <Row className="flex-col w-full items-start">
            {/* Header */}
            <Row className="flex-col gap-2 items-start w-full">
                <h1 className="text-2xl font-bold">Member Details</h1>
                <p>Manage your gym members</p>
            </Row>

            <CustomBreadcrumb
                items={[
                    { label: "Dashboard", linkTo: PAGE_ROUTES.dashboard },
                    { label: "Members", linkTo: PAGE_ROUTES.members },
                    { label: member.name },
                ]}
            />


            {/* Profile Card */}
            <Card className="w-full ">

                <CardHeader>

                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent >
                    <div className="grid grid-cols-5 gap-2">
                        {profileInfo.map((info) => (
                            <div key={info.label}>
                                <p className="text-foreground text-left font-medium">
                                    {info.label}:
                                </p>
                                <p>

                                    {info.value}
                                </p>
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 w-full mt-3">

                {/* Membership Periods */}
                <MembershipPeriodTable
                    userId={member._id}
                    membershipPeriods={member.membershipPeriods ?? []}
                />

                {/* Payment Transactions */}
                <PaymentHistoryTable
                    paymentTransactions={member.paymentTransactions ?? []}
                    membershipPeriods={member.membershipPeriods ?? []}
                />

            </div>

        </Row>
    );
};

export default ViewGymMemberWrapper;
