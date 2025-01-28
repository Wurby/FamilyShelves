import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/app", "routes/app.tsx"),
  route("/*", "routes/not-found.tsx"),
] satisfies RouteConfig;
