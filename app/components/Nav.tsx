import React from "react";
import { Text } from "./Text";

const Nav = () => {
  return (
    <>
      <nav className="flex flex-col w-full fixed top-0 left-0 right-0 bg-slate-200 dark:bg-slate-950 py-2">
        <div className="h-[env(safe-area-inset-top,45px)] w-full min-h-[env(safe-area-inset-top,45px)] block"></div>
        <div className="flex flex-col">
          <Text variant="title" centered>
            FamilyShelves
          </Text>
        </div>
      </nav>
    </>
  );
};

export default Nav;
