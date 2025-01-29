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
import { AddShelfModal } from "./AddShelfModal";
import { AddItemModal } from "../items/AddItemModal";
import { DeleteShelfModal } from "./DeleteShelfModal";
import { Info, X } from "lucide-react";
import { Button } from "../Button";

interface ShelfTableProps {
  shelves: Shelf[];
  setShelves: (shelves: Shelf[]) => void;
  activeTab: string;
  setActiveTab: (id: string) => void;
  shelfToDelete: Shelf | null;
  setShelfToDelete: (shelf: Shelf | null) => void;
  isAddShelfModalOpen: boolean;
  setIsAddShelfModalOpen: (open: boolean) => void;
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (open: boolean) => void;
}

interface ShelfItem {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  notes?: string;
  location?: string;
}

interface ItemDetailsPopupProps {
  item: ShelfItem;
  isOpen: boolean;
  onClose: () => void;
}

function ItemDetailsPopup({ item, isOpen, onClose }: ItemDetailsPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text variant="subtitle">{item.name}</Text>
            <Button variant="iconNoBorder" icon={X} onClick={onClose} />
          </div>

          <div className="grid gap-2">
            <div>
              <Text variant="caption">Location</Text>
              <Text>{item.location || "No location set"}</Text>
            </div>

            <div>
              <Text variant="caption">Quantity</Text>
              <Text>
                {item.quantity} {item.unit}
              </Text>
            </div>

            <div>
              <Text variant="caption">Expiration Date</Text>
              <Text>{item.expirationDate.toLocaleDateString()}</Text>
            </div>

            <div>
              <Text variant="caption">Notes</Text>
              <Text>{item.notes || "No notes"}</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ShelfTable({
  shelves,
  setShelves,
  activeTab,
  setActiveTab,
  shelfToDelete,
  setShelfToDelete,
  isAddShelfModalOpen,
  setIsAddShelfModalOpen,
  isAddItemModalOpen,
  setIsAddItemModalOpen,
}: ShelfTableProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShelfItem | null>(null);

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
      </div>
    );
  }

  const activeShelf = shelves.find((shelf) => shelf.id === activeTab);

  return (
    <>
      {activeShelf && (
        <div className="flex flex-col border-2 border-slate-400 dark:border-slate-600">
          {(activeShelf.items?.length ?? 0) > 0 ? (
            <div className="flex flex-col">
              {activeShelf.items?.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 > 0 ? "bg-slate-300 dark:bg-slate-600" : ""
                  } flex justify-between h-14 items-center divide-x-2 divide-slate-400 dark:divide-slate-600`}
                >
                  <div className="flex flex-col px-2 py-1 w-1/3">
                    <Text variant="subtitle">{item.name}</Text>
                    <Text variant="caption" muted>
                      Expires: {item.expirationDate.toLocaleDateString()}
                    </Text>
                  </div>
                  <div
                    role="button"
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center justify-center w-1/3 h-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <Text>Item Details</Text>
                    <Button variant="iconNoBorder" color="muted" icon={Info} />
                  </div>
                  <div className="flex flex-col w-1/3 px-2 py-1 justify-end items-end">
                    <Text>
                      {item.quantity} {item.unit}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text muted centered>
              No items in this shelf
            </Text>
          )}
        </div>
      )}

      <ItemDetailsPopup
        item={selectedItem!}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />

      <AddShelfModal
        isOpen={isAddShelfModalOpen}
        onClose={() => setIsAddShelfModalOpen(false)}
        onAdd={async ({ name }) => {
          if (!user) return;
          await createShelf(user.uid, { name });

          const userShelves = await getUserShelves(user.uid);
          setShelves(userShelves);
        }}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAdd={async (itemData) => {
          if (!user || !activeShelf) return;
          await addItemToShelf(user.uid, activeShelf.id!, itemData);

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

      <DeleteShelfModal
        isOpen={shelfToDelete !== null}
        onClose={() => setShelfToDelete(null)}
        shelfName={shelfToDelete?.name ?? ""}
        onDelete={async () => {
          if (!user || !shelfToDelete || !shelfToDelete.id) return;
          await deleteShelf(user.uid, shelfToDelete.id);

          if (activeTab === shelfToDelete.id) {
            const remainingShelves = shelves.filter(
              (s) => s.id !== shelfToDelete.id
            );
            if (remainingShelves.length > 0 && remainingShelves[0].id) {
              setActiveTab(remainingShelves[0].id!);
            }
          }

          const userShelves = await getUserShelves(user.uid);
          setShelves(userShelves);
        }}
      />
    </>
  );
}
