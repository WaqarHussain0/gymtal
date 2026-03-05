"use client";

import TextElement from "@/components/common/TextElement";
import { Input } from "@/components/ui/input";
import { passwordInputField } from "@/constants/input.constant";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface IResetPasswordRequest {
  password: string;
}

const ResetPasswordWrapper = ({ token }: { token: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IResetPasswordRequest>();

  const onSubmit = async (data: IResetPasswordRequest) => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        reset();
        throw new Error(result?.error || "Failed to reset password");
      }

      toast.success("Password reset successfully");

      reset();

      setTimeout(() => {
        router.push(PAGE_ROUTES.login);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white max-w-md p-5 md:p-8 bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm">
      <TextElement as="h1" className="mb-8">
        Reset Password
      </TextElement>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name={passwordInputField.name as "password"}
          control={control}
          rules={{
            ...passwordInputField.rules,
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <div className="flex flex-col relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={passwordInputField.placeholder}
              />

              {/* Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
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

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordWrapper;
