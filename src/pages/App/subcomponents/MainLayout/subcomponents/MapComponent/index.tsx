// import React, { useEffect, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet.awesome-markers';
// import axios from 'axios';
// import "./style.scss"

// /// <reference path="./leaflet.awesome-markers.d.ts" />

// // Định nghĩa kiểu cho tọa độ
// interface Coordinates {
//   lat: number;
//   lon: number;
// }

// interface MapData {
//   sourceCoords: Coordinates | null;
//   destinationCoords: Coordinates | null;
//   sourcePopup: string;
//   destinationPopup: string;
// }

// interface MapComponentProps {
//   data: Array<{ sourceIP: string; destinationIP: string }>;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
//   const [mapData, setMapData] = useState<MapData[]>([]);

//   const fetchCoordinates = async (ip: string): Promise<Coordinates | null> => {
//     try {
//       const response = await axios.get(`http://ip-api.com/json/${ip}`);
//       if (response.data.status === 'success') {
//         return { lat: response.data.lat, lon: response.data.lon };
//       } else {
//         console.error(`Failed to get coordinates for IP: ${ip}`);
//         return null;
//       }
//     } catch (error) {
//       console.error(`Error fetching coordinates for IP: ${ip}`, error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const loadMapData = async () => {
//       const locations: MapData[] = [];

//       for (const pair of data) {
//         const sourceCoords = await fetchCoordinates(pair.sourceIP);
//         const destinationCoords = await fetchCoordinates(pair.destinationIP);

//         locations.push({
//           sourceCoords,
//           destinationCoords,
//           sourcePopup: `Source: ${pair.sourceIP}`,
//           destinationPopup: `Destination: ${pair.destinationIP}`,
//         });
//       }

//       setMapData(locations);
//     };

//     loadMapData();
//   }, [data]);

//   useEffect(() => {
//     if (mapData.length === 0) return;

//     const map = L.map('map', {
//       center: [20, 0],
//       zoom: 2,
//       layers: [
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; OpenStreetMap contributors',
//           maxZoom: 19,
//         }),
//       ],
//     });

//     mapData.forEach(({ sourceCoords, destinationCoords, sourcePopup, destinationPopup }) => {
//       let sourceMarker: L.Marker | null = null;
//       let destinationMarker: L.Marker | null = null;

//       // Kiểm tra nếu sourceCoords tồn tại, tạo marker cho nó
//       if (sourceCoords) {
//         sourceMarker = L.marker([sourceCoords.lat, sourceCoords.lon], {
//           icon: L.AwesomeMarkers.icon({
//             icon: 'info',   // Biểu tượng chữ "i"
//             iconColor: 'white',  // Màu của chữ "i"
//             markerColor: 'green',  // Màu nền của marker
//             prefix: 'fa',  // Sử dụng font-awesome để hiển thị biểu tượng
//           }),
//         }).addTo(map);
//         sourceMarker.bindPopup(sourcePopup);
//       }

//       // Kiểm tra nếu destinationCoords tồn tại, tạo marker cho nó
//       if (destinationCoords) {
//         destinationMarker = L.marker([destinationCoords.lat, destinationCoords.lon], {
//           icon: L.AwesomeMarkers.icon({
//             icon: 'info',   // Biểu tượng chữ "i"
//             iconColor: 'white',  // Màu của chữ "i"
//             markerColor: 'red',  // Màu nền của marker
//             prefix: 'fa',  // Sử dụng font-awesome để hiển thị biểu tượng
//           }),
//         }).addTo(map);
//         destinationMarker.bindPopup(destinationPopup);
//       }

//       // Nếu cả hai tọa độ đều tồn tại, vẽ kết nối giữa chúng
//       if (sourceCoords && destinationCoords) {
//         L.polyline(
//           [
//             [sourceCoords.lat, sourceCoords.lon],
//             [destinationCoords.lat, destinationCoords.lon],
//           ],
//           { color: 'cyan', opacity: 0.8, weight: 2.5 }
//         ).addTo(map);
//       }
//     });
//   }, [mapData]);

