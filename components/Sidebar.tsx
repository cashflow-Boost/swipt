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
              "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium",
              active
                ? "bg-or-wash text-or-t"
                : "text-soft hover:bg-w2 hover:text-ink",
            ].join(" ")}
          >
            <span>{item.label}</span>
            {"badge" in item && item.badge && (
              <span className="rounded-pill bg-or px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
