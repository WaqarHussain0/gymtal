import PlanWrapper from "./Plan.wrapper";

const Page = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/plans`);

    const data = await res.json();

    return (
        <PlanWrapper plans={data?.plans || []} />
    )
}

export default Page;