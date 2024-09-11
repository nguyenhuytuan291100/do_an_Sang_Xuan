import React from "react";
import { Chrono } from "react-chrono";
import './style.scss'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { time: "4:35:35 PM", "10.10.10.10": 1, "10.10.10.30": 1, "192.168.88.1": 0, "192.168.88.52": 0, "192.168.89.2": 0, "8.8.8.8": 1 },
  { time: "4:35:40 PM", "10.10.10.10": 1, "10.10.10.30": 1, "192.168.88.1": 0, "192.168.88.52": 1, "192.168.89.2": 0, "8.8.8.8": 0 },
  { time: "4:35:45 PM", "10.10.10.10": 1, "10.10.10.30": 1, "192.168.88.1": 1, "192.168.88.52": 1, "192.168.89.2": 0, "8.8.8.8": 1 },
  { time: "4:35:50 PM", "10.10.10.10": 1, "10.10.10.30": 1, "192.168.88.1": 0, "192.168.88.52": 0, "192.168.89.2": 0, "8.8.8.8": 1 },
  { time: "4:35:55 PM", "10.10.10.10": 1, "10.10.10.30": 1, "192.168.88.1": 0, "192.168.88.52": 0, "192.168.89.2": 0, "8.8.8.8": 0 },
  // Thêm các điểm dữ liệu khác tương tự
];

// Dữ liệu cho thanh ngang đầu tiên
const items1 = [
  { title: "192.168.0.3" },
  { title: "Event 2" },
  { title: "192.168.0.3" },
];

// Dữ liệu cho thanh ngang thứ hai
const items2 = [
  { title: "Event 3" },
  { title: "192.168.0.3" },
  { title: "Event 5" },
];

const FlowChart = () => {
  return (
    
    <div>

      
      {/* Thanh ngang đầu tiên */}
      <Chrono
        items={items1}
        mode="HORIZONTAL"
        itemWidth={150}
// Ẩn thanh điều khiển
        showSingle
      />
      
      {/* Thanh ngang thứ hai */}
      <Chrono
        items={items2}
        mode="HORIZONTAL"
        itemWidth={150}
  // Ẩn thanh điều khiển
        showSingle
      />
    </div>
    
  );
};

export default FlowChart;
