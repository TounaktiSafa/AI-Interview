"use client"; // 👈 Ajoute ceci en haut du fichier

import { useRouter } from 'next/navigation';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const router = useRouter(); // ✅ Maintenant, `useRouter()` fonctionnera correctement

  const navigation = [
    { name: "Home", href: "", current: true },
    { name: "How It Works ?", href: "#how-it-works", current: false },
    { name: "Who We Help ?", href: "#who-we-help", current: false },
    { name: "Pricing", href: "#pricing", current: false }
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-indigo-500 shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo & Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "text-gray-100"
                        : "text-gray-50 ",
                      "rounded-md px-3 py-2 text-base font-semibold"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Profile & Sign In */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <div>
                {/* Bouton Sign In redirigeant vers /sign-up */}
                <MenuButton
                  onClick={() => router.push("/sign-up")}
                  className="rounded-md bg-indigo-500 py-2 px-4 border border-transparent text-center text-base text-white transition-all  focus:bg-indigo-600 focus:shadow-none active:bg-indigo-700 hover:bg-indigo-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                >
                  Sign Up
                </MenuButton>
              </div>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
