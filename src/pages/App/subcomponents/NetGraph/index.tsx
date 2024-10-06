// import React, { useEffect, useRef } from 'react';
// import cytoscape from 'cytoscape';
// import './styles.scss'; // Import file CSS

// interface GraphData {
//   source: string;
//   target: string;
//   label: string;
// }

// interface NetGraphProps {
//   data: GraphData[];
// }

// interface Element {
//   data: {
//     id: string;
//     label?: string;
//     source?: string;
//     target?: string;
//   };
//   classes?: string;
// }

// const NetGraph: React.FC<NetGraphProps> = ({ data }) => {
//   const cyRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const elements: Element[] = [];

//     // Tạo các node và edges từ dữ liệu
//     data.forEach(item => {
//       // Kiểm tra nếu source node chưa tồn tại
//       if (!elements.find(el => el.data.id === item.source)) {
//         elements.push({
//           data: { id: item.source, label: item.source }
//         });
//       }

//       // Kiểm tra nếu target node chưa tồn tại
//       if (!elements.find(el => el.data.id === item.target)) {
//         elements.push({
//           data: { id: item.target, label: item.target }
//         });
//       }

//       // Thêm cạnh (edge) giữa source và target, với class dựa trên label
//       elements.push({
//         data: {
//           id: `${item.source}-${item.target}`,
//           source: item.source,
//           target: item.target,
//           label: item.label
//         },
//         classes: item.label === 'Anomaly' ? 'anomaly' : 'normal'
//       });
//     });

//     // Khởi tạo Cytoscape
//     const cy = cytoscape({
//       container: cyRef.current, // Tham chiếu đến DOM
//       elements: elements, // Các node và edges từ data

//       style: [
//         {
//           selector: 'node',
//           style: {
//             'background-color': '#007bff', // Màu nền xanh dương đậm
//             'label': 'data(label)',
//             'text-valign': 'bottom', // Căn chữ ở dưới node
//             'color': '#000', // Màu chữ đen
//             'font-size': '12px', // Kích thước chữ
//             'width': '40px', // Độ rộng node
//             'height': '40px', // Chiều cao node
//             'border-width': 1, // Độ dày viền mặc định
//             'border-color': '#000000', // Màu viền đen mặc định
//             'text-margin-y': 2 // Đặt chữ bên dưới node
//           }
//         },
//         {
//           selector: 'node.hover', // Style khi node được hover (di chuột vào)
//           style: {
//             'border-color': '#00ff00', // Đổi viền thành xanh lá khi hover
//             'border-width': 6
//           }
//         },
//         {
//           selector: '.highlighted', // Style cho các cạnh được làm nổi bật
//           style: {
//             'line-color': '#ffcc00', // Màu vàng nổi bật cho các cạnh liên quan
//             'target-arrow-color': '#ffcc00', // Đổi màu mũi tên khi cạnh được highlight
//             'width': 3 // Tăng độ dày cạnh để dễ nhìn hơn
//           }
//         },
// {
//           selector: 'edge',
//           style: {
//             'width': 1,
//             'line-color': '#ADD8E6', // Màu xanh dương nhạt cho cạnh
//             'target-arrow-shape': 'triangle',
//             'target-arrow-color': '#ADD8E6', // Màu mũi tên cùng màu cạnh
//             'curve-style': 'bezier', // Sử dụng đường cong bezier để tránh trùng cạnh
//             'control-point-distance': 30, // Khoảng cách đường cong so với đường thẳng giữa các nút
//             'control-point-weight': 0.8, // Điều chỉnh độ cong của đường
//             'edge-distances': 'node-position' // Điều chỉnh điểm điều khiển dựa trên vị trí nút
//           }
//         },
//         {
//           selector: '.anomaly',
//           style: {
//             'line-color': '#ff0000', // Màu đỏ cho cạnh anomaly
//             'target-arrow-color': '#ff0000',
//             'target-arrow-shape': 'triangle',
//             'arrow-scale': 1, // Điều chỉnh kích thước của mũi tên chỉ hướng
//             'curve-style': 'bezier', // Cạnh anomaly cũng sử dụng đường cong bezier
//             'control-point-distance': 30, // Tăng khoảng cách của đường cong cho cạnh anomaly
//             'control-point-weight': 0.7, // Tăng trọng số để đường cong rõ hơn
//             'line-style': 'dashed', 
//             'width': 1.5 // Kiểu đường gạch để phân biệt cạnh anomaly
//           }
//         }
//       ],

