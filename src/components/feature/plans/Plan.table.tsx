"use client";

import Row from "@/components/common/Row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CircleCheck, Edit2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PlanDialog from "./Plan.dialog";
import { deletePlanService } from "./service";

interface IPlanTable {
  plans: any[];
}

const PlanTable: React.FC<IPlanTable> = ({ plans }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (plan: any) => {
    if (!plan?._id) return;

    const res = await deletePlanService(plan._id);
    if (res.ok) {
      toast.success("Plan deleted successfully");
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
    } else {
      toast.error("Failed to delete plan");
    }
  };

  const items = useMemo(() => plans || [], [plans]);

  return (
    <>

    <Card>
    <CardHeader>
                <CardTitle>Plans</CardTitle>
            </CardHeader>

{
  items.length > 0 ? (  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-3 px-6">
    {items.map((plan) => (
      <Card
        key={plan._id}
        className="relative gap-2 pt-4 pb-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out border border-gray-100 rounded-xl overflow-hidden"
      >
        <CardHeader className="">
          <CardTitle className="text-lg font-semibold">
            {plan?.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                {plan?.price} PKR
              </span>
              <Badge variant="outline">{plan?.duration} days</Badge>
              <Badge variant="secondary">
                {plan?.members ?? 0} members
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <h2>Features:</h2>
            {plan?.features?.map((feature: string) => (
              <Row key={feature} className="gap-2">
                <CircleCheck className="text-green-400 size-5" />
                <p>{feature}</p>
              </Row>
            ))}
          </div>
        </CardContent>

        <div className=" w-full flex justify-end gap-2 bg-gray-50 p-2 border-t border-gray-100">
          <Button onClick={() => handleEdit(plan)} variant="outline">
            <Edit2 size={18} />
          </Button>
          <Button
            onClick={() => {
              setSelectedPlan(plan);
              setIsDeleteModalOpen(true);
            }}
            variant="destructive"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </Card>
    ))}
  </div>):(
    <CardContent>
      <p className="text-gray-500">No plans found</p>
    </CardContent>
  )
}
    
      </Card>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              Delete {selectedPlan?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this plan?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedPlan)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PlanDialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        plan={selectedPlan}
      />
    </>
  );
};

export default PlanTable;
