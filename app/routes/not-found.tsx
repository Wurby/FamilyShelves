import { Link } from "react-router";
import { Text } from "../components/Text";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Text variant="title">404</Text>
      <Text variant="subtitle" muted>
        Page not found
      </Text>
      <Text as="span" variant="link">
        <Link to="/">Go to home</Link>
      </Text>
    </div>
  );
}