//       layout: {
//         name: 'grid',  // Sử dụng layout "grid" để xếp các node thành dạng lưới
//         spacingFactor: 1.5,  // Tăng khoảng cách giữa các node
//         padding: 40,  // Tăng khoảng trống xung quanh
//         avoidOverlap: true  // Tránh chồng lấp các node
//       }
//     });

//     // Lắng nghe sự kiện hover để thay đổi border khi di chuột vào node
//     cy.on('mouseover', 'node', function (e) {
//       const node = e.target;
//       node.addClass('hover'); // Thêm class hover khi di chuột vào  
//     });
//     // Lắng nghe sự kiện mouseout để trở lại viền đen khi chuột rời khỏi node
//     cy.on('mouseout', 'node', function (e) {
//       const node = e.target;
//       node.removeClass('hover'); // Xóa class hover khi chuột rời node
//     });
//     // Lắng nghe sự kiện click trên node
//     cy.on('tap', 'node', function (e) {
//       const node = e.target;
//       // Loại bỏ class highlighted khỏi tất cả các cạnh
//       cy.elements('edge').removeClass('highlighted');
//       // Lấy các cạnh liên quan đến node được nhấp vào
//       const connectedEdges = node.connectedEdges();
//       // Thêm class highlighted cho các cạnh liên quan đến node được chọn
//       connectedEdges.forEach((edge: cytoscape.EdgeSingular) => {
//         edge.addClass('highlighted');
//       });
//     });

//     return () => {
//       cy.destroy(); // Hủy cytoscape khi component bị unmount
//     };
//   }, [data]);

//   return (
// <div>
//       <div id="cy" ref={cyRef} />
//     </div>
//   );
// };

// export default NetGraph;






import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Modal, Button } from 'antd'; // Import Modal và Button từ Ant Design
// import 'antd/dist/antd.css'; // Import CSS của Ant Design

// Định nghĩa cấu trúc của dữ liệu đồ thị (graph data)
interface GraphData {
  source: string;
  target: string;
  label: string;
}

// Định nghĩa cấu trúc của NetIPData
interface NetIPData {
  IP: any; // Địa chỉ IP của node
  Count: number; // Số lượng sự kiện liên quan đến node
  ConnectedIPs: any; // Các IP mà node này có kết nối tới
  FirstEvent: string; // Thời gian sự kiện đầu tiên
  LastEvent: string; // Thời gian sự kiện cuối cùng
}

// Thêm `netip` vào `NetGraphProps`
interface NetGraphProps {
  data: GraphData[]; // Dữ liệu cho các cạnh trong đồ thị
  netip: NetIPData[]; // Dữ liệu NetIP liên quan đến các node
}

interface Element {
  data: {
    id: string;
    label?: string;
    source?: string;
    target?: string;
  };
  classes?: string;
}

