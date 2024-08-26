import React, { lazy } from "react";
import { HOME } from "pages/routes/route.constant";
const Home = lazy(() => import("pages/Home"));

export default {
  path: HOME,
  element: Home,
};
