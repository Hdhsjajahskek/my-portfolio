import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundFx } from '../../utils/audio';

export const DeveloperScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, setRoomTheme } = usePortfolio();
  const [interactiveHint, setInteractiveHint] = useState<string | null>(null);

  // Theme color maps
  const themeColors = {
    'cyber-neon': {
      primary: 0x06b6d4,   // Cyan
      secondary: 0xd946ef, // Magenta
      ambient: 0x0f172a,
      screenGlow: 0x00f0ff,
      deskUnderglow: 0x06b6d4,
      pcFan: 0xa855f7
    },
    'matrix-green': {
      primary: 0x10b981,   // Emerald
      secondary: 0x84cc16, // Lime
      ambient: 0x052e16,
      screenGlow: 0x22c55e,
      deskUnderglow: 0x10b981,
      pcFan: 0x15803d
    },
    'synthwave-sunset': {
      primary: 0xf43f5e,   // Rose Pink
      secondary: 0xf59e0b, // Amber
      ambient: 0x1e1022,
      screenGlow: 0xfb7185,
      deskUnderglow: 0xe11d48,
      pcFan: 0xf97316
    },
    'studio-minimal': {
      primary: 0x38bdf8,   // Sky
      secondary: 0xa855f7, // Violet
      ambient: 0x0f172a,
      screenGlow: 0xe2e8f0,
      deskUnderglow: 0x64748b,
      pcFan: 0x38bdf8
    }
  };

  const currentColors = themeColors[data.theme.roomTheme] || themeColors['cyber-neon'];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060b, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 1.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Dynamic Lights
    const ambientLight = new THREE.AmbientLight(currentColors.ambient, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.SpotLight(currentColors.primary, 45);
    mainKeyLight.position.set(3, 6, 4);
    mainKeyLight.angle = Math.PI / 4;
    mainKeyLight.penumbra = 0.8;
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const rimLight = new THREE.PointLight(currentColors.secondary, 25, 15);
    rimLight.position.set(-4, 3, -2);
    scene.add(rimLight);

    const deskUnderglowLight = new THREE.PointLight(currentColors.deskUnderglow, 12, 6);
    deskUnderglowLight.position.set(0, 0.2, 0);
    scene.add(deskUnderglowLight);

    const screenLight = new THREE.PointLight(currentColors.screenGlow, 18, 5);
    screenLight.position.set(0, 1.6, 0.4);
    scene.add(screenLight);

    // 4. Create Cyber Room & Desk Setup
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 40, currentColors.primary, 0x1e293b);
    gridHelper.position.y = -0.01;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // Floor platform
    const floorGeo = new THREE.CylinderGeometry(6, 6.2, 0.2, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.85
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Desk Top
    const deskTopGeo = new THREE.BoxGeometry(3.6, 0.1, 1.6);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.7
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.set(0, 1.1, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    roomGroup.add(deskTop);

    // Desk Glowing Edge Trim
    const deskEdgeGeo = new THREE.BoxGeometry(3.65, 0.03, 1.65);
    const deskEdgeMat = new THREE.MeshBasicMaterial({
      color: currentColors.primary,
      transparent: true,
      opacity: 0.8
    });
    const deskEdge = new THREE.Mesh(deskEdgeGeo, deskEdgeMat);
    deskEdge.position.set(0, 1.06, 0);
    roomGroup.add(deskEdge);

    // Desk Legs (Futuristic Angle)
    const legGeo = new THREE.BoxGeometry(0.08, 1.1, 1.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-1.6, 0.55, 0);
    roomGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(1.6, 0.55, 0);
    roomGroup.add(rightLeg);

    // 5. Dual Curved Monitors
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 1.15, -0.35);
    roomGroup.add(monitorGroup);

    // Screen dynamic texture with Matrix/Code simulation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(canvas);

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture
    });

    // Center Main Ultrawide Monitor
    const mainScreenGeo = new THREE.BoxGeometry(1.9, 0.95, 0.04);
    const mainScreen = new THREE.Mesh(mainScreenGeo, screenMat);
    mainScreen.position.set(0, 0.7, 0);
    mainScreen.castShadow = true;
    monitorGroup.add(mainScreen);

    // Left Angled Monitor
    const leftScreenGeo = new THREE.BoxGeometry(1.1, 0.85, 0.04);
    const leftScreen = new THREE.Mesh(leftScreenGeo, screenMat);
    leftScreen.position.set(-1.35, 0.65, 0.18);
    leftScreen.rotation.y = Math.PI / 8;
    monitorGroup.add(leftScreen);

    // Right Angled Monitor
    const rightScreenGeo = new THREE.BoxGeometry(1.1, 0.85, 0.04);
    const rightScreen = new THREE.Mesh(rightScreenGeo, screenMat);
    rightScreen.position.set(1.35, 0.65, 0.18);
    rightScreen.rotation.y = -Math.PI / 8;
    monitorGroup.add(rightScreen);

    // Monitor Stands
    const standGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.3, 0);
    monitorGroup.add(stand);

    // 6. Cyber PC Tower with Glowing RGB Fans
    const pcGroup = new THREE.Group();
    pcGroup.position.set(1.4, 0.55, 0.2);
    roomGroup.add(pcGroup);

    // PC Case Body
    const pcCaseGeo = new THREE.BoxGeometry(0.4, 0.75, 0.75);
    const pcCaseMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const pcCase = new THREE.Mesh(pcCaseGeo, pcCaseMat);
    pcGroup.add(pcCase);

    // RGB Rotating Fans inside PC
    const fans: THREE.Mesh[] = [];
    const fanGeo = new THREE.RingGeometry(0.04, 0.1, 8);
    const fanMat = new THREE.MeshBasicMaterial({
      color: currentColors.pcFan,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 3; i++) {
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.set(0.19, -0.22 + i * 0.22, 0.36);
      pcGroup.add(fan);
      fans.push(fan);
    }

    // 7. Mechanical Keyboard & Mouse
    const keyboardGeo = new THREE.BoxGeometry(0.7, 0.02, 0.25);
    const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.position.set(0, 1.16, 0.3);
    roomGroup.add(keyboard);

    // Keyboard RGB Underglow
    const keyGlowGeo = new THREE.PlaneGeometry(0.68, 0.23);
    const keyGlowMat = new THREE.MeshBasicMaterial({ color: currentColors.primary, transparent: true, opacity: 0.7 });
    const keyGlow = new THREE.Mesh(keyGlowGeo, keyGlowMat);
    keyGlow.rotation.x = -Math.PI / 2;
    keyGlow.position.set(0, 1.171, 0.3);
    roomGroup.add(keyGlow);

    // Mouse
    const mouseGeo = new THREE.CapsuleGeometry(0.04, 0.06, 4, 8);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.rotation.x = Math.PI / 2;
    mouse.position.set(0.55, 1.17, 0.3);
    roomGroup.add(mouse);

    // 8. Holographic Floating Crystal / Tech Core
    const holoGroup = new THREE.Group();
    holoGroup.position.set(-1.3, 1.6, 0.2);
    roomGroup.add(holoGroup);

    const octaGeo = new THREE.OctahedronGeometry(0.18, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: currentColors.secondary,
      emissive: currentColors.secondary,
      emissiveIntensity: 0.8,
      wireframe: true
    });
    const holoCore = new THREE.Mesh(octaGeo, octaMat);
    holoGroup.add(holoCore);

    const ringGeo = new THREE.TorusGeometry(0.28, 0.008, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: currentColors.primary, transparent: true, opacity: 0.6 });
    const holoRing1 = new THREE.Mesh(ringGeo, ringMat);
    const holoRing2 = new THREE.Mesh(ringGeo, ringMat);
    holoGroup.add(holoRing1);
    holoGroup.add(holoRing2);

    // 9. Stylized 3D Developer Character
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 0.95);
    roomGroup.add(characterGroup);

    // Ergonomic Chair
    const chairGroup = new THREE.Group();
    characterGroup.add(chairGroup);

    const seatGeo = new THREE.BoxGeometry(0.7, 0.08, 0.65);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0b1120, roughness: 0.6 });
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.set(0, 0.75, 0);
    chairGroup.add(seat);

    const backrestGeo = new THREE.BoxGeometry(0.65, 0.85, 0.08);
    const backrest = new THREE.Mesh(backrestGeo, chairMat);
    backrest.position.set(0, 1.25, 0.3);
    backrest.rotation.x = -0.08;
    chairGroup.add(backrest);

    // Chair Stem & Wheels Base
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);
    const stem = new THREE.Mesh(stemGeo, standMat);
    stem.position.set(0, 0.4, 0);
    chairGroup.add(stem);

    // Developer Torso (Hoodie)
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.65, 16);
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.7
    });
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, 1.15, 0.08);
    torso.rotation.x = 0.12;
    characterGroup.add(torso);

    // Developer Head & Cyber Headset
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.62, 0.15);
    characterGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0a98b, roughness: 0.5 });
    const head = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(head);

    // Hair / Cap
    const hairGeo = new THREE.SphereGeometry(0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.02, -0.01);
    headGroup.add(hair);

    // Glowing Cyber Visor / Glasses
    const visorGeo = new THREE.BoxGeometry(0.24, 0.06, 0.08);
    const visorMat = new THREE.MeshStandardMaterial({
      color: currentColors.primary,
      emissive: currentColors.primary,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.03, 0.16);
    headGroup.add(visor);

    // Cyber Headphones
    const phoneGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
    phoneGeo.rotateZ(Math.PI / 2);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.3 });
    
    const leftEar = new THREE.Mesh(phoneGeo, phoneMat);
    leftEar.position.set(-0.19, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(phoneGeo, phoneMat);
    rightEar.position.set(0.19, 0.02, 0);
    headGroup.add(rightEar);

    // Developer Arms (Typing pose reaching to keyboard)
    const armMat = hoodieMat;
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12);
    armGeo.rotateX(Math.PI / 3);

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.25, 1.25, -0.15);
    characterGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.25, 1.25, -0.15);
    characterGroup.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-0.2, 1.18, -0.45);
    characterGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0.2, 1.18, -0.45);
    characterGroup.add(rightHand);

    // 10. Ambient Floating Star Dust Particles
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = Math.random() * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: currentColors.primary,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 11. Mouse tracking & Raycaster
    const mousePos = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mousePos.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      mousePos.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Click on interactive objects to cycle theme
    const handleClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([pcCase, holoCore, mainScreen, leftScreen, rightScreen], true);
      if (intersects.length > 0) {
        soundFx.playWarp();
        const themes: Array<'cyber-neon' | 'matrix-green' | 'synthwave-sunset' | 'studio-minimal'> = [
          'cyber-neon', 'matrix-green', 'synthwave-sunset', 'studio-minimal'
        ];
        const currentIdx = themes.indexOf(data.theme.roomTheme);
        const nextTheme = themes[(currentIdx + 1) % themes.length];
        setRoomTheme(nextTheme);
      }
    };

    container.addEventListener('click', handleClick);

    // 12. Scroll-Choreographed Camera Waypoints
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 13. Screen Canvas Code Rain Animation State
    let lastTime = 0;
    let codeOffset = 0;
    const codeLines = [
      '// AURA NEURAL CORE v4.8',
      'const matrix = new MatrixGraph();',
      'await matrix.sync({ stream: true });',
      'function render3DCanvas(gl) {',
      '  gl.bindBuffer(ARRAY_BUFFER);',
      '  gl.drawArrays(TRIANGLES, 0, 6);',
      '}',
      'AI_AGENT.execute({ task: "OPTIMIZE" });',
      'GPU_UTILIZATION: 99.8% // 60 FPS',
      'LATENCY: 0.42ms [SECURE_NODE]',
      'REALTIME_SYNC: ACTIVE [ALL_TABS]'
    ];

    // 14. Animation Loop
    let animationFrameId: number;

    const clock = new THREE.Clock();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mousePos.x += (mousePos.targetX - mousePos.x) * 0.05;
      mousePos.y += (mousePos.targetY - mousePos.y) * 0.05;

      // 1. Screen texture dynamic draw
      if (time - lastTime > 60 && ctx) {
        lastTime = time;
        codeOffset += 1;

        ctx.fillStyle = '#050a14';
        ctx.fillRect(0, 0, 512, 256);

        // Header banner
        ctx.fillStyle = data.theme.roomTheme === 'matrix-green' ? '#22c55e' : (data.theme.roomTheme === 'synthwave-sunset' ? '#f43f5e' : '#06b6d4');
        ctx.font = 'bold 16px monospace';
        ctx.fillText('◈ AURA // 3D NEURAL TERMINAL', 20, 30);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        for (let i = 0; i < 256; i += 20) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(512, i);
          ctx.stroke();
        }

        // Code streaming
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px monospace';
        codeLines.forEach((line, idx) => {
          const y = 60 + idx * 18;
          if (idx === (codeOffset % codeLines.length)) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('> ' + line + ' █', 20, y);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.fillText('  ' + line, 20, y);
          }
        });

        // Telemetry meter bar
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fillRect(20, 230, 472, 12);
        ctx.fillStyle = data.theme.roomTheme === 'matrix-green' ? '#10b981' : '#06b6d4';
        const progressWidth = ((Math.sin(elapsed * 2) + 1) / 2) * 472;
        ctx.fillRect(20, 230, progressWidth, 12);

        screenTexture.needsUpdate = true;
      }

      // 2. Character Head & Hands tracking
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mousePos.x * 0.45, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mousePos.y * 0.25, 0.08);

      // Typing rhythmic jitter
      const typeSpeed = Math.sin(elapsed * 18) * 0.006;
      leftHand.position.y = 1.18 + typeSpeed;
      rightHand.position.y = 1.18 - typeSpeed;

      // 3. PC Fans rotation
      fans.forEach(fan => {
        fan.rotation.z += delta * 12;
      });

      // 4. Floating Hologram animation
      holoCore.rotation.x += delta * 0.8;
      holoCore.rotation.y += delta * 1.2;
      holoGroup.position.y = 1.6 + Math.sin(elapsed * 2.5) * 0.06;
      holoRing1.rotation.x += delta * 1.4;
      holoRing1.rotation.y += delta * 0.9;
      holoRing2.rotation.y -= delta * 1.1;
      holoRing2.rotation.z += delta * 1.3;

      // 5. Floating Dust Particles drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= delta * 0.15;
        if (positions[i] < 0) positions[i] = 8;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // 6. SCROLL-DRIVEN CAMERA CHOREOGRAPHY
      // Waypoint 0 (Hero): Isometric Overview
      // Waypoint 1 (About/Skills, p=0.25): Orbit closer left to character
      // Waypoint 2 (Projects, p=0.55): Zoom closer to glowing monitors
      // Waypoint 3 (Services/Price, p=0.80): Orbit right towards Hologram/PC
      // Waypoint 4 (Contact, p=1.00): High tech dramatic front terminal view

      let targetCamX = 0;
      let targetCamY = 3.2;
      let targetCamZ = 7.5;
      let targetLookY = 1.2;
      let targetLookX = 0;

      if (scrollProgress < 0.25) {
        // Hero to About
        const t = scrollProgress / 0.25;
        targetCamX = THREE.MathUtils.lerp(0, -1.8, t);
        targetCamY = THREE.MathUtils.lerp(3.2, 2.6, t);
        targetCamZ = THREE.MathUtils.lerp(7.5, 5.8, t);
        targetLookX = THREE.MathUtils.lerp(0, -0.4, t);
        targetLookY = THREE.MathUtils.lerp(1.2, 1.4, t);
      } else if (scrollProgress < 0.6) {
        // About to Projects Showroom
        const t = (scrollProgress - 0.25) / 0.35;
        targetCamX = THREE.MathUtils.lerp(-1.8, 1.6, t);
        targetCamY = THREE.MathUtils.lerp(2.6, 2.2, t);
        targetCamZ = THREE.MathUtils.lerp(5.8, 4.6, t);
        targetLookX = THREE.MathUtils.lerp(-0.4, 0.2, t);
        targetLookY = THREE.MathUtils.lerp(1.4, 1.3, t);
      } else if (scrollProgress < 0.85) {
        // Projects to Services Pricing
        const t = (scrollProgress - 0.6) / 0.25;
        targetCamX = THREE.MathUtils.lerp(1.6, -1.2, t);
        targetCamY = THREE.MathUtils.lerp(2.2, 2.4, t);
        targetCamZ = THREE.MathUtils.lerp(4.6, 5.2, t);
        targetLookX = THREE.MathUtils.lerp(0.2, -0.5, t);
        targetLookY = THREE.MathUtils.lerp(1.3, 1.5, t);
      } else {
        // Services to Contact Terminal
        const t = (scrollProgress - 0.85) / 0.15;
        targetCamX = THREE.MathUtils.lerp(-1.2, 0, t);
        targetCamY = THREE.MathUtils.lerp(2.4, 2.1, t);
        targetCamZ = THREE.MathUtils.lerp(5.2, 4.2, t);
        targetLookX = THREE.MathUtils.lerp(-0.5, 0, t);
        targetLookY = THREE.MathUtils.lerp(1.5, 1.25, t);
      }

      // Parallax mouse damping
      targetCamX += mousePos.x * 0.3;
      targetCamY += mousePos.y * 0.2;

      // Smooth Camera Lerp
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05);

      const currentLook = new THREE.Vector3(targetLookX, targetLookY, 0);
      camera.lookAt(currentLook);

      // Check raycaster hover for interactive feedback
      raycaster.setFromCamera(pointer, camera);
      const hovered = raycaster.intersectObjects([pcCase, holoCore, mainScreen], true);
      if (hovered.length > 0) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }

      renderer.render(scene, camera);
    };

    animate(0);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [data.theme.roomTheme]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Interactive 3D HUD Tooltip & Theme Trigger */}
      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 px-4 py-2.5 rounded-full shadow-2xl z-10 text-xs text-slate-300">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Click 3D Desk / PC to switch Theme Mood</span>
        <button
          onClick={() => {
            soundFx.playWarp();
            const themes: Array<'cyber-neon' | 'matrix-green' | 'synthwave-sunset' | 'studio-minimal'> = [
              'cyber-neon', 'matrix-green', 'synthwave-sunset', 'studio-minimal'
            ];
            const currentIdx = themes.indexOf(data.theme.roomTheme);
            const next = themes[(currentIdx + 1) % themes.length];
            setRoomTheme(next);
          }}
          className="ml-2 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition font-mono uppercase tracking-wider font-semibold"
        >
          {data.theme.roomTheme.replace('-', ' ')}
        </button>
      </div>
    </div>
  );
};
