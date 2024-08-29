import React, { lazy } from "react";
import { MAKECASE } from "pages/routes/route.constant";
const makeCase = lazy(() => import("pages/MakeCase"));

export default {
  path: MAKECASE,
  element: makeCase,
};
