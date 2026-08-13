import React, { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenuButton from "./MobileMenuButton.jsx";

export default function Header({ activePage, logoTitle, navLabels }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "join", to: "/", label: navLabels.join, elementId: "nav-Join" },
    { id: "hub", to: "/hub", label: navLabels.hub, elementId: "nav-hub" },
    { id: "faq", to: "/faq", label: navLabels.faq, elementId: "nav-FAQ" },
  ];

  const visibleNavItems = navItems.filter((item) => item.id !== activePage);

  return (
    <header className="bg-white shadow-sm">
      <section className="container mx-auto px-4 py-3">
        <nav className="flex justify-between items-center">
          <figure className="flex items-center space-x-2 rtl:space-x-reverse">
            <img
              src="/img/chain.png"
              alt="Yellow chain link logo representing connection"
              className="h-8 w-8"
            />
            <figcaption className="logo text-2xl" id="logo-title">
              {logoTitle}
            </figcaption>
          </figure>

          <menu className="hidden md:flex space-x-6 rtl:space-x-reverse">
            {visibleNavItems.map((item) => (
              <li key={item.id}>
                <Link
                  id={item.elementId}
                  to={item.to}
                  className="nav-link text-gray-700 font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </menu>

          <MobileMenuButton onClick={() => setMobileOpen((v) => !v)} />
        </nav>
      </section>

      <aside
        id="mobileMenu"
        className={`${mobileOpen ? "" : "hidden"} md:hidden bg-white shadow-md`}
      >
        <menu className="container mx-auto px-4 py-2 space-y-3">
          {visibleNavItems.map((item) => (
            <li key={item.id}>
              <Link
                id={`mobile-${item.elementId}`}
                to={item.to}
                className="nav-link text-gray-700 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </menu>
      </aside>
    </header>
  );
}
