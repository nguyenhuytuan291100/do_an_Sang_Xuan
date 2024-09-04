import React, { lazy } from "react";
import { LOG } from "pages/routes/route.constant";
const Log = lazy(() => import("pages/Log"));

export default {
  path: LOG,
  element: Log,
};
