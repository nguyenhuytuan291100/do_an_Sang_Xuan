import React from "react";
import "pages/App/subcomponents/MainLayout/subcomponents/InforPopover/style.scss";
import { Avatar, Col, Divider, Image, Row, Space, Typography } from "antd";
import Icons from "assets/icons";
import accountImage from "assets/images/svg/account.svg";

type Props = {
  // isOpen: boolean
};

const InforPopover = () => {
  return (
    <div className="infor-container">
      <Row className="title-popover">
        <Typography>User Profile</Typography>
      </Row>
      <Row style={{ padding: "20px 0", gap: "16px" }} align={"middle"}>
        <Avatar
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          size={80}
        />
        <Col>
          <Row style={{ marginBottom: "4px" }}>
            <Typography className="userNameText" style={{ fontWeight: 500 }}>
              Admin
            </Typography>
          </Row>
          <Row style={{ marginBottom: "4px" }}>
            <Typography className="userNameText">Member</Typography>
          </Row>
          <Space align="center">
            <Icons.mailIcon size={16} />
            <Typography className="userNameText" style={{ marginLeft: "8px" }}>
              admin@gmail.com
            </Typography>
          </Space>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row>
        <div className="account-container">
          <Image preview={false} src={accountImage} />
        </div>
        <div style={{ marginLeft: "16px", cursor: "pointer" }}>
          <Row style={{ marginBottom: "4px", lineHeight: "16.8px" }}>
            <Typography className="accInforText">
              Account Information
            </Typography>
          </Row>
          <Row style={{ lineHeight: "21px" }}>
            <Typography className="accSetText">Account Settings</Typography>
          </Row>
        </div>
      </Row>
      <div className="logoutBn">
        <Typography className="logoffText">Log off</Typography>
      </div>
    </div>
  );
};

export default InforPopover;
