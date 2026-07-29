"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Modules" className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "relative block overflow-hidden rounded-lg py-2 pl-4 pr-3 text-sm transition-colors duration-200",
              active
                ? "bg-or-wash font-medium text-or-t"
                : "text-soft hover:bg-w3 hover:text-ink",
            ].join(" ")}
          >
            {/* Repère de la page courante : il se déplie plutôt que d'apparaître sec. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-[3px] origin-center bg-gr transition-transform duration-200"
              style={{
                transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                transform: active ? "scaleY(1)" : "scaleY(0)",
              }}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
