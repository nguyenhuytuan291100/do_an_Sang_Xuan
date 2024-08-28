import React, { lazy } from "react";
import { DASHBOARD } from "pages/routes/route.constant";
const Dashboard = lazy(() => import("pages/Dashboard"));

export default {
  path: DASHBOARD,
  element: Dashboard,
};