//   return <div id="map"></div>;
// };

// export default MapComponent;


import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers';
import axios from 'axios';
import "./style.scss"

/// <reference path="./leaflet.awesome-markers.d.ts" />

// Định nghĩa kiểu cho tọa độ
interface Coordinates {
  lat: number;
  lon: number;
}

interface MapData {
  sourceCoords: Coordinates | null;
  destinationCoords: Coordinates | null;
  sourcePopup: string;
  destinationPopup: string;
}

interface MapComponentProps {
  data: Array<{ sourceIP: string; destinationIP: string }>;
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  const [mapData, setMapData] = useState<MapData[]>([]);

  const fetchCoordinates = async (ip: string): Promise<Coordinates | null> => {
    if (ip === 'NULL') {
      return null;
    }
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      if (response.data.status === 'success') {
        return { lat: response.data.lat, lon: response.data.lon };
      } else {
        console.error(`Failed to get coordinates for IP: ${ip}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching coordinates for IP: ${ip}`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadMapData = async () => {
      const locations: MapData[] = [];

      for (const pair of data) {
        // Kiểm tra nếu cả hai IP đều là 'NULL', bỏ qua cặp này
        if (pair.sourceIP === 'NULL' && pair.destinationIP === 'NULL') {
          continue;
        }

        const sourceCoords = await fetchCoordinates(pair.sourceIP);
        const destinationCoords = await fetchCoordinates(pair.destinationIP);

        locations.push({
          sourceCoords,
          destinationCoords,
          sourcePopup: `Source: ${pair.sourceIP}`,
          destinationPopup: `Destination: ${pair.destinationIP}`,
        });
      }

      setMapData(locations);
    };

    loadMapData();
  }, [data]);

  useEffect(() => {
    if (mapData.length === 0) return;

    const map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }),
      ],
    });

    mapData.forEach(({ sourceCoords, destinationCoords, sourcePopup, destinationPopup }) => {
      // Kiểm tra nếu không có tọa độ nào, bỏ qua
      if (!sourceCoords && !destinationCoords) {
        return;
      }

      let sourceMarker: L.Marker | null = null;
      let destinationMarker: L.Marker | null = null;

      // Tạo marker cho sourceCoords nếu tồn tại
      if (sourceCoords) {
        sourceMarker = L.marker([sourceCoords.lat, sourceCoords.lon], {
          icon: L.AwesomeMarkers.icon({
            icon: 'info',   // Biểu tượng chữ "i"
            iconColor: 'white',  // Màu của chữ "i"
            markerColor: 'green',  // Màu nền của marker
            prefix: 'fa',  // Sử dụng font-awesome để hiển thị biểu tượng
          }),
        }).addTo(map);
        sourceMarker.bindPopup(sourcePopup);
      }

      // Tạo marker cho destinationCoords nếu tồn tại
      if (destinationCoords) {
        destinationMarker = L.marker([destinationCoords.lat, destinationCoords.lon], {
          icon: L.AwesomeMarkers.icon({
            icon: 'info',   // Biểu tượng chữ "i"
            iconColor: 'white',  // Màu của chữ "i"
            markerColor: 'red',  // Màu nền của marker
            prefix: 'fa',  // Sử dụng font-awesome để hiển thị biểu tượng
          }),
        }).addTo(map);
        destinationMarker.bindPopup(destinationPopup);
      }

      // Vẽ polyline nếu cả hai tọa độ đều tồn tại
      if (sourceCoords && destinationCoords) {
        L.polyline(
          [
            [sourceCoords.lat, sourceCoords.lon],
            [destinationCoords.lat, destinationCoords.lon],
          ],
          { color: 'cyan', opacity: 0.8, weight: 2.5 }
        ).addTo(map);
      }
    });
  }, [mapData]);

  return <div id="map"></div>;
};

export default MapComponent;
