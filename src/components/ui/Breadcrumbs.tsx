import { Link, useLocation, useParams } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { BREADCRUMB_MAP } from "../../types/BreadCrumbs";

type Crumb = { path: string; label: string };

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const params = useParams();

  // Build crumbs from URL segments so parent routes always appear
  const crumbs: Crumb[] = (() => {
    const segments = pathname.split("/").filter(Boolean); // removes leading/trailing ""
    const paramValueToKey = Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [String(v), k]),
    );

    return segments.map((seg, i) => {
      const path = "/" + segments.slice(0, i + 1).join("/");

      // If current segment equals a param value, map using param key
      const paramKey = paramValueToKey[seg];

      const label =
        (paramKey && BREADCRUMB_MAP[paramKey]) || BREADCRUMB_MAP[seg] || seg;

      return { path, label };
    });
  })();

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        sticky top-0 z-30
        rounded-xl border border-[#3A1A22]
        bg-linear-to-r from-[#241217] via-[#1F1216] to-[#241217]
        px-6 py-4
      "
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-[#D4AF37] hover:text-[#F5DEB3] transition"
          >
            <Home size={14} />
          </Link>
        </li>

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-[#F5DEB3]/40" />

              {isLast ? (
                <span className="font-medium text-[#F5DEB3]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-[#F5DEB3]/70 hover:text-[#F5DEB3] transition"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
