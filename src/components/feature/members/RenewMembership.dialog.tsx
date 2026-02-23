"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useWatch } from "react-hook-form";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type FormValues = {
    userId: string;
    startDate: string;
    durationInMonths: number;
    endDate: string;
    amount: number;
};

interface IRenewMembershipDialogProps {
    open: boolean;
    onClose: () => void;
    userId: string | null;
}

const RenewMembershipDialog: React.FC<IRenewMembershipDialogProps> = ({
    open,
    onClose,
    userId,
}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    // Get the user session
    const session = useSession();
    const user = session?.data?.user;


    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            userId: "",
            startDate: "",
            durationInMonths: 1,
            endDate: "",
            amount: 0,
        },
    });






    /* ---------------------------------- */
    /* Auto Calculate End Date            */
    /* ---------------------------------- */
    const startDate = useWatch({ control, name: "startDate" });
    const durationInMonths = useWatch({ control, name: "durationInMonths" });

    useEffect(() => {
        if (startDate && durationInMonths) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setMonth(end.getMonth() + Number(durationInMonths));

            const formattedEnd = end.toISOString().split("T")[0];
            setValue("endDate", formattedEnd);
        }
    }, [startDate, durationInMonths, setValue]);

    /* ---------------------------------- */
    /* Submit                             */
    /* ---------------------------------- */
    const onSubmit = async (data: FormValues) => {

        setIsLoading(true);
        const payload = {
            userId,
            createdById: user?.id,
            amount: data.amount,
            endDate: data.endDate,
            startDate: data.startDate,
        }

        try {
            const res = await fetch(
                `/api/users/gym-member/${userId}/renew`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                setIsLoading(false);
                throw new Error("Failed to renew membership");
            }

            toast.success("Membership renewed successfully 🎉");

            reset();
            setIsLoading(false);
            onClose();
            router.refresh();
        } catch (error: any) {
            setIsLoading(false);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Renew Membership</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Start Date */}
                    <div className="space-y-2">

                        <Label>Subscription Start Date</Label>
                        <Input
                            type="date"
                            {...register("startDate", {
                                required: "Start date is required",
                            })}
                        />
                        {errors.startDate && (
                            <p className="text-sm text-red-500">
                                {errors.startDate.message}
                            </p>
                        )}
                    </div>



                    {/* End Date (Read Only) */}
                    <div className="space-y-2">
                        <Label>Subscription End Date</Label>
                        <Input
                            type="date"
                            {...register("endDate")}
                            readOnly
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">

                        <Label>Amount Paid</Label>
                        <Input
                            type="number"
                            {...register("amount", {
                                required: "Amount is required",
                                min: {
                                    value: 1,
                                    message: "Amount must be greater than 0",
                                },
                            })}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Confirming..." : "Confirm Renewal"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RenewMembershipDialog;
