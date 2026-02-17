import MemberWrapper from "./Member.wrapper";

const Page = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/members`);
    const data = await res.json();
    
    return (
        <MemberWrapper members={data?.members || []} />
    );
};

export default Page;