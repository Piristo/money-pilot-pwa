"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Briefcase, BarChart3, User, Car } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

const navItems = [
    { href: "/", label: "Главная", icon: LayoutGrid }, // Dashboard icon
    { href: "/budgets", label: "Бюджет", icon: Briefcase }, // Budget icon
    { href: "/analytics", label: "Аналитика", icon: BarChart3 }, // Analytics page with charts
    { href: "/auto", label: "Авто", icon: Car }, // Auto/Garage
    { href: "/profile", label: "Профиль", icon: User }, // Profile
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="mx-auto min-h-screen max-w-md bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
            <main className="px-5 pb-28 pt-8 min-h-screen relative z-10">
                {children}
            </main>

            {/* Bottom Navigation matching screenshot style */}
            <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md h-20 bg-card border-t border-card-border px-6 flex items-center justify-between z-50">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center gap-1.5 w-12 h-12"
                        >
                            <div className="relative z-10">
                                <Icon
                                    strokeWidth={isActive ? 2.5 : 2}
                                    size={22}
                                    className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-dot"
                                        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
