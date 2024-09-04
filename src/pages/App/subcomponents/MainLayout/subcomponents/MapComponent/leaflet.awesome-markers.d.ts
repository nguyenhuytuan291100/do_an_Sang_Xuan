import 'leaflet';
declare module 'leaflet' {
  namespace AwesomeMarkers {
    function icon(options: any): Icon;
  }
}
