export const emailInputField = {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    rules: {
        required: "Email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
        },
    },
};

export const passwordInputField = {
    name: "password",
    label: "Password",
    placeholder: "Enter password",
    rules: { required: "Password is required" },
};
