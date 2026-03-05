"use client";

import PAGE_ROUTES from "@/constants/page-routes.constant";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Dumbbell,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useEffect, useRef, useState } from "react";
import TextElement from "./TextElement";

const navigation = [
  { name: "Dashboard", href: PAGE_ROUTES.dashboard, icon: LayoutDashboard },
  { name: "Members", href: PAGE_ROUTES.members, icon: Users },
  { name: "Gym Staff", href: PAGE_ROUTES.users, icon: UserCog },
];

interface INavbar {
  className?: string;
}

const Navbar: React.FC<INavbar> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  // ✅ Close menu on outside click (mobile UX)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setToggleMenu(false);
      }
    };

    if (toggleMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleMenu]);

  return (
    <>
      {/* Mobile Toggle Button (does NOT change styling of sidebar) */}
      {!toggleMenu && (
        <button
          onClick={handleToggleMenu}
          className="lg:hidden fixed top-4 right-4 z-50  bg-blue-900 hover:bg-blue-800 text-primary-foreground px-2 py-1 cursor-pointer rounded-md"
        >
          ☰
        </button>
      )}

      <div
        ref={navbarRef}
        className={`bg-blue-900 text-white ${className}
                fixed lg:static top-0 left-0 h-full z-40
                transition-transform duration-300
                ${toggleMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center gap-3 px-2 py-3 border-b border-blue-800">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-blue-400 blur-lg opacity-40" />

              <div className="relative size-12 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                <Dumbbell className="size-6 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <TextElement
                as="h1"
                className="font-semibold text-xl text-primary-foreground"
              >
                Gymtal
              </TextElement>
              <TextElement
                as="p"
                className="font-body text-xs text-primary-foreground/60"
              >
                Gym Management
              </TextElement>
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
                  onClick={() => setToggleMenu(false)}
                  className={`flex items-center text-sm gap-3 px-4 py-2 rounded-sm transition-colors font-body ${
                    isActive
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
          <div className="px-4 py-4 border-t border-blue-800 space-y-1">
            <Row className="gap-1">
              <div className="capitalize size-9 bg-blue-800 shadow-sm rounded-full flex justify-center items-center">
                {user?.name?.slice(0, 1)}
              </div>

              <TextElement as="h5" className="capitalize">
                {user?.name}
              </TextElement>
            </Row>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Logout Modal */}
        <AlertDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="capitalize">Logout</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-body">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 font-body"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Navbar;
