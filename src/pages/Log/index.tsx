import { useState, useEffect, useLayoutEffect } from "react";
import { Button, Col, Row, Tabs, Table, Input, Select , Menu } from "antd";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Label} from "recharts";
import './styles.scss'; // Import file SCSS
import { useParams } from "react-router-dom";
import { getlogByID } from "services/apiService";
import ResizableTitle from "pages/App/subcomponents/MainLayout/subcomponents/ResiableTitle";
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

import { Modal } from 'antd';
import { gettraffic, gettrafficById} from '../../services/apiService';

const stackedbarchartdata = [
  {
    status_code: '200',
    methods: [
      { method: 'GET', count: 5000 },
      { method: 'HEAD', count: 3000 },
      { method: 'OPTIONS', count: 100 },
      { method: 'POST', count: 200 },

    ]
  },
  {
    status_code: '404',
    methods: [
      { method: 'GET', count: 4000 },
      { method: 'HEAD', count: 2000 },
      { method: 'OPTIONS', count: 50 },
      { method: 'POST', count: 100 },
    ]
  },
  {
    status_code: '408',
    methods: [
      { method: 'GET', count: 4000 },
      { method: 'HEAD', count: 2000 },
      { method: 'OPTIONS', count: 50 },
      { method: 'POST', count: 100 },
    ]
  }
];
// Create an array to store unique methods
const allMethods = Array.from(new Set(stackedbarchartdata.flatMap(entry => entry.methods.map(item => item.method))));

const { TabPane } = Tabs;

