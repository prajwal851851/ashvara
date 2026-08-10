import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Wellness } from "./pages/Wellness";
import { Dining } from "./pages/Dining";
import { About } from "./pages/About";
import { Rooms } from "./pages/Rooms";
import { Gallery } from "./pages/Gallery";

const History = lazy(() =>
  import("./pages/History").then((m) => ({ default: m.History }))
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wellness" element={<Wellness />} />
          <Route path="dining" element={<Dining />} />
          <Route path="about" element={<About />} />
          <Route
            path="history"
            element={
              <Suspense
                fallback={
                  <div
                    className="history-page"
                    style={{ minHeight: "100dvh", background: "#000" }}
                  />
                }
              >
                <History />
              </Suspense>
            }
          />
          <Route path="rooms" element={<Rooms />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
