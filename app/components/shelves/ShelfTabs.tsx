import { Trash, ChevronRight, Plus } from "lucide-react";
import type { Shelf } from "~/DB/auth";
import { Button } from "../Button";
import { useState, useRef, useEffect } from "react";

interface ShelfTabsProps {
  shelves: Shelf[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onAddClick: () => void;
  onDeleteClick: (shelf: Shelf) => void;
}

export function ShelfTabs({
  shelves,
  activeTab,
  onTabChange,
  onAddClick,
  onDeleteClick,
}: ShelfTabsProps) {
  const [showCaret, setShowCaret] = useState(false);

  useEffect(() => {
    setShowCaret(shelves.length > 2);
  }, [shelves.length]);

  return (
    <>
      <div className="flex gap-2 relative overflow-x-auto overflow-y-hidden scrollbar-none w-full">
        <section className="flex flex-nowrap mr-6 overflow-x-auto overflow-y-hidden scrollbar-none w-full">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className={`flex items-center transition-colors active:outline-none focus:outline-none flex-1 
                ${
                  activeTab === shelf.id
                    ? "border-b-4 border-sky-600 dark:border-sky-400 bg-gradient-to-b from-transparent dark:to-sky-900 via-transparent to-sky-200"
                    : "mb-0.5"
                }`}
            >
              <section
                onClick={() => shelf.id && onTabChange(shelf.id)}
                role="button"
                aria-pressed={activeTab === shelf.id}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap active:outline-none focus:outline-none flex-grow
                  ${
                    activeTab === shelf.id
                      ? "text-sky-600 dark:text-sky-400"
                      : ""
                  }`}
              >
                {shelf.name}
              </section>

              <Button
                variant="icon"
                icon={Trash}
                color="warning"
                onClick={() => onDeleteClick(shelf)}
                title="Delete shelf"
                className="mr-2 focus:outline-none active:outline-none flex-shrink"
              />
            </div>
          ))}
          <div className="flex items-center">
            <Button variant="icon" icon={Plus} onClick={onAddClick} />
          </div>
        </section>
        {showCaret && (
          <div className="absolute h-full right-0 top-1/4 ">
            <ChevronRight className="w-5 animate-pulse h-5 text-sky-400" />
          </div>
        )}
      </div>
    </>
  );
}
