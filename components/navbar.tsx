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
    <div className="border-b">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <MobileSidebar>
            <NavbarSearch />
            <NavItem />
          </MobileSidebar>
          <div className="flex items-center gap-8 max-md:hidden">
            <Logo />
            <NavItem />
          </div>
          <div className="max-md:hidden">
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
                <Button className="rounded-sm" asChild>
                  <SignUpButton />
                </Button>
                <Button className="rounded-sm" asChild>
                  <SignInButton />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
