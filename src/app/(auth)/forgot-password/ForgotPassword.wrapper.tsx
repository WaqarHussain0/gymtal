"use client";

import TextElement from "@/components/common/TextElement";
import { Input } from "@/components/ui/input";
import { emailInputField } from "@/constants/input.constant";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Row from "@/components/common/Row";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface IForgotPasswordRequest {
  email: string;
}

const ForgotPasswordWrapper = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForgotPasswordRequest>();

  const onSubmit = async (data: IForgotPasswordRequest) => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Something went wrong");
      }

      toast.success("Request Successful", {
        description: result?.message || "Check your inbox for the reset link",
      });

      reset();
      router.push(PAGE_ROUTES.login);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white max-w-md p-5 md:p-8 bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm">
      <TextElement as="h1" className="mb-8">
        Forgot Password
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

        <Row className="w-full justify-between items-center">
          <TextElement
            as="a"
            onClick={() => router.push(PAGE_ROUTES.login)}
            className="cursor-pointer underline"
          >
            Login
          </TextElement>

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default ForgotPasswordWrapper;
