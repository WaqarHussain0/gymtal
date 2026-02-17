export const deleteUserService = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/users/${id}`, {
        method: "DELETE",
    });
}


export const createUserService = async (payload: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export const updateUserService = async (id: string, payload: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return await fetch(`${baseUrl}/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
