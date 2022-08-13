interface Point {
  lat: number;
  lng: number;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function getDistance(pointA: Point, pointB: Point) {
  const R = 6371;
  const dLat = deg2rad(pointB.lat - pointA.lat);
  const dLon = deg2rad(pointB.lng - pointA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pointA.lat)) *
      Math.cos(deg2rad(pointB.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = Math.round(R * c * 100) / 100;
  return d;
}
