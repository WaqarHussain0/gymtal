"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createMemberService, updateMemberService } from "./service";

interface IMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member?: any | null;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  feePaid: number;
  enrolledDate: string;
  expiryDate: string;
};

const MemberDialog: React.FC<IMemberDialogProps> = ({
  open,
  onClose,
  member,
}) => {
  const router = useRouter();
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
      reset({
        name: member.userId?.name,
        email: member.userId?.email,
        phone: member.userId?.phone,
        gender: member.userId?.gender,
        feePaid: member.feePaid,
        enrolledDate: member.enrolledDate,
        expiryDate: member.expiryDate,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const oneMonthFromToday = new Date(
        new Date(today).setMonth(new Date(today).getMonth() + 1),
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
      ...data,
      feePaid: Number(data.feePaid),
    };
    if (member && member?._id) {
      response = await updateMemberService(member?._id, payload);
    } else {
      response = await createMemberService(payload);
    }
    if (response.ok) {
      onClose();
      reset();
      toast.success("Member saved successfully");
      router.refresh();
    } else {
      const error = await response.json();
      toast.error("Request failed", {
        description: error?.error || "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{member ? "Edit" : "Add New"} Member</DialogTitle>
          <DialogDescription>
            {member
              ? "Update the member's information below."
              : "Create a new member (client)."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter full name"
                {...register("name", {
                  required: "Full name is required",
                })}
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
                {...register("phone", {
                  required: "Phone number is required",
                })}
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

          {/* Start & End Date */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Enrolled Date *</Label>

              <Controller
                control={control}
                name="enrolledDate"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    placeholder="Enter enrolled date"
                  />
                )}
              />
              {errors.enrolledDate && (
                <p className="text-red-500 text-sm">
                  {errors.enrolledDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Expiry Date *</Label>

              <Controller
                control={control}
                name="expiryDate"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    placeholder="Enter expiry date"
                  />
                )}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fee Paid *</Label>
              <Input
                type="number"
                placeholder="Enter fee paid"
                {...register("feePaid", {
                  required: "Fee paid is required",
                })}
              />
              {errors.feePaid && (
                <p className="text-red-500 text-sm">{errors.feePaid.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
