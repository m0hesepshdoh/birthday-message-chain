import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  endAt,
  limit as fbLimit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { hubTranslations } from "../data/hubTranslations.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LanguageToggleButton from "../components/LanguageToggleButton.jsx";
import ScrollToTopButton from "../components/ScrollToTopButton.jsx";
import MessageCard from "../components/MessageCard.jsx";
import { Link } from "react-router-dom";

const PAGE_SIZE = 7;

export default function HubPage() {
  const { lang } = useLanguage();
  const t = hubTranslations[lang];

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSortingByBirthday, setIsSortingByBirthday] = useState(
    () => localStorage.getItem("isSortingByBirthday") === "true",
  );

  const lastVisibleRef = useRef(null);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const searchTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const formatTimeAgo = useCallback(
    (date) => {
      if (!date) return t.justNow;
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      if (seconds < 60) return t.justNow;
      if (seconds < 3600) return t.minutesAgo(Math.floor(seconds / 60));
      if (seconds < 86400) return t.hoursAgo(Math.floor(seconds / 3600));
      return t.daysAgo(Math.floor(seconds / 86400));
    },
    [t],
  );

  const fetchMessages = useCallback(
    async (reset = false, term = "") => {
      if (isFetchingRef.current || (!hasMoreRef.current && !reset)) return;
      isFetchingRef.current = true;
      setLoading(true);
      setError(false);

      if (reset) {
        lastVisibleRef.current = null;
        hasMoreRef.current = true;
        setMessages([]);
      }

      try {
        const submissionsRef = collection(db, "submissions");
        const clauses = [];

        if (term) {
          const lower = term.toLowerCase();
          clauses.push(where("message", ">=", lower));
          clauses.push(where("message", "<=", lower + "\uf8ff"));
          clauses.push(orderBy("message"));
        }

        if (isSortingByBirthday) {
          clauses.push(orderBy("birthMonth"));
          clauses.push(orderBy("birthDay"));
        } else {
          clauses.push(orderBy("timestamp", "desc"));
        }

        if (lastVisibleRef.current && !reset) {
          clauses.push(startAfter(lastVisibleRef.current));
        }

        clauses.push(fbLimit(PAGE_SIZE));

        const q = query(submissionsRef, ...clauses);
        const snapshot = await getDocs(q);

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const next = [...prev];
          snapshot.forEach((docSnap) => {
            if (!existingIds.has(docSnap.id)) {
              next.push({ id: docSnap.id, data: docSnap.data() });
            }
          });
          return next;
        });

        if (snapshot.empty && reset) {
          hasMoreRef.current = false;
        }

        if (!snapshot.empty) {
          lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1];
        }

        if (snapshot.size < PAGE_SIZE) {
          hasMoreRef.current = false;
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(true);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [isSortingByBirthday],
  );

  useEffect(() => {
    fetchMessages(true, searchTerm);
  }, [isSortingByBirthday]);

  useEffect(() => {
    fetchMessages(true, "");
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchMessages(true, value.trim());
    }, 300);
  };

  const handleSortToggle = () => {
    const next = !isSortingByBirthday;
    setIsSortingByBirthday(next);
    localStorage.setItem("isSortingByBirthday", String(next));
    localStorage.setItem("sortField", next ? "birthDay" : "timestamp");
  };

  useEffect(() => {
    const onScroll = () => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 400 &&
          !isFetchingRef.current &&
          lastVisibleRef.current &&
          hasMoreRef.current
        ) {
          fetchMessages(false, searchTerm.trim());
        }
      }, 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchMessages, searchTerm]);

  const noMessages = !loading && messages.length === 0 && !error;

  return (
    <>
      <Header
        activePage="hub"
        logoTitle={t.logoTitle}
        navLabels={{ join: t.navJoin, hub: t.messagesTitle, faq: t.navFaq }}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center mb-2">
          <h2 id="main-title" className="text-3xl font-bold text-gray-800 mb-2">
            {t.title}
          </h2>
          <p id="main-description" className="text-gray-600">
            {t.description}
          </p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            id="searchBar"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-xl font-semibold text-gray-700"
            id="messages-title"
          >
            {t.messagesTitle}
          </h2>
          <div className="flex space-x-2">
            <button
              id="sortMonthBtn"
              onClick={handleSortToggle}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              type="button"
            >
              {isSortingByBirthday ? t.sortLatest : t.sortMonth}
            </button>
          </div>
        </div>

        {loading && (
          <div id="loadingIndicator" className="flex justify-center my-12">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12" />
          </div>
        )}

        <div id="messagesContainer" className="grid gap-6">
          {messages.map(({ id, data }) => (
            <MessageCard
              key={id}
              id={id}
              msg={data}
              lang={lang}
              monthNames={t.months}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>

        {noMessages && (
          <div id="noMessages" className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3
              className="text-lg font-medium text-gray-700 mb-1"
              id="no-messages-title"
            >
              {t.noMessagesTitle}
            </h3>
            <p className="text-gray-500" id="no-messages-desc">
              {t.noMessagesDesc}
            </p>
          </div>
        )}

        {error && (
          <div id="errorDisplay" className="text-center py-12 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-1" id="error-title">
              {t.errorTitle}
            </h3>
            <p className="mb-4" id="error-desc">
              {t.errorDesc}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              type="button"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      <div className="flex justify-center my-8">
        <Link
          to="/"
          id="joinNowBtn"
          className="floating-button px-6 py-3 bg-[#CF0820] text-white rounded-full hover:bg-[#9d0618] transition shadow-lg"
        >
          <span id="joinNowText">{t.joinNowButton}</span>
        </Link>
      </div>

      <Footer
        title={t.footerTitle}
        description={t.footerDesc}
        joinLabel={t.footerJoin}
        hubLabel={t.messagesTitle}
        faqLabel={t.footerFaq}
        copyright={t.copyright}
      />

      <ScrollToTopButton />
      <LanguageToggleButton />
    </>
  );
}
