"use client";
import React from "react";
import Link from "next/link";
import "../../../styles/bootstrap.css";
import { navRoutes, userMenuRoutes } from "../../lib/navRoutes";

const NavSide = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 border-end bg-light"
      style={{ width: "280px", height: "100vh" }}
    >
      <Link
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-light text-decoration-none bg-dark"
      >
        <span className="fs-4">Inventory System</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {navRoutes.map((route) => (
          <li key={route.path} className="nav-item">
            <Link
              href={route.path}
              className={`nav-link ${route.active ? "active" : "link-dark"}`}
              aria-current={route.active ? "page" : undefined}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
          id="dropdownUser2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt="User"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>User</strong>
        </a>
        <ul
          className="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          {userMenuRoutes.map((route, index) => (
            <React.Fragment key={index}>
              {route.divider && (
                <li>
                  <hr className="dropdown-divider" />
                </li>
              )}
              <li>
                <Link href={route.path} className="dropdown-item">
                  {route.label}
                </Link>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavSide;
