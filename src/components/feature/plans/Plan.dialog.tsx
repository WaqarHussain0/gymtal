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
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPlanService, updatePlanService } from "./service";

interface IPlanDialogProps {
  open: boolean;
  onClose: () => void;
  plan?: any | null;
}

type FormValues = {
  name: string;
  duration: number;
  price: number;
  features: { value: string }[];
};

const PlanDialog: React.FC<IPlanDialogProps> = ({
  open,
  onClose,
  plan,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      duration: 0,
      price: 0,
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // Reset when editing
  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        features:
          plan.features?.map((f: string) => ({ value: f })) || [
            { value: "" },
          ],
      });
    } else {
      reset({
        name: "",
        duration: 0,
        price: 0,
        features: [{ value: "" }],
      });
    }
  }, [plan, reset]);

  const onSubmit = async (data: FormValues) => {
    const features = data.features.map((f) => f.value.trim());

    // Prevent duplicate features
    const unique = new Set(features);
    if (unique.size !== features.length) {
      alert("Duplicate features are not allowed");
      return;
    }

    const payload = {
      ...data,
      features,
    };

    let response: any;

    if (plan && plan?._id) {
      response = await updatePlanService(plan?._id, payload);
    } else {
      response = await createPlanService(payload);
    }

    if (response.ok) {
      onClose();
      reset();
      toast.success("Plan saved successfully");
      router.refresh();
    } else {
      const error = await response.json();
      toast.error("Request failed", {
        description: error?.error || "Something went wrong",
      });
    }
  };

  const watchedFeatures = watch("features");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {plan ? "Edit Plan" : "Add New Plan"}
          </DialogTitle>
          <DialogDescription>
            {plan
              ? "Update the plan's information below."
              : "Create a new subscription plan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label>Plan Name *</Label>
            <Input
              placeholder="Enter plan name"
              {...register("name", {
                required: "Plan name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (Days) *</Label>
              <Input
                type="number"
                {...register("duration", {
                  required: "Duration is required",
                  min: { value: 1, message: "Must be at least 1 day" },
                })}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Price (PKR) *</Label>
              <Input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            <Label>Features *</Label>

            {fields.map((field, index) => {
              const currentValue = watchedFeatures?.[index]?.value;

              const isDuplicate =
                watchedFeatures.filter(
                  (f, i) =>
                    f.value.trim() === currentValue?.trim() &&
                    i !== index &&
                    currentValue?.trim() !== ""
                ).length > 0;

              return (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Enter feature"
                    {...register(`features.${index}.value`, {
                      required: "Feature cannot be empty",
                    })}
                    className={
                      isDuplicate ? "border-red-500" : ""
                    }
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Feature
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={()=>{
                onClose();
                reset();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {plan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
