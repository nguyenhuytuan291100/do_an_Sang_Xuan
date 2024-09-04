import React, { lazy } from "react";
import { TRAFFIC } from "pages/routes/route.constant";
const Traffic = lazy(() => import("pages/Traffic"));

export default {
  path: TRAFFIC,
  element: Traffic,
};
