export const deleteMemberService = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/members/${id}`, {
        method: "DELETE",
    });
}

export const createMemberService = async (payload: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/members`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
    });
}

export const updateMemberService = async (id: string, payload: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/members/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
    });
}
