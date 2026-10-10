import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "@fontsource/inter/700.css";
import "pretendard/dist/web/static/pretendard-dynamic-subset.css";
import { isCanvasTooSmall } from "./effects/canvasFrame";
import MobileNotice from "./mobile/MobileNotice";

const root = createRoot(document.getElementById("root")!);

if (isCanvasTooSmall()) {
  root.render(
    <StrictMode>
      <MobileNotice />
    </StrictMode>
  );
} else {
  import("./App.tsx").then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}
