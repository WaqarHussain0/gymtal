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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import UserDialog from "./User.dialog";
import { deleteUserService } from "./service";

interface IUserTable {
  users: any[];
  className?: string;
}
const UserTable: React.FC<IUserTable> = ({ users, className }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        label: "Name",
      },
      {
        label: "Email",
      },

      {
        label: "Role",
      },

      {
        label: "Actions",
      },
    ],
    [],
  );

  const getActions = (user: any) => {
    return [
      {
        label: "Edit",
        onClick: () => {
          setSelectedUser(user);
          setIsEditModalOpen(true);
        },
        separatorAfter: false,
        show: true,
        icon: Edit,
      },

      {
        label: "Delete",
        onClick: () => {
          setIsDeleteModalOpen(true);
          setSelectedUser(user);
        },
        show: true,
        separatorAfter: false,
        icon: Trash,
      },
    ];
  };

  const handleDelete = async (user: any) => {
    if (!user._id) return;
    const res = await deleteUserService(user._id);
    if (res.ok) {
      toast.success("User deleted successfully");
      router.refresh();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } else {
      toast.error("Failed to delete user");
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
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id?.toString()}>
                <TableCell className="capitalize">{user?.name}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={user?.role === "admin" ? "default" : "secondary"}
                  >
                    {user?.role}
                  </Badge>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getActions(user)
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
                No results.
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
              Delete {selectedUser?.name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this user?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDelete(selectedUser)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}

      <UserDialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;
