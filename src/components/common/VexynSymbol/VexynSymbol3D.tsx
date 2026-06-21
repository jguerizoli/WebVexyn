import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// NEW LINEAR PATH (Skeleton)
const VX_PATH = "M49.3789 1.15137C51.714 0.194429 53.6138 0.222509 56.376 0.267578C59.6682 0.320548 62.5028 0.372342 65.1963 2.23047C66.432 3.08304 67.2809 4.06956 67.8369 4.85156L68.0576 5.17285L72.375 11.9004L72.585 12.2275L72.7949 11.9014L80.0215 0.704102L99.1367 0.724609L82.3623 27.001L82.2764 27.1357L82.3623 27.2705L99.207 53.6641L80.0537 53.7031L73.001 42.5049L72.79 42.1699L72.5781 42.5039L65.4883 53.7031L46.2334 53.6387L63.1035 27.3105L63.1895 27.1748L63.1025 27.0391L56.4072 16.6787L56.1836 16.332L55.9795 16.6914L35.6553 52.5283C35.1648 53.3928 34.2835 53.9672 33.2949 54.0576C32.7048 54.1118 32.0495 54.1308 31.3428 54.0908H31.3418C30.6853 54.0543 30.0823 53.9716 29.541 53.8662C28.7528 53.7122 28.0776 53.2063 27.7021 52.4951C18.6057 35.2512 9.50856 18.0093 0.412109 0.766602L18.4648 0.671875L31.6748 25.5977L31.8857 25.9941L32.1123 25.6064L43.9961 5.22559C44.8273 4.19041 46.4053 2.50934 48.8721 1.37207L49.3789 1.15137ZM55.6074 3.91211C52.0506 3.92358 48.3392 4.71027 46.5195 7.87988L31.791 33.5254L16.1309 4.07617L16.0586 3.93945L15.9033 3.94336L6.74023 4.19922L6.33691 4.21094L6.52637 4.56738L31.3574 51.1113L31.5684 51.5068L31.7939 51.1191L53.8379 13.249C53.9691 13.0739 54.6628 12.2029 55.8936 12.0752C56.9537 11.965 57.7251 12.4789 57.9482 12.6436C60.3307 16.2101 62.7127 19.7763 65.0957 23.3428L65.3066 23.6572L65.5137 23.3408L70.4824 15.7412L70.5742 15.6006L70.4775 15.4619C68.9579 13.2866 67.8533 11.4858 66.9023 9.99805C65.9548 8.51562 65.1539 7.33317 64.25 6.4248C62.4142 4.58002 60.1876 3.89763 55.6074 3.91211ZM79.9219 31.0439L74.9932 38.7637L74.9062 38.8994L74.9941 39.0352L82.0957 49.916L82.1719 50.0332L82.3115 50.0293L91.916 49.7793L92.3594 49.7676L92.1191 49.3945L80.3438 31.043L80.1328 30.7148L79.9219 31.0439ZM92.1768 4.09668L82.1592 4.13867L82.0225 4.13965L81.9492 4.25488L53.3154 49.3887L53.0693 49.7773L53.5293 49.7725L63.667 49.6797L63.8027 49.6787L63.876 49.5635L92.3896 4.47949L92.6338 4.09473L92.1768 4.09668Z";

const EnergyCircuitShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#e5531c') },
    uSpeed: { value: 30.0 }, // Pixels per second
    uTotalLength: { value: 0 }, // Total circuit length
    uCircuitOffset: { value: 0 }, // Offset for multi-pulse
    uCoreSize: { value: 8.0 }, // Sharper pulse size in pixels
  },
  vertexShader: `
    attribute float aDist;
    varying float vDist;
    void main() {
      vDist = aDist;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uSpeed;
    uniform float uTotalLength;
    uniform float uCircuitOffset;
    uniform float uCoreSize;
    varying float vDist;
    
    void main() {
      // Calculate head position with global speed and circuit offset
      float time = uTime * uSpeed;
      float headPos = mod(time + uCircuitOffset, uTotalLength);
      
      // Advanced wraparound: check three possible positions to cover the 0/Length seam
      float d1 = abs(vDist - headPos);
      float d2 = abs(vDist - (headPos + uTotalLength));
      float d3 = abs(vDist - (headPos - uTotalLength));
      float distToHead = min(d1, min(d2, d3));

      // Noise-based energy variation
      float energyVariation = sin(vDist * 0.1 + uTime * 5.0) * 0.5 + 0.5;
      float pulseWave = sin(uTime * 15.0 - vDist * 0.02) * 0.1 + 0.9;
      
      // Sharper falloff for the core and a smooth technical glow
      float core = smoothstep(uCoreSize, uCoreSize * 0.4, distToHead);
      float glow = smoothstep(uCoreSize * 6.0, 0.0, distToHead);
      
      // Technical energy shimmer
      float shimmer = sin(vDist * 5.0 + uTime * 30.0) * 0.1 + 0.9;
      
      // Final color composition with organic pulsing
      vec3 finalColor = uColor * (core * 25.0 * pulseWave + glow * 3.0 * energyVariation) * shimmer;
      float alpha = core * 1.0 + glow * 0.3 * energyVariation;
      
      if (alpha < 0.01) discard;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

const VexynMark3D = ({ isInView }: { isInView: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);

  const paths = useMemo(() => {
    const loader = new SVGLoader();
    const svgData = loader.parse(`<svg><path d="${VX_PATH}" /></svg>`);
    return svgData.paths;
  }, []);

  const circuits = useMemo(() => {
    const rawSubPaths = paths.flatMap(path => path.subPaths)
      .sort((a, b) => b.getLength() - a.getLength());

    const uniqueSubPaths: THREE.Path[] = [];
    rawSubPaths.forEach(sp => {
      const len = sp.getLength();
      if (!uniqueSubPaths.some(p => Math.abs(p.getLength() - len) < 1.0)) {
        uniqueSubPaths.push(sp);
      }
    });

    const buildCircuit = (pathIdx: number, speed: number, offset: number) => {
      const path = uniqueSubPaths[pathIdx];
      if (!path) return [];
      
      const length = path.getLength();
      const points = path.getSpacedPoints(Math.max(120, Math.floor(length * 2)));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const distAttr = new Float32Array(points.length);
      for (let i = 0; i < points.length; i++) {
        distAttr[i] = (i / (points.length - 1)) * length;
      }
      geometry.setAttribute('aDist', new THREE.BufferAttribute(distAttr, 1));

      const material = new THREE.ShaderMaterial({
        ...EnergyCircuitShader,
        uniforms: THREE.UniformsUtils.clone(EnergyCircuitShader.uniforms),
        transparent: true,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });

      material.uniforms.uTotalLength.value = length;
      material.uniforms.uSpeed.value = speed;
      material.uniforms.uCircuitOffset.value = offset;

      return [{ geometry, material }];
    };

    return [
      ...buildCircuit(0, 25.0, 0),
      ...buildCircuit(1, 35.0, 10.0),
      ...buildCircuit(2, 35.0, 40.0),
      ...buildCircuit(3, 35.0, 80.0),
    ];
  }, [paths]);


  useFrame((state) => {
    if (!isInView) return;

    circuits.forEach((c) => {
      c.material.uniforms.uTime.value = state.clock.elapsedTime;
    });

    if (meshRef.current) {
      // Subtle floaty motion (Keeping this as it wasn't requested to be removed)
      meshRef.current.position.y = 2.75 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={meshRef} scale={[0.1, -0.1, 0.1]} position={[-5, 2.75, 0]}>
      {circuits.map((c, i) => (
        <lineLoop key={i} geometry={c.geometry} material={c.material} />
      ))}
    </group>
  );
};

const VexynSymbol3D: React.FC<{ className?: string; size?: string }> = ({ className, size = '600px' }) => {
  const [isInView, setIsInView] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 968);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ width: size, height: '598px', background: 'transparent' }}
    >
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }} 
        gl={{ alpha: true, antialias: !isMobile }}
        frameloop={isInView ? 'always' : 'never'} // HARD CUT ON RENDER
      >
        <VexynMark3D isInView={isInView} />
        {!isMobile && (
          <EffectComposer enableNormalPass={false}>
            <Bloom intensity={1.2} luminanceThreshold={1.1} luminanceSmoothing={0.5} radius={0.4} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default VexynSymbol3D;
