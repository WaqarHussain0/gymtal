"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMemberService, updateMemberService } from "@/components/feature/members/service";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import PAGE_ROUTES from "@/constants/page-routes.constant";

type FormValues = {
    name: string;
    email: string;
    phone: string;
    gender: string;
    feePaid: number;
    enrolledDate: string;
    expiryDate: string;
};

interface IPageProps {
    member?: any | null; // if editing existing member
}

const MemberForm: React.FC<IPageProps> = ({ member }) => {
    const router = useRouter();

    const { data: session } = useSession();
    const user = session?.user;
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            gender: "male",
            feePaid: 0,
            enrolledDate: new Date().toISOString().split("T")[0],
            expiryDate: new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        if (member) {
            // Get the latest membership period
            const latestPeriod = member.membershipPeriods?.[0];
            // Get the latest payment transaction
            const latestPayment = member.paymentTransactions?.[0];
    
            reset({
                name: member.name,
                email: member.email,
                phone: member.phone,
                gender: member.gender,
                feePaid: latestPayment?.amount || 0,
                enrolledDate: latestPeriod
                    ? new Date(latestPeriod.startDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                expiryDate: latestPeriod
                    ? new Date(latestPeriod.endDate).toISOString().split("T")[0]
                    : new Date(
                          new Date().setMonth(new Date().getMonth() + 1)
                      )
                          .toISOString()
                          .split("T")[0],
            });
        } else {
            const today = new Date().toISOString().split("T")[0];
            const oneMonthFromToday = new Date(
                new Date(today).setMonth(new Date(today).getMonth() + 1)
            )
                .toISOString()
                .split("T")[0];
    
            reset({
                name: "",
                email: "",
                phone: "",
                gender: "male",
                feePaid: 0,
                enrolledDate: today,
                expiryDate: oneMonthFromToday,
            });
        }
    }, [member, reset]);

    const onSubmit = async (data: FormValues) => {
        let response: any;

        const payload = {
            user: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                gender: data.gender,
                role: "member", // force member role
            },
            membershipPeriod: {
                startDate: new Date(data.enrolledDate),
                endDate: new Date(data.expiryDate),
                // optional: createdBy adminId if needed
            },
            paymentTransaction: {
                amount: Number(data.feePaid),
                paymentMethod: "cash",
                paymentDate: new Date(data.enrolledDate),
                // optional: receivedBy adminId
            },
            createdByUserId: user?.id,
        };


        if (member && member._id) {
            response = await updateMemberService(member._id, payload);
        } else {
            response = await createMemberService(payload);
        }

        if (response.ok) {
            reset();
            toast.success("Request successful", {
                description: "Member saved successfully",
            });
            router.push(PAGE_ROUTES.members);
        } else {
            const error = await response.json();
            toast.error("Request failed", {
                description: error?.error || "Something went wrong",
            });
        }
    };

    return (
        <Card className="w-full bg-white mx-auto p-6">


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                            placeholder="Enter full name"
                            {...register("name", { required: "Full name is required" })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address *</Label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            {...register("email", {
                                required: "Email address is required",
                                validate: (value) =>
                                    value.trim().length > 0 || "Email address is required",
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone & Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input
                            placeholder="Enter phone number"
                            {...register("phone", { required: "Phone number is required" })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Gender *</Label>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <Select {...field}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.gender && (
                            <p className="text-red-500 text-sm">{errors.gender.message}</p>
                        )}
                    </div>
                </div>

                {/* Enrolled & Expiry Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Enrolled Date *</Label>
                        <Controller
                            control={control}
                            name="enrolledDate"
                            render={({ field }) => <Input {...field} type="date" />}
                        />
                        {errors.enrolledDate && (
                            <p className="text-red-500 text-sm">{errors.enrolledDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Expiry Date *</Label>
                        <Controller
                            control={control}
                            name="expiryDate"
                            render={({ field }) => <Input {...field} type="date" />}
                        />
                        {errors.expiryDate && (
                            <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
                        )}
                    </div>
                </div>

                {/* Fee Paid */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label>Fee Paid *</Label>
                        <Input
                            type="number"
                            placeholder="Enter fee paid"
                            {...register("feePaid", { required: "Fee paid is required" })}
                        />
                        {errors.feePaid && (
                            <p className="text-red-500 text-sm">{errors.feePaid.message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">{member ? "Update" : "Save"}</Button>
                </div>
            </form>
        </Card>
    );
};

export default MemberForm;