// Array to store colors for charts
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
  //log
  const { id } = useParams();
  const [viewType, setViewType] = useState("Map");
  const [activeTabKey, setActiveTabKey] = useState('');

  // State for storing data for each chart/table
  const [log_type, setLogType] = useState('');
  const [tableDatam1, setTableDatam1] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedField, setSelectedField] = useState('');

  // M2
  const [barChartDatam2, setBarChartDatam2] = useState([]);

  // M3
  const [lineChartDatam3, setLineChartDatam3] = useState([]);
  //M4
  const [barChartDatam4, setBarChartDatam4] = useState([]);
  //M5
  const [barChartDatam5, setBarChartDatam5] = useState([]);
  //M6 Access
  const [barChartDatam6Access, setBarChartDatam6Access] = useState([]);

  const [barChartDatam7Access, setBarChartDatam7Acsess] = useState([]);
  const [PieChartData8Access, setPieChartData8Access] = useState([]);
  const [PieChartData9Access, setPieChartData9Access] = useState([]);
  const [PieChartData10Access, setPieChartData10Access] = useState([]);

  //M6 Audit
  const [barChartDatam6Audit, setBarChartDatam6Audit] = useState([]);
  const [barChartDatam7Audit, setBarChartDatam7Audit] = useState([]);
  const [barChartDatam8Audit, setBarChartDatam8Audit] = useState([]);
  const [PieChartData9Audit, setPieChartData9Audit] = useState([]);

  //Anomaly
  const [anomalyTimestamps, setAnomalyTimestamps] = useState<string[]>([]);

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

  let columns: typeof dnsColumns | typeof auditColumns | typeof accessColumns | [] | undefined;

  if (log_type === 'dns') {
    columns = dnsColumns;

  } else if (log_type === 'audit') {
    columns = auditColumns;

  } else if (log_type === 'access') {
    columns = accessColumns;

  }
 
  // Handle search input
  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleFieldChange = (value: any) => {
    setSelectedField(value);
  };

  const filteredData = tableDatam1.filter((item) => {
    if (!selectedField || selectedField === "All Fields") {
      return Object.values(item).some((val) => {
        if (val !== undefined && val !== null) {
          const valueStr = typeof val === 'string' || typeof val === 'number' ? String(val) : '';
          return valueStr.toLowerCase().includes(searchText.toLowerCase());
        }
        return false;
      });
    } else {
      const selectedValue = item[selectedField];
      if (selectedValue !== undefined && selectedValue !== null) {
        const valueStr = typeof selectedValue === 'string' || typeof selectedValue === 'number' ? String(selectedValue) : '';
        return valueStr.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    }
  });

  const toggleViewType = () => {
    setViewType((prevType) => (prevType === "Map" ? "Table" : "Map"));
  };
 
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  useLayoutEffect(() => {
    getlogByID(id).then( async (res) =>{
      await setLogType(res['typeLog']);//ok
      setTableDatam1(res['m1']);//ok
      // Process network data
      setBarChartDatam2(res['m2'])
      setLineChartDatam3(res['m3'])//ok
      setBarChartDatam4(res['m4']);
      setBarChartDatam5(res['m5']);

      if(log_type === "audit"){
        //Audit
        setBarChartDatam6Audit(res['m6']);
        setBarChartDatam7Audit(res['m7']);
        setBarChartDatam8Audit(res['m8']);
        setPieChartData9Audit(res['m9']);
      }else if(log_type === "access"){
        //Access
        setBarChartDatam6Access(res['m6'])
        setBarChartDatam7Acsess(res['m7']);
        setPieChartData8Access(res['m8']);
        setPieChartData10Access(res['m10']);
        setPieChartData9Access(res['m9']);
      }
      setAnomalyTimestamps(res['m11'])

    }).catch((error) => {
      console.error("Error fetching log data:", error);
    });
  }, [id]);

  useEffect(() => {
    if (log_type === 'dns') {
      setActiveTabKey('1');
    } else if (log_type === 'audit') {
      setActiveTabKey('2');
    } else if (log_type === 'access') {
      setActiveTabKey('3');
    } else if (log_type === 'undefined') {
      setActiveTabKey('4');
    }
  }, [log_type]);
//link log timestamp anomaly
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);  // Quản lý trạng thái modal
  const [isLogModalVisibleAudit, setIsLogModalVisibleAudit] = useState(false);  // Quản lý trạng thái modal
  const [isLogModalVisibleAccess, setIsLogModalVisibleAccess] = useState(false);  // Quản lý trạng thái modal

  const [selectedTimestamp, setSelectedTimestamp] = useState(null);  // Quản lý thời gian đã chọn
  const [filteredLogs, setFilteredLogs] = useState([]);  // Lưu trữ dữ liệu log đã lọc
  const handleDotClick = (timestamp:any) => {
    // Chuyển đổi timestamp thành dạng chuỗi để tìm kiếm
    const logsForTimestamp = tableDatam1.filter((log:any) => {
      // Kiểm tra xem timestamp của log có chứa chuỗi timestamp đã chọn không (tìm kiếm gần đúng)
      return log.Timestamp.includes(timestamp);
    });
  
    setSelectedTimestamp(timestamp);
    setFilteredLogs(logsForTimestamp);
    setIsLogModalVisible(true);  // Mở modal
  };
  const handleDotClickAudit = (timestamp:any) => {
    // Chuyển đổi timestamp thành dạng chuỗi để tìm kiếm
    const logsForTimestamp = tableDatam1.filter((log:any) => {
      // Kiểm tra xem timestamp của log có chứa chuỗi timestamp đã chọn không (tìm kiếm gần đúng)
      return log.Timestamp.includes(timestamp);
    });
    setSelectedTimestamp(timestamp);
    setFilteredLogs(logsForTimestamp);
    setIsLogModalVisibleAudit(true);  // Mở modal
  };
  const handleDotClickAccess = (timestamp:any) => {
    // Chuyển đổi timestamp thành dạng chuỗi để tìm kiếm
    const logsForTimestamp = tableDatam1.filter((log:any) => {
      // Kiểm tra xem timestamp của log có chứa chuỗi timestamp đã chọn không (tìm kiếm gần đúng)
      return log.Timestamp.includes(timestamp);
    });
    setSelectedTimestamp(timestamp);
    setFilteredLogs(logsForTimestamp);
    setIsLogModalVisibleAccess(true);  // Mở modal
  };

  type ChartData = {
    name: string;
    uv: number;
  };

  const getTopXData = (data: ChartData[], topX: number): ChartData[] => {
    if (!Array.isArray(data) || data.length === 0 || typeof topX !== 'number' || topX <= 0) {
      return data; // Trả về dữ liệu gốc nếu không có dữ liệu hoặc topX không hợp lệ
    }
    // Sắp xếp dữ liệu theo 'uv' giảm dần và trả về top X phần tử
    return [...data].sort((a, b) => b.uv - a.uv).slice(0, topX);
  };

  const [barChartDatam4TopX, setBarChartDatam4TopX] = useState<ChartData[]>([]);
  // setBarChartDatam4TopX(barChartDatam4)
  const [barChartDatam5TopX, setBarChartDatam5TopX] = useState<ChartData[]>([]);
  const [barChartDatam6TopX, setBarChartDatam6TopX] = useState<ChartData[]>([]);
  const [barChartDatam7TopX, setBarChartDatam7TopX] = useState<ChartData[]>([]);
  const [barChartDatam8TopX, setBarChartDatam8TopX] = useState<ChartData[]>([]);

  const handleTopXm4Change = (data: ChartData[],topX: number) => {
    setBarChartDatam4TopX(getTopXData(data, topX));
    // Trực tiếp cập nhật state với dữ liệu đã lọc mà không tạo biến trung gian
  };
  const handleTopXm5Change = (data: ChartData[],topX: number) => {
    setBarChartDatam5TopX(getTopXData(data, topX));
    // Trực tiếp cập nhật state với dữ liệu đã lọc mà không tạo biến trung gian
  };
  const handleTopXm6Change = (data: ChartData[],topX: number) => {
    setBarChartDatam6TopX(getTopXData(data, topX));
    // Trực tiếp cập nhật state với dữ liệu đã lọc mà không tạo biến trung gian
  };
  const handleTopXm7Change = (data: ChartData[],topX: number) => {
    setBarChartDatam7TopX(getTopXData(data, topX));
    // Trực tiếp cập nhật state với dữ liệu đã lọc mà không tạo biến trung gian
  };
  const handleTopXm8Change = (data: ChartData[],topX: number) => {
    setBarChartDatam8TopX(getTopXData(data, topX));
    // Trực tiếp cập nhật state với dữ liệu đã lọc mà không tạo biến trung gian
  };
  //link traffic
  interface LogRecord {
    Timestamp: string; // hoặc Date, tùy vào định dạng
    id: string; // nếu có thêm id hoặc các thuộc tính khác
    Anomaly?: string;  // Thuộc tính Anomaly có thể là string hoặc undefined
      // Thêm các thuộc tính khác nếu cần
    [key: string]: any;
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [selectedLogRecord, setSelectedLogRecord] = useState<LogRecord | null>(null);
  const [trafficFiles, setTrafficFiles] = useState<string[]>([]);  // Trạng thái để lưu trữ các tệp đã tải lên cho Traffic
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(false);
  //LINK TRAFFIC FUNCTION
  useEffect(() => {
    gettraffic().then((res) => {
      console.log(res); // Kiểm tra cấu trúc dữ liệu trả về
      setTrafficFiles(res);
    });
  }, []);

  const showModal = (recordLog:any)=> {
    setSelectedLogRecord(recordLog);
    setIsModalVisible(true);
    showModal1(false)
  };
  const showModal1 = async (state:any) => {
    setIsModalVisible1(state);
  };

  const handleOnClickTraffic = async (trafficid: any)=>{
    handleTrafficFileSelect(trafficid)

  }
  const convertTimestampToComparableFormat = (timestamp: string) => {
    // Thay '/' bằng '-' và khoảng trắng ' ' bằng 'T' để có định dạng chuẩn ISO
    return timestamp.replace(/\//g, '-').replace(' ', 'T');
  };
  // Hàm so sánh hai timestamp và kiểm tra chênh lệch thời gian có <= 30 giây
  const compareTimestamps = (logTimestamp: string, trafficTimestamp: string) => {
    let logDate, trafficDate;
    // Kiểm tra và chuyển đổi logTimestamp thành đối tượng Date
    if (!isNaN(Number(logTimestamp))) {
      logDate = new Date(Number(logTimestamp)); // Trường hợp logTimestamp là số milliseconds
    } else {
      logDate = new Date(convertTimestampToComparableFormat(logTimestamp)); // Chuyển đổi chuỗi về định dạng chuẩn
    }
    // Chuyển trafficTimestamp thành đối tượng Date
    trafficDate = new Date(convertTimestampToComparableFormat(trafficTimestamp));
    // Kiểm tra tính hợp lệ của đối tượng Date
    if (isNaN(logDate.getTime()) || isNaN(trafficDate.getTime())) {
      console.error("Invalid date:", { logTimestamp, trafficTimestamp });
      return false;
    }
    // Tính toán chênh lệch thời gian tính bằng milliseconds
    const timeDifference = Math.abs(logDate.getTime() - trafficDate.getTime());
    // Trả về true nếu chênh lệch nhỏ hơn hoặc bằng 30 giây (30,000 milliseconds)
    return timeDifference <= 30000;
  };
  // Hàm xử lý khi chọn file traffic
  const handleTrafficFileSelect = async (trafficFile: any) => {
    console.log(trafficFile);
  
    try {
      const trafficDataSet = await gettrafficById(trafficFile); // Lấy dữ liệu traffic theo ID
      console.log(trafficDataSet);
      console.log(selectedLogRecord);
  
      setLoading(true); // Bắt đầu loading
  
      if (selectedLogRecord && trafficDataSet) {
        console.log(selectedLogRecord.Timestamp);
  
        // Lấy dữ liệu traffic từ trafficDataSet
        let trafficData = trafficDataSet['m1'];
        if (!trafficData || !trafficData.length) {
          console.error("No traffic data available");
          return;
        }
  
        // Lọc trafficData theo khoảng thời gian 30 giây
        const filteredTrafficData = trafficData.filter((item: any) => 
          compareTimestamps(selectedLogRecord.Timestamp, item.Timestamp)
        );
  
        setTrafficData(filteredTrafficData); // Lưu dữ liệu đã lọc
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
    setTrafficData([]); 
  };
  const handleCancel1 = () => {
    setIsModalVisible1(false);
    setTrafficData([]); 
  };
  const TrafficColumns=[
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
    { title: 'Label', dataIndex: 'Label', key: 'labl', width: 80 },]


  const actionColumn = {
    title: 'Hành động',
    key: 'action',
    width: 150,
    render: (text: any, record: LogRecord) => (
      <Button type="primary" onClick={() => showModal(record)}>
        Tìm kiếm Traffic
      </Button>
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
                <Tabs activeKey={activeTabKey} onChange={handleTabChange} centered >
                  <TabPane 
                    tab="DNS Log" 
                    key="1" 
                    disabled={log_type !== ('dns')} 
                    active={log_type === ('dns')}
                  />
                  <TabPane 
                    tab="Audit Log" 
                    key="2" 
                    disabled={log_type !== ('audit')} 
                    active={log_type === ('audit')}
                  />
                  <TabPane 
                    tab="Apache Log" 
                    key="3" 
                    disabled={log_type !== ('access')}
                    active={log_type === ('access')}
                  />
                  <TabPane 
                    tab="Undefined" 
                    key="4" 
                    disabled={log_type !== ('undefined')} 
                  />
                </Tabs>
              </Col>
            )}
          </Row>
          {viewType === "Map" && (
            <div>
              {activeTabKey === "1" && (
                <div>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={12}>
                    <h2>DNS Event</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '20px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>UV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barChartDatam2?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{item['name']}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{item['uv']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table></Col>
                    
                    </Row>
                    <Row gutter={[40, 40]} className="chart-row">
                    <Col span={24}>
                      <h2>Total Number of DNS Events per Day/Hour</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartDatam3}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis>
                            <Label value="Số sự kiện" angle={-90} position="insideLeft" />
                          </YAxis>
                          <RechartsTooltip />
                          <Legend formatter={() => 'Thời gian'} />
                          <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            dot={(dataPoint) => {
                              const { cx, cy } = dataPoint;  // Lấy giá trị cx và cy từ dataPoint
                              return anomalyTimestamps.includes(dataPoint.payload.name) ? (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="red"
                                    onClick={() => handleDotClick(dataPoint.payload.name)}  // Thêm sự kiện onClick
                                    style={{ cursor: 'pointer' }}
                                  />  // Định nghĩa vị trí của chấm dựa trên cx, cy
                              ) : (
                                <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                              );
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Modal
                      title={`Log DNS for ${selectedTimestamp}`}
                      visible={isLogModalVisible}
                      onCancel={() => setIsLogModalVisible(false)}
                      footer={null}
                      width={1300}
                      height={1000}
                    >
                      <Table
                        dataSource={filteredLogs.map((item: any) => ({
                          ...item,
                          rowClassName: item.label === 'Anomaly' ? 'anomaly-row' : '',
                        }))}
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
                      rowClassName={(record) => (record.Anomaly === 'Anomaly' ? 'anomaly-row' : '')}
                      className="custom-table"
                      />
                    </Modal>


                  <Row gutter={[20, 20]} className="chart-row">
                    <Col span={12}>  
                    <h2>Top Source IPs by Number of DNS Events</h2>  
                     {/* Nhóm nút Top 3, Top 5, Top 10 */}
                    <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>            
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartDatam4TopX.length > 0 ? barChartDatam4TopX : barChartDatam4}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" ></XAxis>
                          <YAxis ><Label value="Number of Events" angle={-90} position="insideLeft" /></YAxis>
                          <RechartsTooltip />
                          <Legend formatter={() => 'Source IPs'} />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }} >
                            {barChartDatam4?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                    <Col span={12}>
                    <h2>Distribution of DNS Query Type</h2>
                    <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>  
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartDatam5TopX.length > 0 ? barChartDatam5TopX : barChartDatam5}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name"></XAxis>
                          <YAxis><Label value="Number of Queries" angle={-90} position="insideLeft" /></YAxis>
                          <RechartsTooltip />
                          <Legend formatter={() => 'Query Type'} />
                          <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam5?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>               
                </div>
              )}
              {activeTabKey === "2" && (
                <div>
                <Row gutter={[24, 24]} className="chart-row">
                  <h2>Event Template</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam2}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="EventTemplate" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'Event Template'}/>
                        <Bar dataKey="Occurrences"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam2?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Row>
                  <Row gutter={[40, 40]} className="chart-row">
                  <Col span={23}>
                    <h2>Event Per Day</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartDatam3}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'Time'}/>
                        <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            dot={(dataPoint) => {
                              const { cx, cy } = dataPoint;  // Lấy giá trị cx và cy từ dataPoint
                              return anomalyTimestamps.includes(dataPoint.payload.name) ? (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="red"
                                    onClick={() => handleDotClickAudit(dataPoint.payload.name)}  // Thêm sự kiện onClick
                                    style={{ cursor: 'pointer' }}
                                  />  // Định nghĩa vị trí của chấm dựa trên cx, cy
                              ) : (
                                <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                              );
                            }}
                          />
                      </LineChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
                <Modal
                      title={`Log Audit for ${selectedTimestamp}`}
                      visible={isLogModalVisibleAudit}
                      onCancel={() => setIsLogModalVisibleAudit(false)}
                      footer={null}
                      width={1300}
                      height={1000}
                    >
                      <Table
                        dataSource={filteredLogs.map((item: any) => ({
                          ...item,
                          rowClassName: item.label === 'Anomaly' ? 'anomaly-row' : '',
                        }))}
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
                      rowClassName={(record) => (record.Anomaly === 'Anomaly' ? 'anomaly-row' : '')}
                      className="custom-table"
                      />
                    </Modal>
                <Row gutter={[20, 20]} className="chart-row">
                  <Col span={12}>  
                  <h2>Event type</h2>     
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>           
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam4TopX.length > 0 ? barChartDatam4TopX : barChartDatam4}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'Event Type'}/>
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam4?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>            
                  </Col>
                  <Col span={12}>
                  <h2>Account activity</h2>
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>  
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam5TopX.length > 0 ? barChartDatam5TopX : barChartDatam5}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'Account'}/>
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam5?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
                <Row gutter={[20, 20]} className="chart-row">
                  <Col span={12}>  
                  <h2>PID</h2>   
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Audit,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Audit,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Audit,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>             
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam6TopX.length > 0 ? barChartDatam6TopX : barChartDatam6Audit}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'PID'}/>
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam6Audit?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>            
                  </Col>
                  <Col span={12}>
                  <h2>UID</h2>
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm7Change(barChartDatam7Audit,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm7Change(barChartDatam7Audit,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm7Change(barChartDatam7Audit,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>  
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam7TopX.length > 0 ? barChartDatam7TopX : barChartDatam7Audit}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'UID'}/>
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam7Audit?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
                <Row gutter={[20, 20]} className="chart-row">
                  <Col span={12}>  
                  <h2>EXE</h2> 
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm8Change(barChartDatam8Audit,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm8Change(barChartDatam8Audit,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm8Change(barChartDatam8Audit,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>               
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam8TopX.length > 0 ? barChartDatam8TopX : barChartDatam8Audit}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis><Label value="Number" angle={-90} position="insideLeft" /></YAxis>
                        <RechartsTooltip />
                        <Legend formatter={() => 'EXE command'}/>
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam8Audit?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>            
                  </Col>
                  <Col span={12}>
                  <h2>Successful Event Categories</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={PieChartData9Audit}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {PieChartData9Audit?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                  </Col>
                </Row>               
              </div>
              )}
              {activeTabKey === "3" && (
                <div>
                  <Row gutter={[24, 24]} className="chart-row">
                  <h2>Event Template</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam2}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="EventTemplate" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                       
                        <Bar dataKey="Occurrences"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam2?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Row>
                  <Row gutter={[40, 40]} className="chart-row">
                  <Col span={23}>
                    <h4>Number Event Per Hours</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartDatam3}>
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
                              const { cx, cy } = dataPoint;  // Lấy giá trị cx và cy từ dataPoint
                              return anomalyTimestamps.includes(dataPoint.payload.name) ? (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="red"
                                    onClick={() => handleDotClickAccess(dataPoint.payload.name)}  // Thêm sự kiện onClick
                                    style={{ cursor: 'pointer' }}
                                  />  // Định nghĩa vị trí của chấm dựa trên cx, cy
                              ) : (
                                <circle cx={cx} cy={cy} r={4} fill="#8884d8" />
                              );
                            }}
                          />
                      </LineChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
                <Modal
                      title={`Log Access for ${selectedTimestamp}`}
                      visible={isLogModalVisibleAccess}
                      onCancel={() => setIsLogModalVisibleAccess(false)}
                      footer={null}
                      width={1300}
                      height={1000}
                    >
                      <Table
                        dataSource={filteredLogs.map((item: any) => ({
                          ...item,
                          rowClassName: item.label === 'Anomaly' ? 'anomaly-row' : '',
                        }))}
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
                      rowClassName={(record) => (record.Anomaly === 'Anomaly' ? 'anomaly-row' : '')}
                      className="custom-table"
                      />
                    </Modal>
                <Row gutter={[20, 20]} className="chart-row">
                  <Col span={12}>  
                  <h2>Top Frequent Values in Client_IP</h2>  
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm4Change(barChartDatam4,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>              
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam4TopX.length > 0 ? barChartDatam4TopX : barChartDatam4}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        {/* <Bar dataKey="count" fill="#8884d8" /> */}
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam4?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>            
                  </Col>
                  <Col span={12}>
                  <h2>Histogram Of Filtered Data</h2>
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm5Change(barChartDatam5,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>  
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barChartDatam5TopX.length > 0 ? barChartDatam5TopX : barChartDatam5}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="uv"  fill="#8884d8" label={{ position: 'top' }}>
                            {barChartDatam5?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                            ))}
                          </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
                <Row gutter={[20, 20]} className="chart-row">
                <Col span={12}>  
                  <h2>HTTP Methods by Status Code</h2>
                  <div style={{ marginBottom: '10px' }}>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Access,3)}>Top 3</Button>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Access,5)} style={{ marginLeft: 8 }}>Top 5</Button>
                      <Button onClick={() => handleTopXm6Change(barChartDatam6Access,10)} style={{ marginLeft: 8 }}>Top 10</Button>
                    </div>               
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartDatam6TopX.length > 0 ? barChartDatam6TopX : barChartDatam6Access}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status_code" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      {allMethods?.map((method, index) => (
                        <Bar key={method} dataKey={method} stackId="a" fill={COLORS[index % COLORS.length]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>               
                </Col>
                <Col span={12}>
                  <h2>User_Agent</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '20px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>UV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barChartDatam7Access?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{item['name']}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{item['uv']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
                </Row>
                <Row gutter={[20, 20]} className="chart-row">
                  <Col span={8}>  
                  <h2>Distribution of Status_Code</h2>              
                  <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={PieChartData8Access}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {PieChartData8Access?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>           
                  </Col>
                  <Col span={8}>
                  <h2>Distribution of Version</h2>
                  <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={PieChartData9Access}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {PieChartData9Access?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                  </Col>
                  <Col span={8}>
                  <h2>Distribution of Version</h2>
                  <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={PieChartData10Access}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {PieChartData10Access?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                  </Col>
                </Row>
                </div>
              )}
              </div>
            )}

          {viewType === "Table" && (
            <div>
              <h2>
                {log_type === 'dns' ? 'DNS Log' :
                log_type === 'audit' ? 'Audit Log' :
                log_type === 'access' ? 'Access Log' : 'Select Log Type'} Table
              </h2>

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
                    style={{ width: '25%', marginRight: '8px' }}
                    placeholder="Select a field"
                    onChange={handleFieldChange}
                    allowClear
                  >
                    <Select.Option value="">All Fields</Select.Option>
                    
                    {columns?.map((col) => (
                      <Select.Option key={col.dataIndex} value={col.dataIndex}>
                        {col.title}
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
                  rowClassName: item.label === 'Anomaly' ? 'anomaly-row' : '',
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
                rowClassName={(record) => (record.Anomaly === 'Anomaly' ? 'anomaly-row' : '')}
                className="custom-table"
              />
              </div>
              
          )}
          {/* Modal hiển thị danh sách file traffic */}
      <Modal
        title="Chọn file Traffic"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không có footer
        width={800} // Đặt kích thước modal
      >
        {/* Hiển thị danh sách các file traffic */}
        <Menu>
        {trafficFiles.map((item: any, index) => (
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
        title="Traffic Data"
        visible={isModalVisible1}
        onCancel={handleCancel1}
         // Không có footer
        width={1500}
        height={3000} // Đặt kích thước modal
      >
        {/* Hiển thị bảng traffic trong modal */}
        <Table
          dataSource={trafficData.map((item: any) => ({
            ...item,
            rowClassName: item.labl === 'Anomaly' ? 'anomaly-row' : '',
          }))}
          columns={TrafficColumns}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ['bottomRight'],
            prevIcon: <Button>«</Button>,
            nextIcon: <Button>»</Button>,
          }}
          loading={loading} // Hiển thị loading khi đang chờ dữ liệu
          rowKey="id" // Đặt rowKey nếu dữ liệu có ID
          rowClassName={(TrafficColumns) => (TrafficColumns.Label === 'Anomaly' ? 'anomaly-row' : '')}
          className="custom-table"
        />
      </Modal>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
