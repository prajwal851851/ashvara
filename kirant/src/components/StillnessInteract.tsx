import { useState } from "react";
import { Link } from "react-router-dom";
import { brand } from "../data/brand";
import "./StillnessInteract.css";

const PANELS = [
  {
    id: "breath",
    label: "Breath",
    title: "Mountain air rituals",
    copy: "Slow the pulse with guided stillness framed by ridge light and pine.",
    image: "/images/ashvara/meditation.jpg",
  },
  {
    id: "touch",
    label: "Touch",
    title: "Herbal body therapies",
    copy: "Warm botanicals and skilled hands restore what the journey takes away.",
    image: "/images/wellness/wellness-image-9.webp",
  },
  {
    id: "water",
    label: "Water",
    title: "Thermal quiet",
    copy: "Steam, stone, and clear mountain water — a private reset between peaks.",
    image: "/images/wellness/spa-room-2.webp",
  },
] as const;

/** Interactive wellness chapter — expand panels instead of a flat banner */
export function StillnessInteract() {
  const [active, setActive] = useState(0);

  return (
    <section className="stillness" aria-label={`${brand.name} wellness`}>
      <div className="stillness__head">
        <p className="stillness__eyebrow">Wellness</p>
        <h2 className="stillness__title">
          Find your
          <br />
          stillness
        </h2>
        <p className="stillness__hint"></p>
      </div>

      <div
        className="stillness__panels"
        onMouseLeave={() => setActive(0)}
      >
        {PANELS.map((panel, i) => {
          const isOn = active === i;
          return (
            <button
              key={panel.id}
              type="button"
              className={`stillness__panel${isOn ? " is-active" : ""}`}
              aria-pressed={isOn}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <img
                src={panel.image}
                alt=""
                className="stillness__panel-img"
                draggable={false}
              />
              <div className="stillness__panel-shade" />
              <div className="stillness__panel-body">
                <span className="stillness__panel-label">{panel.label}</span>
                <h3 className="stillness__panel-title">{panel.title}</h3>
                <p className="stillness__panel-copy">{panel.copy}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="stillness__foot">
        <Link to="/wellness" className="stillness__cta">
          Enter the spa
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
