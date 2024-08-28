import { Button, Col, Row } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons"; // Example icon
import React from "react";
import { useNavigate } from "react-router-dom";
import { MAKECASE } from "pages/routes/route.constant";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page page">
      <div className="page-header">Home</div>
      <div className="page-container">
        <div className="page-content">
          <Row justify={"space-between"}>
            <Col>
              <Button
                onClick={() => {
                  navigate(MAKECASE);
                }}
              >
                Make case
              </Button>
            </Col>
            <Col>
              <DoubleRightOutlined />
            </Col>
            <Col>
              <Button>Upload data</Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Home;
