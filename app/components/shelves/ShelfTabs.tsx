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
      <div className="flex gap-2 relative overflow-x-auto overflow-y-hidden scrollbar-none">
        <section className="flex flex-nowrap gap-2 mr-6 overflow-x-auto overflow-y-hidden scrollbar-none">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className={`flex items-center -mb-px transition-colors active:outline-none focus:outline-none
                ${activeTab === shelf.id ? "border-b-2 border-sky-500" : ""}`}
            >
              <section
                onClick={() => shelf.id && onTabChange(shelf.id)}
                role="button"
                aria-pressed={activeTab === shelf.id}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap active:outline-none focus:outline-none
                  ${
                    activeTab === shelf.id
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                className="mr-2 focus:outline-none active:outline-none"
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
