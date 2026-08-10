import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Reveal, ClipReveal } from "../components/Reveal";
import { ScrollHint } from "../components/ScrollHint";
import { brand } from "../data/brand";
import "./Rooms.css";

const ROOMS = [
  {
    title: "Single Bed Room",
    description:
      "A cozy, light-filled retreat tailored for solo travelers, featuring a plush single bed, curated modern amenities, and a peaceful garden view.",
    image: "/images/ashvara/rooms/single.jpg",
    price: "$149",
  },
  {
    title: "Double Bed Room",
    description:
      "A spacious, sophisticated sanctuary featuring a premium double bed, curated bespoke furnishings, and tranquil mountain vistas.",
    image: "/images/ashvara/rooms/double.jpg",
    price: "$189",
  },
  {
    title: "Twin Bed Room",
    description:
      "An elegant and airy room configured with two comfortable twin beds, ideal for sharing with friends or family while enjoying beautiful alpine views.",
    image: "/images/ashvara/rooms/twin.jpg",
    price: "$199",
  },
  {
    title: "King/Queen Room",
    description:
      "A majestic retreat offering a grand plush king or queen bed, customized ambient lighting, and a sophisticated lounge seating area.",
    image: "/images/ashvara/rooms/king.jpg",
    price: "$229",
  },
  {
    title: "Double Bed Suite",
    description:
      "An expansive luxury suite featuring two premium double beds, a separate elegant living area, marble bathroom, and scenic balcony views.",
    image: "/images/ashvara/rooms/suite.jpg",
    price: "$389",
  },
  {
    title: "Rooftop Suite",
    description:
      "Our crown jewel summit sanctuary, boasting an expansive private rooftop terrace, soaring floor-to-ceiling panoramic glass walls, and custom fire-pit lounging.",
    image: "/images/ashvara/rooms/rooftop.jpg",
    price: "$500",
  },
];

export function Rooms() {
  const [hintHidden, setHintHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHintHidden(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <img
          className="rooms-hero__image"
          src="/images/ashvara/rooms/hero.jpg"
          alt={`Luxury suite interior at ${brand.name}`}
        />
        <div className="rooms-hero__overlay" />
        <motion.div
          className="rooms-hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <h1>
            A Sanctuary of
            <br />
            Quiet Luxury.
          </h1>
          <p>
            Retreat to beautifully crafted rooms designed for quiet comfort, where
            warm natural textures and simple elegance create a peaceful sanctuary.
          </p>
          <Button href="#rooms-grid" variant="outline-gold">
            Reserve Now
          </Button>
        </motion.div>

        <div className="rooms-hero__info">
          <div>
            <p className="rooms-hero__info-label">Check-In / Out</p>
            <p>
              {brand.checkIn} / {brand.checkOut}
            </p>
          </div>
          <div>
            <p className="rooms-hero__info-label">Customer Support</p>
            <p>
              <a href={brand.phoneHref}>{brand.supportPhone}</a>
            </p>
          </div>
          <div>
            <p className="rooms-hero__info-label">Hotel Location</p>
            <p>{brand.location}</p>
          </div>
        </div>
        <ScrollHint hidden={hintHidden} />
      </section>

      <section id="rooms-grid" className="section rooms-grid-wrap">
        <div className="container rooms-grid">
          {ROOMS.map((room, i) => (
            <Reveal key={room.title} delay={i * 0.06} className="room-card">
              <h2 className="gold-text">{room.title}</h2>
              <p>{room.description}</p>
              <ClipReveal>
                <img src={room.image} alt={room.title} />
              </ClipReveal>
              <p className="room-card__price gold-text">{room.price} / night</p>
              <Button variant="outline-gold" fullWidth>
                Reserve Now
              </Button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section rooms-discover">
        <div className="container rooms-discover__grid">
          <Reveal>
            <h2 className="gold-text">Discover Refined Luxury</h2>
            <p>
              Immerse yourself in a curated environment of absolute elegance. Every
              corner of our resort is meticulously crafted to blend world-class
              contemporary design with the raw majesty of our alpine setting.
            </p>
            <p>
              This elegant retreat is thoughtfully composed to satisfy the senses.
              From bespoke furnishings to curated amenities, experience a seamless
              connection between inner comfort and natural grandeur.
            </p>
          </Reveal>
          <div className="rooms-discover__media">
            <ClipReveal>
              <img src="/images/ashvara/rooms/luxury-1.jpg" alt="Refined lounge seating" />
            </ClipReveal>
            <ClipReveal>
              <img src="/images/ashvara/rooms/luxury-2.jpg" alt="Luxury interior detail" />
            </ClipReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
