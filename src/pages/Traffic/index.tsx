import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Row, Tabs, Card, Tooltip,Table, Input, Select, Menu, Space  } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Network, DataSet, Node, Edge } from "vis-network/standalone/esm/vis-network";
import './styles.scss'; // Import file SCSS
import { useParams } from "react-router-dom";
import { gettrafficById} from "services/apiService";
import MapComponent from "pages/App/subcomponents/MainLayout/subcomponents/MapComponent";
import ResizableTitle from "pages/App/subcomponents/MainLayout/subcomponents/ResiableTitle";
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

import { Modal } from 'antd';
import { getlog, getlogByID} from '../../services/apiService';


import FlowChart from "pages/App/subcomponents/MainLayout/subcomponents/FlowChart";
// dataip M20

const { TabPane } = Tabs;
const COLORS = [
  '#0088FE', // Bright Blue
  '#00C49F', // Bright Green
  '#FFBB28', // Bright Yellow
  '#FF8042', // Bright Orange
  '#FF6384', // Bright Pink
  '#FF5733', // Bright Red
  '#C70039', // Bright Magenta
  '#36A2EB', // Light Blue
  '#FFCE56', // Light Yellow
  '#FFC300', // Bright Gold
  '#DAF7A6', // Light Green
  '#581845', // Deep Purple
  '#900C3F', // Dark Pink
  '#FF9FF3', // Light Pink
  '#F368E0', // Bright Purple
  '#00C851', // Bright Lime
  '#007E33', // Dark Green
  '#FF4444', // Bright Red
  '#33b5e5', // Light Sky Blue
  '#2BBBAD', // Bright Cyan
];

