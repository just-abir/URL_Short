import React from "react";
import { NavLink } from "react-router-dom";

interface ThemeProps {
  themeMode: boolean;
  setthemeMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ themeMode, setthemeMode }: ThemeProps) => {
  const themeHandle = () => {
    setthemeMode((prev) => !prev);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all duration-500 ${
        themeMode
          ? "border-white/10 bg-slate-950/75"
          : "border-white/30 bg-white/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <NavLink to="/" className="group flex items-center gap-2">
          {/* Logo Icon */}
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-emerald-500
via-green-500
to-teal-500
              shadow-lg shadow-fuchsia-500/20
              transition-all duration-300
              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M7 17H5C3.34315 17 2 15.6569 2 14V10C2 8.34315 3.34315 7 5 7H7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M17 7H19C20.6569 7 22 8.34315 22 10V14C22 15.6569 20.6569 17 19 17H17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M8 8L10 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M16 16L14 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Logo Text */}
          <div className="hidden sm:block">
            <h1
              className="
                text-xl font-extrabold tracking-tight
                bg-gradient-to-r from-emerald-500
via-green-500
to-teal-500
                bg-clip-text text-transparent
              "
            >
              ShortURL
            </h1>

            <p
              className={`-mt-1 text-[9px] font-medium tracking-[0.25em] ${
                themeMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              SMART • SIMPLE • FAST
            </p>
          </div>
        </NavLink>

        {/* ================= NAV LINKS ================= */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `
              relative rounded-xl px-3 py-2 text-sm font-semibold
              transition-all duration-300
              ${
                isActive
                  ? themeMode
                    ? "bg-gradient-to-r from-violet-500/20 to-cyan-400/20 text-cyan-300"
                    : "bg-gradient-to-r from-violet-500/10 to-cyan-400/10 text-violet-600"
                  : themeMode
                    ? "text-slate-300 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-white/60 hover:text-violet-600"
              }
            `
            }
          >
            <span className="flex items-center gap-1.5">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-6h6v6" />
              </svg>

              <span className="hidden sm:inline">Home</span>
            </span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `
              rounded-xl px-3 py-2 text-sm font-semibold
              transition-all duration-300
              ${
                isActive
                  ? themeMode
                    ? "bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 text-fuchsia-300"
                    : "bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 text-fuchsia-600"
                  : themeMode
                    ? "text-slate-300 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-white/60 hover:text-fuchsia-600"
              }
            `
            }
          >
            <span className="flex items-center gap-1.5">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>

              <span className="hidden sm:inline">Dashboard</span>
            </span>
          </NavLink>

          {/* ================= THEME BUTTON ================= */}
          <button
            onClick={themeHandle}
            aria-label="Toggle theme"
            className={`
              group relative flex h-10 w-10 items-center justify-center
              overflow-hidden rounded-xl
              border transition-all duration-300
              hover:scale-105
              ${
                themeMode
                  ? "border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/20"
                  : "border-orange-300/30 bg-gradient-to-br from-orange-200/60 to-yellow-100/60"
              }
            `}
          >
            {themeMode ? (
              /* Moon */
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-300 transition-transform duration-500 group-hover:rotate-45"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              /* Sun */
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500 transition-transform duration-500 group-hover:rotate-90"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M6.34 17.66l-1.41 1.41" />
                <path d="M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
