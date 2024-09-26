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

type Props = {
  collapsed: boolean;
  setCollapsed: any;
};

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideBar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const navigation = useNavigate()
  const [logFiles, setLogFiles] = useState<string[]>([]);  // Trạng thái để lưu trữ các tệp đã tải lên cho Log
  const [trafficFiles, setTrafficFiles] = useState<string[]>([]);  // Trạng thái để lưu trữ các tệp đã tải lên cho Traffic
  const [isLoading, setIsLoading] = useState(false);
  const getSideBar = async () => {
      setIsLoading(true)
      try {
        const [response1, response2] = await Promise.all([
          gettraffic(),
          getlog()
        ]);
        console.log("response: ", response1);
        setTrafficFiles(response1)
        setLogFiles(response2);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        // Kết thúc isLoading
        setIsLoading(false);
      }
    };
  useEffect(()=>{
    // gettraffic().then((res) => {
    //   setTrafficFiles(res)
    // })
    // getlog().then((res) => {
    //   setLogFiles(res)
    // })
    getSideBar();
  },[])
  
  const handleUpload = async (options: UploadRequestOption, setFiles: React.Dispatch<React.SetStateAction<string[]>>) => {
    const { file, onSuccess, onError } = options;
    const fileName = (file as File).name;

    // Kiểm tra nếu tên file đã tồn tại trong danh sách, không thêm nữa
    setFiles((prevFiles) => {
      if (!prevFiles.includes(fileName)) {
        return [...prevFiles, fileName];
      }else{ return prevFiles;}
      
      
    });

    console.log("UpisLoading:", fileName);
    try {
      // Gọi API upload file (không chờ kết quả xử lý xong)
      await uploadTrafficFile(file as File);

      onSuccess?.("ok", new XMLHttpRequest());
      console.log("Upload successful");
      await  gettraffic().then((res)=>{
        setTrafficFiles(res)
      });
    } catch (error) {
      onError?.(new Error("upload failed"));
      console.error("Upload error:", error);
    }
    
  };

  const handleUploadLog = async (options: UploadRequestOption, setFiles: React.Dispatch<React.SetStateAction<string[]>>) => {
    const { file, onSuccess, onError } = options;
    const fileName = (file as File).name;

    // Kiểm tra nếu tên file đã tồn tại trong danh sách, không thêm nữa
    setFiles((prevFiles) => {
      if (!prevFiles.includes(fileName)) {
        return [...prevFiles, fileName];
      }else{ return prevFiles;}
      
    });

    console.log("UpisLoading:", fileName);
    try {
      // Gọi API upload file (không chờ kết quả xử lý xong)
      await uploadLogFile(file as File);

      onSuccess?.("ok", new XMLHttpRequest());
      console.log("Upload successful");

      
      await getlog().then((log)=>{
        setLogFiles(log)
      })

    } catch (error) {
      onError?.(new Error("upload failed"));
      console.error("Upload error:", error);
    }
    
  };

  
  const logUploadProps = {
    showUploadList: false,
    customRequest: (options: UploadRequestOption) => handleUploadLog(options, setLogFiles),
  };

  const trafficUploadProps = {
    showUploadList: false,
    customRequest: (options: UploadRequestOption) => handleUpload(options, setTrafficFiles),
  };

  const handleOnClickLog=(id: any)=>{
    navigation(`/log/${id}`)
  };

  const handleOnClickTraffic =(id: any)=>{
    navigation(`/traffic/${id}`)
  }

  const handleOnClickDeleteLog = async (id:any) =>{
    console.log(id)
    await deletelogById(id)
    
    await getlog().then((log)=>{
      setLogFiles(log)
    })
    // navigation(`/Log/delete/${id}`)
  }

  const handleOnClickDeleteTraffic = async (id:any) =>{
    console.log(id)
    await deletetrafficById(id)
    await gettraffic().then((res)=>{
      setTrafficFiles(res)
    });
    // navigation(`/traffic/`)
  }
  

  return (
    <Spin spinning={isLoading}>
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
            <Icons.homeTwoTone size={40} />
            <Link className="menuText" to={HOME}>
              Home
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <>
                <Icons.dashBoardTwoTone size={40} />
                <span className="menuText">Dashboard</span>
              </>
            }
          >
            {/* Log Section */}
            <SubMenu
              key="sub-log"
              title="Log"
              icon={<FileOutlined />}
            >
              {logFiles.map((item: any, index) => (
                <Menu.Item 
                  key={`log-file-${index}`} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                  <Button onClick={() => handleOnClickDeleteLog(item.id)} 
                      style={{ cursor: 'pointer', marginRight: 0 , color: "rgb(91, 107, 121)" , backgroundColor: "rgb(178, 223, 219)" }} icon={<MinusOutlined         
                        />}></Button>
                    <Button onClick={()=>handleOnClickLog(item.id)} style={{ marginLeft: 5 , color: "rgb(91, 107, 121)" , backgroundColor: "rgb(178, 223, 219)"}} icon={<FileOutlined />}>{item.filename}</Button>
                    
                    </div>
                  
                </Menu.Item>
              ))}
              <Menu.Item key="upload-log">
                <Upload {...logUploadProps}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    style={{ padding: 0, marginLeft: 10 }}
                  >
                    Upload Log File
                  </Button>
                </Upload>
              </Menu.Item>
            </SubMenu>

            {/* Traffic Section */}
            <SubMenu
              key="sub-traffic"
              title="Traffic"
              icon={<FileOutlined />}
            >
              {trafficFiles.map((item: any, index) => (
                <Menu.Item 
                  key={`traffic-file-${index}`} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  
                    {/* <FileOutlined /> */}
                    {/* /* <Link to={TRAFFIC}><Button onClick={()=>handleOnClickTraffic(item.id)} style={{ marginLeft: 10 }}>{item.filename}</Button></Link> */ }
                    <div>
                    <Button onClick={() => handleOnClickDeleteTraffic(item.id)} 
                      style={{ cursor: 'pointer', marginRight: 0, color: "rgb(91, 107, 121)" , backgroundColor: "rgb(178, 223, 219)"  }} icon={<MinusOutlined         
                        />}></Button>
                    <Button onClick={()=>handleOnClickTraffic(item.id)} style={{ marginLeft: 5 , color: "rgb(91, 107, 121)" , backgroundColor: "rgb(178, 223, 219)" }} icon={<FileOutlined />}>{item.filename}</Button>
                    
                    </div>
                  
                </Menu.Item>
              ))}
              <Menu.Item key="upload-traffic">
                <Upload {...trafficUploadProps}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    style={{ padding: 0, marginLeft: 10 }}
                  >
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