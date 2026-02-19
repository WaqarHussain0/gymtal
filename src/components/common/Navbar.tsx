"use client";

import PAGE_ROUTES from "@/constants/page-routes.constant";
import {
    LayoutDashboard,
    Users,
    LogOut,
    Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Row from "./Row";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "../ui/alert-dialog";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: PAGE_ROUTES.dashboard, icon: LayoutDashboard },
    { name: "Members", href: PAGE_ROUTES.members, icon: Users },
    { name: "Gym Staff", href: PAGE_ROUTES.users, icon: Users },
];


interface INavbar {
    className?: string;
}

const Navbar: React.FC<INavbar> = ({ className }) => {
    const pathname = usePathname();

    const router = useRouter();

    // Get the user session on the server
    const session = useSession();
    const user = session.data?.user;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const handleLogout = async () => {
        // Sign out from NextAuth and redirect to login
        await signOut({ redirect: false });
        router.push(PAGE_ROUTES.login);
    };




    return (<div className={`bg-blue-900 text-white ${className}`}>
        <div className="flex flex-col h-full space-y-3">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-3 border-b border-blue-800">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg">FitLedger</h1>
                    <p className="text-xs text-blue-300">Gym Management</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-sm transition-colors ${isActive
                                ? "bg-white/10 text-white"
                                : "text-blue-100 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-blue-800">

                <Row className="gap-1">
                    <div className="capitalize size-9 bg-blue-800 shadow-sm rounded-full flex justify-center items-center">
                        {user?.name?.slice(0, 1)}
                    </div>


                    <h2 className="capitalize">{user?.name}</h2>
                </Row>

                {user && (
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/5 hover:text-white transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                )}

            </div>
        </div>


        {/* Delete Modal */}
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="capitalize">
                        Logout
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to logout?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleLogout}
                    >
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>


    );
}


export default Navbar;