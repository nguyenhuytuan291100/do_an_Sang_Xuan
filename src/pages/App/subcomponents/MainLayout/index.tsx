import { Layout, Row, Typography } from "antd";
import { Outlet } from "react-router-dom";
import HeaderLayout from "pages/App/subcomponents/MainLayout/subcomponents/HeaderLayout";
import SideBar from "pages/App/subcomponents/MainLayout/subcomponents/SideBar";
import "pages/App/subcomponents/MainLayout/style.scss"
import { useState } from "react";

const MainLayout = () => {
  const [openShoppingCart, setOpenShoppingCart] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const openCart = () => {
    setOpenShoppingCart(true);
  };

  const closeCart = () => {
    setOpenShoppingCart(false);
  };

  return (
    <div className="main-layout-container">
      <Layout style={{ height: "100vh", display: "flex" }} hasSider={true}>
        {/* <Layout style={{ display: "flex" }}> */}
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="layout-container">
          <Row className="header-main-container">
            <HeaderLayout
              setCollapsedMenu={toggleCollapsed}
              openShoppingCart={openCart}
            />
          </Row>
          <Row className="content-wrapper">
            <Outlet />
          </Row>
          <Layout.Footer
            style={{
              textAlign: "end",
              padding: "0px 8px",
              paddingBottom: "20px",
            }}
          >
            <Typography className="text-footer">
              {/* © {currentYear} Bản quyền thuộc về SBA */}
            </Typography>
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
