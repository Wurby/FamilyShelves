import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import { Text } from "../components/Text";
import { ShelfTable } from "../components/shelves/ShelfTable";
import { useState } from "react";
import type { Shelf } from "~/DB/auth";
import { Plus } from "lucide-react";
import { Button } from "~/components/Button";
import ShelfControl from "~/components/ShelfControl/ShelfControl";

// Colocated types
namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;
  export type MetaArgs = Parameters<MetaFunction>[0];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FamilyShelves - Dashboard" },
    { name: "description", content: "Manage your home inventory" },
  ];
}

export default function App() {
  const { user, loading } = useAuth();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <section className="flex flex-col gap-2 border-t pt-2 border-slate-200 dark:border-slate-800 scrollbar-hide mx-auto w-full md:w-xl">
        <Text centered variant="subtitle">
          {activeTab
            ? shelves.find((shelf) => shelf.id === activeTab)?.name
            : "Your shelves"}
        </Text>

        <ShelfTable
          shelves={shelves}
          setShelves={setShelves}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          shelfToDelete={shelfToDelete}
          setShelfToDelete={setShelfToDelete}
          isAddShelfModalOpen={isAddShelfModalOpen}
          setIsAddShelfModalOpen={setIsAddShelfModalOpen}
          isAddItemModalOpen={isAddItemModalOpen}
          setIsAddItemModalOpen={setIsAddItemModalOpen}
        />
      </section>
      <section className="fixed bottom-0 pb-[env(safe-area-inset-bottom)] left-0 right-0">
        <ShelfControl
          setIsAddShelfModalOpen={setIsAddShelfModalOpen}
          setIsAddItemModalOpen={setIsAddItemModalOpen}
          shelves={shelves}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id)}
          onDeleteClick={setShelfToDelete}
        />
      </section>
    </div>
  );
}