const Dashboard = () => {

  const { id } = useParams();
  const [viewType, setViewType] = useState("Map");
  const [activeTabKey, setActiveTabKey] = useState("1");

  // M1
  const [tableDatam1, setTableDatam1] = useState([]);
 
  // State cho tìm kiếm và trường được chọn
  const [searchText, setSearchText] = useState('');
  const [selectedField, setSelectedField] = useState('');

  //M2 
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  //M4
  const [totalE, setTotalEM4] = useState([]);

// M5
  const [lineChartDatam5, setLineChartDatam5] = useState([]);
// M6
  const [lineChartDatam6, setLineChartDatam6] = useState([]);
// M7
  const [lineChartDatam7, setLineChartDatam7] = useState([]);
// M8
  const [Datam8Max, setDatam8Maxsize] = useState();
  const [Datam8Min, setDatam8Minsize] = useState();
  const [Datam8Mean, setDatam8Meansize] = useState();
  const [Datam8SumIP, setDatam8SumIP] = useState();
  const [Datam8Src, setDatam8Src] = useState();
  const [Datam8Dst, setDatam8Dst] = useState();
// M9
  const [barChartDatam9, setBarChartDatam9] = useState([]);
// <10
  const [barChartDatam10, setBarChartDatam10] = useState([]);
// M11
  const [barChartData11, setBarChartDatam11] = useState([]);
// M12
  const [barChartData12, setBarChartDatam12] = useState([]);
// M13
  const [Data13Max, setDatam13Maxdur] = useState();
  const [Datam13Min, setDatam13Mindur] = useState();
  const [Datam13Mean, setDatam13Meandur] = useState();
  const [Datam813UniPro, setDatam13UniPro] = useState();
  const [Datam813UniSrc, setDatam13UniSrc] = useState();
  const [Datam813UniDst, setDatam13UniDst] = useState();
  const [Datam813AppPro, setDatam13AppPro] = useState();
// M14
  const [pieChartData14, setPieChartData14] = useState([]);
// M15
  const [barChartData15, setBarChartDatam15] = useState([]);
// M16
  const [barChartData16, setBarChartDatam16] = useState([]);
  // M17
  const [barChartData17, setBarChartDatam17] = useState([]);
  // M18
  const [lineChartData18, setLineChartDatam18] = useState([]);
  // M19
  const [lineChartData19, setLineChartDatam19] = useState([]);
// M20
  const [dataM20, setDataM20] = useState([]);

  //Anomaly
  const [anomalyTimestamps, setAnomalyTimestamps] = useState<string[]>([]);

  const [columns, setColumns] = useState([
    { title: 'Flow ID', dataIndex: 'Flow ID', key: 'flowID', width: 100 },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'timestamp', width: 150 },
    { title: 'Source IP', dataIndex: 'Source IP', key: 'srcIP', width: 80 },
    { title: 'Destination IP', dataIndex: 'Destination IP', key: 'dstIP', width: 150 },
    { title: 'Source Port', dataIndex: 'Source Port', key: 'srcPort', width: 100 },
    { title: 'Destination Port', dataIndex: 'Destination Port', key: 'dstPort', width: 100 },
    { title: 'Protocol', dataIndex: 'Protocol', key: 'protocol', width: 100 },
    { title: 'Application Protocol', dataIndex: 'Application Protocol', key: 'appProtocol', width: 150 },
    { title: 'Time_Delta', dataIndex: 'Time_Delta', key: 'timeDelta', width: 100 },
    { title: 'Totlen Pkts', dataIndex: 'Totlen Pkts', key: 'totLenPkts', width: 100 },
    { title: 'Tot Fwd Pkts', dataIndex: 'Tot Fwd Pkts', key: 'totFwdPkts', width: 100 },
    { title: 'Tot Bwd Pkts', dataIndex: 'Tot Bwd Pkts', key: 'totBwdPkts', width: 100 },
    { title: 'TotLen Fwd Pkts', dataIndex: 'TotLen Fwd Pkts', key: 'totLenFwdPkts', width: 150 },
    { title: 'TotLen Bwd Pkts', dataIndex: 'TotLen Bwd Pkts', key: 'totLenBwdPkts', width: 150 },
    { title: 'Tot Pkts', dataIndex: 'Tot Pkts', key: 'totPkts', width: 100 },
    { title: 'Label', dataIndex: 'Label', key: 'labl', width: 80 },
  ]);

  
  const handleResize = (index: number) => (e: any, { size }: any) => {
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    setColumns(nextColumns);
  };
  
  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

   // Hàm xử lý tìm kiếm

  const [selectedValue, setSelectedValue] = useState(null); // State để lưu giá trị đã chọn từ dropdown
  const [uniqueFieldValues, setUniqueFieldValues] = useState([]); // State để lưu các giá trị không trùng lặp của trường đã chọn

  const handleSearch = (e:any) => {
    setSearchText(e.target.value);
  };

  const handleFieldChange = (field:any) => {
    setSelectedField(field);
  
    // Lấy tất cả các giá trị của trường được chọn và lọc ra các giá trị không trùng lặp
    if (field) {
      const values = tableDatam1.map((item) => item[field]);
      const uniqueValues = [...new Set(values)];
      setUniqueFieldValues(uniqueValues); // Cập nhật dropdown giá trị
    } else {
      setUniqueFieldValues([]);
      setSelectedValue(null);
    }
  };
  const handleValueChange = (value:any) => {
    setSelectedValue(value); // Cập nhật giá trị đã chọn
  };

  const filteredData = tableDatam1.filter((item) => {
    // Trường hợp 1: Chọn cả trường và giá trị
    if (selectedField && selectedValue) {
      const selectedFieldValue = item[selectedField];
      // Kiểm tra nếu giá trị của trường được chọn khớp với giá trị trong dropdown value
      if (selectedFieldValue !== undefined && selectedFieldValue !== null) {
        return selectedFieldValue === selectedValue;
      }
      return false;
    }
  
    // Trường hợp 2: Chỉ chọn trường (không chọn giá trị trong dropdown value)
    if (selectedField && !selectedValue) {
      // Tìm kiếm theo trường được chọn và từ khóa trong thanh search
      const selectedFieldValue = item[selectedField];
      if (selectedFieldValue !== undefined && selectedFieldValue !== null) {
        const valueStr = typeof selectedFieldValue === 'string' || typeof selectedFieldValue === 'number' ? String(selectedFieldValue) : '';
        return valueStr.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    }
  
    // Trường hợp 3: Không chọn gì trong dropdown, chỉ tìm theo thanh search
    if (!selectedField || selectedField === "All Fields") {
      if (searchText) {
        return Object.values(item).some((val) => {
          if (val !== undefined && val !== null) {
            // Chỉ chuyển đổi nếu val là chuỗi hoặc số
            const valueStr = typeof val === 'string' || typeof val === 'number' ? String(val) : '';
            return valueStr.toLowerCase().includes(searchText.toLowerCase());
          }
          return false;
        });
      }
      // Nếu không có gì trong thanh tìm kiếm, trả về toàn bộ dữ liệu
      return true;
    }
  
    // Mặc định trả về tất cả dữ liệu
    return true;
  });
  
  
  const networkRef = useRef<HTMLDivElement | null>(null);

  const toggleViewType = () => {
    setViewType((prevType) => (prevType === "Map" ? "Table" : "Map"));
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    gettrafficById(id).then((res) => {

      setTableDatam1(res['m1'])
      // Xử lý dữ liệu mạng
      const networkData = res['m2'];
      const nodeData = networkData.nodes.map((node: any) => ({
        id: node.id,
        label: node.id,
      }));
      const edgeData = networkData.edges.map((edge: any) => ({
        from: edge.source,
        to: edge.target,
      }));
      setNodes(nodeData);
      setEdges(edgeData);
      // Barchart: uv
      // Linechart: pv
      setTotalEM4(res['m4']);

      setLineChartDatam5(res['m5']);

      setLineChartDatam6(res['m6']);

      setLineChartDatam7(res['m7']);

      const parsedData = res['m8'];
      setDatam8Maxsize(parsedData.max_packet_size)
      setDatam8Minsize(parsedData.min_packet_size)
      setDatam8Meansize(parsedData.mean_packet_size)
      setDatam8SumIP(parsedData.total_unique_ips)
      setDatam8Src(parsedData.unique_source_ips)
      setDatam8Dst(parsedData.unique_destination_ips)
      // Dữ liệu biểu đồ Bar, Line, Pie
      setBarChartDatam9(res['m9']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setBarChartDatam10(res['m10']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setBarChartDatam11(res['m11']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setBarChartDatam12(res['m12']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      const parsedData13 = res['m13'];
      setDatam13Maxdur(parsedData13.max_duration)
      setDatam13Mindur(parsedData13.min_duration)
      setDatam13Meandur(parsedData13.average_duration)
      setDatam13UniPro(parsedData13.num_unique_protocol)
      setDatam13UniSrc(parsedData13.num_unique_source_ports)
      setDatam13UniDst(parsedData13.num_unique_dst_ports)
      setDatam13AppPro(parsedData13.num_unique_application_protocol)

      setPieChartData14(res['m14']); // Giả sử dữ liệu pie chart nằm ở phần thứ 7

      setBarChartDatam15(res['m15']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setBarChartDatam16(res['m16']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setBarChartDatam17(res['m17']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setLineChartDatam18(res['m18']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setLineChartDatam19(res['m19']); // Giả sử dữ liệu bar chart nằm ở phần thứ 5

      setDataM20(res['m20']);

      setAnomalyTimestamps(res['m21'])

      console.log(res['m21'])
    }).catch((error) => {
      console.error("Error fetching traffic data:", error);
    });
  }, [id]);

  useEffect(() => {
    if (activeTabKey === "1" && networkRef.current) {
      const container = networkRef.current;
      const data = {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges),
      };
      const options = {
        physics: {
          enabled: true,
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08,
          },
          maxVelocity: 50,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: { iterations: 150 },
        },
      };
      new Network(container, data, options);
    }
  }, [activeTabKey, nodes, edges]);

//Link anomaly Traffic timestamp
  const [isTrafficModalVisible, setIsTrafficModalVisible] = useState(false);  // Quản lý trạng thái modal
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);  // Quản lý thời gian đã chọn
  const [filteredTraffics, setFilteredTraffics] = useState([]);  // Lưu trữ dữ liệu log đã lọc

  const handleDotClick = (timestamp: any) => {
    // Lọc log traffic tương ứng với thời gian
    const logsForTimestamp = tableDatam1.filter((log:any) => {
      // Kiểm tra xem timestamp của log có chứa chuỗi timestamp đã chọn không (tìm kiếm gần đúng)
      return log.Timestamp.includes(timestamp);
    });
  
    setSelectedTimestamp(timestamp);
    setFilteredTraffics(logsForTimestamp);
    setIsTrafficModalVisible(true);  // Mở modal
  };

  //Link Log data

  const [log_type, setLogType] = useState('');

  const dnsColumns = [
    { title: 'Line ID', dataIndex: 'LineId', key: 'lineId', width: 80 },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'timestamp', width: 150 },
    { title: 'Process', dataIndex: 'Process', key: 'process', width: 120 },
    { title: 'Content', dataIndex: 'Content', key: 'content', width: 200 },
    { title: 'Event Template', dataIndex: 'EventTemplate', key: 'eventTemplate', width: 180 },
    { title: 'Label', dataIndex: 'Anomaly', key: 'label', width: 100 },
  ];

  const auditColumns = [
    { title: 'Line ID', dataIndex: 'LineId', key: 'lineId', width: 80 },
    { title: 'Type', dataIndex: 'Type', key: 'type', width: 100 },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'timestamp', width: 150 },
    { title: 'Process ID', dataIndex: 'pid', key: 'pid', width: 100 },
    { title: 'User ID', dataIndex: 'uid', key: 'uid', width: 100 },
    { title: 'Session ID', dataIndex: 'ses', key: 'ses', width: 100 },
    { title: 'Message', dataIndex: 'msg', key: 'msg', width: 300 },
    { title: 'Account', dataIndex: 'acct', key: 'acct', width: 150 },
    { title: 'Executable', dataIndex: 'exe', key: 'exe', width: 200 },
    { title: 'Hostname', dataIndex: 'hostname', key: 'hostname', width: 150 },
    { title: 'IP Address', dataIndex: 'addr', key: 'addr', width: 150 },
    { title: 'Terminal', dataIndex: 'terminal', key: 'terminal', width: 100 },
    { title: 'Result', dataIndex: 'res', key: 'res', width: 100 },
    { title: 'Event Classification', dataIndex: 'Event_Classification', key: 'eventClassification', width: 200 },
    { title: 'Label', dataIndex: 'Anomaly', key: 'label', width: 100 },
  ];

  const accessColumns = [
    { title: 'Line ID', dataIndex: 'LineId', key: 'lineId', width: 80 },
    { title: 'Client IP', dataIndex: 'Client_IP', key: 'clientIp', width: 150 },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'timestamp', width: 150 },
    { title: 'Status Code', dataIndex: 'Status_Code', key: 'statusCode', width: 100 },
    { title: 'Response Bytes', dataIndex: 'Response_Bytes', key: 'responseBytes', width: 150 },
    { title: 'Refer', dataIndex: 'Refer', key: 'refer', width: 150 },
    { title: 'Method', dataIndex: 'Method', key: 'method', width: 100 },
    { title: 'Path', dataIndex: 'Path', key: 'path', width: 200 },
    { title: 'Version', dataIndex: 'Version', key: 'version', width: 100 },
    { title: 'User Agent', dataIndex: 'User_Agent', key: 'userAgent', width: 200 },
    { title: 'Label', dataIndex: 'Anomaly', key: 'label', width: 100 },
  ];

  let columnsLog: typeof dnsColumns | typeof auditColumns | typeof accessColumns | [] | undefined;

  if (log_type === 'dns') {
    columnsLog = dnsColumns;

  } else if (log_type === 'audit') {
    columnsLog = auditColumns;

  } else if (log_type === 'access') {
    columnsLog = accessColumns;

  }
  interface TrafficRecord {
    Timestamp: string; // hoặc Date, tùy vào định dạng
    id: string; // nếu có thêm id hoặc các thuộc tính khác
    payload: string;
    [key: string]: any;
  }
  interface LogRecord {
    Anomaly: string; // Cột Anomaly luôn tồn tại và là chuỗi
    [key: string]: any; // Các cột khác có thể thay đổi
  }
  
  // const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisiblePayload, setIsModalVisiblePayload] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [selectedTraficRecord, setSelectedTrafficRecord] = useState<TrafficRecord | null>(null);
  const [logFiles, setlogFiles] = useState<string[]>([]);  // Trạng thái để lưu trữ các tệp đã tải lên cho Traffic
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  //LINK TRAFFIC FUNCTION
  useEffect(() => {
    getlog().then((res) => {
      console.log(res); // Kiểm tra cấu trúc dữ liệu trả về
      setlogFiles(res);
    });
  }, []);

  const showModal = (recordTraffic:any)=> {
    setSelectedTrafficRecord(recordTraffic);
    setIsModalVisible(true);
    showModal1(false)
  };
  const showModal1 = async (state:any) => {
    setIsModalVisible1(state);
  };

  //show Payload
  const showModalPaylaod = (record: TrafficRecord) => {
    setModalContent(record.payload); // Lấy payload từ record và lưu vào state
    setIsModalVisiblePayload(true); // Hiển thị modal
  };
  const handleOk = () => {
    setIsModalVisiblePayload(false); // Đóng modal khi nhấn OK
  };

  const handleCancelPayload = () => {
    setIsModalVisiblePayload(false); // Đóng modal khi nhấn Cancel
  };

  const handleOnClickTraffic = async (logid: any)=>{
    handleTrafficFileSelect(logid)

  }
  const convertTimestampToComparableFormat = (timestamp: string) => {
    // Thay '/' bằng '-' và khoảng trắng ' ' bằng 'T' để có định dạng chuẩn ISO
    return timestamp.replace(/\//g, '-').replace(' ', 'T');
  };
   
  const compareTimestamps = (logTimestamp: string, trafficTimestamp: string) => {
    let logDate, trafficDate;
  
    // Kiểm tra và chuyển đổi logTimestamp thành đối tượng Date
    if (!isNaN(Number(trafficTimestamp))) {
      trafficDate = new Date(Number(trafficTimestamp)); // Trường hợp logTimestamp là số milliseconds
    } else {
      trafficDate = new Date(convertTimestampToComparableFormat(trafficTimestamp)); // Chuyển đổi chuỗi về định dạng chuẩn
    }
  
    // Chuyển trafficTimestamp thành đối tượng Date
    logDate = new Date(convertTimestampToComparableFormat(logTimestamp));
  
    // Kiểm tra tính hợp lệ của đối tượng Date
    if (isNaN(trafficDate.getTime()) || isNaN(logDate.getTime())) {
      console.error("Invalid date:", { logTimestamp, trafficTimestamp });
      return false;
    }
  
    // Tính toán chênh lệch thời gian tính bằng milliseconds
    const timeDifference = Math.abs(logDate.getTime() - trafficDate.getTime());
  
    // Trả về true nếu chênh lệch nhỏ hơn hoặc bằng 30 giây (30,000 milliseconds)
    return timeDifference <= 30000;
  };
  const handleTrafficFileSelect = async (logFile: any) => {
    console.log(logFile);
  
    try {
      const logDataSet = await getlogByID(logFile); // Lấy dữ liệu traffic theo ID
      console.log(logDataSet);
      console.log(selectedTraficRecord);
  
      setLoading(true); // Bắt đầu loading
  
      if (selectedTraficRecord && logDataSet) {
        console.log(selectedTraficRecord.Timestamp);
        setLogType(logDataSet['typeLog'])
        // Lấy dữ liệu traffic từ trafficDataSet
        let logData = logDataSet['m1'];
        if (!logData || !logData.length) {
          console.error("No log data available");
          return;
        }
  
        // Lọc trafficData theo khoảng thời gian 30 giây
        const filteredTrafficData = logData.filter((item: any) => 
          compareTimestamps(selectedTraficRecord.Timestamp, item.Timestamp)
        );
  
        setLogData(filteredTrafficData); // Lưu dữ liệu đã lọc
        showModal1(true); // Hiển thị modal
      } else {
        console.error("No selected log record or traffic data set found");
      }
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    } finally {
      setLoading(false); // Tắt loading
    }
    };

    const handleCancel = () => {
      setIsModalVisible(false);
      setLogData([]); 
    };
    const handleCancel1 = () => {
      setIsModalVisible1(false);
      setLogData([]); 
    };
  
    const actionColumn = {
      title: 'Hành động',
      key: 'action',
      width: 200, // Tăng kích thước cột nếu cần để chứa cả 2 nút
      render: (text: any, record: TrafficRecord) => (
        <Space size="middle">
          {/* Nút Tìm kiếm Log */}
          <Button type="primary" onClick={() => showModal(record)}>
            Tìm kiếm Log
          </Button>
          
          {/* Nút Payload */}
          <Button type="default" onClick={() => showModalPaylaod(record)}>
            Payload
          </Button>
        </Space>
      ),
    };
  
    const columnsWithButton = Array.isArray(columns) ? [...columns, actionColumn] : [actionColumn];
  
  return (
    <div className="dashboard-page page">
      <div className="page-header">Dashboard</div>
      <div className="page-container">
        <div className="page-content">
          <Row justify={"space-between"} align="middle">
            <Col>
              <Button onClick={toggleViewType}>
                {viewType === "Map" ? "Switch to Table" : "Switch to Map"}
              </Button>
            </Col>
            {viewType === "Map" && (
              <Col span={16}>
                <Tabs activeKey={activeTabKey} onChange={handleTabChange} centered>
                  <TabPane tab="Network" key="1" />
                  <TabPane tab="Time analysis" key="2" />
                  <TabPane tab="Artifacts" key="3" />
                  <TabPane tab="Communications" key="4" />
                </Tabs>
              </Col>
            )}
          </Row>

          {viewType === "Map" && (
            <div>
              {activeTabKey === "1" && (
                <div>
                  <div ref={networkRef} style={{ height: '400px', marginBottom: '20px', border: '1px solid lightgray' }} />
                  <Row>
                   </Row>
                  <Row >
                    <Col span={24}><div >
                    <h1>Network Map</h1>
                  </div>
                 </Col>
                  </Row>
                  <Row><Col span={24}> <div style={{ width: '100%', height: '600px', marginTop: '20px' }}><MapComponent data={dataM20} /></div></Col></Row>
                </div>
              )}
              {activeTabKey === "2" && (
                <div>
                  <Row gutter={[24, 24]} className="event-summary" style={{ marginBottom: "20px" }}>
                    <Col span={8}>
                      <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                        <h3>Total Event</h3>
                        <p>
                          <Tooltip title="Total Event" placement="right">
                            {totalE} events <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h2>Event for Time</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartDatam5}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            dot={(dataPoint) => {
                              const { cx, cy } = dataPoint;  
                              return anomalyTimestamps?.includes(dataPoint.payload.name) ? (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={8}
                                  fill="red"
                                  onClick={() => handleDotClick(dataPoint.payload.name)}  // Thêm sự kiện onClick
                                  style={{ cursor: 'pointer' }}
                                />
                              ) : (
                                <circle onClick={() => handleDotClick(dataPoint.payload.name)} cx={cx} cy={cy} r={8} fill="#8884d8" />
                              );
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  {/* Modal hiển thị log traffic tương ứng */}
                  <Modal
                    title={`Log Traffic for ${selectedTimestamp}`}
                    visible={isTrafficModalVisible}
                    onCancel={() => setIsTrafficModalVisible(false)}
                    footer={null}
                    width={1500}
                  >
                    <Table
                      dataSource={filteredTraffics}
                      columns={columns}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        position: ['bottomRight'],
                        prevIcon: <Button>«</Button>,
                        nextIcon: <Button>»</Button>,
                      }}
                      scroll={{x:1000,y:1000}}
                      components={{
                        header: {
                          cell: ResizableTitle,
                        },
                      }}
                      rowClassName={(record:any) => (record.Label === 'Anomaly' ? 'anomaly-row' : '')}
                      className="custom-table"
                    />
                  </Modal>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h2>Bytes for Time</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartDatam6}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h2>Durations for Time</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartDatam7}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="pv" stroke="#FF8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </div>
              )}
              {activeTabKey === "3" && (
                <div>
                  <Row gutter={[24, 24]} className="event-summary" style={{ marginBottom: "20px" }}>
                    <Col span={12}>
                      <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                        <h3>Suspicious Traffic</h3>
                        <p>
                          <Tooltip title="Max packet size" placement="right">
                          Max packet size: {Datam8Max} Bytes <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Min packet size" placement="right">
                          Min packet size: {Datam8Min} Bytes <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Mean of size" placement="right">
                          Mean of size: {Datam8Mean} Bytes <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Source IP number" placement="right">
                            Source IP number: {Datam8Src} IP <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Destination IP number" placement="right">
                            Destination IP number: {Datam8Dst} IP <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="IP number" placement="right">
                            IP number: {Datam8SumIP} <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[20, 20]} className="chart-row">
                    <Col span={12}>
                    <h2>Distribution of packet size</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartDatam9}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam9?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
               
                    </Col>
                    <Col span={12}>
                    <h2>Distribution of Top Source IP</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartDatam10}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam10?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[20, 20]} className="chart-row">
                    <Col span={12}>
                    <h2>Distribution of Top Destination IP</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData11}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartData11?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                    <h2>Top IP pairs by traffic volume (len)</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData12}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartData12?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </div>
              )}
              {activeTabKey === "4" && (
                <div>
                  <Row gutter={[24, 24]} className="event-summary" style={{ marginBottom: "20px" }}>
                    <Col span={12}>
                      <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                        <h3>Suspicious Traffic</h3>
                        <p>
                          <Tooltip title="Range of size" placement="right">
                            Number Src Port: {Datam813UniSrc} Ports <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Source IP number" placement="right">
                          Number Dst Port: {Datam813UniDst} Ports <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Destination IP number" placement="right">
                            Number of Protocol: {Datam813UniPro} <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="IP number" placement="right">
                          Number of App Protocol: {Datam813AppPro}  <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                        <h3>Suspicious Traffic</h3>
                        <p>
                          <Tooltip title="Range of size" placement="right">
                            Max Duration: {Data13Max}s <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Source IP number" placement="right">
                            Min Duration: {Datam13Min}s <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                        <p>
                          <Tooltip title="Destination IP number" placement="right">
                            Mean Duration: {Datam13Mean}s <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={12}>
                    <h2>The Protocol</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieChartData14}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {pieChartData14.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                    <h2>Top 10 The Application Protocol</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData15}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartData15?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[20, 20]} className="chart-row">
                    <Col span={12}>
                    <h2>Top source port.</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData16}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartData16?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                    <h2>Top destination port.</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData17}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartData17?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h2>Total Source To Destination Bytes Sent</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData18}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h2>Total Destination To Source Bytes Sent</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData19}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="pv" stroke="#FF8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          )}

          {viewType === "Table" && (
            <div>
              <h2>Table</h2>
              <Row gutter={[24, 24]} style={{ marginBottom: '20px' }}>
                <Col span={14}>
                  <Input 
                    placeholder="Search..." 
                    value={searchText} 
                    onChange={handleSearch} 
                    prefix={<SearchOutlined />} 
                    style={{ width: '100%' }} 
                  />
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                  <Select
                    suffixIcon={<FilterOutlined />}
                    style={{ width: '30%', marginRight: '8px' }}
                    placeholder="Select a field"
                    onChange={handleFieldChange}
                    allowClear
                  >
                    <Select.Option value="">All Fields</Select.Option>
                    {columns.map((col) => (
                      <Select.Option key={col.dataIndex} value={col.dataIndex}>
                        {col.title}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* select giá trị của trường */}
                  <Select
                    style={{ width: '30%', marginRight: '8px' }}
                    placeholder="Select a value"
                    value={selectedValue}
                    onChange={handleValueChange}
                    allowClear
                    disabled={!selectedField}
                  >
                    <Select.Option value="">-- No Filter --</Select.Option> {/* Giá trị rỗng để cho phép tìm kiếm */}
                    {uniqueFieldValues.map((value) => (
                      <Select.Option key={value} value={value}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>

                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
              <Table
                bordered
                dataSource={filteredData.map((item: any) => ({
                  ...item,
                  rowClassName: item.labl === 'Anomaly' ? 'anomaly-row' : '',
                }))}
                columns={columnsWithButton}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  position: ['bottomRight'],
                  prevIcon: <Button>«</Button>,
                  nextIcon: <Button>»</Button>,
                }}
                scroll={{x:1000}}
                components={{
                  header: {
                    cell: ResizableTitle,
                  },
                }}
                rowClassName={(record) => (record.Label === 'Anomaly' ? 'anomaly-row' : '')}
                className="custom-table"
              />
            </div>
          )}
        <Modal
        title="Chọn file Log"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không có footer
        width={800} // Đặt kích thước modal
      >
        {/* Hiển thị danh sách các file traffic */}
        <Menu>
        {logFiles.map((item: any, index) => (
                <Menu.Item 
                  key={`traffic-file-${index}`} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >            
                    <div>                    
                    <Button onClick={()=>handleOnClickTraffic(item.id)} style={{ marginLeft: 5 , color: "rgb(91, 107, 121)" , backgroundColor: "rgb(178, 223, 219)" }} >{item.filename}</Button>
                    </div>                  
                </Menu.Item>
              ))}</Menu>
      </Modal>
          {/* Modal hiển thị bảng traffic */}
      <Modal
        title="Log Data"
        visible={isModalVisible1}
        onCancel={handleCancel1}
        onOk={handleCancel1}
         // Không có footer
        width={2000}
// Đặt kích thước modal
      >
        <h2>
                {log_type === 'dns' ? 'DNS Log' :
                log_type === 'audit' ? 'Audit Log' :
                log_type === 'access' ? 'Access Log' : 'Select Log Type'} Table
              </h2>
        {/* Hiển thị bảng traffic trong modal */}
        <Table
          dataSource={logData}
          columns={columnsLog}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ['bottomRight'],
            prevIcon: <Button>«</Button>,
            nextIcon: <Button>»</Button>,
          }}
          scroll={{x:1000}}
          loading={loading} // Hiển thị loading khi đang chờ dữ liệu
          rowKey="id" // Đặt rowKey nếu dữ liệu có ID
          rowClassName={(record:LogRecord) => record.Anomaly === 'Anomaly' ? 'anomaly-row' : ''}
        />
      </Modal>

      {/* Modal sẽ hiển thị khi nhấn vào nút 'Payload' */}
      <Modal
        title="Payload Data"
        visible={isModalVisiblePayload}
        onOk={handleOk}
        onCancel={handleCancelPayload}
      >
        <p>{modalContent}</p> {/* Hiển thị dữ liệu payload trong modal */}
      </Modal>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
