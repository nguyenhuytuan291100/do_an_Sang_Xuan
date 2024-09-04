import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Row, Tabs, Card, Tooltip,Table, Input, Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Network, DataSet, Node, Edge } from "vis-network/standalone/esm/vis-network";
import './styles.scss'; // Import file SCSS
import { useParams } from "react-router-dom";
import { gettrafficById } from "services/apiService";
import MapComponent from "pages/App/subcomponents/MainLayout/subcomponents/MapComponent";
import ResizableTitle from "pages/App/subcomponents/MainLayout/subcomponents/ResiableTitle";
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';




// dataip M20
const dataipmap = [
  { sourceIP: '1.1.1.1', destinationIP: '8.8.8.8' },
  { sourceIP: '9.9.9.9', destinationIP: '8.6.0.1' },
  // Thêm các cặp IP khác
];




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
  const [dataM20, setDataM20] = useState<any>('');
  const [htmlContentM20, setHtmlContentM20] = useState("");
  const [barChartData, setBarChartDatam] = useState([]);
  // const [barChartData, setBarChartDatam11] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [totalE, setTotalEM4] = useState([]);

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
  const handleSearch = (e:any) => {
    setSearchText(e.target.value);
  };

  const handleFieldChange = (value:any) => {
    setSelectedField(value);
  };

  const filteredData = tableDatam1.filter((item) => {
    if (!selectedField || selectedField === "All Fields") {
      return Object.values(item).some((val) => {
        if (val !== undefined && val !== null) {
          // Chỉ chuyển đổi nếu val là chuỗi hoặc số
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

      // let formattedHtmlContent = res['m20'].replace(/\\n/g, "<br>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
// setHtmlContentM20(formattedHtmlContent);

      setDataM20(res['m20']);
      const rawHtmlContent = res['m20']; // Đây là dữ liệu HTML bạn đã cung cấp
      const formattedHtmlContent = rawHtmlContent
          .replace(/\\n/g, "")
          .replace(/\\t/g, "")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'");
      setHtmlContentM20(formattedHtmlContent);
        



      setLineChartData(res[9]); // Giả sử dữ liệu line chart nằm ở phần thứ 6
      console.log(res['m14'])
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
                  {/* <Row gutter={[24, 24]} className="chart-row">
                    <Col span={12}>
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
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
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
                  </Row> */}
                  {/* Thêm dữ liệu từ res[20] vào đây */}
                  <Row>
                    <Col span={24}>
                      {/* <Card style={{ background: "#1c1c1e", color: "#fff" }}> */}
                        {/* <h3>Dữ liệu từ res[20]</h3> */}
                        {/* <p>{dataM20 && JSON.stringify(dataM20)}</p> */}
                        <div>
                        <div dangerouslySetInnerHTML={{ __html: htmlContentM20 }} />
                        <div dangerouslySetInnerHTML={{ __html: dataM20 }} />
                        </div>
                        
                      {/* </Card> */}
                    </Col>
                  </Row>
                  <Row >
                    <Col span={24}><div style={{ width: '100%', height: '600px', marginTop: '20px' }}>
                    <h1>Network Map</h1>
                    <MapComponent data={dataipmap} />
                  </div></Col>
                  
                  </Row>
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
                      <h4>tab2/m1: Event for Time</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartDatam5}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]} className="chart-row">
                    <Col span={23}>
                      <h4>tab2/m2.1: Bytes for Time</h4>
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
                      <h4>tab2/m2.2: Durations for Time</h4>
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
                      <h4>tab2/m2.1</h4>
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
                      <h4>tab2/m2.2</h4>
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
                columns={mergedColumns as any}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
