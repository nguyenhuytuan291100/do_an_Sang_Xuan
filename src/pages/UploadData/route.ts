import React, { lazy } from "react";
import { UPLOADFILE } from "pages/routes/route.constant";
const uploadFile = lazy(() => import("pages/UploadData"));

export default {
  path: UPLOADFILE,
  element: uploadFile,
};
