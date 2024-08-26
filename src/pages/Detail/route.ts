import React, { lazy } from "react";
import { DETAIL } from "pages/routes/route.constant";
const Detail = lazy(() => import("pages/Detail"));

export default {
  path: DETAIL,
  element: Detail,
};
