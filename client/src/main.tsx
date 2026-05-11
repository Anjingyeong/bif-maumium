import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { migrateSessionConsent } from "./lib/history";

// sessionStorage 동의 기록을 localStorage로 마이그레이션 (한 번만 실행)
migrateSessionConsent();

createRoot(document.getElementById("root")!).render(<App />);
