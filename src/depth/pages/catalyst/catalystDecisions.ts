import type { Decision } from "../../../components/DecisionList";

export const CORE_DECISIONS: Decision[] = [
  {
    title: "연구실 환경에 맞춘 Python 전환",
    problem:
      "연구실 PC와 장비가 모두 Windows 환경이라 iOS가 들어갈 수 없고, Swift로는 데이터 읽기와 신호 연산을 전부 직접 구현해야 함",
    judgment:
      "iOS 대신 Windows에서 바로 동작하고 데이터 · 연산 라이브러리가 갖춰진 Python 데스크톱 앱으로 전환",
    result:
      "rainbow-api로 장비의 .ch 데이터를 바로 읽고 NumPy · SciPy로 연산, Windows · macOS에 배포",
    linkLabel: "layer 3",
    depthId: "catalyst-runtime",
  },
  {
    title: "앱과 웹뷰 사이의 경계 처리",
    problem:
      "회전하며 보는 3D 그래프와 축 라벨 · 눈금 · 테마를 함께 갖춘 라이브러리는 웹 기반의 Plotly였고, 웹뷰는 앱과 분리된 프로세스라 IPC로만 데이터 전달 가능",
    judgment:
      "Plotly를 앱 안의 웹뷰로 띄우고, 스크립트 번들 · 임시 파일 로드 · 로드 후 데이터 주입 · QWebChannel 브리지로 앱 ↔ 웹 통로를 직접 설계",
    result:
      "오프라인과 IPC URL 길이 제한 속에서도 3D 그래프 렌더링, 대신 앱 무게와 임시 파일 관리를 감수",
    linkLabel: "layer 3",
    depthId: "catalyst-webview",
  },
];
