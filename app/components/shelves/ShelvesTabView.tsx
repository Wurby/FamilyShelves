import { useState, useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
import { getUserShelves, createShelf, addItemToShelf } from "~/DB/shelves";
import type { Shelf } from "~/DB/auth";
import { Text } from "../Text";
import { Button } from "../Button";
import { AddShelfModal } from "./AddShelfModal";
import { AddItemModal } from "../items/AddItemModal";

export function ShelvesTabView() {
  const [shelves, setShelves] = useState<(Shelf & { id: string })[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  useEffect(() => {
    async function fetchShelves() {
      if (!user) return;

      try {
        const userShelves = await getUserShelves(user.uid);
        setShelves(userShelves);
        if (userShelves.length > 0) {
          setActiveTab(userShelves[0].id);
        }
      } catch (error) {
        console.error("Error fetching shelves:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchShelves();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Text>Loading shelves...</Text>
      </div>
    );
  }

  if (shelves.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Text>No shelves found</Text>
      </div>
    );
  }

  const activeShelf = shelves.find((shelf) => shelf.id === activeTab);

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs Container */}
      <div className="relative">
        {/* Scrollable Tabs */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 min-w-full">
            <div className="flex gap-1">
              {shelves.map((shelf) => (
                <button
                  key={shelf.id}
                  onClick={() => setActiveTab(shelf.id)}
                  className={`px-4 py-2 -mb-px font-medium transition-colors whitespace-nowrap
                    ${
                      activeTab === shelf.id
                        ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                  {shelf.name}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAddShelfModalOpen(true)}
              className="whitespace-nowrap px-4 py-2 -mb-px"
            >
              Add Shelf
            </Button>
          </div>
        </div>

        {/* Fade Indicators */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-slate-800 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-800 to-transparent" />
      </div>

      {/* Content */}
      {activeShelf && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Text variant="subtitle">{activeShelf.name}</Text>
              <Button
                variant="solid"
                onClick={() => setIsAddItemModalOpen(true)}
              >
                Add Item
              </Button>
            </div>

            {/* Items List */}
            {(activeShelf.items?.length ?? 0) > 0 ? (
              <div className="grid gap-2">
                {activeShelf.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md"
                  >
                    <div className="flex flex-col">
                      <Text>{item.name}</Text>
                      <Text variant="caption" muted>
                        Expires: {item.expirationDate.toLocaleDateString()}
                      </Text>
                    </div>
                    <Text>
                      {item.quantity} {item.unit}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text muted centered>
                No items in this shelf
              </Text>
            )}
          </div>
        </div>
      )}

      {/* Add Shelf Modal */}
      <AddShelfModal
        isOpen={isAddShelfModalOpen}
        onClose={() => setIsAddShelfModalOpen(false)}
        onAdd={async ({ name }) => {
          if (!user) return;
          await createShelf(user.uid, { name });
          // Refresh shelves
          const userShelves = await getUserShelves(user.uid);
          setShelves(userShelves);
        }}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAdd={async (itemData) => {
          if (!user || !activeShelf) return;
          await addItemToShelf(user.uid, activeShelf.id, itemData);
          // Refresh shelves
          const userShelves = await getUserShelves(user.uid);
          setShelves(userShelves);
        }}
        defaultValues={{
          unit: activeShelf?.settings?.defaultUnit || "each",
          quantity: activeShelf?.settings?.defaultQuantity || 1,
          expirationDays: activeShelf?.settings?.defaultExpirationDate || 7,
          location: activeShelf?.settings?.defaultLocation,
        }}
      />
    </div>
  );
}
