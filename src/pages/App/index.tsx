import React from "react";
import ErrorBoundary from "pages/App/subcomponents/ErrorBoundary";
import { FC, Suspense } from "react";
import Loading from "components/Loading";
import { Navigate, Route, Routes } from "react-router-dom";
import { HOME } from "pages/routes/route.constant";
import authRoutes from "pages/routes/route.auth";
import MainLayout from "pages/App/subcomponents/MainLayout";

const App = () => {
  const homeRoute = process.env.REACT_APP_HOME_PAGE_ROUTE || HOME;
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={homeRoute} />} />
          {authRoutes.map(({ path, element }) => {
            const Element: FC = element;
            return (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<Loading />}>
                    <Element />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
