import type { Decision } from "../../../components/DecisionList";

const PR_URL = "https://github.com/motive-Prelude/Prelude-iOS/pull";

export const CORE_DECISIONS: Decision[] = [
  {
    title: "TCA 기반 리팩토링",
    judgment: "MVVM에서 상태 변경을 Reducer로 모으는 TCA로 전환",
    problem: "MVVM에서 View가 여러 매니저에 직접 의존해 상태 변경이 흩어짐",
    result:
      "Login · Main · Onboarding · Purchase · Setting 5개 기능을 각각 Reducer로 나눠 상태가 바뀌는 경로가 하나로",
    linkLabel: "#40",
    href: `${PR_URL}/40`,
  },
  {
    title: "계층별 에러 처리 설계",
    judgment:
      "계층 경계마다 에러를 상위 타입으로 변환하고, 최종 DomainError만 EventBus로 전달",
    problem: "Presentation 계층이 하위 계층의 에러 타입 5종을 모두 알아야 함",
    result:
      "Presentation 계층은 DomainError 하나만 다루고, 새 에러는 변환 한 곳에서 대응",
    linkLabel: "#24",
    href: `${PR_URL}/24`,
  },
  {
    title: "다중 저장소 동기화 전략",
    judgment: "Firestore를 기준으로, Write Through로 나머지 저장소에 함께 반영",
    problem:
      "SwiftData · iCloud · Firestore 3곳의 사용자 정보가 어긋날 수 있음",
    result:
      "어느 값이 맞는지의 기준이 Firestore 하나로 정해짐",
    linkLabel: "#20",
    href: `${PR_URL}/20`,
  },
  {
    title: "디자인 확장에 대응하는 버튼 컴포넌트 설계",
    judgment:
      "디자이너가 정의한 다섯 속성을 그대로 코드 구조로 옮기고, 그 조합으로 스타일을 찾게 함",
    problem: "디자인이 진행되며 버튼 변형이 계속 늘어남",
    result:
      "새 버튼 대부분은 기존 조합만으로 대응, 26가지를 ButtonStyle 하나로 표현",
    linkLabel: "#14",
    href: `${PR_URL}/14`,
  },
];
