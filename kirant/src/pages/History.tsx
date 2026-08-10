import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "../data/brand";
import { useLenis } from "../hooks/useLenis";
import "./History.css";

gsap.registerPlugin(ScrollTrigger);

const deg = (n: number) => (Math.PI / 180) * n;
const MODEL_URL = "/models/warrior-transformed.glb";

const CHAPTERS = [
  {
    title: "Mountain Beginnings",
    desc: `Long before ${brand.name} opened its doors, travelers paused on the ${brand.region} ridge to watch dawn spill across the Himalaya. These high meadows were known as places of quiet arrival — where the journey slowed and the horizon widened.`,
    image: "/images/ashvara/about-heritage.jpg",
  },
  {
    title: "A House of Rest",
    desc: `${brand.name} began as a modest house of rest for pilgrims and explorers seeking clean air and clear views. Stone, timber, and local craft shaped the first rooms — built not for spectacle, but for shelter, warmth, and the long look outward.`,
    image: "/images/ashvara/about-hero.jpg",
  },
  {
    title: "Craft & Ritual",
    desc: `Hospitality here follows a quieter ritual: fire lit at dusk, tea poured at first light, and service paced to the mountain rather than the clock. Generations of hosts refined a language of care rooted in place, season, and sincere welcome.`,
    image: "/images/ashvara/about-craft.jpg",
  },
  {
    title: "The Quiet Luxury",
    desc: `Luxury at ${brand.name} is measured in stillness — soft light through wooden screens, linen cooled by highland air, and silence deep enough to hear the wind in the pines. Every detail is chosen to deepen presence, never to distract from it.`,
    image: "/images/ashvara/about-portrait.jpg",
  },
  {
    title: "Guests & Guardians",
    desc: `Those who stay become part of the ridge’s story, and those who serve remain its guardians. From chefs to keepers of the garden, the people of ${brand.name} carry forward a promise: that every guest leaves lighter, clearer, and closer to the mountain.`,
    image: "/images/ashvara/about-culture.jpg",
  },
] as const;