const NetGraph: React.FC<NetGraphProps> = ({ data, netip }) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State để quản lý hiển thị Modal
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{
    id: string;
    label: any;
    count?: number; // Số lượng sự kiện liên quan đến node
    connectedIPs?: string[]; // Các IP mà node này có kết nối tới
    firstEvent?: string; // Thời gian sự kiện đầu tiên
    lastEvent?: string; // Thời gian sự kiện cuối cùng
  } | null>(null); // State để lưu thông tin node được chọn

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const elements: Element[] = [];
    // Tạo các node và edges từ dữ liệu
    data.forEach(item => {
      // Kiểm tra nếu source node chưa tồn tại
      if (!elements.find(el => el.data.id === item.source)) {
        elements.push({
          data: { id: item.source, label: item.source }
        });
      }

      // Kiểm tra nếu target node chưa tồn tại
      if (!elements.find(el => el.data.id === item.target)) {
        elements.push({
          data: { id: item.target, label: item.target }
        });
      }

      // Thêm cạnh (edge) giữa source và target, với class dựa trên label
      elements.push({
        data: {
          id: `${item.source}-${item.target}`,
          source: item.source,
          target: item.target,
          label: item.label
        },
        classes: item.label === 'Anomaly' ? 'anomaly' : 'normal'
      });
    });

    // Khởi tạo Cytoscape
    const cy = cytoscape({
      container: cyRef.current, // Tham chiếu đến DOM
      elements: elements, // Các node và edges từ data

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#007bff',
            'label': 'data(label)',
            'text-valign': 'bottom',
            'color': '#000',
            'font-size': '12px',
            'width': '40px',
            'height': '40px',
            'border-width': 1,
            'border-color': '#000000',
            'text-margin-y': 2
          }
        },
        {
          selector: 'node.hover',
          style: {
            'border-color': '#00ff00',
            'border-width': 6
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ADD8E6',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#ADD8E6',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.anomaly',
          style: {
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1,
            'curve-style': 'bezier',
            'line-style': 'dashed',
            'width': 1.5
          }
        }
      ],

      layout: {
        name: 'grid',
        spacingFactor: 1.5,
        padding: 40,
        avoidOverlap: true
      }
    });
    
    
    // Lắng nghe sự kiện hover để thay đổi border khi di chuột vào node
    cy.on('mouseover', 'node', function (e) {
      const node = e.target;
      node.addClass('hover');
      console.log(node.data('label'));
    });

    // Lắng nghe sự kiện mouseout để trở lại viền đen khi chuột rời khỏi node
    cy.on('mouseout', 'node', function (e) {
      const node = e.target;
      node.removeClass('hover');
    });

    // Lắng nghe sự kiện click trên node
    cy.on('tap', 'node', function (e) {
      const node = e.target;
      const nodeId = node.id();
      const nodeLabel = node.data('label');

      // Lấy thông tin từ netip dựa trên ID node được chọn
      const netipInfo = netip?.find(n => n.IP === nodeLabel);
      console.log(netip);
      console.log(netipInfo)

      // Cập nhật thông tin node được chọn và hiển thị modal với chi tiết
      setSelectedNodeInfo({
        id: nodeId,
        label: nodeLabel,
        count: netipInfo?.Count,
        connectedIPs: netipInfo?.ConnectedIPs,
        firstEvent: netipInfo?.FirstEvent,
        lastEvent: netipInfo?.LastEvent
      });
      setIsModalVisible(true);
    });

    return () => {
      cy.destroy(); // Hủy Cytoscape khi component bị unmount
    };
  }, [data, netip]);

  return (
    <>
      {/* Container của Cytoscape */}
      <div id="cy" ref={cyRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />

      {/* Modal hiển thị thông tin node */}
      <Modal
        title="Node Information"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedNodeInfo && (
          <div>
            <p><b>Node ID:</b> {selectedNodeInfo.id}</p>
            <p><b>Label:</b> {selectedNodeInfo.label}</p>
            <p><b>Count:</b> {selectedNodeInfo.count || 'N/A'}</p>
            <p><b>Connected IPs:</b> {selectedNodeInfo.connectedIPs?.length ? selectedNodeInfo.connectedIPs.join(', ') : 'None'}</p>
            <p><b>First Event:</b> {selectedNodeInfo.firstEvent || 'N/A'}</p>
            <p><b>Last Event:</b> {selectedNodeInfo.lastEvent || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NetGraph;
