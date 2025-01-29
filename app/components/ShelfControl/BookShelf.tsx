import React, { useState, useRef } from "react";
import { Plus, TableCellsSplit, Trash } from "lucide-react";
import { Text } from "../Text";
import type { Shelf } from "~/DB/auth";
import { Button } from "../Button";

interface BookShelfProps {
  shelves: Shelf[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onDeleteClick: (shelf: Shelf) => void;
  setIsAddShelfModalOpen: (open: boolean) => void;
}

function useClickAway(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Using pointerdown instead of mousedown/touchstart
    // as it handles both mouse and touch events
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [callback]);

  return ref;
}

export const BookShelf = ({
  shelves,
  activeTab,
  onTabChange,
  onDeleteClick,
  setIsAddShelfModalOpen,
}: BookShelfProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickAway(() => setIsOpen(false));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />}

      <div ref={containerRef} className="relative z-20">
        <div
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          aria-label="Open shelf"
          className="flex items-center gap-2 justify-around w-full"
        >
          <Button
            variant="iconNoBorder"
            icon={TableCellsSplit}
            className="flex-shrink-0"
          />
          <Text>Shelves</Text>
        </div>
        <section
          className={`transition-all duration-300 ${
            isOpen
              ? "absolute -translate-y-full w-36"
              : "absolute translate-y-full w-36"
          }`}
        >
          <div className="flex flex-col w-full bg-white dark:bg-slate-800 shadow-lg">
            {shelves.map((shelf) => (
              <div
                key={shelf.id}
                className={`flex items-center justify-between py-4 px-1 border-b border-slate-200 dark:border-slate-700
              ${activeTab === shelf.id ? "bg-sky-50 dark:bg-sky-900/30" : ""}`}
              >
                <Button
                  variant="icon"
                  icon={Trash}
                  color="warning"
                  onClick={() => onDeleteClick(shelf)}
                  title="Delete shelf"
                  className="flex-shrink-0"
                />
                <div
                  onClick={() => {
                    shelf.id && onTabChange(shelf.id);
                    setIsOpen(false);
                  }}
                  role="button"
                  aria-label={`Switch to ${shelf.name} shelf`}
                  className={`flex-grow text-right px-2 py-1 h-full rounded-md
                ${
                  activeTab === shelf.id
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-700 dark:text-slate-300"
                }`}
                >
                  {shelf.name}
                </div>
              </div>
            ))}
            <div
              role="button"
              aria-label="Add shelf"
              onClick={() => setIsAddShelfModalOpen(true)}
              className={`flex items-center justify-between py-4 px-1 border-b  border-slate-200 dark:border-slate-700`}
            >
              <Button
                variant="icon"
                onClick={() => setIsAddShelfModalOpen(true)}
                icon={Plus}
              />
              <Text>Add Shelf</Text>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookShelf;
