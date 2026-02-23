"use client";

import TextElement from "@/components/common/TextElement";
import { Input } from "@/components/ui/input";
import { emailInputField, passwordInputField } from "@/constants/input.constant";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Row from "@/components/common/Row";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface ILoginRequest {
    email: string;
    password: string;

}

const LoginWrapper = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginRequest>();


    const onSubmit = async (data: ILoginRequest) => {

        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });


        if (res?.error) {
            toast.error("Login Failed", {
                description: res.error, // ✅ show backend message directly
            });
            setLoading(false);
            return;
        }



        toast.success("Login Successful", {
            description: "You are now logged in",
        });


        router.push(PAGE_ROUTES.dashboard);

        setLoading(false);



    };

    return (
        <div className="w-full bg-white max-w-md p-8 bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm">
            <TextElement as="h1" className="mb-8">
                Login
            </TextElement>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <Controller
                    name={emailInputField.name as "email"}
                    control={control}
                    rules={emailInputField.rules}
                    render={({ field }) => (
                        <div className="flex flex-col">
                            <Input
                                {...field}
                                type="email"
                                placeholder={emailInputField.placeholder}
                            />
                            {errors.email && (
                                <TextElement as="span" className="text-red-400 mt-1">
                                    {errors.email.message}
                                </TextElement>
                            )}
                        </div>
                    )}
                />

                {/* Password Input */}
                <Controller
                    name={passwordInputField.name as "password"}
                    control={control}
                    rules={passwordInputField.rules}
                    render={({ field }) => (
                        <div className="flex flex-col relative">
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder={passwordInputField.placeholder}
                            />
                            <button
                                type="button"
                                className="absolute cursor-pointer right-2 top-2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && (
                                <TextElement as="span" className="text-red-400 mt-1">
                                    {errors.password.message}
                                </TextElement>
                            )}
                        </div>
                    )}
                />

                <Row className="w-full justify-between items-center">


                    <Row className="justify-between mt-2">
                        <TextElement
                            as="a"
                            onClick={() => router.push(PAGE_ROUTES.forgotPassword)}
                            className="cursor-pointer underline"
                        >
                            Forgot password
                        </TextElement>
                    </Row>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Row>
            </form>
        </div>
    );
};

export default LoginWrapper;
