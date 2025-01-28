import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Housemaster" },
    { name: "description", content: "Welcome to Housemaster" },
  ];
}

export default function Home() {
  return <div>Simple test</div>;
}
