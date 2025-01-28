import { useState, useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
import {
  getUserShelves,
  createShelf,
  addItemToShelf,
  deleteShelf,
} from "~/DB/shelves";
import type { Shelf } from "~/DB/auth";
import { Text } from "../Text";
import { Button } from "../Button";
import { AddShelfModal } from "./AddShelfModal";
import { AddItemModal } from "../items/AddItemModal";
import { DeleteShelfModal } from "./DeleteShelfModal";
import { ShelfTabs } from "./ShelfTabs";
import { Plus } from "lucide-react";

export function ShelfTable() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);

  useEffect(() => {
    async function fetchShelves() {
      if (!user) return;

      try {
        const userShelves = await getUserShelves(user.uid);
        setShelves(userShelves);
        if (userShelves.length > 0 && userShelves[0].id) {
          setActiveTab(userShelves[0].id!);
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
        <Button onClick={() => setIsAddShelfModalOpen(true)}>Add Shelf</Button>
      </div>
    );
  }

  const activeShelf = shelves.find((shelf) => shelf.id === activeTab);

  return (
    <div className="flex flex-col gap-4 p-2">
      <ShelfTabs
        shelves={shelves}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
        onAddClick={() => setIsAddShelfModalOpen(true)}
        onDeleteClick={setShelfToDelete}
      />

      {/* Content */}
      {activeShelf && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Text variant="subtitle">{activeShelf.name}</Text>
              <Button
                variant="outline"
                onClick={() => setIsAddItemModalOpen(true)}
              >
                <Plus size={16} />
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
          await addItemToShelf(user.uid, activeShelf.id!, itemData);
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
        shelfName={activeShelf?.name || ""}
      />

      {/* Delete Shelf Modal */}
      <DeleteShelfModal
        isOpen={shelfToDelete !== null}
        onClose={() => setShelfToDelete(null)}
        shelfName={shelfToDelete?.name ?? ""}
        onDelete={async () => {
          if (!user || !shelfToDelete || !shelfToDelete.id) return;
          await deleteShelf(user.uid, shelfToDelete.id);

          // Update active tab if needed
          if (activeTab === shelfToDelete.id) {
            const remainingShelves = shelves.filter(
              (s) => s.id !== shelfToDelete.id
            );
            if (remainingShelves.length > 0 && remainingShelves[0].id) {
              setActiveTab(remainingShelves[0].id!);
            }
          }

          // Refresh shelves
          const userShelves = await getUserShelves(user.uid);
          setShelves(userShelves);
        }}
      />
    </div>
  );
}
