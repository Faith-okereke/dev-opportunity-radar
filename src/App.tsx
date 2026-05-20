import { Route, Routes, useLocation } from "react-router";
import SideMenu from "./layout/side-menu";
import Home from "./pages/overview";
import Repos from "./pages/repos";
import Jobs from "./pages/jobs";
import Profile from "./pages/profile";
import { closeNav, toggleNav } from "./store/navSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isOpen = useSelector((state: RootState) => state.navbar.isOpen);
  useEffect(() => {
    dispatch(closeNav());
  }, [pathname]);
  return (
    <div className="flex h-screen bg-white">
      <Toaster />
      <SideMenu />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="relative flex items-center md:hidden p-4">
          <button
            id="hamburger-btn"
            onClick={() => dispatch(toggleNav())}
            className="p-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-500 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <Icon icon={"tdesign:close-rectangle"} fontSize={20} />
            ) : (
              <Icon icon={"tdesign:menu"} fontSize={20} />
            )}
          </button>

          <h3 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
            Early Check
          </h3>
        </div>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repos" element={<Repos />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
