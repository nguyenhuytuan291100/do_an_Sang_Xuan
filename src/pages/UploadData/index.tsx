import { Button, Row, Space, Upload } from "antd";
import React from "react";

const UploadData = () => {
  return (
    <div className="upload-data-page page">
      <div className="page-header">Upload data</div>
      <div className="page-container">
        <div className="page-content">
          <div style={{ padding: "0 200px" }}>
            <Row justify={"center"}>
              <Space size={50}> 
                <Button>Make instance</Button>
                <Button>Upload data</Button>
              </Space>
            </Row>
            <Row style={{height: "150px"}}></Row>
            <Row justify={"center"}>
              <Upload><Button>Upload file</Button></Upload>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
