import React from "react";
import { Layout, Row, Image, Typography, Menu } from "antd";
import "pages/App/subcomponents/MainLayout/subcomponents/SideBar/style.scss";
import { menuItems } from "pages/App/subcomponents/MainLayout/subcomponents/SideBar/config";
import { Link } from "react-router-dom";
import bussinessReport from "assets/images/png/business-report.png";
import processPng from "assets/images/png/process.png";
import themesPng from "assets/images/png/themes.png";
import appDevelopPng from "assets/images/png/app-development.png";
import notifiPng from "assets/images/png/notifications.png";
import lifeStylePng from "assets/images/png/lifestyle.png";
import rechargePng from "assets/images/png/recharge.png";
import telegramPng from "assets/images/png/telegram.png";
import worldWebsitePng from "assets/images/png/world-wide-web.png";
import contactListPng from "assets/images/png/contact-list.png";
import serverPng from "assets/images/png/server.png";
import clockPng from "assets/images/png/clock.png";
import userPng from "assets/images/png/user.png";
import trolleyPng from "assets/images/png/trolley.png";
import cancelPng from "assets/images/png/cancel.png";
import { HOME, DASHBOARD } from "pages/routes/route.constant";
import Icons from "assets/icons";

type Props = {
  collapsed: boolean;
  setCollapsed: any;
};

const { Sider } = Layout;

const imageStyle = { width: 25, height: 25, marginRight: 10 };

const SideBar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  return (
    <Sider
      onCollapse={(value) => setCollapsed(value)}
      className={collapsed ? "sider unCollapsed-sider" : "sider"}
      collapsible={false}
      theme="light"
      width={270}
      breakpoint="xl"
      collapsed={collapsed}
    >
      <Row style={{ height: "70px" }}></Row>
      <Row className="menu-container">
        <Row className="title-menu-container">
          <Typography className="title-menu-text">CLIENT PAGE</Typography>
        </Row>
        <Menu inlineCollapsed={collapsed} mode="inline" inlineIndent={10}>
          <Menu.Item key="1">
            <Icons.homeTwoTone size={40} />
            <Link className="menuText" to={HOME}>
              Home
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Icons.dashBoardTwoTone size={40} />
            <Link className="menuText" to={DASHBOARD}>
              Dashboard
            </Link>
          </Menu.Item>
        </Menu>
      </Row>
    </Sider>
  );
};

export default SideBar;
