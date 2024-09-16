import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './styles.scss'; // Import file CSS

interface GraphData {
  source: string;
  target: string;
  label: string;
}

interface NetGraphProps {
  data: GraphData[];
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

const NetGraph: React.FC<NetGraphProps> = ({ data }) => {
  const cyRef = useRef<HTMLDivElement>(null);

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
            'background-color': '#007bff', // Màu nền xanh dương đậm
            'label': 'data(label)',
            'text-valign': 'bottom', // Căn chữ ở dưới node
            'color': '#000', // Màu chữ đen
            'font-size': '12px', // Kích thước chữ
            'width': '40px', // Độ rộng node
            'height': '40px', // Chiều cao node
            'border-width': 1, // Độ dày viền mặc định
            'border-color': '#000000', // Màu viền đen mặc định
            'text-margin-y': 2 // Đặt chữ bên dưới node
          }
        },
        {
          selector: 'node.hover', // Style khi node được hover (di chuột vào)
          style: {
            'border-color': '#00ff00', // Đổi viền thành xanh lá khi hover
            'border-width': 6
          }
        },
        {
          selector: '.highlighted', // Style cho các cạnh được làm nổi bật
          style: {
            'line-color': '#ffcc00', // Màu vàng nổi bật cho các cạnh liên quan
            'target-arrow-color': '#ffcc00', // Đổi màu mũi tên khi cạnh được highlight
            'width': 3 // Tăng độ dày cạnh để dễ nhìn hơn
          }
        },
{
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ADD8E6', // Màu xanh dương nhạt cho cạnh
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#ADD8E6', // Màu mũi tên cùng màu cạnh
            'curve-style': 'bezier', // Sử dụng đường cong bezier để tránh trùng cạnh
            'control-point-distance': 30, // Khoảng cách đường cong so với đường thẳng giữa các nút
            'control-point-weight': 0.8, // Điều chỉnh độ cong của đường
            'edge-distances': 'node-position' // Điều chỉnh điểm điều khiển dựa trên vị trí nút
          }
        },
        {
          selector: '.anomaly',
          style: {
            'line-color': '#ff0000', // Màu đỏ cho cạnh anomaly
            'target-arrow-color': '#ff0000',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1, // Điều chỉnh kích thước của mũi tên chỉ hướng
            'curve-style': 'bezier', // Cạnh anomaly cũng sử dụng đường cong bezier
            'control-point-distance': 30, // Tăng khoảng cách của đường cong cho cạnh anomaly
            'control-point-weight': 0.7, // Tăng trọng số để đường cong rõ hơn
            'line-style': 'dashed', 
            'width': 1.5 // Kiểu đường gạch để phân biệt cạnh anomaly
          }
        }
      ],

      layout: {
        name: 'grid',  // Sử dụng layout "grid" để xếp các node thành dạng lưới
        spacingFactor: 1.5,  // Tăng khoảng cách giữa các node
        padding: 40,  // Tăng khoảng trống xung quanh
        avoidOverlap: true  // Tránh chồng lấp các node
      }
    });

    // Lắng nghe sự kiện hover để thay đổi border khi di chuột vào node
    cy.on('mouseover', 'node', function (e) {
      const node = e.target;
      node.addClass('hover'); // Thêm class hover khi di chuột vào  
    });
    // Lắng nghe sự kiện mouseout để trở lại viền đen khi chuột rời khỏi node
    cy.on('mouseout', 'node', function (e) {
      const node = e.target;
      node.removeClass('hover'); // Xóa class hover khi chuột rời node
    });
    // Lắng nghe sự kiện click trên node
    cy.on('tap', 'node', function (e) {
      const node = e.target;
      // Loại bỏ class highlighted khỏi tất cả các cạnh
      cy.elements('edge').removeClass('highlighted');
      // Lấy các cạnh liên quan đến node được nhấp vào
      const connectedEdges = node.connectedEdges();
      // Thêm class highlighted cho các cạnh liên quan đến node được chọn
      connectedEdges.forEach((edge: cytoscape.EdgeSingular) => {
        edge.addClass('highlighted');
      });
    });

    return () => {
      cy.destroy(); // Hủy cytoscape khi component bị unmount
    };
  }, [data]);

  return (
<div>
      <div id="cy" ref={cyRef} />
    </div>
  );
};

export default NetGraph;