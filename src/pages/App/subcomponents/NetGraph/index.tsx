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
