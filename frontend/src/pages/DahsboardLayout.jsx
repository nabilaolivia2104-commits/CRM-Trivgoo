import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoTrivgoo from "../assets/logo-trivgoo.png";
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        className={`bg-dark text-white p-3 d-flex flex-column justify-content-between ${
          sidebarOpen ? "flex-shrink-0" : "d-none d-md-flex"
        }`}
        style={{ width: sidebarOpen ? "250px" : "0", transition: "0.3s" }}
      >
        <div>
          {/* Header sidebar dengan tombol close mobile */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="text-center">
              <img src={LogoTrivgoo} alt="logo trivgo" className="w-75" />
            </div>
            {/* Tombol close hanya muncul di mobile */}
            <div className=" d-md-none" onClick={() => setSidebarOpen(false)}>
              <i className="bi bi-x-lg text-white fs-3"></i>
            </div>
          </div>

          <ul className="nav nav-pills flex-column">
            <li className="nav-item mb-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link text-white" +
                  (isActive ? " bg-warning text-dark" : "")
                }
              >
                Dashboard
              </NavLink>
            </li>
            {(user.role === "admin" || user.role === "sales") && (
              <li className="nav-item mb-2">
                <NavLink
                  to="/clients"
                  className={({ isActive }) =>
                    "nav-link text-white" +
                    (isActive ? " bg-warning text-dark" : "")
                  }
                >
                  Clients
                </NavLink>
              </li>
            )}

            {user.role === "admin" && (
              <li className="nav-item mb-2">
                <NavLink
                  to="/sales"
                  className={({ isActive }) =>
                    "nav-link text-white" +
                    (isActive ? " bg-warning text-dark" : "")
                  }
                >
                  Sales
                </NavLink>
              </li>
            )}
            {(user.role === "admin" || user.role === "sales") && (
              <li className="nav-item mb-2">
                <NavLink
                  to="/proposal"
                  className={({ isActive }) =>
                    "nav-link text-white" +
                    (isActive ? " bg-warning text-dark" : "")
                  }
                >
                  Proposal
                </NavLink>
              </li>
            )}
            {(user.role === "admin" || user.role === "sales") && (
              <li className="nav-item mb-2">
                <NavLink
                  to="/deals"
                  className={({ isActive }) =>
                    "nav-link text-white" +
                    (isActive ? " bg-warning text-dark" : "")
                  }
                >
                  Deal
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Logout di bagian bawah sidebar */}
        <div>
          <button className="btn btn-warning w-100" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 bg-light">
        {/* HEADER */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
          <div className="container-fluid">
            {/* Toggle sidebar */}
            <div
              className=" me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-3"></i>
            </div>

            {/* Profile info */}
            <div className="dropdown ms-auto">
              <div
                className=" d-flex align-items-center"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-3 me-2"></i>
                <span className="d-none d-md-inline">
                  {user.nama || user.email}
                </span>
              </div>

              <ul
                className="dropdown-menu dropdown-menu-end p-3"
                aria-labelledby="profileDropdown"
                style={{ minWidth: "220px" }}
              >
                <div className="d-flex">
                  <li className="d-flex align-items-center gap-2">
                    <i className="bi bi-person-circle fs-3"></i>

                    <div>
                      <strong>{user.nama}</strong>
                      <div className="text-muted small">{user.role}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </nav>

        {/* CONTENT AREA */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
