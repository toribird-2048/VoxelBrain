import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Layers,
  Eye,
  EyeOff,
  Globe,
  Zap,
  ShieldAlert,
  LayoutGrid,
  Box,
  Sun,
  Battery,
} from 'lucide-react';

interface VoxelViewerProps {
  N: number;
  internalOutputs?: number[][][]; // (N, N, N)
  membraneOutputs?: number[][][]; // (P, P, P) where P = N + 2
  koList: { x: number; y: number; z: number }[];
  importanceMap?: number[][][];
  inPortsFi?: number[][];
  outPortsFi?: number[][];
  onToggleKo: (x: number, y: number, z: number) => void;
  showImportance?: boolean;
}

interface OutputPortDef {
  index: number;
  key: string;
  x: number;
  y: number;
  z: number;
  name: string;
  shortName: string;
  colorHex: number;
  colorStr: string;
}

export const VoxelViewer: React.FC<VoxelViewerProps> = ({
  N,
  internalOutputs,
  membraneOutputs,
  koList,
  importanceMap,
  inPortsFi,
  outPortsFi,
  onToggleKo,
  showImportance = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'SLICES' | '3D'>('SLICES');
  const [sliceZ, setSliceZ] = useState<number | 'ALL'>('ALL');
  const [ghostMode, setGhostMode] = useState<boolean>(false);
  const [showMembrane, setShowMembrane] = useState<boolean>(true);

  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
    z: number;
    val: number;
    isKo: boolean;
    importance?: number;
    isMembrane?: boolean;
    portName?: string;
    portColor?: string;
  } | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const spheresRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // KO判定セット
  const koSet = new Set(koList.map((c) => `${c.x},${c.y},${c.z}`));

  // 出力ポート座標変換ヘルパー (Slang: faceIndex_to_coordOut と完全一致)
  // 内部ニューロン表面の6面 (面座標 = 0 または N-1, 面内座標 = 0 .. N-1)
  const faceIndexToCoordOut = (face: number, u: number, v: number, nVal: number) => {
    const cu = Math.max(0, Math.min(nVal - 1, Math.round(u)));
    const cv = Math.max(0, Math.min(nVal - 1, Math.round(v)));
    switch (Math.max(0, Math.min(5, Math.round(face)))) {
      case 0: return { x: 0, y: cu, z: cv };
      case 1: return { x: nVal - 1, y: cu, z: cv };
      case 2: return { x: cu, y: 0, z: cv };
      case 3: return { x: cu, y: nVal - 1, z: cv };
      case 4: return { x: cu, y: cv, z: 0 };
      case 5: return { x: cu, y: cv, z: nVal - 1 };
      default: return { x: 0, y: cu, z: cv };
    }
  };

  // 入力ポート座標変換ヘルパー (Slang: faceIndex_to_coordIn と完全一致)
  // 外周膜の6面 (面座標 = -1 または N, 面内座標 = -1 .. N) -> P = N + 2 座標系 (0 .. P-1)
  const faceIndexToCoordIn = (face: number, u: number, v: number, nVal: number, pVal: number) => {
    const cu = Math.max(-1, Math.min(nVal, Math.round(u)));
    const cv = Math.max(-1, Math.min(nVal, Math.round(v)));
    switch (Math.max(0, Math.min(5, Math.round(face)))) {
      case 0: return { px: 0, py: cu + 1, pz: cv + 1 };
      case 1: return { px: pVal - 1, py: cu + 1, pz: cv + 1 };
      case 2: return { px: cu + 1, py: 0, pz: cv + 1 };
      case 3: return { px: cu + 1, py: pVal - 1, pz: cv + 1 };
      case 4: return { px: cu + 1, py: cv + 1, pz: 0 };
      case 5: return { px: cu + 1, py: cv + 1, pz: pVal - 1 };
      default: return { px: 0, py: cu + 1, pz: cv + 1 };
    }
  };

  // 出力ポートの定義一覧（メモ化）
  const outputPorts = useMemo<OutputPortDef[]>(() => {
    if (!outPortsFi || outPortsFi.length === 0) return [];
    const meta = [
      { name: '⚡ 発電(+) 出力', shortName: '発電(+)', colorHex: 0x38bdf8, colorStr: '#38bdf8' },
      { name: '⚡ 発電(-) 出力', shortName: '発電(-)', colorHex: 0xf43f5e, colorStr: '#f43f5e' },
      { name: '🏃 推進速度 出力', shortName: '推進速度', colorHex: 0xa855f7, colorStr: '#a855f7' },
      { name: '🔄 旋回 出力', shortName: '旋回', colorHex: 0xeab308, colorStr: '#eab308' },
    ];
    return outPortsFi.slice(0, 4).map((p, idx) => {
      const coord = faceIndexToCoordOut(p[0], p[1], p[2], N);
      const m = meta[idx] || { name: `出力 #${idx}`, shortName: `OUT${idx}`, colorHex: 0x06b6d4, colorStr: '#06b6d4' };
      return {
        index: idx,
        key: `${coord.x},${coord.y},${coord.z}`,
        x: coord.x,
        y: coord.y,
        z: coord.z,
        name: m.name,
        shortName: m.shortName,
        colorHex: m.colorHex,
        colorStr: m.colorStr,
      };
    });
  }, [outPortsFi, N]);

  const outputPortMap = useMemo(() => {
    const map = new Map<string, OutputPortDef>();
    outputPorts.forEach((p) => map.set(p.key, p));
    return map;
  }, [outputPorts]);

  // 入力ポート定義 (☀️ 太陽光, 🔋 バッテリー)
  const inPorts = useMemo(() => {
    if (!inPortsFi || inPortsFi.length === 0) return [];
    const P = N + 2;
    const meta = [
      { name: '☀️ 太陽光入力', shortName: '太陽光', colorStr: '#f59e0b', icon: '☀️' },
      { name: '🔋 バッテリー入力', shortName: 'バッテリー', colorStr: '#10b981', icon: '🔋' },
    ];
    return inPortsFi.slice(0, 2).map((p, idx) => {
      const coord = faceIndexToCoordIn(p[0], p[1], p[2], N, P);
      const m = meta[idx] || { name: `入力 #${idx}`, shortName: `IN${idx}`, colorStr: '#38bdf8', icon: '⚡' };
      return {
        index: idx,
        face: p[0],
        u: p[1],
        v: p[2],
        px: coord.px,
        py: coord.py,
        pz: coord.pz,
        name: m.name,
        shortName: m.shortName,
        colorStr: m.colorStr,
        icon: m.icon,
      };
    });
  }, [inPortsFi, N]);

  // 平面スライス用セルスタイル計算関数
  const getCellStyle = (
    val: number,
    isKo: boolean,
    imp?: number,
    showImp?: boolean,
    outPort?: OutputPortDef
  ) => {
    if (isKo) {
      return {
        backgroundColor: 'rgba(153, 27, 27, 0.55)',
        borderColor: '#ef4444',
        boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.4)',
        color: '#fca5a5',
      };
    }

    if (showImp && imp !== undefined) {
      const normImp = Math.max(0, Math.min(1, imp / 0.8));
      const hue = (1 - normImp) * 240;
      return {
        backgroundColor: `hsla(${hue}, 85%, 25%, 0.85)`,
        borderColor: `hsla(${hue}, 100%, 55%, 0.9)`,
        boxShadow: normImp > 0.4 ? `0 0 8px hsla(${hue}, 100%, 50%, 0.4)` : 'none',
        color: '#ffffff',
      };
    }

    const cVal = Math.max(-1, Math.min(1, val));
    if (Math.abs(cVal) < 0.01) {
      return {
        backgroundColor: 'rgba(30, 41, 59, 0.65)',
        borderColor: outPort ? outPort.colorStr : 'rgba(51, 65, 85, 0.8)',
        boxShadow: outPort ? `0 0 10px ${outPort.colorStr}44` : 'none',
        color: '#94a3b8',
      };
    }

    if (cVal > 0) {
      const hue = 180 - cVal * 40; // シアン -> エメラルド
      const lightness = 22 + cVal * 25;
      const glow = Math.min(12, cVal * 12);
      return {
        backgroundColor: `hsla(${hue}, 85%, ${lightness}%, 0.85)`,
        borderColor: outPort ? outPort.colorStr : `hsla(${hue}, 95%, 65%, 0.8)`,
        boxShadow: outPort
          ? `0 0 12px ${outPort.colorStr}88`
          : `0 0 ${glow}px hsla(${hue}, 100%, 50%, ${cVal * 0.45})`,
        color: '#f8fafc',
      };
    } else {
      const p = -cVal;
      const hue = 280; // パープル
      const lightness = 18 + p * 20;
      return {
        backgroundColor: `hsla(${hue}, 75%, ${lightness}%, 0.85)`,
        borderColor: outPort ? outPort.colorStr : `hsla(${hue}, 85%, 60%, 0.7)`,
        boxShadow: outPort
          ? `0 0 12px ${outPort.colorStr}88`
          : `0 0 ${p * 8}px hsla(${hue}, 90%, 50%, ${p * 0.35})`,
        color: '#f1f5f9',
      };
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e131f);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(N * 2.2, N * 1.8, N * 2.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // 6. Grid / Helper
    const gridHelper = new THREE.GridHelper(N * 1.5, N, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -N * 0.65;
    scene.add(gridHelper);

    // 7. Cubes 生成
    const cubes = new Map<string, THREE.Mesh>();
    const spacing = 1.15;
    const offset = ((N - 1) * spacing) / 2;

    const boxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    // 出力ポート強調用のアウターワイヤーフレームジオメトリ (少し大きめの0.92)
    const outBoxGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const outEdges = new THREE.EdgesGeometry(outBoxGeo);

    for (let z = 0; z < N; z++) {
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
          });

          const mesh = new THREE.Mesh(boxGeo, mat);
          mesh.position.set(
            x * spacing - offset,
            y * spacing - offset,
            z * spacing - offset
          );
          mesh.userData = { x, y, z };

          // 外枠エッジ (通常枠)
          const edges = new THREE.EdgesGeometry(boxGeo);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 1 })
          );
          line.name = 'normalEdge';
          mesh.add(line);

          // 出力ポート用アクセント外枠 (二重枠で際立たせる)
          const outLine = new THREE.LineSegments(
            outEdges,
            new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.9,
              linewidth: 2,
            })
          );
          outLine.name = 'outPortAccent';
          outLine.visible = false;
          mesh.add(outLine);

          scene.add(mesh);
          cubes.set(`${x},${y},${z}`, mesh);
        }
      }
    }
    cubesRef.current = cubes;

    // 7-B. Membrane Spheres 生成 (P = N + 2 の外周膜セル)
    const P = N + 2;
    const offsetP = ((P - 1) * spacing) / 2;
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const spheres = new Map<string, THREE.Mesh>();

    for (let pz = 0; pz < P; pz++) {
      for (let py = 0; py < P; py++) {
        for (let px = 0; px < P; px++) {
          const isInternal = px >= 1 && px <= N && py >= 1 && py <= N && pz >= 1 && pz <= N;
          if (isInternal) continue;

          const sMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.35,
          });

          const sphereMesh = new THREE.Mesh(sphereGeo, sMat);
          sphereMesh.position.set(
            px * spacing - offsetP,
            py * spacing - offsetP,
            pz * spacing - offsetP
          );
          sphereMesh.userData = {
            isMembrane: true,
            px,
            py,
            pz,
            x: px - 1,
            y: py - 1,
            z: pz - 1,
          };

          scene.add(sphereMesh);
          spheres.set(`${px},${py},${pz}`, sphereMesh);
        }
      }
    }
    spheresRef.current = spheres;

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [N]);

  // 3Dモード復帰時のキャンバスリサイズ追従
  useEffect(() => {
    if (viewMode === '3D') {
      const timer = setTimeout(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // 色 & KO 状態 & Zスライス & 外周膜球体のリアルタイム更新
  useEffect(() => {
    const cubes = cubesRef.current;
    if (cubes.size === 0) return;

    // 1. 内部ニューロンキューブの更新
    for (let z = 0; z < N; z++) {
      const isLayerSelected = sliceZ === 'ALL' || sliceZ === z;

      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const key = `${x},${y},${z}`;
          const mesh = cubes.get(key);
          if (!mesh) continue;

          const outPort = outputPortMap.get(key);
          const normalEdge = mesh.getObjectByName('normalEdge') as THREE.LineSegments | undefined;
          const outAccent = mesh.getObjectByName('outPortAccent') as THREE.LineSegments | undefined;

          // 非選択層の表示コントロール
          if (!isLayerSelected) {
            if (!ghostMode) {
              mesh.visible = false;
              if (outAccent) outAccent.visible = false;
              continue;
            } else {
              mesh.visible = true;
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.transparent = true;
              mat.opacity = 0.05;
              mat.emissiveIntensity = 0.0;
              if (normalEdge) {
                (normalEdge.material as THREE.LineBasicMaterial).color.setHex(0x1e293b);
              }
              if (outAccent) {
                // ゴーストモードでも出力ポートの輪郭はうっすら見えるようにして位置を把握可能に
                if (outPort) {
                  outAccent.visible = true;
                  const oMat = outAccent.material as THREE.LineBasicMaterial;
                  oMat.color.setHex(outPort.colorHex);
                  oMat.opacity = 0.25;
                } else {
                  outAccent.visible = false;
                }
              }
              continue;
            }
          }

          // 選択層は通常表示
          mesh.visible = true;
          const isKo = koSet.has(key);
          const val = internalOutputs ? internalOutputs[z]?.[y]?.[x] ?? 0.0 : 0.0;
          const imp = importanceMap ? importanceMap[z]?.[y]?.[x] ?? 0.0 : 0.0;

          const mat = mesh.material as THREE.MeshStandardMaterial;
          const edgeMat = normalEdge ? (normalEdge.material as THREE.LineBasicMaterial) : null;

          // 出力ポートのアクセント枠表示
          if (outPort && outAccent) {
            outAccent.visible = true;
            const oMat = outAccent.material as THREE.LineBasicMaterial;
            oMat.color.setHex(outPort.colorHex);
            oMat.opacity = 0.95;
            mesh.userData.outputPort = outPort;
          } else {
            if (outAccent) outAccent.visible = false;
            mesh.userData.outputPort = undefined;
          }

          if (isKo) {
            mat.color.setHex(0xef4444);
            mat.emissive.setHex(0x991b1b);
            mat.emissiveIntensity = 0.7;
            mat.opacity = sliceZ === 'ALL' ? 0.45 : 0.8;
            if (edgeMat) edgeMat.color.setHex(0xff0000);
          } else if (showImportance && importanceMap) {
            const normImp = Math.max(0, Math.min(1, imp / 0.8));
            const col = new THREE.Color();
            col.setHSL(0.66 * (1 - normImp), 1.0, 0.4 + 0.2 * normImp);
            mat.color.copy(col);
            mat.emissive.copy(col);
            mat.emissiveIntensity = normImp * 0.8;
            mat.opacity = 0.9;
            if (edgeMat) {
              edgeMat.color.setHex(outPort ? outPort.colorHex : 0x64748b);
            }
          } else {
            const cVal = Math.max(-1, Math.min(1, val));
            const col = new THREE.Color();
            if (cVal >= 0) {
              const hue = 0.5 - cVal * 0.35;
              const lightness = 0.25 + cVal * 0.45;
              col.setHSL(hue, 0.9, lightness);
              mat.emissive.setHSL(hue, 1.0, cVal * 0.5);
              mat.emissiveIntensity = cVal * 0.7;
            } else {
              const p = -cVal;
              col.setHSL(0.8, 0.7, 0.2 + p * 0.3);
              mat.emissive.setHSL(0.8, 0.8, p * 0.4);
              mat.emissiveIntensity = p * 0.5;
            }

            // 出力ポートキューブは発光色にポートカラーをブレンドし、枠線をポートカラーに染めて即座に識別可能にする
            if (outPort) {
              const portCol = new THREE.Color(outPort.colorHex);
              mat.emissive.lerp(portCol, 0.4);
              mat.emissiveIntensity = Math.max(0.25, mat.emissiveIntensity);
              if (edgeMat) {
                edgeMat.color.setHex(outPort.colorHex);
              }
            } else {
              if (edgeMat) {
                edgeMat.color.setHex(sliceZ === 'ALL' ? 0x475569 : 0x38bdf8);
              }
            }

            mat.color.copy(col);
            mat.opacity = sliceZ === 'ALL' ? 0.85 : 0.95;
          }
        }
      }
    }

    // 2. 外周膜球体 (Membrane Spheres) の更新
    // ※ 入力ポートのみ球体でハイライト（出力ポートは内部ニューロン表面キューブ側で可視化）
    const P = N + 2;
    const inPortMap = new Map<string, { name: string; color: number }>();
    if (inPortsFi && inPortsFi.length >= 1) {
      const p = faceIndexToCoordIn(inPortsFi[0][0], inPortsFi[0][1], inPortsFi[0][2], N, P);
      inPortMap.set(`${p.px},${p.py},${p.pz}`, { name: '☀️ 太陽光入力', color: 0xf59e0b });
    }
    if (inPortsFi && inPortsFi.length >= 2) {
      const p = faceIndexToCoordIn(inPortsFi[1][0], inPortsFi[1][1], inPortsFi[1][2], N, P);
      inPortMap.set(`${p.px},${p.py},${p.pz}`, { name: '🔋 バッテリー入力', color: 0x10b981 });
    }

    const spheres = spheresRef.current;
    if (spheres && spheres.size > 0) {
      spheres.forEach((sphere, key) => {
        if (!showMembrane) {
          sphere.visible = false;
          return;
        }

        const { px, py, pz } = sphere.userData;
        const isLayerSelected = sliceZ === 'ALL' || pz === (typeof sliceZ === 'number' ? sliceZ + 1 : -1);

        if (!isLayerSelected) {
          if (!ghostMode) {
            sphere.visible = false;
            return;
          } else {
            sphere.visible = true;
            const mat = sphere.material as THREE.MeshStandardMaterial;
            mat.opacity = 0.04;
            mat.emissiveIntensity = 0.0;
            return;
          }
        }

        sphere.visible = true;
        const mat = sphere.material as THREE.MeshStandardMaterial;
        const portInfo = inPortMap.get(key);
        const mVal = membraneOutputs?.[pz]?.[py]?.[px] ?? 0.0;

        if (portInfo) {
          // 入力ポート球体: 入力電位の大きさに応じてダイナミックに明滅
          const portVal = Math.abs(mVal);
          mat.color.setHex(portInfo.color);
          mat.emissive.setHex(portInfo.color);
          mat.emissiveIntensity = 0.15 + Math.min(1.0, portVal * 1.5) * 0.85;
          mat.opacity = 0.6 + Math.min(0.4, portVal * 0.4);
          sphere.userData.portName = portInfo.name;
        } else {
          // 通常の膜球体: 静止時 (mVal ~ 0) は控えめなダークスレート、信号通過時のみ発光
          const absVal = Math.abs(mVal);
          if (absVal < 0.005) {
            mat.color.setHex(0x1e293b);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0.0;
            mat.opacity = sliceZ === 'ALL' ? 0.3 : 0.5;
          } else if (mVal > 0) {
            const cVal = Math.min(1.0, mVal);
            const hue = 0.55 - cVal * 0.1;
            const lightness = 0.3 + cVal * 0.4;
            mat.color.setHSL(hue, 0.9, lightness);
            mat.emissive.setHSL(hue, 1.0, cVal * 0.6);
            mat.emissiveIntensity = Math.min(1.0, cVal * 1.2);
            mat.opacity = 0.5 + cVal * 0.45;
          } else {
            const pVal = Math.min(1.0, -mVal);
            mat.color.setHSL(0.78, 0.7, 0.2 + pVal * 0.2);
            mat.emissive.setHSL(0.78, 0.9, pVal * 0.4);
            mat.emissiveIntensity = Math.min(1.0, pVal * 0.8);
            mat.opacity = 0.4 + pVal * 0.4;
          }
          sphere.userData.portName = undefined;
        }
      });
    }
  }, [internalOutputs, membraneOutputs, inPortsFi, outputPortMap, koList, importanceMap, showImportance, N, sliceZ, ghostMode, showMembrane]);

  // マウスイベント (ホバー & クリックピッキング)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const getCellCoords = (obj: THREE.Object3D): { x: number; y: number; z: number; outputPort?: OutputPortDef } | null => {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      if (curr.userData && typeof curr.userData.x === 'number') {
        return {
          x: curr.userData.x,
          y: curr.userData.y,
          z: curr.userData.z,
          outputPort: curr.userData.outputPort,
        };
      }
      curr = curr.parent;
    }
    return null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return; // 左クリックのみ
    pointerDownPos.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !pointerDownPos.current) return;
    const dx = Math.abs(event.clientX - pointerDownPos.current.x);
    const dy = Math.abs(event.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;

    // 視点ドラッグではなく、純粋なクリック（移動量5px未満）の場合のみKO切替
    if (dx > 5 || dy > 5) return;
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const activeCubes = Array.from(cubesRef.current.values()).filter((c) => c.visible);
    const intersects = raycasterRef.current.intersectObjects(activeCubes, false);

    if (intersects.length > 0) {
      const coords = getCellCoords(intersects[0].object);
      if (coords) {
        onToggleKo(coords.x, coords.y, coords.z);
      }
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const activeCubes = Array.from(cubesRef.current.values()).filter((c) => c.visible);
    const activeSpheres = showMembrane ? Array.from(spheresRef.current.values()).filter((s) => s.visible) : [];
    const allActive = [...activeCubes, ...activeSpheres];
    const intersects = raycasterRef.current.intersectObjects(allActive, false);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const u = hitObj.userData;
      if (u && u.isMembrane) {
        const mVal = membraneOutputs?.[u.pz]?.[u.py]?.[u.px] ?? 0.0;
        setHoveredCell({
          x: u.x,
          y: u.y,
          z: u.z,
          val: mVal,
          isKo: false,
          isMembrane: true,
          portName: u.portName,
          portColor: '#f59e0b',
        });
        return;
      }

      const coords = getCellCoords(hitObj);
      if (coords) {
        const { x: cx, y: cy, z: cz } = coords;
        const key = `${cx},${cy},${cz}`;
        const val = internalOutputs ? internalOutputs[cz]?.[cy]?.[cx] ?? 0.0 : 0.0;
        const imp = importanceMap ? importanceMap[cz]?.[cy]?.[cx] : undefined;
        const outPort = outputPortMap.get(key);

        setHoveredCell({
          x: cx,
          y: cy,
          z: cz,
          val,
          isKo: koSet.has(key),
          importance: imp,
          isMembrane: false,
          portName: outPort ? outPort.name : undefined,
          portColor: outPort ? outPort.colorStr : undefined,
        });
        return;
      }
    }
    setHoveredCell(null);
  };

  return (
    <div className="relative w-full h-full select-none flex flex-col">
      {/* 3D キャンバス (3D表示時のみ可視化、状態保持のため破棄せずdisplay制御) */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer"
        style={{ display: viewMode === '3D' ? 'block' : 'none' }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />

      {/* ⊞ 4スライス平面表示モード (4枚のZ層を同時にフラット表示) */}
      {viewMode === 'SLICES' && (
        <div className="w-full h-full p-4 overflow-y-auto flex flex-col items-center justify-center bg-[#0a0d14]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full my-auto">
            {Array.from({ length: N }, (_, z) => {
              // このZ層に存在する出力ポート
              const portsInThisZ = outputPorts.filter((p) => p.z === z);
              // このZ層に隣接する入力ポート (pz = z + 1)
              const inPortsInThisZ = inPorts.filter((p) => p.pz === z + 1);

              return (
                <div
                  key={z}
                  className="bg-slate-900/85 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex flex-col items-center relative group hover:border-slate-600 transition"
                >
                  {/* スライスヘッダー */}
                  <div className="flex items-center justify-between w-full pb-2 mb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm">
                        Z = {z}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {z === 0 ? '底面 (Bottom)' : z === N - 1 ? '天面 (Top)' : `中間層 Z=${z}`}
                      </span>
                    </div>

                    {/* ポートバッジ (出力 & 入力) */}
                    <div className="flex items-center gap-1">
                      {inPortsInThisZ.map((inp) => (
                        <span
                          key={inp.index}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5"
                          style={{
                            color: inp.colorStr,
                            borderColor: `${inp.colorStr}55`,
                            backgroundColor: `${inp.colorStr}18`,
                          }}
                          title={`${inp.name} がこのZ=${z}層の外周に接続`}
                        >
                          {inp.icon} {inp.shortName}
                        </span>
                      ))}
                      {portsInThisZ.map((p) => (
                        <span
                          key={p.index}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            color: p.colorStr,
                            borderColor: `${p.colorStr}66`,
                            backgroundColor: `${p.colorStr}22`,
                          }}
                          title={p.name}
                        >
                          {p.shortName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4x4 グリッド (Y軸: 上が N-1、下が 0 / X軸: 左が 0、右が N-1) */}
                  <div className="flex flex-col gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    {Array.from({ length: N }, (_, rowIdx) => {
                      const y = N - 1 - rowIdx;
                      return (
                        <div key={y} className="flex gap-1.5 justify-center">
                          {Array.from({ length: N }, (_, x) => {
                            const key = `${x},${y},${z}`;
                            const val = internalOutputs ? internalOutputs[z]?.[y]?.[x] ?? 0.0 : 0.0;
                            const imp = importanceMap ? importanceMap[z]?.[y]?.[x] : undefined;
                            const isKo = koSet.has(key);
                            const outPort = outputPortMap.get(key);
                            const style = getCellStyle(val, isKo, imp, showImportance, outPort);

                            return (
                              <button
                                key={key}
                                onClick={() => onToggleKo(x, y, z)}
                                onMouseEnter={() =>
                                  setHoveredCell({
                                    x,
                                    y,
                                    z,
                                    val,
                                    isKo,
                                    importance: imp,
                                    isMembrane: false,
                                    portName: outPort ? outPort.name : undefined,
                                    portColor: outPort ? outPort.colorStr : undefined,
                                  })
                                }
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`relative flex flex-col items-center justify-between p-1 rounded-lg border transition-all transform active:scale-95 hover:scale-105 cursor-pointer aspect-square w-12 h-12 md:w-14 md:h-14 select-none ${
                                  outPort ? 'ring-2 ring-offset-1 ring-offset-slate-900 shadow-lg' : ''
                                }`}
                                style={{
                                  ...style,
                                  ringColor: outPort ? outPort.colorStr : undefined,
                                }}
                                title={`[x:${x}, y:${y}, z:${z}] 電位: ${val.toFixed(3)}${outPort ? ` (${outPort.name})` : ''} - クリックでKO切替`}
                              >
                                {/* 上部: 座標 & 出力ポートタグ */}
                                <div className="flex items-center justify-between w-full text-[9px] font-mono leading-none">
                                  <span className="opacity-60">{x},{y}</span>
                                  {outPort && (
                                    <span
                                      className="font-bold text-[8px] px-1 rounded"
                                      style={{
                                        backgroundColor: `${outPort.colorStr}33`,
                                        color: outPort.colorStr,
                                      }}
                                    >
                                      {outPort.shortName}
                                    </span>
                                  )}
                                </div>

                                {/* 中央: 電位またはKOマーク */}
                                <div className="font-mono font-bold text-xs tracking-tight">
                                  {isKo ? (
                                    <span className="text-rose-400 flex items-center justify-center font-bold text-base leading-none">
                                      ✕
                                    </span>
                                  ) : (
                                    <span>{val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
                                  )}
                                </div>

                                {/* 下部: 微小インジケータ */}
                                <div className="w-full text-center text-[8px] leading-none opacity-50 font-mono">
                                  {isKo ? 'KO' : ''}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* スライスフッター (軸ラベルの案内) */}
                  <div className="flex items-center justify-between w-full mt-2 text-[10px] text-slate-500 font-mono px-1">
                    <span>↑ +Y (y=3)</span>
                    <span>X: 0 → 3 →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 表示モード切り替え & スライスコントロールバー (画面右上) */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        {/* モード切り替えタブ [⊞ 4スライス平面] / [🧊 3D 立体] */}
        <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-1 flex items-center space-x-1 shadow-xl text-xs">
          <button
            onClick={() => setViewMode('SLICES')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition text-xs ${
              viewMode === 'SLICES'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Z=0〜3の4つの層を平面マトリックスとしてまとめて同時表示"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>⊞ 4スライス平面</span>
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition text-xs ${
              viewMode === '3D'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="3D空間内でボクセルキューブを立体表示"
          >
            <Box className="w-3.5 h-3.5" />
            <span>🧊 3D 立体</span>
          </button>
        </div>

        {/* 3Dモード時のみ表示する詳細レイヤーコントロール */}
        {viewMode === '3D' && (
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-1.5 flex items-center space-x-1.5 shadow-xl text-xs">
            <div className="flex items-center space-x-1 px-2 py-0.5 text-slate-400 font-medium border-r border-slate-800">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>層:</span>
            </div>

            {/* ALL (全層表示) ボタン */}
            <button
              onClick={() => setSliceZ('ALL')}
              className={`px-2 py-1 rounded-lg font-medium transition text-xs ${
                sliceZ === 'ALL'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="全層を3D表示"
            >
              全層
            </button>

            {/* 各 Z 層ボタン (0 〜 N-1) */}
            {Array.from({ length: N }, (_, z) => (
              <button
                key={z}
                onClick={() => setSliceZ(z)}
                className={`px-2 py-1 rounded-lg font-mono font-medium transition text-xs ${
                  sliceZ === z
                    ? 'bg-sky-500 text-white shadow-sm font-bold ring-1 ring-sky-300/50'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title={`Z = ${z} 層のみ3Dスライス表示`}
              >
                Z={z}
              </button>
            ))}

            {/* スライス選択時のみ: ゴースト表示切り替えボタン */}
            {sliceZ !== 'ALL' && (
              <button
                onClick={() => setGhostMode(!ghostMode)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition ml-1 text-xs border ${
                  ghostMode
                    ? 'bg-slate-800 text-sky-300 border-sky-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
                title={ghostMode ? '他層を完全に非表示にする' : '他層をうっすら半透明で残す（ゴースト表示）'}
              >
                {ghostMode ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-[11px]">ゴースト</span>
              </button>
            )}

            {/* 膜表示 (Membrane) トグルボタン */}
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              onClick={() => setShowMembrane(!showMembrane)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition text-xs border font-medium ${
                showMembrane
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="外周膜（入力ポート・球体）の表示/非表示を切り替え"
            >
              <Globe className={`w-3.5 h-3.5 ${showMembrane ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>膜</span>
            </button>
          </div>
        )}
      </div>

      {/* ホバー情報ツールチップ */}
      {hoveredCell && (
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none z-30 max-w-[280px]">
          <div className="font-semibold flex items-center justify-between gap-1.5">
            {hoveredCell.isMembrane ? (
              <span className="text-sky-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                外周膜 [{hoveredCell.x}, {hoveredCell.y}, {hoveredCell.z}]
              </span>
            ) : (
              <span className="text-sky-400 flex items-center gap-1">
                ニューロン [{hoveredCell.x}, {hoveredCell.y}, {hoveredCell.z}]
              </span>
            )}
            {hoveredCell.portName && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-sans font-bold border"
                style={{
                  backgroundColor: `${hoveredCell.portColor || '#38bdf8'}22`,
                  color: hoveredCell.portColor || '#38bdf8',
                  borderColor: `${hoveredCell.portColor || '#38bdf8'}66`,
                }}
              >
                {hoveredCell.portName}
              </span>
            )}
          </div>

          <div className="text-slate-300 mt-1">
            電位・出力値: <span className="font-mono text-emerald-400 font-bold">{hoveredCell.val.toFixed(3)}</span>
          </div>

          {!hoveredCell.isMembrane && hoveredCell.importance !== undefined && (
            <div className="text-slate-300">
              KO影響度: <span className="font-mono text-rose-400 font-bold">-{hoveredCell.importance.toFixed(4)}</span>
            </div>
          )}

          {!hoveredCell.isMembrane && (
            <div className="mt-1">
              {hoveredCell.isKo ? (
                <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> KO (無効化中) - クリックで復帰
                </span>
              ) : (
                <span className="text-slate-400">
                  クリックで <span className="text-rose-400 font-semibold">KO無効化</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 出力ポート可視化凡例カード (画面左下) */}
      {outputPorts.length > 0 && (
        <div className="absolute bottom-10 left-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-2.5 shadow-xl z-20 text-xs flex flex-col gap-1.5 min-w-[210px]">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              表面出力ニューロン (4ポート)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">二重枠で強調</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {outputPorts.map((port) => {
              const currentVal = internalOutputs?.[port.z]?.[port.y]?.[port.x] ?? 0.0;
              const isSelectedZ = sliceZ === 'ALL' || sliceZ === port.z;

              return (
                <button
                  key={port.index}
                  onClick={() => {
                    if (viewMode === '3D') {
                      setSliceZ(port.z);
                    }
                  }}
                  className={`flex flex-col text-left p-1.5 rounded-lg border transition ${
                    viewMode === 'SLICES' || isSelectedZ
                      ? 'bg-slate-800/80 hover:bg-slate-700/80'
                      : 'bg-slate-900/60 opacity-60 hover:opacity-100 hover:bg-slate-800/50'
                  }`}
                  style={{
                    borderColor: port.colorStr ? `${port.colorStr}66` : '#334155',
                  }}
                  title={`出力ポート: ${port.name} (座標: [${port.x}, ${port.y}, ${port.z}])`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: port.colorStr }}
                    >
                      {port.shortName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      [{port.x},{port.y},{port.z}]
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] text-slate-400">
                      Z={port.z}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-200">
                      {currentVal.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ガイドヒント */}
      <div className="absolute bottom-2 left-4 text-[11px] text-slate-500 pointer-events-none z-20">
        {viewMode === '3D'
          ? '左ドラッグ: 回転 ｜ 右ドラッグ: パン ｜ ホイール: ズーム ｜ 左クリック: セルKO切替'
          : '各セルをクリック: KO切替 (無効化/復帰) ｜ ホバー: 電位・ポート詳細'}
      </div>
    </div>
  );
};