function WarriorModel(props: ThreeElements["group"]) {
  const gltf = useGLTF(MODEL_URL) as unknown as {
    nodes: Record<string, THREE.Object3D>;
    materials: Record<string, THREE.Material>;
  };

  const mesh = useMemo(() => {
    const node =
      (gltf.nodes["warriorStatue.001"] as THREE.Mesh | undefined) ||
      (gltf.nodes.warriorStatue001 as THREE.Mesh | undefined) ||
      (Object.values(gltf.nodes).find(
        (n) => (n as THREE.Mesh).isMesh
      ) as THREE.Mesh | undefined);
    return node;
  }, [gltf.nodes]);

  const material = gltf.materials.warrior_033 ?? Object.values(gltf.materials)[0];

  if (!mesh?.geometry) return null;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={mesh.geometry}
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/** Exact camera / light choreography from kirant.webxnepal.com/history */
function WarriorScene() {
  const groupRef = useRef<THREE.Group>(null);
  const targetRef = useRef(new THREE.Object3D());
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const rot = useRef(new THREE.Euler(0, deg(220), 0));
  const scale = useRef(new THREE.Vector3(1, 1, 1));
  const look = useRef(new THREE.Vector3(-0.2, 0.7, -1.7));

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.copy(pos.current);
    g.rotation.copy(rot.current);
    g.scale.copy(scale.current);
    const local = look.current.clone();
    g.updateMatrixWorld(true);
    g.worldToLocal(local);
    targetRef.current.position.copy(local);
  }, []);

  useGSAP(() => {
    // Reset to hero pose whenever scene mounts
    pos.current.set(0, 0, 0);
    rot.current.set(0, deg(220), 0);
    scale.current.set(1, 1, 1);
    look.current.set(-0.2, 0.7, -1.7);

    const scrub = (
      target: object,
      vars: gsap.TweenVars,
      trigger: string,
      start = "top bottom",
      end = "top top"
    ) => {
      gsap.to(target, {
        ...vars,
        ease: "none",
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: 1,
        },
      });
    };

    scrub(pos.current, { z: 1.8 }, "#hero-section", "top top", "bottom top");
    scrub(look.current, { z: 0.1 }, "#hero-section", "top top", "bottom top");

    scrub(rot.current, { x: deg(-15) }, "#chapter-1");
    scrub(look.current, { x: -1.65, y: -0.85, z: 0.45 }, "#chapter-1");

    scrub(look.current, { x: -5, y: -1.2, z: 5, immediateRender: false }, "#chapter-2");
    scrub(rot.current, { y: deg(280), immediateRender: false }, "#chapter-2");
    gsap.fromTo(
      scale.current,
      { x: 1, y: 1, z: 1 },
      {
        x: 0.7,
        y: 0.7,
        z: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: "#chapter-2",
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      }
    );

    scrub(look.current, { x: -0.6, y: 1.05, z: 5, immediateRender: false }, "#chapter-3");
    scrub(pos.current, { x: 1, immediateRender: false }, "#chapter-3");
    scrub(rot.current, { y: deg(340), immediateRender: false }, "#chapter-3");

    scrub(look.current, { x: 0, y: -1.2, z: 5, immediateRender: false }, "#chapter-4");
    scrub(rot.current, { y: deg(420), immediateRender: false }, "#chapter-4");
    scrub(pos.current, { x: -0.2, z: 3, delay: 0.2, immediateRender: false }, "#chapter-4");
    scrub(scale.current, { x: 0.4, y: 0.4, z: 0.4, immediateRender: false }, "#chapter-4");

    scrub(look.current, { x: 4, y: -4.25, z: -1.65, immediateRender: false }, "#chapter-5");
    scrub(rot.current, { y: deg(480), immediateRender: false }, "#chapter-5");
    scrub(pos.current, { x: 0, z: 0, immediateRender: false }, "#chapter-5");

    scrub(rot.current, { x: deg(15), immediateRender: false }, "#last-section");
    scrub(pos.current, { x: -0.2, y: 0.3, z: 2, immediateRender: false }, "#last-section");

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(t);
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.lerp(pos.current, 0.08);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rot.current.x, 0.08);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, rot.current.y, 0.08);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, rot.current.z, 0.08);
    g.scale.lerp(scale.current, 0.08);
    const local = look.current.clone();
    g.updateMatrixWorld(true);
    g.worldToLocal(local);
    targetRef.current.position.lerp(local, 0.08);
  });

  return (
    <group ref={groupRef} rotation={[0, deg(220), 0]} scale={[1, 1, 1]}>
      <primitive object={targetRef.current} />
      <spotLight
        target={targetRef.current}
        position={[0, 1.1, -1.2]}
        angle={Math.PI / 12}
        penumbra={0.6}
        intensity={40}
        distance={3}
        color="#ff6222"
        castShadow
      />
      <spotLight
        position={[-2.5, 1, 0]}
        angle={Math.PI / 3}
        intensity={20}
        distance={4}
        color="#e0e0e0"
        castShadow
      />
      <WarriorModel position={[-0.8, 0, 0]} rotation={[0, 0, 0]} scale={1.2} />
    </group>
  );
}

