const PAGE_ROUTES = {

    // Auth Routes
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",

    // Authenticated Routes
    dashboard: "/dashboard",
    users: "/users",
    members: "/members",
    createMember: "/members/create",
    viewMember: (id: string) => `/members/view?id=${id}`,
    plans: "/plans",
}

export default PAGE_ROUTES;