import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Đường dẫn trang"
      style={{
        padding: "16px 0 12px 0",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontSize: "12px",
          color: "var(--color-slate, #707070)",
          flexWrap: "wrap",
        }}
      >
        <li>
          <Link
            to="/"
            style={{
              color: "var(--color-slate)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-slate)")}
          >
            <Home size={13} aria-hidden="true" />
            <span>Trang chủ</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li style={{ color: "var(--color-hairline-silver)", display: "flex", alignItems: "center" }}>
                <ChevronRight size={12} aria-hidden="true" />
              </li>
              <li>
                {isLast || !item.link ? (
                  <span
                    style={{
                      color: "var(--color-ink, #1d1d1f)",
                      fontWeight: 600,
                    }}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.link}
                    style={{
                      color: "var(--color-slate)",
                      textDecoration: "none",
                      transition: "color 150ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-slate)")}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

