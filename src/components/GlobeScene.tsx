"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";

export type HeatmapLayer = "population" | "temperature" | "education" | "language";

export type CountryData = {
  iso: string;
  name: string;
  value: number;
  extra?: Record<string, unknown>;
};

type GlobeSceneProps = {
  layer: HeatmapLayer;
  countryData: CountryData[];
  geoJson: GeoJSON.FeatureCollection | null;
  onCountryClick: (feature: GeoJSON.Feature) => void;
  zoomLevel?: number;
  zoomTrigger: { iso: string; coords: [number, number] } | null;
};

const LAYER_COLORS: Record<HeatmapLayer, (t: number) => string> = {
  population: (t) => `hsl(${220 - t * 220}, 80%, ${30 + t * 40}%)`,
  temperature: (t) => `hsl(${240 - t * 240}, 90%, ${35 + t * 30}%)`,
  education: (t) => `hsl(${120 + t * 60}, 70%, ${25 + t * 45}%)`,
  language: (t) => `hsl(${t * 300}, 65%, 45%)`,
};

export function GlobeScene({
  layer,
  countryData,
  geoJson,
  onCountryClick,
  zoomLevel,
  zoomTrigger,
}: GlobeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const frameRef = useRef<number>(0);
  const autoRotateRef = useRef(true);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ phi: Math.PI / 2, theta: 0, radius: 250 });
  const hoveredRef = useRef<GeoJSON.Feature | null>(null);
  const getColorFnRef = useRef<(d: object) => string>(() => "rgba(30,30,50,0.6)");

  const getColorFn = useCallback(
    (d: object) => {
      const feature = d as GeoJSON.Feature;
      if (hoveredRef.current && hoveredRef.current === feature) return "rgba(255,255,255,0.55)";
      const iso = (feature.properties?.ISO_A2 || feature.properties?.iso_a2 || "").toUpperCase();
      const entry = countryData.find((c) => c.iso.toUpperCase() === iso);
      if (!entry) return "rgba(30,30,50,0.6)";
      const normalized = Math.min(Math.max(entry.value, 0), 1);
      return LAYER_COLORS[layer](normalized);
    },
    [countryData, layer]
  );

  // Keep ref in sync so hover callback always uses latest color function
  useEffect(() => { getColorFnRef.current = getColorFn; }, [getColorFn]);

  // Initialize scene once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    sceneRef.current = scene;

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(6000);
    for (let i = 0; i < 6000; i++) starPositions[i] = (Math.random() - 0.5) * 2000;
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })));

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
    camera.position.set(0, 0, 250);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(200, 100, 100);
    scene.add(sun);

    const globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .atmosphereColor("#4466ff")
      .atmosphereAltitude(0.12);

    scene.add(globe as unknown as THREE.Object3D);
    globeRef.current = globe;

    // Atmosphere glow sphere
    const glowGeo = new THREE.SphereGeometry(102, 64, 64);
    const glowMat = new THREE.MeshPhongMaterial({
      color: 0x3355ff,
      transparent: true,
      opacity: 0.04,
      side: THREE.FrontSide,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (autoRotateRef.current && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.002;
      }
      const { phi, theta, radius } = sphericalRef.current;
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth, nh = mount.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Update polygon data when layer/countryData/geoJson change
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !geoJson) return;
    globe
      .polygonsData(geoJson.features)
      .polygonCapColor(getColorFn)
      .polygonSideColor(() => "rgba(0,0,0,0.2)")
      .polygonStrokeColor(() => "#ffffff18")
      .polygonAltitude((d) => (d as GeoJSON.Feature) === hoveredRef.current ? 0.018 : 0.006);
  }, [layer, countryData, geoJson, getColorFn]);

  // External zoom level (buttons)
  useEffect(() => {
    if (zoomLevel == null) return;
    sphericalRef.current.radius = zoomLevel;
  }, [zoomLevel]);

  // Zoom to country
  useEffect(() => {
    if (!zoomTrigger || !sphericalRef.current) return;
    const [lat, lng] = zoomTrigger.coords;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    sphericalRef.current = { phi, theta, radius: 160 };
    autoRotateRef.current = false;
  }, [zoomTrigger]);

  // Mouse controls
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      // Orbit drag
      if (isDraggingRef.current) {
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        sphericalRef.current.theta -= dx * 0.005;
        sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi + dy * 0.005));
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
      // Hover detection
      if (!geoJson || !cameraRef.current || !rendererRef.current) return;
      const rect = mount.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, cameraRef.current);
      const globeObj = globeRef.current as unknown as THREE.Object3D;
      const hits = raycaster.intersectObjects(globeObj.children, true);
      if (!hits.length) {
        if (hoveredRef.current !== null) {
          hoveredRef.current = null;
          globeRef.current?.polygonCapColor(getColorFnRef.current)
            .polygonAltitude(() => 0.006);
          mount.style.cursor = "default";
        }
        return;
      }
      const point = hits[0].point.clone().normalize();
      const lat = 90 - Math.acos(point.y) * (180 / Math.PI);
      const lng = (Math.atan2(point.x, point.z) * (180 / Math.PI) + 360) % 360 - 180;
      const match = geoJson.features.find((f) =>
        containsPoint((f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon).coordinates, f.geometry.type, lng, lat)
      ) ?? null;
      if (match !== hoveredRef.current) {
        hoveredRef.current = match;
        globeRef.current
          ?.polygonCapColor(getColorFnRef.current)
          .polygonAltitude((d) => (d as GeoJSON.Feature) === hoveredRef.current ? 0.018 : 0.006);
        mount.style.cursor = match ? "pointer" : "default";
      }
    };

    const onMouseUp = () => { isDraggingRef.current = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(130, Math.min(500, sphericalRef.current.radius + e.deltaY * 0.3));
    };

    const onClick = (e: MouseEvent) => {
      if (!geoJson || !cameraRef.current || !rendererRef.current) return;
      const rect = mount.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, cameraRef.current);
      const globeObj = globeRef.current as unknown as THREE.Object3D;
      const hits = raycaster.intersectObjects(globeObj.children, true);
      if (!hits.length) return;
      const point = hits[0].point.clone().normalize();
      const lat = 90 - Math.acos(point.y) * (180 / Math.PI);
      const lng = (Math.atan2(point.x, point.z) * (180 / Math.PI) + 360) % 360 - 180;

      // Find matching feature
      const match = geoJson.features.find((f) => {
        const coords = (f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon).coordinates;
        return containsPoint(coords, f.geometry.type, lng, lat);
      });
      if (match) onCountryClick(match);
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.addEventListener("click", onClick);

    return () => {
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("wheel", onWheel);
      mount.removeEventListener("click", onClick);
    };
  }, [geoJson, onCountryClick]);

  return <div ref={mountRef} className="w-full h-full" />;
}

function containsPoint(
  coords: GeoJSON.Position[][] | GeoJSON.Position[][][],
  type: string,
  lng: number,
  lat: number
): boolean {
  if (type === "Polygon") {
    return pointInPolygon(coords as GeoJSON.Position[][], lng, lat);
  }
  if (type === "MultiPolygon") {
    return (coords as GeoJSON.Position[][][]).some((poly) => pointInPolygon(poly, lng, lat));
  }
  return false;
}

function pointInPolygon(rings: GeoJSON.Position[][], lng: number, lat: number): boolean {
  const ring = rings[0];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
