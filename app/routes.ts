import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  
  layout("components/logged-wrapper.tsx", [
    layout("routes/layout.tsx", [
      index("routes/home.tsx"),
      route("books", "routes/books.tsx"),
      route("members", "routes/members.tsx"),
      route("borrowing", "routes/borrowing.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
