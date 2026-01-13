"use client";

import Container from "./ui/container";
import Logo from "./Logo";
import NavbarActions from "./navbar-actions";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import NavbarSearch from "./navbar-search";
import MobileSidebar from "@/app/(admin)/_components/mobile-sidebar";
import NavItem from "./nav-item";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="sticky top-0 z-50 bg-primary transition-all text-white shadow-md">
      <Container>
        <div className="flex flex-col">
          <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center">
              <MobileSidebar>
                <NavItem />
              </MobileSidebar>
              <div className="md:hidden ml-2">
                <Logo />
              </div>
              <div className="flex items-center gap-8 max-md:hidden">
                <Logo />
                <NavItem />
              </div>
            </div>
            <div className="max-md:hidden w-full max-w-2xl mx-4">
              <NavbarSearch />
            </div>
            <div className="flex items-center">
              <NavbarActions />
              {isLoaded && isSignedIn ? (
                <div className="ml-2">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: {
                          height: 35,
                          width: 35,
                        },
                      },
                    }}
                  />
                </div>
              ) : isLoaded ? (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    className="rounded-full bg-white text-primary hover:bg-gray-100 border-none max-md:hidden"
                    asChild
                  >
                    <SignUpButton />
                  </Button>
                  <Button
                    className="rounded-full bg-white text-primary hover:bg-gray-100 border-none"
                    asChild
                  >
                    <SignInButton />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          {/* Mobile Search Bar - Second Row */}
          <div className="md:hidden px-4 pb-4">
            <NavbarSearch />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
