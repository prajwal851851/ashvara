import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Float,
  Sparkles,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "../data/brand";
import { useLenis } from "../hooks/useLenis";
import "./History.css";

gsap.registerPlugin(ScrollTrigger);

const deg = (n: number) => (Math.PI / 180) * n;
const SCENE_BG = "#1c1710";
/**
 * Photoreal sculpted animal (project GLB). Swap this path if you drop in
 * another species e.g. `/models/snow-leopard.glb`.
 */
const ANIMAL_URL = "/models/warrior-transformed.glb";

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

/** Real textured animal GLB — sculpted mesh, not cartoon primitives */
function GuardianAnimal() {
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(ANIMAL_URL);
  const skinned = useMemo(() => cloneSkinned(scene), [scene]);
  const { actions } = useAnimations(animations, root);

  useEffect(() => {
    skinned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (!m) return;
          m.side = THREE.FrontSide;
          if ("envMapIntensity" in m) {
            (m as THREE.MeshStandardMaterial).envMapIntensity = 0.85;
          }
          if ("roughness" in m) {
            const std = m as THREE.MeshStandardMaterial;
            // Keep PBR readable under our warm key lights
            std.roughness = THREE.MathUtils.clamp(std.roughness ?? 0.55, 0.35, 0.9);
            std.metalness = THREE.MathUtils.clamp(std.metalness ?? 0.15, 0, 0.45);
            std.needsUpdate = true;
          }
        });
      }
    });
  }, [skinned]);

  useEffect(() => {
    const clips = Object.values(actions).filter(Boolean);
    const idle = actions.Survey ?? actions.Idle ?? actions.Walk ?? clips[0];
    idle?.reset().fadeIn(0.45).play();
    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions]);

  useFrame((state) => {
    if (!root.current) return;
    // Subtle breath so a static sculpt still feels alive
    const t = state.clock.elapsedTime;
    root.current.position.y = Math.sin(t * 0.7) * 0.03;
  });

  return (
    <Float speed={0.7} rotationIntensity={0.03} floatIntensity={0.08}>
      <group position={[0, -0.5, 0]}>
        <Center disableY>
          <group ref={root} rotation={[0, deg(-20), 0]} scale={1.25}>
            <primitive object={skinned} />
          </group>
        </Center>
        <mesh rotation={[Math.PI / 2.2, 0.12, 0]} position={[0, -0.2, 0]}>
          <torusGeometry args={[1.7, 0.014, 12, 96]} />
          <meshStandardMaterial
            color="#fff1c2"
            emissive="#c9a84c"
            emissiveIntensity={0.65}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
        <Sparkles
          count={22}
          scale={[3.4, 2.2, 3.4]}
          size={2}
          speed={0.2}
          opacity={0.45}
          color="#ffe6a8"
        />
      </group>
    </Float>
  );
}

useGLTF.preload(ANIMAL_URL);

function PointerParallax({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.28;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.14;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.current.x,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      target.current.y,
      0.05
    );
  });

  return <group ref={group}>{children}</group>;
}

function GuardianScene() {
  const groupRef = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(0, 0.1, 0));
  const rot = useRef(new THREE.Euler(0, deg(12), 0));
  const scale = useRef(new THREE.Vector3(1.15, 1.15, 1.15));

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.copy(pos.current);
    g.rotation.copy(rot.current);
    g.scale.copy(scale.current);
  }, []);

  useGSAP(() => {
    pos.current.set(0, 0.1, 0);
    rot.current.set(0, deg(12), 0);
    scale.current.set(1.15, 1.15, 1.15);

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
          scrub: 1.1,
        },
      });
    };

    // Hero → chapter flow: stay large and readable
    scrub(pos.current, { y: 0.05, z: 0.35 }, "#hero-section", "top top", "bottom top");
    scrub(rot.current, { y: deg(28) }, "#hero-section", "top top", "bottom top");

    scrub(rot.current, { y: deg(55), x: deg(-6) }, "#chapter-1");
    scrub(pos.current, { x: 0.55, y: 0 }, "#chapter-1");

    scrub(rot.current, { y: deg(120), immediateRender: false }, "#chapter-2");
    scrub(pos.current, { x: -0.45, z: 0.2, immediateRender: false }, "#chapter-2");
    scrub(scale.current, { x: 1.05, y: 1.05, z: 1.05, immediateRender: false }, "#chapter-2");

    scrub(rot.current, { y: deg(200), immediateRender: false }, "#chapter-3");
    scrub(pos.current, { x: 0.4, y: 0.05, immediateRender: false }, "#chapter-3");

    scrub(rot.current, { y: deg(280), x: deg(4), immediateRender: false }, "#chapter-4");
    scrub(pos.current, { x: -0.25, z: 0.45, immediateRender: false }, "#chapter-4");
    scrub(scale.current, { x: 0.95, y: 0.95, z: 0.95, immediateRender: false }, "#chapter-4");

    scrub(rot.current, { y: deg(360), immediateRender: false }, "#chapter-5");
    scrub(pos.current, { x: 0, y: 0.12, z: 0.15, immediateRender: false }, "#chapter-5");
    scrub(scale.current, { x: 1.2, y: 1.2, z: 1.2, immediateRender: false }, "#chapter-5");

    scrub(rot.current, { y: deg(390), x: deg(-4), immediateRender: false }, "#last-section");
    scrub(pos.current, { x: 0, y: 0.2, z: 0.3, immediateRender: false }, "#last-section");

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
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.05} color="#fff4e0" />
      <hemisphereLight args={["#ffe8c8", "#1a1410", 1.2]} />
      <directionalLight
        position={[3.2, 4.5, 2.5]}
        intensity={2.8}
        color="#ffe2b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2.5, 2.2, -1.2]} intensity={1.35} color="#b8d0ff" />
      <spotLight
        position={[0.8, 3.4, 2.4]}
        angle={0.6}
        penumbra={0.55}
        intensity={32}
        distance={14}
        color="#ffc878"
        castShadow
      />
      <PointerParallax>
        <Suspense fallback={null}>
          <GuardianAnimal />
        </Suspense>
      </PointerParallax>
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.45}
        scale={8}
        blur={2.4}
        far={3.5}
        color="#0a0806"
      />
    </group>
  );
}

