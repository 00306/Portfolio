import { WaterRippleEffect } from "./effects/WaterRippleEffect";
import { SECTIONS } from "./sections/sections";
import { useDepth } from "./depth/useDepth";
import { useWheelPaging } from "./navigation/useWheelPaging";
import { DEPTH_PAGES } from "./depth/DepthPages";
import "./styles/App.css";
import "./styles/depth.css";

function App() {
  const depth = useDepth();
  useWheelPaging();
  const DepthPage = depth.topId ? DEPTH_PAGES[depth.topId] : null;
  const surface = depth.surfacePhase;

  return (
    <>
      <WaterRippleEffect
        submerged={
          surface === "suspended" || surface === "open" || surface === "exiting"
        }
        plunging={surface === "entering"}
        depthPhase={surface}
      />

      <main
        className={`snap-container${
          depth.phase !== "idle" ? " is-submerged" : ""
        }`}
        data-depth={surface}
        onAnimationEnd={(event) => {
          if (event.animationName === "surface-fade") depth.settle();
        }}
      >
        {SECTIONS.map(({ id, Component }) => (
          <div key={id} className="snap-slot" data-section={id}>
            <Component onDescend={depth.enter} />
          </div>
        ))}
      </main>

      {DepthPage && (
        <div key={depth.topId} className="depth-layer" data-phase={depth.phase}>
          <DepthPage
            onExit={depth.exit}
            onDescend={depth.enter}
            phase={depth.phase}
          />
        </div>
      )}

      <div
        className="depth-blackout"
        data-phase={depth.phase}
        onAnimationEnd={(event) => {
          if (event.animationName === "blackout-in") depth.settle();
        }}
      />
    </>
  );
}

export default App;
