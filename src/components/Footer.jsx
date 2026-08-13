import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ title, description, joinLabel, hubLabel, faqLabel, copyright }) {
  return (
    <footer className="footer text-white py-8 w-full">
      <section className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <figure className="flex items-center space-x-2 rtl:space-x-reverse mb-4 md:mb-0" id="footer-logo-desc">
          <img src="/img/chainF.png" alt="Yellow chain link logo in footer section" className="h-6 w-6" />
          <figcaption>
            <span className="font-bold text-lg" id="footer-title">
              {title}
            </span>
            <p className="text-sm mt-2" id="footer-desc">
              {description}
            </p>
          </figcaption>
        </figure>

        <nav className="flex flex-col items-center md:items-end" id="footer-links-col">
          <menu className="flex space-x-4 rtl:space-x-reverse mb-3" id="footer-links">
            <li>
              <Link id="footer-main" to="/" className="hover:text-yellow-300 transition-colors">
                {joinLabel}
              </Link>
            </li>
            <li>
              <Link id="footer-hub" to="/hub" className="hover:text-yellow-300 transition-colors">
                {hubLabel}
              </Link>
            </li>
            <li>
              <Link id="footer-faq" to="/faq" className="hover:text-yellow-300 transition-colors">
                {faqLabel}
              </Link>
            </li>
          </menu>
          <p className="text-xs" id="footer-copyright" dangerouslySetInnerHTML={{ __html: copyright }} />
        </nav>
      </section>
    </footer>
  );
}
