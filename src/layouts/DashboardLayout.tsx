import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCursor } from "@/core/hooks/useCursor";
import { useAuthStore } from "@/core/stores/auth.store";
import { useLogout } from "@/features/auth/hooks/useAuth";
import Overline from "@/shared/ui/Overline";
import { ButtonNavigate } from "@/shared/ui";
import type { RoleName } from "@ipartydjs/shared";

interface NAV_LINKS_TYPE {
    label: string;
    href: string;
    permit: RoleName[];
}

const navLinks: NAV_LINKS_TYPE[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        permit: ["cliente"],
    },
    {
        label: "Nueva solicitud",
        href: "/dashboard/solicitudes/nueva",
        permit: ["cliente"],
    },
    {
        label: "Mis Solicitudes",
        href: "/dashboard/solicitudes",
        permit: ["cliente"],
    },
    { label: "Mis Citas", href: "/dashboard/citas", permit: ["cliente"] },
    { label: "Mis Eventos", href: "/dashboard/eventos", permit: ["cliente"] },
    { label: "Mis reseñas", href: "/dashboard/resenias", permit: ["cliente"] },
    {
        label: "Dashboard",
        href: "/dashboard/admin",
        permit: ["administrador", "superadministrador"],
    },
    {
        label: "Usuarios",
        href: "/dashboard/admin/usuarios",
        permit: ["administrador", "superadministrador"],
    },
    {
        label: "Contactos",
        href: "/dashboard/admin/contactos",
        permit: ["superadministrador"],
    },
    {
        label: "Galeria",
        href: "/dashboard/admin/galeria",
        permit: ["superadministrador"],
    },
    {
        label: "Fotografias",
        href: "/dashboard/admin/fotografias",
        permit: ["colaborador_fotografico"],
    },
    {
        label: "Solicitudes",
        href: "/dashboard/admin/eventos",
        permit: ["administrador", "superadministrador"],
    },
    {
        label: "Citas",
        href: "/dashboard/admin/citas",
        permit: ["administrador", "superadministrador"],
    },
    {
        label: "Reportes",
        href: "/dashboard/admin/reportes",
        permit: ["superadministrador"],
    },
];

export default function DashboardLayout() {
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useCursor();

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const handleProfile = () => {
        closeMobileMenu();
        navigate("/dashboard/profile");
    };

    const handleLogout = () => {
        closeMobileMenu();
        logout();
    };

    return (
        <div className="min-h-screen  text-cream">
            <div className="border-b px-4 py-3 backdrop-blur-md lg:hidden">
                <div className="flex items-center justify-between">
                    <div className="font-display text-xl font-semibold">
                        <span className="text-cream">iParty</span>{" "}
                        <span className="text-gold">DJs</span>
                    </div>

                    <button
                        type="button"
                        aria-label="Abrir menú"
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="flex h-11 w-11 items-center justify-center rounded border border-gold/30 bg-surface-1 text-cream transition-colors hover:border-gold hover:text-gold"
                    >
                        <span className="relative block h-4 w-5">
                            <span
                                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                                    mobileMenuOpen
                                        ? "top-1.5 rotate-45"
                                        : "top-0 rotate-0"
                                }`}
                            />
                            <span
                                className={`absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />
                            <span
                                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                                    mobileMenuOpen
                                        ? "top-1.5 -rotate-45"
                                        : "top-3 rotate-0"
                                }`}
                            />
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gold/15 bg-on-surface p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:fixed lg:z-auto lg:w-72 lg:translate-x-0 lg:bg-surface lg:shadow-none lg:h-screen ${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
                >
                    <nav className="flex flex-1 flex-col">
                        <div className="hidden font-display text-xl font-semibold lg:block">
                            <span className="text-cream">iParty</span>{" "}
                            <span className="text-gold">DJs</span>
                        </div>

                        <div className="mb-8 mt-10 flex justify-center">
                            <Overline>{"Navegacion"}</Overline>
                        </div>

                        <div className="flex flex-col gap-1">
                            {user ? (
                                navLinks.map((link) => {
                                    if (!link.permit.includes(user.rol)) return;

                                    return (
                                        <NavLink
                                            key={link.href}
                                            to={link.href}
                                            end
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `group relative -mx-3 px-3 py-3 font-body text-[0.8rem] font-normal tracking-[0.12em] uppercase transition-all duration-300 ease-out hover:translate-x-1 ${
                                                    isActive
                                                        ? "text-gold"
                                                        : "text-cream/70 hover:text-cream"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <span>{link.label}</span>
                                                    <span
                                                        className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ease-out ${
                                                            isActive
                                                                ? "w-full opacity-100"
                                                                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                                                        }`}
                                                    />
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })
                            ) : (
                                <p>No estas logeado, accede porfavor</p>
                            )}
                        </div>

                        <div className="mb-8 mt-10 flex justify-center">
                            <Overline>{"Cuenta"}</Overline>
                        </div>

                        <div className="space-y-3">
                            <ButtonNavigate
                                type="button"
                                onClick={handleProfile}
                                className="w-full"
                            >
                                Mi perfil
                            </ButtonNavigate>
                            <ButtonNavigate
                                type="button"
                                onClick={handleLogout}
                                className="w-full"
                            >
                                Cerrar Sesión
                            </ButtonNavigate>
                        </div>
                    </nav>

                    <div className="mt-8 flex items-center gap-3 border-t border-gold/10 pt-4">
                        {user ? (
                            <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-body text-lg text-gold">
                                    {user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-xs text-cream/90">
                                        {user.email}
                                    </div>
                                    <div className="text-[0.6rem] uppercase tracking-[0.2em] text-gold/80">
                                        {user.rol}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-cream/80">
                                cargando...
                            </span>
                        )}
                    </div>
                </aside>

                {mobileMenuOpen && (
                    <button
                        type="button"
                        aria-label="Cerrar menú"
                        onClick={closeMobileMenu}
                        className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    />
                )}

                <div className="flex-1 overflow-hidden lg:ml-72">
                    <main className="min-h-screen bg-surface px-10 py-10 lg:px-15 lg:py-15">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
