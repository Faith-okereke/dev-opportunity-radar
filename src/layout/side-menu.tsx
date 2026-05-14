import { useEffect } from "react";
import { LayoutDashboard, Code2, Briefcase, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {closeNav } from "../store/navSlice";
import type { RootState } from "../store";

const SideMenu = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.navbar.isOpen);

  // Close on route change
  useEffect(() => {
    dispatch(closeNav());
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#side-menu") && !target.closest("#hamburger-btn")) {
        dispatch(closeNav());
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const items = [
    { label: "Overview", icon: <LayoutDashboard size={20} />, link: "/" },
    { label: "Trending Repos", icon: <Code2 size={20} />, link: "/repos" },
    { label: "HN Jobs", icon: <Briefcase size={20} />, link: "/jobs" },
    { label: "My Profile", icon: <UserCircle size={20} />, link: "/profile" },
  ];

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-white/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        id="side-menu"
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 h-screen bg-white 
          flex flex-col shadow-2xl md:shadow-sm
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-slate-300">
          <h2 className="text-2xl font-bold text-blue-400">Dashboard</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                to={item.link}
                key={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-blue-100"
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-white" : "group-hover:text-cyan-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1 w-1 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-300">
          <p className="text-xs text-slate-500 text-center">Dashboard v1.0</p>
        </div>
      </div>
    </>
  );
};

export default SideMenu;