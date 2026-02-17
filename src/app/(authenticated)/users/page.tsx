import UserWrapper from "./User.wrapper";

const Page = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/users`);

    const data = await res.json();

    return (
            <UserWrapper users={data?.users || []} />
    )
}

export default Page;