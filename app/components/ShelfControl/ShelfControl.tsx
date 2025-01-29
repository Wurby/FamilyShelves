import React from "react";
import type { Shelf } from "~/DB/auth";
import BookShelf from "./BookShelf";
import { Camera, Plus } from "lucide-react";
import { Button } from "../Button";
import { Text } from "../Text";
interface ShelfControlProps {
  shelves: Shelf[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onDeleteClick: (shelf: Shelf) => void;
  setIsAddShelfModalOpen: (open: boolean) => void;
  setIsAddItemModalOpen: (open: boolean) => void;
}

export const ShelfControl = ({
  shelves,
  activeTab,
  onTabChange,
  onDeleteClick,
  setIsAddShelfModalOpen,
  setIsAddItemModalOpen,
}: ShelfControlProps) => {
  return (
    <section className="fixed flex justify-between items-center bottom-0 pb-[env(safe-area-inset-bottom)] left-0 w-full h-18 bg-slate-300 dark:bg-slate-800 border-t-2 border-sky-300 dark:border-sky-600">
      {/* Left side */}
      <div className="flex-1 flex justify-start pl-4">
        <BookShelf
          setIsAddShelfModalOpen={setIsAddShelfModalOpen}
          shelves={shelves}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onDeleteClick={onDeleteClick}
        />
      </div>

      {/* Center - Camera button */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/3 top-0 bg-slate-300 dark:bg-slate-800 p-4 rounded-full  border-2 border-sky-300 dark:border-sky-600">
        <Button variant="iconNoBorder" icon={Camera} className="p-2" />
      </div>

      {/* Right side */}
      <div className="flex-1 flex justify-end pr-4">
        <div
          role="button"
          aria-label="Add item"
          onClick={() => setIsAddItemModalOpen(true)}
          className="flex items-center gap-2 justify-around"
        >
          <Text>Add item</Text>
          <Button
            variant="iconNoBorder"
            icon={Plus}
            onClick={() => {
              setIsAddItemModalOpen(true);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ShelfControl;
