import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import { Button } from "../components/Button";
import { Text } from "../components/Text";

// Colocated types
namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;
  export type MetaArgs = Parameters<MetaFunction>[0];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FamilyShelves" },
    { name: "description", content: "Welcome to FamilyShelves" },
  ];
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-6 p-8 border-2 border-slate-500 rounded-md w-[340px]">
          <div className="flex flex-col gap-2">
            <Text variant="subtitle" centered>
              You are signed in as:
            </Text>
            <Text centered className="font-medium">
              {user.displayName || user.email}
            </Text>
          </div>

          <div className="flex flex-col gap-6">
            <Link to="/app">
              <Button variant="solid" className="w-full">
                Launch App
              </Button>
            </Link>

            <Text variant="caption" centered muted>
              If you'd like to logout or switch accounts,{" "}
              <Link to="/logout">
                <Text variant="link">click here</Text>
              </Link>
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <section className="flex flex-col items-center gap-4">
          <Text centered variant="title">
            Welcome to FamilyShelves
          </Text>
          <Text centered variant="subtitle" muted>
            Your all-in-one solution for home organization and inventory
            management
          </Text>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Text variant="subtitle">Track Your Inventory</Text>
            <Text muted>
              Keep detailed records of all your household items. Track
              quantities, locations, and important details to always know what
              you have and where it is.
            </Text>
          </div>

          <div className="flex flex-col gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Text variant="subtitle">Organize By Room</Text>
            <Text muted>
              Create virtual rooms and spaces to mirror your home's layout.
              Easily organize and find items based on their physical location in
              your house.
            </Text>
          </div>

          <div className="flex flex-col gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Text variant="subtitle">Maintenance Reminders</Text>
            <Text muted>
              Set up maintenance schedules for your home equipment and
              appliances. Never miss important upkeep tasks with our built-in
              reminder system.
            </Text>
          </div>

          <div className="flex flex-col gap-3 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Text variant="subtitle">Share With Family</Text>
            <Text muted>
              Collaborate with family members by sharing access to your home
              inventory. Everyone stays informed and can contribute to keeping
              records up to date.
            </Text>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <Text variant="subtitle">Ready to Get Started?</Text>
          <Text muted>
            Join FamilyShelves today and take control of your home organization.
          </Text>
          <Button variant="solid" to="/signup">
            Sign Up Now
          </Button>
        </section>
      </div>
    </div>
  );
}
