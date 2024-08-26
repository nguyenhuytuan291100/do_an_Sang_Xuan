import { Affix, Avatar, Badge, Button, Popover, Row, Space } from "antd";
import React from "react";
import Icons from "assets/icons";
import "pages/App/subcomponents/MainLayout/subcomponents/HeaderLayout/style.scss";
import InforPopover from "pages/App/subcomponents/MainLayout/subcomponents/InforPopover";

type Props = {
  openShoppingCart: any;
  setCollapsedMenu: any;
};

const InforPopoverComponent = <InforPopover />;

const HeaderLayout: React.FC<Props> = ({
  openShoppingCart,
  setCollapsedMenu,
}) => {
  return (
    <>
      <Row className="header-container w-100">
        <Affix className="header-affix-container">
          <Row justify={"space-between"}>
            <Space size={0} direction="horizontal">
              <div className="iconMenuContainer">
                {/* <Button
                  onClick={setCollapsedMenu}
                  className="iconMenu"
                  icon={<Icons.menuLine />}
                  shape="circle"
                  size="large"
                  type="default"
                /> */}
              </div>
            </Space>
            <Space size={0} direction="horizontal">
              <div className="iconMenuContainer">
                <Button
                  className="iconMenu"
                  icon={
                    <Badge color="blue" dot>
                      <Icons.bellIcon />
                    </Badge>
                  }
                  shape="circle"
                  size="large"
                  type="default"
                />
              </div>
              <Popover content={InforPopoverComponent}>
                <div className="iconMenuContainer">
                  <Button
                    className="iconMenu"
                    size="large"
                    type="dashed"
                    shape="circle"
                  >
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                  </Button>
                </div>
              </Popover>
            </Space>
          </Row>
        </Affix>
      </Row>
    </>
  );
};

export default HeaderLayout;
