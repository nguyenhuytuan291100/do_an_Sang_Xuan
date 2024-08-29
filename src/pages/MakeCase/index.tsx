import { Row, Form, Input, Divider, Button } from "antd";
import { UPLOADFILE } from "pages/routes/route.constant";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type SizeType = Parameters<typeof Form>[0]["size"];

const MakeCase = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const navigate = useNavigate();

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <div className="make-case-page page">
      <div className="page-header">Make new case</div>
      <div className="page-container">
        <div className="page-content">
          <div style={{ padding: "0 200px" }}>
            <Row className="">Case Information</Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize as SizeType}
                style={{ width: "100%" }}
              >
                <Form.Item label="Case name" name="caseName">
                  <Input />
                </Form.Item>
                <Form.Item label="Directory" name="directory">
                  <Input />
                </Form.Item>
                <Form.Item label="Case type" name="caseType">
                  <Input />
                </Form.Item>
                <Form.Item label="Name" name="name">
                  <Input />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
                <Form.Item label="Organization" name="organization">
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input />
                </Form.Item>
              </Form>
            </Row>
            <Row justify={"space-between"}>
              <Button>Back</Button>
              <Button
                type="primary"
                onClick={() => {
                  navigate(UPLOADFILE);
                }}
              >
                Create Case
              </Button>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeCase;
