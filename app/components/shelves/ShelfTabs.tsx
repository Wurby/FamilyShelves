import { Trash } from "lucide-react";
import type { Shelf } from "~/DB/auth";
import { Button } from "../Button";

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
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 min-w-full">
          <div className="flex">
            {shelves.map((shelf, index) => (
              <div
                key={shelf.id}
                className={`flex items-center ${
                  index > 0
                    ? "border-l border-slate-200 dark:border-slate-700"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center -mb-px transition-colors active:outline-none focus:outline-none
                    ${
                      activeTab === shelf.id ? "border-b-2 border-sky-500" : ""
                    }`}
                >
                  <button
                    onClick={() => shelf.id && onTabChange(shelf.id)}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap active:outline-none focus:outline-none
                      ${
                        activeTab === shelf.id
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                  >
                    {shelf.name}
                  </button>
                  <Button
                    variant="icon"
                    warning
                    onClick={() => onDeleteClick(shelf)}
                    title="Delete shelf"
                    className="mr-2 focus:outline-none active:outline-none"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={onAddClick}
            className="whitespace-nowrap px-4 py-2 -mb-px"
          >
            Add Shelf
          </Button>
        </div>
      </div>
    </div>
  );
}