function HistoryCanvas({ onReady }: { onReady: () => void }) {
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
        camera={{ position: [0, 0.45, small ? 4.2 : 3.4], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.75]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.setClearColor(SCENE_BG, 1);
          onReady();
        }}
      >
        <color attach="background" args={[SCENE_BG]} />
        <fog attach="fog" args={[SCENE_BG, 8, 20]} />
        <GuardianScene />
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

function ChapterProgress({ active }: { active: number }) {
  return (
    <nav className="history-progress" aria-label="Chapter progress">
      {CHAPTERS.map((chapter, i) => (
        <a
          key={chapter.title}
          href={`#chapter-${i + 1}`}
          className={`history-progress__dot${active === i ? " is-active" : ""}${
            active > i ? " is-done" : ""
          }`}
          aria-label={`Chapter ${i + 1}: ${chapter.title}`}
          aria-current={active === i ? "true" : undefined}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
        </a>
      ))}
    </nav>
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
  const [activeChapter, setActiveChapter] = useState(-1);
  const [sceneReady, setSceneReady] = useState(false);
  const { lenis } = useLenis();

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

      root.querySelectorAll<HTMLElement>(".chapter-section").forEach((section, index) => {
        const card = section.querySelector<HTMLElement>(".chapter-card");
        const media = section.querySelector<HTMLElement>(".history-chapter__media img");
        if (!card) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 14%",
            end: "top -45%",
            scrub: 1.1,
          },
        });

        tl.fromTo(
          card,
          { opacity: 0, y: 56, rotateX: 6 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.85, ease: "power1.out" }
        )
          .to(card, { opacity: 1, y: 0, duration: 4.2 })
          .to(card, { opacity: 0, y: -36, duration: 0.75, ease: "power1.in" });

        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.12, yPercent: 6 },
            {
              scale: 1,
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      });
    },
    { scope: chaptersRef }
  );

  useGSAP(
    () => {
      if (!heroRef.current || !heroTitleRef.current) return;
      gsap.to(heroTitleRef.current, {
        opacity: 0,
        y: -36,
        letterSpacing: "0.28em",
        ease: "power1.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "18% top",
          scrub: true,
        },
      });
    },
    { scope: heroRef }
  );

  useGSAP(
    () => {
      if (!lastRef.current || !lastInnerRef.current) return;
      gsap.fromTo(
        lastInnerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: lastRef.current,
            start: "top 70%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
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
    // Safety: never leave the “warming” state forever
    const readyFallback = window.setTimeout(() => setSceneReady(true), 1800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(readyFallback);
    };
  }, []);

  return (
    <div className={`history-page${sceneReady ? " is-ready" : ""}`}>
      <div className="history-atmosphere" aria-hidden="true">
        <div className="history-atmosphere__glow" />
        <div className="history-atmosphere__mist" />
      </div>

      <HistoryCanvas onReady={() => setSceneReady(true)} />
      <HistoryScrollHint hidden={hintHidden} />
      <ChapterProgress active={activeChapter} />

      {!sceneReady && (
        <div className="history-boot" role="status" aria-live="polite">
          <span className="history-boot__mark" />
          <p>Opening the ridge…</p>
        </div>
      )}

      <div className="history-content">
        <section ref={heroRef} id="hero-section" className="history-hero">
          <div className="history-hero__inner">
            <p className="history-hero__eyebrow">Guardian of the ridge</p>
            <h1 ref={heroTitleRef} className="history-hero__title">
              The {brand.name}
            </h1>
            <p className="history-hero__sub">
              Scroll to walk five chapters of the mountain
            </p>
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
