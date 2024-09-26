import React, { useEffect, useState } from "react";  // Thêm useState để quản lý trạng thái
import { Layout, Row, Image, Typography, Menu, Spin } from "antd";
import "pages/App/subcomponents/MainLayout/subcomponents/SideBar/style.scss";
import { menuItems } from "pages/App/subcomponents/MainLayout/subcomponents/SideBar/config";
import { Link, useNavigate } from "react-router-dom";
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
import { HOME, DASHBOARD, TRAFFIC, LOG } from "pages/routes/route.constant";
import Icons from "assets/icons";
import { Upload, Button } from "antd";
import { PlusOutlined, FileOutlined, MinusOutlined } from "@ant-design/icons";
import { UploadRequestOption } from "rc-upload/lib/interface";  // Import kiểu dữ liệu chính xác
import { uploadTrafficFile, gettraffic, deletetrafficById,uploadLogFile, getlog, deletelogById } from "../../../../../../services/apiService"
import useSWR from "swr";
import { useGetTraffic } from "utils/request/useGetTraffic";
import { useGetLog } from "utils/request/useLog";

type Props = {
  collapsed: boolean;
  setCollapsed: any;
};

const { Sider } = Layout;
const { SubMenu } = Menu;

const fetcher = (url: string) => {
  if (url === '/traffic') return gettraffic();
  if (url === '/log') return getlog();
};

const SideBar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const navigation = useNavigate();
  
  // Sử dụng SWR để lấy dữ liệu cho traffic và log
  const { data: trafficFiles, error: trafficError, isLoading: trafficLoading, mutate: mutateTraffic } = useGetTraffic();
  const { data: logFiles, error: logError, isLoading: logLoading, mutate: mutateLog } = useGetLog();
  console.log(trafficFiles);
  
  const handleUpload = async (options: UploadRequestOption, mutate: any) => {
    const { file, onSuccess, onError } = options;
    try {
      console.log("Uploading Traffic");
      await uploadTrafficFile(file as File);
      onSuccess?.("ok", new XMLHttpRequest());
      console.log("Complete");
      
      // Sau khi upload thành công, cập nhật dữ liệu bằng mutate
      mutateTraffic();
    } catch (error) {
      onError?.(new Error("upload failed"));
    }
  };

  const handleUploadLog = async (options: UploadRequestOption, mutate: any) => {
    const { file, onSuccess, onError } = options;
    try {
      console.log("Uploading Log");
      await uploadLogFile(file as File);
      onSuccess?.("ok", new XMLHttpRequest());
      console.log("Complete");
      mutateLog();
    } catch (error) {
      onError?.(new Error("upload failed"));
    }
  };

  const handleOnClickLog = (id: any) => {
    navigation(`/log/${id}`);
  };

  const handleOnClickTraffic = (id: any) => {
    navigation(`/traffic/${id}`);
  };

  const handleOnClickDeleteLog = async (id: any) => {
    await deletelogById(id);
    console.log("delete Log complete");
    mutateLog(); // Cập nhật dữ liệu sau khi xóa
  };

  const handleOnClickDeleteTraffic = async (id: any) => {
    await deletetrafficById(id);
    console.log("delete Traffic complete");
    mutateTraffic(); // Cập nhật dữ liệu sau khi xóa
  };

  const logUploadProps = {
    showUploadList: false,
    customRequest: (options: UploadRequestOption) => handleUploadLog(options, mutateLog),
  };

  const trafficUploadProps = {
    showUploadList: false,
    customRequest: (options: UploadRequestOption) => handleUpload(options, mutateTraffic),
  };

  return (
    <Spin spinning={trafficLoading || logLoading}>
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
            <Typography className="title-menu-text">N3TW0RK F0R3NS1C5</Typography>
          </Row>
          <Menu inlineCollapsed={collapsed} mode="inline" inlineIndent={10}>
            <Menu.Item key="1">
              <Link className="menuText" to="/">
                Home
              </Link>
            </Menu.Item>

            <SubMenu key="sub1" title="Dashboard" icon={<FileOutlined />}>
              {/* Log Section */}
              <SubMenu key="sub-log" title="Log" icon={<FileOutlined />}>
                {logFiles?.map((item: any, index: number) => (
                  <Menu.Item key={`log-file-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button onClick={() => handleOnClickDeleteLog(item.id)} style={{ cursor: 'pointer', marginRight: 0, color: "rgb(91, 107, 121)", backgroundColor: "rgb(178, 223, 219)" }} icon={<MinusOutlined />}></Button>
                    <Button onClick={() => handleOnClickLog(item.id)} style={{ marginLeft: 5, color: "rgb(91, 107, 121)", backgroundColor: "rgb(178, 223, 219)" }} icon={<FileOutlined />}>{item.filename}</Button>
                  </Menu.Item>
                ))}
                <Menu.Item key="upload-log">
                  <Upload {...logUploadProps}>
                    <Button type="link" icon={<PlusOutlined />} style={{ padding: 0, marginLeft: 10 }}>
                      Upload Log File
                    </Button>
                  </Upload>
                </Menu.Item>
              </SubMenu>

              {/* Traffic Section */}
              <SubMenu key="sub-traffic" title="Traffic" icon={<FileOutlined />}>
                {trafficFiles?.map((item: any, index: number) => (
                  <Menu.Item key={`traffic-file-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button onClick={() => handleOnClickDeleteTraffic(item.id)} style={{ cursor: 'pointer', marginRight: 0, color: "rgb(91, 107, 121)", backgroundColor: "rgb(178, 223, 219)" }} icon={<MinusOutlined />}></Button>
                    <Button onClick={() => handleOnClickTraffic(item.id)} style={{ marginLeft: 5, color: "rgb(91, 107, 121)", backgroundColor: "rgb(178, 223, 219)" }} icon={<FileOutlined />}>{item.filename}</Button>
                  </Menu.Item>
                ))}
                <Menu.Item key="upload-traffic">
                  <Upload {...trafficUploadProps}>
                    <Button type="link" icon={<PlusOutlined />} style={{ padding: 0, marginLeft: 10 }}>
                      Upload Traffic File
                    </Button>
                  </Upload>
                </Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </Row>
      </Sider>
    </Spin>
  );
};

export default SideBar;