import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileMenuButton from './MobileMenuButton.jsx';


export default function Header({ activePage, logoTitle, navLabels }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (page) =>
    `nav-link text-gray-700 font-medium${page === activePage ? ' text-[#CF0820]' : ''}`;

  return (
    <header className="bg-white shadow-sm">
      <section className="container mx-auto px-4 py-3">
        <nav className="flex justify-between items-center">
          <figure className="flex items-center space-x-2 rtl:space-x-reverse">
            <img src="/img/chain.png" alt="Yellow chain link logo representing connection" className="h-8 w-8" />
            <figcaption className="logo text-2xl" id="logo-title">
              {logoTitle}
            </figcaption>
          </figure>

          <menu className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <li>
              <Link id="nav-Join" to="/" className={linkClass('join')}>
                {navLabels.join}
              </Link>
            </li>
            <li>
              <Link id="nav-hub" to="/hub" className={linkClass('hub')}>
                {navLabels.hub}
              </Link>
            </li>
            <li>
              <Link id="nav-FAQ" to="/faq" className={linkClass('faq')}>
                {navLabels.faq}
              </Link>
            </li>
          </menu>

          <MobileMenuButton onClick={() => setMobileOpen((v) => !v)} />
        </nav>
      </section>

      <aside id="mobileMenu" className={`${mobileOpen ? '' : 'hidden'} md:hidden bg-white shadow-md`}>
        <menu className="container mx-auto px-4 py-2 space-y-3">
          <li>
            <Link id="mobile-nav-main" to="/" className={linkClass('join')} onClick={() => setMobileOpen(false)}>
              {navLabels.join}
            </Link>
          </li>
          <li>
            <Link id="mobile-nav-hub" to="/hub" className={linkClass('hub')} onClick={() => setMobileOpen(false)}>
              {navLabels.hub}
            </Link>
          </li>
          <li>
            <Link id="mobile-nav-FAQ" to="/faq" className={linkClass('faq')} onClick={() => setMobileOpen(false)}>
              {navLabels.faq}
            </Link>
          </li>
        </menu>
      </aside>
    </header>
  );
}
