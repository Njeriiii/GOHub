import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthProvider";
import { LogOutIcon } from "lucide-react";
import { Translate, LanguageSwitch } from '../contexts/TranslationProvider';

// Header component This component represents the header of the application.
// It includes the navigation links and user authentication controls.

// Navigation links
const navigation = [
    { name: "Home", href: "/" },
    { name: "Find GOs", href: "/find-gos" },
    { name: "Establishment Guide", href: "/establishment-guide" },
    { name: "Proposal Builder", href: "/proposal-builder" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "About Us", href: "/about-us" },
];

// Logo component
const Logo = ({ className = "h-10 w-10" }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="50" cy="50" r="45" fill="#14B8A6" />
        <path
        d="M30 70 Q 50 30 70 70"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        />
        <circle cx="50" cy="30" r="10" fill="white" />
    </svg>
);

// Header component
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md">
        <nav
            className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
            aria-label="Global"
        >
            <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5 flex items-center">
                <span className="sr-only">GOHub</span>
                <Logo />
                <span className="ml-2 text-xl font-bold text-gray-900">GOHub</span>
            </a>
            </div>
            <div className="flex lg:hidden">
            <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
            >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
                <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-teal-600 transition duration-150 ease-in-out"
                >
                    <Translate>{item.name}</Translate>
                </a>
            ))}
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {user ? (
                            <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold text-gray-900">
                                <Translate>Welcome!</Translate> {user.name}
                            </span>
                            <div className="border-l border-gray-200 h-6" />
                            <LanguageSwitch />
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold leading-6 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md transition duration-150 ease-in-out flex items-center"
                            >
                                <LogOutIcon className="h-5 w-5 mr-2" />
                                <Translate>Log out</Translate>
                            </button>
                        </div>
                    ) : (<div className="flex items-center gap-4">
                        <LanguageSwitch />
                        <a
                            href="/login"
                            className="text-sm font-semibold leading-6 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md transition duration-150 ease-in-out flex items-center"
                        >
                            <UserCircleIcon className="h-5 w-5 mr-2" />
                            <Translate>Login</Translate>
                        </a>
                        </div>
                    )}
            </div>
        </nav>
        <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
        >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5 flex items-center">
                <span className="sr-only">GOHub</span>
                <Logo className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                    GOHub
                </span>
                </a>
                <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
                >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                        <Translate>{item.name}</Translate>
                    </a>
                    ))}
                    <LanguageSwitch />
                </div>
                <div className="py-6">
                    
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white bg-teal-600 hover:bg-teal-700 w-full text-left"
                        >
                            <Translate>Log out</Translate>
                        </button>
                    ) : (
                        <a
                            href="/login"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white bg-teal-600 hover:bg-teal-700"
                        >
                            <Translate>Login</Translate>
                        </a>
                    )}
                </div>
                </div>
            </div>
            </Dialog.Panel>
        </Dialog>
        </header>
    );
}