function HistoryCanvas() {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setSmall(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="history-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, small ? 5 : 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        <Environment preset="night" />
        <ambientLight color="#ffffff" intensity={0.8} />
        <directionalLight position={[0, 2, 4]} intensity={1.2} color="#ffffff" />
        <Suspense fallback={null}>
          <WarriorScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function HistoryScrollHint({ hidden }: { hidden: boolean }) {
  return (
    <div className={`history-scroll ${hidden ? "is-hidden" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 40 64" width="28" height="48" fill="none">
        <path
          d="M20 2 L32 9 L32 23 L20 30 L8 23 L8 9 Z"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
        />
        <path
          className="history-scroll__beam"
          d="M20 2 L8 9 L8 23 L20 30 L20 60"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="history-scroll__beam"
          d="M20 2 L32 9 L32 23 L20 30 L20 60"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span>Scroll Down</span>
    </div>
  );
}

function ChapterIcon() {
  return (
    <svg className="history-chapter__icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <polygon
        points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5"
        stroke="currentColor"
        strokeWidth="6"
        opacity="0.5"
      />
      <polygon points="50,35 63,42.5 63,57.5 50,65 37,57.5 37,42.5" fill="currentColor" />
    </svg>
  );
}

export function History() {
  const chaptersRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lastRef = useRef<HTMLElement>(null);
  const lastInnerRef = useRef<HTMLDivElement>(null);
  const [hintHidden, setHintHidden] = useState(false);
  const { lenis } = useLenis();

  // Mildly slower page scroll on History only (paragraphs stay readable)
  useEffect(() => {
    if (!lenis) return;
    const prev = {
      duration: lenis.options.duration,
      wheelMultiplier: lenis.options.wheelMultiplier,
      touchMultiplier: lenis.options.touchMultiplier,
    };
    lenis.options.duration = 1.45;
    lenis.options.wheelMultiplier = 0.9;
    lenis.options.touchMultiplier = 1.35;
    return () => {
      lenis.options.duration = prev.duration;
      lenis.options.wheelMultiplier = prev.wheelMultiplier;
      lenis.options.touchMultiplier = prev.touchMultiplier;
    };
  }, [lenis]);

  useGSAP(
    () => {
      const root = chaptersRef.current;
      if (!root) return;

      root.querySelectorAll<HTMLElement>(".chapter-section").forEach((section) => {
        const card = section.querySelector<HTMLElement>(".chapter-card");
        if (!card) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 12%",
              end: "top -50%",
              scrub: 1,
            },
          })
          .fromTo(
            card,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" }
          )
          .to(card, { opacity: 1, y: 0, duration: 4.5 })
          .to(card, { opacity: 0, y: -40, duration: 0.8, ease: "power1.in" });
      });
    },
    { scope: chaptersRef }
  );

  useGSAP(
    () => {
      if (!heroRef.current || !heroTitleRef.current) return;
      gsap.to(heroTitleRef.current, {
        opacity: 0,
        y: -30,
        ease: "power1.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "15% top",
          scrub: true,
        },
      });
    },
    { scope: heroRef }
  );

  useGSAP(
    () => {
      if (!lastRef.current || !lastInnerRef.current) return;
      gsap.to(lastInnerRef.current, {
        opacity: 0,
        y: -30,
        ease: "power1.out",
        scrollTrigger: {
          trigger: lastRef.current,
          start: "bottom bottom",
          end: "bottom 50%",
          scrub: true,
        },
      });
    },
    { scope: lastRef }
  );

  useEffect(() => {
    const onScroll = () => setHintHidden(window.scrollY > window.innerHeight * 0.2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="history-page">
      <HistoryCanvas />
      <HistoryScrollHint hidden={hintHidden} />

      <div className="history-content">
        <section ref={heroRef} id="hero-section" className="history-hero">
          <div className="history-hero__inner">
            <h1 ref={heroTitleRef} className="history-hero__title">
              The {brand.name}
            </h1>
          </div>
        </section>

        <div ref={chaptersRef} className="history-chapters">
          {CHAPTERS.map((chapter, index) => {
            const num = String(index + 1).padStart(2, "0");
            const alignEnd = index % 2 === 1;
            return (
              <section
                key={chapter.title}
                id={`chapter-${index + 1}`}
                className="chapter-section"
              >
                <article
                  className={`chapter-card ${alignEnd ? "chapter-card--end" : "chapter-card--start"}`}
                >
                  <div className="history-chapter__media">
                    <img src={chapter.image} alt="" />
                  </div>
                  <div className="history-chapter__label">
                    <ChapterIcon />
                    <span>CHAPTER {num}</span>
                  </div>
                  <h2>{chapter.title}</h2>
                  <div className="history-chapter__rule" />
                  <p>{chapter.desc}</p>
                </article>
              </section>
            );
          })}
        </div>

        <section ref={lastRef} id="last-section" className="history-legacy">
          <div ref={lastInnerRef} className="history-legacy__inner">
            <h2>The {brand.name} Legacy</h2>
            <p>Echoes carried through generations</p>
          </div>
        </section>
      </div>
    </div>
  );
}
