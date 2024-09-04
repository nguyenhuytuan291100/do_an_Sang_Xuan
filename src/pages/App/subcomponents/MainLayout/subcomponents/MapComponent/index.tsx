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
  sourceCoords: Coordinates;
  destinationCoords: Coordinates;
  sourcePopup: string;
  destinationPopup: string;
}

interface MapComponentProps {
  data: Array<{ sourceIP: string; destinationIP: string }>;
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  const [mapData, setMapData] = useState<MapData[]>([]);

  const fetchCoordinates = async (ip: string): Promise<Coordinates | null> => {
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
        const sourceCoords = await fetchCoordinates(pair.sourceIP);
        const destinationCoords = await fetchCoordinates(pair.destinationIP);

        if (sourceCoords && destinationCoords) {
          locations.push({
            sourceCoords,
            destinationCoords,
            sourcePopup: `Source: ${pair.sourceIP}`,
            destinationPopup: `Destination: ${pair.destinationIP}`,
          });
        } else {
          console.error('Missing coordinates for one or both IPs', pair);
        }
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
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        //   attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        //   maxZoom: 20,
        // }),
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }),

      ],
    });

    mapData.forEach(({ sourceCoords, destinationCoords, sourcePopup, destinationPopup }) => {
      if (sourceCoords && destinationCoords) {
        const sourceMarker = L.marker([sourceCoords.lat, sourceCoords.lon], {
          icon: L.AwesomeMarkers.icon({
            icon: 'info-sign',
            iconColor: 'white',
            markerColor: 'green',
            prefix: 'glyphicon',
          }),
        }).addTo(map);
        sourceMarker.bindPopup(sourcePopup);

        const destinationMarker = L.marker([destinationCoords.lat, destinationCoords.lon], {
          icon: L.AwesomeMarkers.icon({
            icon: 'info-sign',
            iconColor: 'white',
            markerColor: 'red',
            prefix: 'glyphicon',
          }),
        }).addTo(map);
        destinationMarker.bindPopup(destinationPopup);

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
