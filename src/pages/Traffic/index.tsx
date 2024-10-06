import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Col,
  Row,
  Tabs,
  Card,
  Tooltip,
  Table,
  Input,
  Select,
  Menu,
  Space,
  Spin,
  Divider,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Label,
} from "recharts";
import "./styles.scss"; // Import file SCSS
import { useParams } from "react-router-dom";
import { gettrafficById } from "services/apiService";
import MapComponent from "pages/App/subcomponents/MainLayout/subcomponents/MapComponent";
import ResizableTitle from "pages/App/subcomponents/MainLayout/subcomponents/ResiableTitle";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import NetGraph from "pages/App/subcomponents/NetGraph";
import { Modal } from "antd";
import { getlog, getlogByID } from "../../services/apiService";

const { TabPane } = Tabs;
const COLORS = [
  "#0088FE", // Bright Blue
  "#00C49F", // Bright Green
  "#FFBB28", // Bright Yellow
  "#FF8042", // Bright Orange
  "#FF6384", // Bright Pink
  "#FF5733", // Bright Red
  "#C70039", // Bright Magenta
  "#36A2EB", // Light Blue
  "#FFCE56", // Light Yellow
  "#FFC300", // Bright Gold
  "#DAF7A6", // Light Green
  "#581845", // Deep Purple
  "#900C3F", // Dark Pink
  "#FF9FF3", // Light Pink
  "#F368E0", // Bright Purple
  "#00C851", // Bright Lime
  "#007E33", // Dark Green
  "#FF4444", // Bright Red
  "#33b5e5", // Light Sky Blue
  "#2BBBAD", // Bright Cyan
];
const Dashboard = () => {
  const { id } = useParams();
  const [viewType, setViewType] = useState("Map");
  const [activeTabKey, setActiveTabKey] = useState("2");
  // M1
  const [tableDatam1, setTableDatam1] = useState([]);
  // State cho tìm kiếm và trường được chọn của M1
  const [searchText, setSearchText] = useState("");
  const [selectedField, setSelectedField] = useState("");
  //M2
  interface ProtocolCounts {
    SSH: number;
    HTTP: number;
    HTTPS: number;
    DNS: number;
    TCP: number;
  }
  interface Netgraph {
    source: string; // hoặc Date, tùy vào định dạng
    target: string; // nếu có thêm id hoặc các thuộc tính khác
    label: string;
    [key: string]: any;
  }
  interface NetTableRecord {
    id: number;
    source: string;
    target: string;
    nameserver: string;
    label: string;
    protocol_counts: ProtocolCounts;
    payloads_with_timestamps: any;
    dest_event_counts: Record<string, number>;
    source_event_counts: Record<string, number>;
  }
  const [netgraph, setNetgraph] = useState<Netgraph[]>([]);
  const nettablecolumns = [
    { title: "Source", dataIndex: "source", key: "src", width: 120 },
    { title: "Target", dataIndex: "target", key: "targ", width: 120 },
    { title: "Label", dataIndex: "label", key: "labl", width: 80 },
  ];

  interface NetIP {
    IP: any; // hoặc Date, tùy vào định dạng
    Count: number; // nếu có thêm id hoặc các thuộc tính khác
    ConnectedIPs: any;
    FirstEvent: string;
    LastEvent: string;
    [key: string]: any;
  }
  const [netIp, setNetIp] = useState<NetIP[]>([]);
  const [netInfo, setNetInfo] = useState<NetTableRecord[]>([]);

  const [nettable, setNettable] = useState([]);
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
  //Anomaly M21
  const [anomalyTimestamps, setAnomalyTimestamps] = useState<string[]>([]);
  // M22
  const [Data22SumAlert, setDatam22Alert] = useState([]);
  const [Data22SumIP, setDatam22IP] = useState([]);
  // M23
  const [barChartDatam23, setBarChartDatam23] = useState([]);
  // M24
  const [barChartDatam24, setBarChartDatam24] = useState([]);
  // M25
  const [barChartDatam25, setBarChartDatam25] = useState([]);
  // M26
  const [barChartDatam26, setBarChartDatam26] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  // const [columns, setColumns] = useState([
  //   // { title: 'Flow ID', dataIndex: 'Flow ID', key: 'flowID', width: 100 },
  //   { title: 'Timestamp', dataIndex: 'Timestamp', key: 'timestamp', width: 120 },
  //   { title: 'Source IP', dataIndex: 'Source IP', key: 'srcIP', width: 150 },
  //   { title: 'Destination IP', dataIndex: 'Destination IP', key: 'dstIP', width: 150 },
  //   { title: 'Source Port', dataIndex: 'Source Port', key: 'srcPort', width: 90 },
  //   { title: 'Destination Port', dataIndex: 'Destination Port', key: 'dstPort', width: 120 },
  //   { title: 'Protocol', dataIndex: 'Protocol', key: 'protocol', width: 100 },
  //   { title: 'Application Protocol', dataIndex: 'Application Protocol', key: 'appProtocol', width: 130 },
  //   { title: 'Time Delta', dataIndex: 'Time_Delta', key: 'timeDelta', width: 110 },
  //   { title: 'Totlen Pkts', dataIndex: 'Totlen Pkts', key: 'totLenPkts', width: 100 },
  //   { title: 'Tot Fwd Pkts', dataIndex: 'Tot Fwd Pkts', key: 'totFwdPkts', width: 100 },
  //   { title: 'Tot Bwd Pkts', dataIndex: 'Tot Bwd Pkts', key: 'totBwdPkts', width: 100 },
  //   { title: 'TotLen Fwd Pkts', dataIndex: 'TotLen Fwd Pkts', key: 'totLenFwdPkts', width: 100 },
  //   { title: 'TotLen Bwd Pkts', dataIndex: 'TotLen Bwd Pkts', key: 'totLenBwdPkts', width: 100 },
  //   { title: 'Tot Pkts', dataIndex: 'Tot Pkts', key: 'totPkts', width: 60 },
  //   { title: 'Label', dataIndex: 'Label', key: 'labl', width: 90 },
  //   { title: 'Confidence Score', dataIndex: 'Conference', key: 'conference', width: 110 },
  // ]);
  const columns = [
    {
      title: "Timestamp",
      dataIndex: "Timestamp",
      key: "timestamp",
      width: 120,
      sorter: (a: any, b: any) =>
        new Date(a["Timestamp"]).getTime() - new Date(b["Timestamp"]).getTime(),
    },
    {
      title: "Source IP",
      dataIndex: "Source IP",
      key: "srcIP",
      width: 80,
      sorter: (a: any, b: any) => a["Source IP"].localeCompare(b["Source IP"]),
    },
    {
      title: "Destination IP",
      dataIndex: "Destination IP",
      key: "dstIP",
      width: 80,
      sorter: (a: any, b: any) =>
        a["Destination IP"].localeCompare(b["Destination IP"]),
    },
    {
      title: "Source Port",
      dataIndex: "Source Port",
      key: "srcPort",
      width: 90,
      sorter: (a: any, b: any) => a["Source Port"] - b["Source Port"],
    },
    {
      title: "Destination Port",
      dataIndex: "Destination Port",
      key: "dstPort",
      width: 100,
      sorter: (a: any, b: any) => a["Destination Port"] - b["Destination Port"],
    },
    {
      title: "Protocol",
      dataIndex: "Protocol",
      key: "protocol",
      width: 70,
      sorter: (a: any, b: any) => a["Protocol"].localeCompare(b["Protocol"]),
    },
    {
      title: "Application Protocol",
      dataIndex: "Application Protocol",
      key: "appProtocol",
      width: 110,
      sorter: (a: any, b: any) =>
        a["Application Protocol"].localeCompare(b["Application Protocol"]),
    },
    {
      title: "Label",
      dataIndex: "Label",
      key: "labl",
      width: 70,
      sorter: (a: any, b: any) => a["Label"].localeCompare(b["Label"]),
    },
    {
      title: "Confidence Score",
      dataIndex: "Conference",
      key: "conference",
      width: 100,
      sorter: (a: any, b: any) => a["Conference"] - b["Conference"],
    },
  ];
  // Hàm xử lý tìm kiếm
  const [selectedValue, setSelectedValue] = useState(null); // State để lưu giá trị đã chọn từ dropdown
  const [uniqueFieldValues, setUniqueFieldValues] = useState([]); // State để lưu các giá trị không trùng lặp của trường đã chọn
  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };
  const handleFieldChange = (field: any) => {
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
  const handleValueChange = (value: any) => {
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
        const valueStr =
          typeof selectedFieldValue === "string" ||
          typeof selectedFieldValue === "number"
            ? String(selectedFieldValue)
            : "";
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
            const valueStr =
              typeof val === "string" || typeof val === "number"
                ? String(val)
                : "";
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
  const toggleViewType = () => {
    setViewType((prevType) => (prevType === "Map" ? "Table" : "Map"));
  };
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };
  const fetchData = async () => {
    setIsLoading(true);
    const res = await gettrafficById(id);
    setActiveTabKey("2");
    setTableDatam1(res["m1"]);
    // Xử lý dữ liệu mạng
    const networkData = res["m2"];
    const netgraphData = networkData?.netgraph?.map((node: any) => ({
      source: node.source,
      target: node.target,
      label: node.label,
    }));
    const nettableData = networkData?.nettable?.map((edge: any) => ({
      source: edge.source,
      target: edge.target,
      nameserver: edge.nameserver,
      label: edge.label,
      protocol_counts: edge.protocol_counts,
      payloads_with_timestamps: edge.payloads_with_timestamps,
      dest_event_counts: edge.dest_event_counts,
      source_event_counts: edge.source_event_counts,
    }));
    const netInfoData = networkData.nettable.map((Info: any) => ({
      id: Info.id,
      source: Info.source,
      target: Info.target,
      label: Info.label,
      protocol_counts: Info.protocol_counts,
      payloads_with_timestamps: Info.payloads_with_timestamps,
      dest_event_counts: Info.dest_event_counts,
      source_event_counts: Info.source_event_counts,
    }));
    const netIPData = networkData?.netip?.map((IP: any) => ({
      IP: IP.IP, // hoặc Date, tùy vào định dạng
      Count: IP.Count, // nếu có thêm id hoặc các thuộc tính khác
      ConnectedIPs: IP.ConnectedIPs,
      FirstEvent: IP.FirstEvent,
      LastEvent: IP.LastEvent,
    }));
    setNetgraph(netgraphData);
    setNettable(nettableData);
    setNetInfo(netInfoData);
    setNetIp(netIPData);

    console.log(networkData);
    console.log(netIPData);
    console.log(netIp);

    // Barchart: uv
    // Linechart: pv
    setTotalEM4(res["m4"]);
    setLineChartDatam5(res["m5"]);
    setLineChartDatam6(res["m6"]);
    setLineChartDatam7(res["m7"]);
    const parsedData = res["m8"];
    setDatam8Maxsize(parsedData.max_packet_size);
    setDatam8Minsize(parsedData.min_packet_size);
    setDatam8Meansize(parsedData.mean_packet_size);
    setDatam8SumIP(parsedData.total_unique_ips);
    setDatam8Src(parsedData.unique_source_ips);
    setDatam8Dst(parsedData.unique_destination_ips);
    // Dữ liệu biểu đồ Bar, Line, Pie
    setBarChartDatam9(res["m9"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setBarChartDatam10(res["m10"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setBarChartDatam11(res["m11"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setBarChartDatam12(res["m12"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    const parsedData13 = res["m13"];
    setDatam13Maxdur(parsedData13.max_duration);
    setDatam13Mindur(parsedData13.min_duration);
    setDatam13Meandur(parsedData13.average_duration);
    setDatam13UniPro(parsedData13.num_unique_protocol);
    setDatam13UniSrc(parsedData13.num_unique_source_ports);
    setDatam13UniDst(parsedData13.num_unique_dst_ports);
    setDatam13AppPro(parsedData13.num_unique_application_protocol);
    setPieChartData14(res["m14"]); // Giả sử dữ liệu pie chart nằm ở phần thứ 7
    setBarChartDatam15(res["m15"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setBarChartDatam16(res["m16"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setBarChartDatam17(res["m17"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setLineChartDatam18(res["m18"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setLineChartDatam19(res["m19"]); // Giả sử dữ liệu bar chart nằm ở phần thứ 5
    setDataM20(res["m20"]);
    setAnomalyTimestamps(res["m21"]);
    const Data22 = res["m22"];
    setDatam22Alert(Data22[0]);
    setDatam22IP(Data22[1]);
    setBarChartDatam23(res["m23"]);
    setBarChartDatam24(res["m24"]);
    setBarChartDatam25(res["m25"]);
    setBarChartDatam26(res["m26"]);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  //Link anomaly Traffic timestamp
  const [isTrafficModalVisible, setIsTrafficModalVisible] = useState(false); // Quản lý trạng thái modal
  const [selectedTimestamp, setSelectedTimestamp] = useState(null); // Quản lý thời gian đã chọn
  const [filteredTraffics, setFilteredTraffics] = useState([]); // Lưu trữ dữ liệu log đã lọc
  const handleDotClick = (timestamp: any) => {
    // Lọc log traffic tương ứng với thời gian
    const logsForTimestamp = tableDatam1.filter((log: any) => {
      // Kiểm tra xem timestamp của log có chứa chuỗi timestamp đã chọn không (tìm kiếm gần đúng)
      return log.Timestamp.includes(timestamp);
    });
    setSelectedTimestamp(timestamp);
    setFilteredTraffics(logsForTimestamp);
    setIsTrafficModalVisible(true); // Mở modal
  };
  //Link Log data
  const [log_type, setLogType] = useState("");
  const dnsColumns = [
    { title: "Line ID", dataIndex: "LineId", key: "lineId", width: 80 },
    {
      title: "Timestamp",
      dataIndex: "Timestamp",
      key: "timestamp",
      width: 150,
    },
    { title: "Process", dataIndex: "Process", key: "process", width: 120 },
    { title: "Content", dataIndex: "Content", key: "content", width: 200 },
    {
      title: "Event Template",
      dataIndex: "EventTemplate",
      key: "eventTemplate",
      width: 180,
    },
    { title: "Label", dataIndex: "Anomaly", key: "label", width: 100 },
  ];
  const auditColumns = [
    { title: "Line ID", dataIndex: "LineId", key: "lineId", width: 80 },
    { title: "Type", dataIndex: "Type", key: "type", width: 100 },
    {
      title: "Timestamp",
      dataIndex: "Timestamp",
      key: "timestamp",
      width: 150,
    },
    { title: "Process ID", dataIndex: "pid", key: "pid", width: 100 },
    { title: "User ID", dataIndex: "uid", key: "uid", width: 100 },
    { title: "Session ID", dataIndex: "ses", key: "ses", width: 100 },
    { title: "Message", dataIndex: "msg", key: "msg", width: 300 },
    { title: "Account", dataIndex: "acct", key: "acct", width: 150 },
    { title: "Executable", dataIndex: "exe", key: "exe", width: 200 },
    { title: "Hostname", dataIndex: "hostname", key: "hostname", width: 150 },
    { title: "IP Address", dataIndex: "addr", key: "addr", width: 150 },
    { title: "Terminal", dataIndex: "terminal", key: "terminal", width: 100 },
    { title: "Result", dataIndex: "res", key: "res", width: 100 },
    {
      title: "Event Classification",
      dataIndex: "Event_Classification",
      key: "eventClassification",
      width: 200,
    },
    { title: "Label", dataIndex: "Anomaly", key: "label", width: 100 },
  ];
  const accessColumns = [
    { title: "Line ID", dataIndex: "LineId", key: "lineId", width: 80 },
    { title: "Client IP", dataIndex: "Client_IP", key: "clientIp", width: 150 },
    {
      title: "Timestamp",
      dataIndex: "Timestamp",
      key: "timestamp",
      width: 150,
    },
    {
      title: "Status Code",
      dataIndex: "Status_Code",
      key: "statusCode",
      width: 100,
    },
    {
      title: "Response Bytes",
      dataIndex: "Response_Bytes",
      key: "responseBytes",
      width: 150,
    },
    { title: "Refer", dataIndex: "Refer", key: "refer", width: 150 },
    { title: "Method", dataIndex: "Method", key: "method", width: 100 },
    { title: "Path", dataIndex: "Path", key: "path", width: 200 },
    { title: "Version", dataIndex: "Version", key: "version", width: 100 },
    {
      title: "User Agent",
      dataIndex: "User_Agent",
      key: "userAgent",
      width: 200,
    },
    { title: "Label", dataIndex: "Anomaly", key: "label", width: 100 },
  ];
  let columnsLog:
    | typeof dnsColumns
    | typeof auditColumns
    | typeof accessColumns
    | []
    | undefined;
  if (log_type === "dns") {
    columnsLog = dnsColumns;
  } else if (log_type === "audit") {
    columnsLog = auditColumns;
  } else if (log_type === "access") {
    columnsLog = accessColumns;
  }
  interface TrafficRecord {
    Timestamp: string; // hoặc Date, tùy vào định dạng
    id: string; // nếu có thêm id hoặc các thuộc tính khác
    Payload: string;
    [key: string]: any;
  }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisiblePayload, setIsModalVisiblePayload] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [selectedTraficRecord, setSelectedTrafficRecord] =
    useState<TrafficRecord | null>(null);
  const [logFiles, setlogFiles] = useState<string[]>([]); // Trạng thái để lưu trữ các tệp đã tải lên cho Traffic
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  //LINK TRAFFIC FUNCTION
  useEffect(() => {
    getlog().then((res) => {
      // console.log(res); // Kiểm tra cấu trúc dữ liệu trả về
      setlogFiles(res);
    });
  }, []);
  type ChartData = {
    name: string;
    uv: number;
  };
  const [barChartDatam9TopX, setBarChartDatam9TopX] = useState<ChartData[]>([]);
  const [barChartDatam10TopX, setBarChartDatam10TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam11TopX, setBarChartDatam11TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam12TopX, setBarChartDatam12TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam15TopX, setBarChartDatam15TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam16TopX, setBarChartDatam16TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam17TopX, setBarChartDatam17TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam24TopX, setBarChartDatam24TopX] = useState<ChartData[]>(
    []
  );
  const [barChartDatam25TopX, setBarChartDatam25TopX] = useState<ChartData[]>(
    []
  );

  const getTopXData = (data: ChartData[], topX: number): ChartData[] => {
    if (
      !Array.isArray(data) ||
      data.length === 0 ||
      typeof topX !== "number" ||
      topX <= 0
    ) {
      return data; // Trả về dữ liệu gốc nếu không có dữ liệu hoặc topX không hợp lệ
    }
    // Sắp xếp dữ liệu theo 'uv' giảm dần và trả về top X phần tử
    return [...data].sort((a, b) => b.uv - a.uv).slice(0, topX);
  };
  const columnsdata1011 = [
    { title: "IP", dataIndex: "name", key: "name" },
    { title: "Frequency", dataIndex: "uv", key: "uv" },
  ];
  const columnsdata12 = [
    { title: "Source to Destination IP", dataIndex: "name", key: "name" },
    { title: "Count", dataIndex: "uv", key: "uv" },
  ];
  const columnsdata15 = [
    { title: "Protocol", dataIndex: "name", key: "name" },
    { title: "Count", dataIndex: "uv", key: "uv" },
  ];
  const columnsdata1617 = [
    { title: "Port", dataIndex: "name", key: "name" },
    { title: "Count", dataIndex: "uv", key: "uv" },
  ];
  type ChartBtn = {
    barChart9: number;
    barChart10: number;
    barChart11: number;
    barChart12: number;
    barChart15: number;
    barChart16: number;
    barChart17: number;
    barChart24: number;
    barChart25: number;
  };
  const [chartBtn, setChartBtn] = useState<ChartBtn>({
    barChart9: 10,
    barChart10: 0,
    barChart11: 0,
    barChart12: 0,
    barChart15: 0,
    barChart16: 0,
    barChart17: 0,
    barChart24: 0,
    barChart25: 0,
  });
  const [viewMode10, setViewMode10] = useState("table");
  const [viewMode11, setViewMode11] = useState("table");
  const [viewMode12, setViewMode12] = useState("table");
  const [viewMode15, setViewMode15] = useState("table");

  const [viewMode16, setViewMode16] = useState("table");
  const [viewMode17, setViewMode17] = useState("table");
  const handleTopXm9Change = (data: ChartData[], topX: number) => {
    setBarChartDatam9TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart9: topX });
  };
  const handleTopXm10Change = (data: ChartData[], topX: number) => {
    setBarChartDatam10TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart10: topX });

    if (topX === 0) {
      setViewMode10("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode10("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm11Change = (data: ChartData[], topX: number) => {
    setBarChartDatam11TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart11: topX });

    if (topX === 0) {
      setViewMode11("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode11("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm12Change = (data: ChartData[], topX: number) => {
    setBarChartDatam12TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart12: topX });

    if (topX === 0) {
      setViewMode12("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode12("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm15Change = (data: ChartData[], topX: number) => {
    setBarChartDatam15TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart15: topX });

    if (topX === 0) {
      setViewMode15("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode15("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm16Change = (data: ChartData[], topX: number) => {
    setBarChartDatam16TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart16: topX });

    if (topX === 0) {
      setViewMode16("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode16("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm17Change = (data: ChartData[], topX: number) => {
    setBarChartDatam17TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart17: topX });

    if (topX === 0) {
      setViewMode17("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode17("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const [viewMode24, setViewMode24] = useState("table");
  const [viewMode25, setViewMode25] = useState("table");
  const handleTopXm24Change = (data: ChartData[], topX: number) => {
    setBarChartDatam24TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart24: topX });

    if (topX === 0) {
      setViewMode24("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode24("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const handleTopXm25Change = (data: ChartData[], topX: number) => {
    setBarChartDatam25TopX(getTopXData(data, topX));
    setChartBtn({ ...chartBtn, barChart25: topX });

    if (topX === 0) {
      setViewMode25("table"); // Chuyển sang chế độ bảng khi nhấn Top 10
    } else {
      setViewMode25("chart"); // Hiển thị biểu đồ cho Top 3 và Top 5
    }
  };
  const columnsdata24 = [
    { title: "IP", dataIndex: "name", key: "name" },
    { title: "Count", dataIndex: "uv", key: "uv" },
  ];
  const showModal = (recordTraffic: any) => {
    setSelectedTrafficRecord(recordTraffic);
    setIsModalVisible(true);
    showModal1(false);
  };
  const showModal1 = async (state: any) => {
    setIsModalVisible1(state);
  };
  //show Payload

  const showModalPaylaod = (record: TrafficRecord) => {
    const payload = record.Payload; // Lấy payload từ record

    // Làm sạch dữ liệu trước khi thêm mới
    setExtractedData([]); // Đảm bảo dữ liệu cũ được xóa trước khi thêm mới
    setSearchTextHL("");
    setModalContent(payload); // Hiển thị payload đã giải mã
    setIsModalVisiblePayload(true); // Hiển thị modal
  };

  // Dùng useEffect để theo dõi khi extractedData được reset thành mảng rỗng, sau đó thực hiện các bước tiếp theo.
  useEffect(() => {
    if (extractedData.length === 0 && modalContent !== "") {
      const decodedPayload = modalContent; // Lấy payload đã được giải mã

      if (!decodedPayload) {
        return; // Nếu payload là null hoặc không tồn tại, dừng lại
      }

      // Giải mã nếu payload được mã hóa
      const isBase64 = (str: string) => {
        try {
          return btoa(atob(str)) === str; // Kiểm tra nếu chuỗi là Base64
        } catch (err) {
          return false;
        }
      };

      const decodeHex = (hex: string) => {
        const hexStr = hex.toString();
        let str = "";
        for (let i = 0; i < hexStr.length; i += 2) {
          str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
        }
        return str;
      };

      let processedPayload = decodedPayload;

      if (isBase64(decodedPayload)) {
        // Giải mã Base64 nếu payload là Base64
        processedPayload = atob(decodedPayload);
      } else if (/^[0-9a-fA-F]+$/.test(decodedPayload)) {
        // Giải mã Hex nếu payload là chuỗi Hex
        processedPayload = decodeHex(decodedPayload);
      }

      if (!processedPayload) {
        return; // Dừng lại nếu không có payload
      }

      // Biểu thức chính quy để nhận diện dữ liệu nhạy cảm giống như trong file Python

      // Regex cho email
      const emailRegex =
        /(?:\t| |^|<|,|:)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      // Regex bước đầu để nhận diện thẻ tín dụng
      const firstStepCreditCardRegex = /(?:\s|^)(?:\d[ -]*?){13,16}(?:\s|$)/g;
      // Regex bước hai để xác minh thẻ tín dụng
      const secondStepCreditCardRegex =
        /^(3[47][0-9]{13})|((?:6541|6556)[0-9]{12})|(389[0-9]{11})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|(65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(?:622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10}))|(63[7-9][0-9]{13})|((?:2131|1800|35\d{3})\d{11})|(9[0-9]{15})|((?:6304|6706|6709|6771)[0-9]{12,15})|((?:5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15})|((?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12})|((6334|6767)[0-9]{12,14,15})|((?:4903|4905|4911|4936|6333|6759)[0-9]{12,14,15}|564182[0-9]{10,12,13}|633110[0-9]{10,12,13})|(62[0-9]{14,17})|(4[0-9]{12}(?:[0-9]{3})?)|(9[0-9]{15})$/;
      // Regex cho tên người dùng
      const usernameRegex =
        /(?:(?:username|user|login|usr|name|uid|uname|u_name|user_id|user_name|account|acct|member|membername|useraccount|user_login|login_name|userID|identifier|user_key|client_id|clientid|accountname|profile_name|usercode|customer_id|subscriber|admin_user|login_id|employee_id|staff_id|emp_number|client_number|cust_number|account_number|user_token|session_user|admin_name|operator_id|contact_id|contact_name|client_code|member_id|partner_id|partner_code|agent_id|agent_code|merchant_id|merchant_code|shop_id|shop_code|user_handle|screen_name|login_user|site_user|system_user|user_alias|operator_name|account_id|user_email|email_address|user_contact|user_reference|account_reference|ref_id|user_phone|mobile_number|user_mobile|user_nickname|nickname|user_initials|initials|account_holder|account_user|service_user|access_user|resource_user|database_user|db_user|schema_user|table_user|column_user|row_user|api_user|web_user|service_account|bot_user|bot_account|process_user|task_user|container_user|vm_user|virtual_user|cloud_user|cloud_account)['"]?\s*[:=]\s*['"]?([\w.-@]+)['"]?)/gi;
      // Regex cho mật khẩu
      const passwordRegex =
        /(?:(?:password|pass|pwd|pw|passwd|pword|secret|secretword|secret_code|auth|authorization|passcode|passphrase|access_key|access_code|pin|pin_code|security_key|private_key|token|secure_pass|secure_password|api_key|keyphrase|crypt_key|encryption_key|secretkey|sec_key|credential|auth_token|security_token|otp|one_time_password|recovery_key|recovery_code|backup_code|decryption_key|session_key|login_password|admin_pass|root_pass|sudo_pass|master_key|master_password|system_password|device_key|machine_key|encryption_pass|lock_code|unlock_code|pin_number|signing_key|signature_key|crypto_key|crypto_pass|cipher_key|cipher_pass|vault_key|vault_pass|recovery_pass|backup_pass|keystore_password|keystore_pass|token_password|ssh_key|ssh_pass|ftp_pass|http_pass|https_pass|service_pass|process_pass|task_pass|container_pass|vm_pass|cloud_pass|virtual_pass|network_pass|router_pass|switch_pass|firewall_pass|db_pass|database_pass|db_password|db_key|database_key|data_pass|field_pass|row_pass|column_pass|schema_pass|table_pass)['"]?\s*[:=]\s*['"]?([\w.-@!#%^&*]+)['"]?)/gi;
      // Regex cho domain
      const domainRegex = /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      // Regex cho tài liệu dạng Excel
      const documentRegex = /\b\w+_\d{4}\.xlsx\b/g;

      // Danh sách các TLD hợp lệ
      const allowedTLDs = [
        "com",
        "net",
        "info",
        "io",
        "org",
        "gov",
        "edu",
        "vn",
        "biz",
        "mil",
        "us",
        "uk",
        "xyz",
        "tech",
        "store",
        "online",
        "site",
        "me",
        "tv",
        "ai",
        "app",
      ];

      // Hàm để đọc ngược chuỗi domain đến khi gặp dấu hiệu dừng
      const extractDomain = (text: string, tld: string) => {
        const tldIndex = text.lastIndexOf(tld); // Tìm vị trí của TLD
        if (tldIndex === -1) return null;

        let domain = tld; // Domain sẽ chứa ít nhất TLD
        // Đọc ngược về trước để tìm ranh giới domain
        for (let i = tldIndex - 1; i >= 0; i--) {
          const char = text[i];
          if (char === "." && text[i - 1] === ".") {
            // Dừng lại nếu gặp hai dấu chấm liên tiếp
            break;
          }
          if (char === "#" || char === "-") {
            // Dừng lại nếu gặp ký tự đặc biệt như # hoặc -
            break;
          }
          domain = char + domain; // Thêm ký tự vào domain
        }
        return domain;
      };

      // Tìm tất cả các domain trong payload
      let domains: string[] = [];
      allowedTLDs.forEach((tld) => {
        const domain = extractDomain(processedPayload, `.${tld}`);
        if (domain) {
          domains.push(domain);
        }
      });

      // Loại bỏ các domain trùng lặp bằng Set
      domains = [...new Set(domains)];

      // Lọc domain với các TLD hợp lệ và loại bỏ các dấu chấm liên tiếp
      domains = domains.filter((domain: string) => {
        const parts = domain.split(".");
        const tld = parts[parts.length - 1]; // Lấy phần TLD
        return (
          allowedTLDs.includes(tld) &&
          parts.every((part: string) => part.length >= 2)
        );
      });

      // Trích xuất các giá trị từ payload
      const emails = Array.from(
        new Set(processedPayload.match(emailRegex) || [])
      );
      const creditCards = Array.from(
        new Set(processedPayload.match(firstStepCreditCardRegex) || [])
      );
      const usernames = Array.from(
        new Set(processedPayload.match(usernameRegex) || [])
      );
      const passwords = Array.from(
        new Set(processedPayload.match(passwordRegex) || [])
      );
      // const domains = Array.from(new Set(processedPayload.match(domainRegex) || []));
      const documents = Array.from(
        new Set(processedPayload.match(documentRegex) || [])
      );

      const cleanedCreditCards = creditCards
        .map((card) => card.replace(/[\s-]/g, ""))
        .filter((card) => secondStepCreditCardRegex.test(card));

      // Cập nhật dữ liệu đã trích xuất vào state, giữ nguyên giá trị cũ nếu không có thay đổi
      setExtractedData((prev) => {
        let updatedData = [...prev];

        // Kiểm tra và cập nhật email
        emails.forEach((email) => {
          if (
            !updatedData.some(
              (data) => data.type === "Email" && data.value === email
            )
          ) {
            updatedData.push({ type: "Email", value: email });
          }
        });

        // Kiểm tra và cập nhật thẻ tín dụng
        cleanedCreditCards.forEach((card) => {
          if (
            !updatedData.some(
              (data) => data.type === "CreditCard" && data.value === card
            )
          ) {
            updatedData.push({ type: "CreditCard", value: card });
          }
        });

        // Kiểm tra và cập nhật tên người dùng
        usernames.forEach((username) => {
          if (
            !updatedData.some(
              (data) => data.type === "Username" && data.value === username
            )
          ) {
            updatedData.push({ type: "Username", value: username });
          }
        });

        // Kiểm tra và cập nhật mật khẩu
        passwords.forEach((password) => {
          if (
            !updatedData.some(
              (data) => data.type === "Password" && data.value === password
            )
          ) {
            updatedData.push({ type: "Password", value: password });
          }
        });

        // Kiểm tra và cập nhật domain
        domains.forEach((domain) => {
          if (
            !updatedData.some(
              (data) => data.type === "Domain" && data.value === domain
            )
          ) {
            updatedData.push({ type: "Domain", value: domain });
          }
        });

        // Kiểm tra và cập nhật document
        documents.forEach((document) => {
          if (
            !updatedData.some(
              (data) => data.type === "Document" && data.value === document
            )
          ) {
            updatedData.push({ type: "Document", value: document });
          }
        });

        return updatedData;
      });
    }
  }, [extractedData, modalContent]);

  const handleOk = () => {
    setIsModalVisiblePayload(false); // Đóng modal khi nhấn OK
    setExtractedData([]); // Reset dữ liệu trích xuất
    setModalContent(""); // Reset payload
  };
  const handleCancelPayload = () => {
    setExtractedData([]); // Reset dữ liệu trích xuất
    setModalContent(""); // Reset payload
    setIsModalVisiblePayload(false); // Đóng modal khi nhấn Cancel
  };
  const handleOnClickTraffic = async (logid: any) => {
    handleTrafficFileSelect(logid);
  };
  const convertTimestampToComparableFormat = (timestamp: string) => {
    // Thay '/' bằng '-' và khoảng trắng ' ' bằng 'T' để có định dạng chuẩn ISO
    return timestamp.replace(/\//g, "-").replace(" ", "T");
  };
  const compareTimestamps = (
    logTimestamp: string,
    trafficTimestamp: string
  ) => {
    let logDate, trafficDate;
    // Kiểm tra và chuyển đổi logTimestamp thành đối tượng Date
    if (!isNaN(Number(trafficTimestamp))) {
      trafficDate = new Date(Number(trafficTimestamp)); // Trường hợp logTimestamp là số milliseconds
    } else {
      trafficDate = new Date(
        convertTimestampToComparableFormat(trafficTimestamp)
      ); // Chuyển đổi chuỗi về định dạng chuẩn
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
    // console.log(logFile);
    try {
      const logDataSet = await getlogByID(logFile); // Lấy dữ liệu traffic theo ID
      // console.log(logDataSet);
      // console.log(selectedTraficRecord);
      setLoading(true); // Bắt đầu loading
      if (selectedTraficRecord && logDataSet) {
        // console.log(selectedTraficRecord.Timestamp);
        setLogType(logDataSet["typeLog"]);
        // Lấy dữ liệu traffic từ trafficDataSet
        let logData = logDataSet["m1"];
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
    title: "Action",
    key: "action",
    width: 120, // Tăng kích thước cột nếu cần để chứa cả 2 nút
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
  const [searchTextHL, setSearchTextHL] = useState("");
  const handleSearchHighLight = (e: any) => {
    setSearchTextHL(e.target.value);
  };

  // Hàm bôi đỏ các ký tự khớp
  const highlightText = (text: any, search: any) => {
    if (!search) {
      return text;
    }

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part: any, index: any) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span
          key={index}
          style={{ backgroundColor: "rgb(0, 98, 255)", color: "white" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  interface NetTableRecord {
    id: number;
    source: string;
    target: string;
    nameserver: string;
    label: string;
    protocol_counts: ProtocolCounts;
    payloads_with_timestamps: any;
    dest_event_counts: Record<string, number>;
    source_event_counts: Record<string, number>;
  }
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isSourceInfoVisible, setIsSourceInfoVisible] = useState(false);
  const [isDestInfoVisible, setIsDestInfoVisible] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [detailFlow, setDetailFlow] = useState<any>();

  const showSourceInfo = () => {
    setIsSourceInfoVisible(true);
  };

  const showDestInfo = () => {
    setIsDestInfoVisible(true);
  };
  const columnsWithButton = Array.isArray(columns)
    ? [...columns, actionColumn]
    : [actionColumn];

  return (
    <Spin tip="Loading..." spinning={isLoading}>
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
                  <Tabs
                    style={{ fontSize: "24px" }}
                    activeKey={activeTabKey}
                    onChange={handleTabChange}
                    centered
                  >
                    <TabPane
                      tab="Overview"
                      key="2"
                      style={{ fontSize: "24px" }}
                    />
                    <TabPane
                      tab="Network"
                      key="1"
                      style={{ fontSize: "24px" }}
                    />
                    <TabPane
                      tab="Artifacts"
                      key="3"
                      style={{ fontSize: "24px" }}
                    />
                    <TabPane
                      tab="Communications"
                      key="4"
                      style={{ fontSize: "24px" }}
                    />
                  </Tabs>
                </Col>
              )}
            </Row>
            {viewType === "Map" && (
              <div>
                {activeTabKey === "1" && (
                  <div>
                    <Row>
                      <Col span={16}>
                        <div>
                          <h1>Network Graph</h1>
                          {/* <NetGraph data={netgraph} /> */}
                          <NetGraph data={netgraph} netip={netIp} />
                        </div>
                      </Col>
                      <Col span={8}>
                        <div>
                          <h1>Network Table</h1>
                          <Table
                            dataSource={nettable}
                            columns={nettablecolumns}
                            scroll={{ y: 300, x: 300 }}
                            pagination={false}
                            onRow={(record) => ({
                              onClick: () => {
                                console.log("dcm", record);
                                setDetail(record);
                                setIsDetailVisible(true);
                              }, // Xử lý sự kiện click vào hàng
                            })}
                            style={{
                              width: "100%",
                              height: "400px",
                              marginLeft: "10px",
                            }}
                            rowClassName={(record: any) =>
                              record.label === "Anomaly" ? "anomaly-row" : ""
                            }
                            className="custom-table"
                          />
                          {/* Modal Chi tiết */}
                          <Modal
                            title="Thông tin chi tiết"
                            visible={isDetailVisible}
                            onCancel={() => setIsDetailVisible(false)}
                            footer={null}
                            width={800}
                          >
                            {" "}
                            <h2>
                              IP Nguồn: {detail?.source} ----- IP Đích:{" "}
                              {detail?.target}
                            </h2>
                            <div>
                              <p>
                                Sự Kiện HTTPS bất thường:{" "}
                                {detail?.protocol_counts?.HTTPS || 0}
                              </p>
                              <p>
                                Sự Kiện HTTP bất thường:{" "}
                                {detail?.protocol_counts?.HTTP || 0}
                              </p>
                              <p>
                                Sự Kiện SSH bất thường:{" "}
                                {detail?.protocol_counts?.SSH || 0}
                              </p>
                              <p>
                                Sự Kiện DNS bất thường:{" "}
                                {detail?.protocol_counts?.DNS || 0}
                              </p>
                              <h3>Payloads:</h3>
                              <Table
                                dataSource={detail?.payloads_with_timestamps?.map(
                                  (payload: any, index: number) => ({
                                    details: payload["content"], // Nội dung payload
                                    timestamp: payload["timestamp"], // Thời gian payload
                                  })
                                )}
                                columns={[
                                  // { title: 'Loại Payload', dataIndex: 'type', key: 'type' },
                                  {
                                    title: "Chi tiết Payload",
                                    dataIndex: "details",
                                    key: "details",
                                    width: 120,
                                  },
                                  {
                                    title: "Thời gian",
                                    dataIndex: "timestamp",
                                    key: "timestamp",
                                    width: 60,
                                  },
                                ]}
                                scroll={{ x: 300, y: 300 }}
                                pagination={false}
                              />
                            </div>
                            <div>
                              <Button onClick={showSourceInfo}>
                                Tìm kiếm các thông tin liên quan đến source
                              </Button>
                              <Button
                                onClick={showDestInfo}
                                style={{ marginLeft: "30px" }}
                              >
                                Tìm kiếm các thông tin liên quan đến dest
                              </Button>
                            </div>
                          </Modal>

                          {/* Modal Thông tin IP Nguồn */}
                          <Modal
                            title="Thông tin IP Nguồn"
                            visible={isSourceInfoVisible}
                            onCancel={() => setIsSourceInfoVisible(false)}
                            footer={null}
                          >
                            <p>Thống kê bất thường liên quan đến các IP khác</p>
                            <Table
                              dataSource={detail?.dest_event_counts?.map(
                                (event: any, index: number) => ({
                                  ip: event["IP"], // Nội dung payload
                                  count: event["Count"], // Thời gian payload
                                })
                              )}
                              columns={[
                                {
                                  title: "Địa chỉ IP",
                                  dataIndex: "ip",
                                  key: "ip",
                                },
                                {
                                  title: "Số Lượng Yêu cầu Bất thường",
                                  dataIndex: "count",
                                  key: "count",
                                },
                              ]}
                              pagination={false}
                            />
                          </Modal>

                          {/* Modal Thông tin IP Đích */}
                          <Modal
                            title="Thông tin IP Đích"
                            visible={isDestInfoVisible}
                            onCancel={() => setIsDestInfoVisible(false)}
                            footer={null}
                          >
                            <p>Thống kê bất thường liên quan đến các IP khác</p>
                            <Table
                              dataSource={detail?.source_event_counts?.map(
                                (event: any, index: number) => ({
                                  ip: event["IP"], // Nội dung payload
                                  count: event["Count"], // Thời gian payload
                                })
                              )}
                              columns={[
                                {
                                  title: "Địa chỉ IP",
                                  dataIndex: "ip",
                                  key: "ip",
                                },
                                {
                                  title: "Số Lượng Yêu cầu Bất thường",
                                  dataIndex: "count",
                                  key: "count",
                                },
                              ]}
                              pagination={false}
                            />
                          </Modal>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div>
                          <h1>IP Address Map</h1>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        {" "}
                        <div
                          style={{
                            width: "100%",
                            height: "600px",
                            marginTop: "20px",
                          }}
                        >
                          <MapComponent data={dataM20} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
                {activeTabKey === "2" && (
                  <div>
                    <Row
                      gutter={[24, 24]}
                      className="event-summary"
                      style={{ marginBottom: "20px" }}
                    >
                      <Col span={8}>
                        <Card
                          style={{
                            background: "#1c1c1e",
                            color: "#fff",
                            fontSize: "20px",
                          }}
                        >
                          <h3 style={{ fontSize: "30px", marginTop: "-5px" }}>
                            Total Event
                          </h3>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "-5px",
                              marginBottom: "-5px",
                            }}
                          >
                            {totalE} events
                          </p>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          style={{
                            background: "#1c1c1e",
                            color: "#fff",
                            fontSize: "20px",
                          }}
                        >
                          <h3 style={{ fontSize: "30px", marginTop: "-5px" }}>
                            Total Event Alert
                          </h3>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "-5px",
                              marginBottom: "-5px",
                            }}
                          >
                            {Data22SumAlert} events
                          </p>
                        </Card>
                      </Col>
                      <Col span={7}>
                        <Card
                          style={{
                            background: "#1c1c1e",
                            color: "#fff",
                            fontSize: "20px",
                          }}
                        >
                          <h3 style={{ fontSize: "30px", marginTop: "-5px" }}>
                            Total IP Alert
                          </h3>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "-5px",
                              marginBottom: "-5px",
                            }}
                          >
                            {Data22SumIP} IPs{" "}
                          </p>
                          {/* <p>
                          <Tooltip title="Total Event" placement="right" style={{fontSize:"20px"}}>
                            <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        </p> */}
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={23}>
                        <h2>Event Count Over Time</h2>
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
                                return anomalyTimestamps?.includes(
                                  dataPoint.payload.name
                                ) ? (
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="red"
                                    onClick={() =>
                                      handleDotClick(dataPoint.payload.name)
                                    } // Thêm sự kiện onClick
                                    style={{ cursor: "pointer" }}
                                  />
                                ) : (
                                  <circle
                                    onClick={() =>
                                      handleDotClick(dataPoint.payload.name)
                                    }
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="#8884d8"
                                  />
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
                        dataSource={filteredTraffics.map((item: any) => ({
                          ...item,
                          rowClassName:
                            item.labl === "Anomaly"
                              ? "anomaly-row"
                              : item.conference === 0.5
                              ? "yellow-row"
                              : "",
                        }))}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                          pageSize: 10,
                          showSizeChanger: false,
                          position: ["bottomRight"],
                          prevIcon: <Button>«</Button>,
                          nextIcon: <Button>»</Button>,
                        }}
                        scroll={{ x: 1000, y: 500 }}
                        components={{
                          header: {
                            cell: ResizableTitle,
                          },
                        }}
                        rowClassName={(record) =>
                          record.Label === "Anomaly"
                            ? "anomaly-row"
                            : record.Conference === 0.5
                            ? "yellow-row"
                            : ""
                        }
                        className="custom-table"
                      />
                    </Modal>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={12}>
                        <h2>Alert Count</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={barChartDatam23}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis>
                              <Label
                                value="Count"
                                angle={-90}
                                position="insideLeft"
                              />
                            </YAxis>
                            <RechartsTooltip />
                            <Legend formatter={() => ""} />
                            <Bar
                              dataKey="uv"
                              fill="#8884d8"
                              label={{ position: "top" }}
                            >
                              {barChartDatam23?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % 20]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={12}>
                        <h2>Top Alert Protocols</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart layout="vertical" data={barChartDatam26}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" /> {/* XAxis trở thành số */}
                            <YAxis type="category" dataKey="name" width={150}>
                              {" "}
                              {/* YAxis là danh mục */}
                            </YAxis>
                            <RechartsTooltip />
                            <Legend formatter={() => "Totlen Pkts"} />
                            <Bar
                              dataKey="uv"
                              fill="#8884d8"
                              label={{ position: "right" }}
                            >
                              {barChartDatam9?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % 20]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={12}>
                        <h2>Top Alert Public Hosts</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart24 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm24Change(barChartDatam24, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart24 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm24Change(barChartDatam24, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart24 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm24Change(barChartDatam24, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode24 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              layout="vertical"
                              data={
                                barChartDatam24TopX.length > 0
                                  ? barChartDatam24TopX
                                  : barChartDatam24
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" /> {/* XAxis trở thành số */}
                              <YAxis type="category" dataKey="name" width={150}>
                                {" "}
                                {/* YAxis là danh mục */}
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => ""} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "right" }}
                              >
                                {barChartDatam24?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartDatam24}
                            columns={columnsdata24}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                      <Col span={12}>
                        <h2>Top Alert Private Hosts</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart25 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm25Change(barChartDatam25, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart25 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm25Change(barChartDatam25, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart25 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm25Change(barChartDatam25, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode25 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              layout="vertical"
                              data={
                                barChartDatam25TopX.length > 0
                                  ? barChartDatam25TopX
                                  : barChartDatam25
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" /> {/* XAxis trở thành số */}
                              <YAxis type="category" dataKey="name" width={150}>
                                {" "}
                                {/* YAxis là danh mục */}
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => ""} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "right" }}
                              >
                                {barChartDatam25?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartDatam25}
                            columns={columnsdata24}
                            scroll={{ y: 300 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                    </Row>

                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={12}>
                        <h2>Total Packet Length Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={lineChartDatam6}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="pv"
                              stroke="#82ca9d"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={11}>
                        <h2>Durations Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={lineChartDatam7}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="pv"
                              stroke="#FF8042"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                  </div>
                )}
                {activeTabKey === "3" && (
                  <div>
                    <Row
                      gutter={[24, 24]}
                      className="event-summary"
                      style={{ marginBottom: "20px" }}
                    >
                      <Col span={12}>
                        <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Max packet size" placement="right">
                              Maximum packet size: {Datam8Max} Bytes{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Min packet size" placement="right">
                              Minimum packet size: {Datam8Min} Bytes{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Mean of size" placement="right">
                              Average packet size: {Datam8Mean} Bytes{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Source IP number" placement="right">
                              Source IP number: {Datam8Src} IP{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip
                              title="Destination IP number"
                              placement="right"
                            >
                              Destination IP number: {Datam8Dst} IP{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="IP number" placement="right">
                              IP number: {Datam8SumIP}{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[20, 20]} className="chart-row">
                      <Col span={12}>
                        <h2>Distribution of packet size</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart9 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm9Change(barChartDatam9, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart9 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm9Change(barChartDatam9, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart9 === 10 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm9Change(barChartDatam9, 10)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 10
                          </Button>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={
                              barChartDatam9TopX.length > 0
                                ? barChartDatam9TopX
                                : barChartDatam9
                            }
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis>
                              <Label
                                value="Frequency"
                                angle={-90}
                                position="insideLeft"
                              />
                            </YAxis>
                            <RechartsTooltip />
                            <Legend formatter={() => "Totlen Pkts"} />
                            <Bar
                              dataKey="uv"
                              fill="#8884d8"
                              label={{ position: "top" }}
                            >
                              {barChartDatam9?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % 20]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={12}>
                        <h2>Distribution of Top Source IP</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart10 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm10Change(barChartDatam10, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart10 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm10Change(barChartDatam10, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart10 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm10Change(barChartDatam10, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode10 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam10TopX.length > 0
                                  ? barChartDatam10TopX
                                  : barChartDatam10
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Frequency"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => "Source IP"} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartDatam10?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartDatam10}
                            columns={columnsdata1011}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row gutter={[20, 20]} className="chart-row">
                      <Col span={12}>
                        <h2>Distribution of Top Destination IP</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart11 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm11Change(barChartData11, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart11 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm11Change(barChartData11, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart11 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm11Change(barChartData11, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode11 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam11TopX.length > 0
                                  ? barChartDatam11TopX
                                  : barChartData11
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Frequency"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => "Destination IP"} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartData11?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartData11}
                            columns={columnsdata1011}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                      <Col span={12}>
                        <h2>Top IP pairs by traffic volume (len)</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart12 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm12Change(barChartData12, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart12 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm12Change(barChartData12, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart12 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm12Change(barChartData12, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode12 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam12TopX.length > 0
                                  ? barChartDatam12TopX
                                  : barChartData12
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Totlen Pkts"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend
                                formatter={() => "Source and Destination IP"}
                              />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartData12?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartData12}
                            columns={columnsdata12}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
                {activeTabKey === "4" && (
                  <div>
                    <Row
                      gutter={[24, 24]}
                      className="event-summary"
                      style={{ marginBottom: "20px" }}
                    >
                      <Col span={12}>
                        <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Range of size" placement="right">
                              Number Src Port: {Datam813UniSrc} Ports{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Source IP number" placement="right">
                              Number Dst Port: {Datam813UniDst} Ports{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip
                              title="Destination IP number"
                              placement="right"
                            >
                              Number of Protocol: {Datam813UniPro}{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="IP number" placement="right">
                              Number of App Protocol: {Datam813AppPro}{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card style={{ background: "#1c1c1e", color: "#fff" }}>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Range of size" placement="right">
                              Max Duration: {Data13Max}s{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip title="Source IP number" placement="right">
                              Min Duration: {Datam13Min}s{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            <Tooltip
                              title="Destination IP number"
                              placement="right"
                            >
                              Mean Duration: {Datam13Mean}s{" "}
                              <i className="fas fa-info-circle"></i>
                            </Tooltip>
                          </p>
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={12}>
                        <h2>Protocol Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieChartData14}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {pieChartData14.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={12}>
                        <h2>Top Application Protocol</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart15 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm15Change(barChartData15, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart15 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm15Change(barChartData15, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart15 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm15Change(barChartData15, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode15 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam15TopX.length > 0
                                  ? barChartDatam15TopX
                                  : barChartData15
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Frequency"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend
                                formatter={() => "Application Protocol"}
                              />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartData15?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartData15}
                            columns={columnsdata15}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row gutter={[20, 20]} className="chart-row">
                      <Col span={12}>
                        <h2>Top Source Port Distribution</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart16 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm16Change(barChartData16, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart16 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm16Change(barChartData16, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart16 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm16Change(barChartData16, 10)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 10
                          </Button>
                        </div>
                        {viewMode16 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam16TopX.length > 0
                                  ? barChartDatam16TopX
                                  : barChartData16
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Frequency"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => "Source Port"} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartData16?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartData16}
                            columns={columnsdata1617}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                      <Col span={12}>
                        <h2>Top Destination Port Distribution</h2>
                        <div style={{ marginBottom: "10px" }}>
                          <Button
                            type={
                              chartBtn.barChart17 === 3 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm17Change(barChartData17, 3)
                            }
                          >
                            Top 3
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart17 === 5 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm17Change(barChartData17, 5)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            Top 5
                          </Button>
                          <Button
                            type={
                              chartBtn.barChart17 === 0 ? "primary" : "default"
                            }
                            onClick={() =>
                              handleTopXm17Change(barChartData17, 0)
                            }
                            style={{ marginLeft: 8 }}
                          >
                            All
                          </Button>
                        </div>
                        {viewMode17 === "chart" ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={
                                barChartDatam17TopX.length > 0
                                  ? barChartDatam17TopX
                                  : barChartData17
                              }
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis>
                                <Label
                                  value="Frequency"
                                  angle={-90}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <RechartsTooltip />
                              <Legend formatter={() => "Destination Port"} />
                              <Bar
                                dataKey="uv"
                                fill="#8884d8"
                                label={{ position: "top" }}
                              >
                                {barChartData17?.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Table
                            dataSource={barChartData17}
                            columns={columnsdata1617}
                            scroll={{ y: 200 }}
                            pagination={false}
                            style={{ width: "100%", height: "300px" }}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={23}>
                        <h2>Total Bytes Sent from Source to Destination</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={lineChartData18}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="pv"
                              stroke="#82ca9d"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="chart-row">
                      <Col span={23}>
                        <h2>Total Bytes Sent from Destination to Source</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={lineChartData19}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="pv"
                              stroke="#FF8042"
                            />
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
                <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
                  <Col span={14}>
                    <Input
                      placeholder="Search..."
                      value={searchText}
                      onChange={handleSearch}
                      prefix={<SearchOutlined />}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col span={10} style={{ textAlign: "right" }}>
                    <Select
                      suffixIcon={<FilterOutlined />}
                      style={{ width: "30%", marginRight: "8px" }}
                      placeholder="Select a field"
                      onChange={handleFieldChange}
                      allowClear
                    >
                      <Select.Option value="">All Fields</Select.Option>
                      {columns.map((col) => (
                        <Select.Option
                          key={col.dataIndex}
                          value={col.dataIndex}
                        >
                          {col.title}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* select giá trị của trường */}
                    <Select
                      style={{ width: "30%", marginRight: "8px" }}
                      placeholder="Select a value"
                      value={selectedValue}
                      onChange={handleValueChange}
                      allowClear
                      disabled={!selectedField}
                    >
                      <Select.Option value="">-- No Filter --</Select.Option>{" "}
                      {/* Giá trị rỗng để cho phép tìm kiếm */}
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
                <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
                  <Table
                    bordered
                    dataSource={filteredData.map((item: any) => ({
                      ...item,
                      rowClassName:
                        item.labl === "Anomaly"
                          ? "anomaly-row"
                          : item.conference === 0.5
                          ? "yellow-row"
                          : item.conference === 0.5
                          ? "yellow-row"
                          : "",
                    }))}
                    columns={columnsWithButton}
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: false,
                      position: ["bottomRight"],
                      prevIcon: <Button>«</Button>,
                      nextIcon: <Button>»</Button>,
                    }}
                    onRow={(record) => ({
                      onClick: () => {
                        console.log("dcm", record);
                        setDetailFlow(record);
                      }, // Xử lý sự kiện click vào hàng
                    })}
                    scroll={{ x: "auto", y: 300 }}
                    components={{
                      header: {
                        cell: ResizableTitle,
                      },
                    }}
                    rowClassName={(record) => {
                      return record.Conference >= 0.75
                        ? "anomaly-row"
                        : record.Conference > 0.5
                        ? "orange-row"
                        : record.Conference === 0.5
                        ? "yellow-row"
                        : "";
                    }}
                    className="custom-table"
                  />
                </Row>
                <Divider
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0 10px",
                    // opacity: 0.1,
                    borderWidth: '2px'
                  }}
                />
                <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
                  <Col span={8}>
                    <div style={{ borderRight: "1px solid black", opacity: 0.5 }}>
                      <h3>Flow ID: {detailFlow?.["Flow ID"] || " "}</h3>
                      <h3>Timestamp: {detailFlow?.["Timestamp"]}</h3>
                      <h3>Source IP: {detailFlow?.["Source IP"]}</h3>
                      <h3>Destination IP: {detailFlow?.["Destination IP"]}</h3>
                      <h3>Source Port: {detailFlow?.["Source Port"]}</h3>
                      <h3>
                        Destination Port: {detailFlow?.["Destination Port"]}
                      </h3>
                      <h3>Protocol: {detailFlow?.["Protocol"]}</h3>
                      <h3>
                        Application Protocol:{" "}
                        {detailFlow?.["Application Protocol"]}
                      </h3>
                      <h3>Time Delta: {detailFlow?.["Time_Delta"]}</h3>
                      <h3>Totlen Pkts: {detailFlow?.["Totlen Pkts"]}</h3>
                      <h3>Tot Fwd Pkts: {detailFlow?.["Tot Fwd Pkts"]}</h3>
                      <h3>Tot Bwd Pkts: {detailFlow?.["Tot Bwd Pkts"]}</h3>
                      <h3>
                        TotLen Fwd Pkts: {detailFlow?.["TotLen Fwd Pkts"]}
                      </h3>
                      <h3>
                        TotLen Bwd Pkts: {detailFlow?.["TotLen Bwd Pkts"]}
                      </h3>
                      <h3>Tot Pkts: {detailFlow?.["Tot Pkts"]}</h3>
                    </div>
                  </Col>
                  <Col
                    span={10}
                    style={{ maxWidth: '500px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                  >
                    <h3>Payload: {detailFlow?.Payload}</h3>
                  </Col>
                </Row>
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Button
                        onClick={() => handleOnClickTraffic(item.id)}
                        style={{
                          marginLeft: 5,
                          color: "rgb(91, 107, 121)",
                          backgroundColor: "rgb(178, 223, 219)",
                        }}
                      >
                        {item.filename}
                      </Button>
                    </div>
                  </Menu.Item>
                ))}
              </Menu>
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
                {log_type === "dns"
                  ? "DNS Log"
                  : log_type === "audit"
                  ? "Audit Log"
                  : log_type === "access"
                  ? "Access Log"
                  : "Select Log Type"}{" "}
                Table
              </h2>
              {/* Hiển thị bảng traffic trong modal */}
              <Table
                dataSource={logData.map((item: any) => ({
                  ...item,
                  rowClassName: item.label === "Anomaly" ? "anomaly-row" : "",
                }))}
                columns={columnsLog}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  position: ["bottomRight"],
                  prevIcon: <Button>«</Button>,
                  nextIcon: <Button>»</Button>,
                }}
                scroll={{ x: 1000 }}
                loading={loading} // Hiển thị loading khi đang chờ dữ liệu
                rowKey="id" // Đặt rowKey nếu dữ liệu có ID
                rowClassName={(record) =>
                  record.Anomaly === "Anomaly" ? "anomaly-row" : ""
                }
              />
            </Modal>
            {/* Modal sẽ hiển thị khi nhấn vào nút 'Payload' */}
            <Modal
              title="Payload Data"
              visible={isModalVisiblePayload}
              onOk={handleOk}
              onCancel={handleCancelPayload}
              width={1500}
            >
              <Input
                placeholder="Tìm kiếm ký tự trong Payload"
                value={searchTextHL}
                onChange={handleSearchHighLight}
                style={{ marginBottom: "10px" }}
              />
              {/* Hiển thị payload với ký tự được bôi đỏ */}
              <div>{highlightText(modalContent, searchTextHL)}</div>
              <p>{modalContent}</p>{" "}
              {/* Hiển thị dữ liệu payload gốc trong modal */}
              <h3>Trích xuất thông tin nhạy cảm</h3>
              <Table
                dataSource={extractedData}
                columns={[
                  { title: "Loại Dữ Liệu", dataIndex: "type", key: "type" },
                  { title: "Giá Trị", dataIndex: "value", key: "value" },
                ]}
                pagination={false}
                rowKey="value"
              />
            </Modal>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default Dashboard;
