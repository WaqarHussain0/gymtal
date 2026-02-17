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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUserService, updateUserService } from "./service";


const roles = [
    { id: "admin", name: "Admin" },
    { id: "staff", name: "Staff" },
];

interface IUserDialogProps {
    open: boolean;
    onClose: () => void;
    user?: any | null;
}

type FormValues = {
    name: string;
    email: string;
    password: string;
    role: string;
};

const UserDialog: React.FC<IUserDialogProps> = ({
    open,
    onClose,
    user,
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
            password: "",
            role: "",
        },
    });




    // Reset when editing
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
            });
        } else {
            reset({
                name: "",
                email: "",
                password: "",
                role: "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: FormValues) => {

        let response: any;

        if (user && user?._id) {
            response = await updateUserService(user?._id, data);
        } else {
            response = await createUserService(data);
        }

        if (response.ok) {
            onClose();
            reset();
            toast.success("User saved successfully");
            router.refresh();
        } else {
            const error = await response.json();
            toast.error("Request failed", { description: error?.error || 'Something went wrong' });
        }

    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {user ? "Edit" : "Add New"} Staff User
                    </DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Update the user's information below."
                            : "Create a new staff user."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">

                        {/* Plan Name */}
                        <div className="space-y-2">
                            <Label>Full Name *</Label>
                            <Input
                                placeholder="Enter full name"
                                {...register("name", {
                                    required: "Full name is required",
                                })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Address */}
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
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>


                    </div>

                    {/* Duration + Price */}
                    <div className={`grid gap-4 ${user ? 'grid-cols-1' : 'grid-cols-2'}`}>

                        {!user && <div className="space-y-2">
                            <Label>Password *</Label>
                            <Input
                                placeholder="Enter password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    validate: (value) =>
                                        value.trim().length > 0 || "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>}

                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: "Role is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full capitalize">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles?.map((role) => (
                                                <SelectItem
                                                    className="capitalize"
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && (
                                <p className="text-red-500 text-sm">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>
                    </div>



                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => {
                            onClose();
                            reset();
                        }}>
                            Cancel
                        </Button>
                        <Button type="submit">

                            Save            </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserDialog;
