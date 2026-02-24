"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { deleteMemberService } from "./service";
import PAGE_ROUTES from "@/constants/page-routes.constant";
import TextElement from "@/components/common/TextElement";

interface IMemberTable {
  members: any[];
  className?: string;
}
const MemberTable: React.FC<IMemberTable> = ({ members, className }) => {

  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const columns = useMemo(
    () => [
      {
        label: "Name",
      },
      {
        label: "Email",
      },

      {
        label: "Enrolled Date",
      },



      {
        label: "Phone",
      },

      {
        label: "Actions",
      },
    ],
    [],
  );

  const getActions = (member: any) => {
    return [
      {
        label: "View",
        onClick: () => {
          router.push(PAGE_ROUTES.viewMember(member._id));
        },
        separatorAfter: false,
        show: true,
        icon: Eye,
      },


      {
        label: "Delete",
        onClick: () => {
          setIsDeleteModalOpen(true);
          setSelectedMember(member);
        },
        show: true,
        separatorAfter: false,
        icon: Trash,
      },
    ];
  };

  const handleDelete = async (member: any) => {
    if (!member._id) return;
    const res = await deleteMemberService(member._id);
    if (res.ok) {
      toast.success("Member deleted successfully");
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } else {
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className={className}>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.label}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member._id?.toString()}>
                <TableCell className="capitalize">{member?.name}</TableCell>
                <TableCell>{member?.email}</TableCell>
                <TableCell>{member?.createdAt
                  ? new Date(member.createdAt).toLocaleDateString()
                  : "N/A"}</TableCell>

                <TableCell>{member?.phone || "N/A"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getActions(member)
                        ?.filter((action) => action.show)
                        .map((action) => (
                          <div key={action.label}>
                            <DropdownMenuItem onClick={action.onClick}>
                              {action.icon && (
                                <action.icon className="mr-2 size-4" />
                              )}
                              {action.label}
                            </DropdownMenuItem>
                            {action.separatorAfter && (
                              <DropdownMenuSeparator />
                            )}
                          </div>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                <TextElement as="p" className="text-center">
                  No results.
                </TextElement>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              Delete {selectedMember?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this member?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedMember)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
};

export default MemberTable;
