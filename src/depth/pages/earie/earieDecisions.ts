import type { Decision } from "../../../components/DecisionList";

const IOS_PR = "https://github.com/temp-pj/temp-iOS/pull";
const SERVER_PR = "https://github.com/temp-pj/temp-ws/pull";

export const IOS_DECISIONS: Decision[] = [
  {
    title: "게임 상태 기계 분리",
    problem:
      "게임 규칙과 서버 통신이 한 Reducer에 섞이면, 실제 소켓 없이는 규칙 검증 불가",
    judgment:
      "GameReducer를 외부 의존 없는 순수 FSM으로 분리하고, 서버 통신은 delegate로 RoomReducer에 위임",
    result: "Room 11개 · Game 6개 테스트를 소켓 없이 실행",
    linkLabel: "PR #19",
    href: `${IOS_PR}/19`,
  },
  {
    title: "Client 계층 분리",
    problem:
      "Feature가 Client 구현에 직접 의존하면 테스트에서 네트워크 · MusicKit 회피 불가, 전송 기술인 WebSocket이 도메인 Client와 같은 계층에 혼재",
    judgment:
      "모든 Client를 Interface · Live · Test 모듈로 분리해 Feature는 Interface에만 의존, WebSocket은 도메인 Client 하위 계층으로 이동",
    result: "Client 6개의 구조 통일, Feature 수정 없이 Live · Test 구현 교체",
    linkLabel: "PR #11",
    href: `${IOS_PR}/11`,
  },
  {
    title: "단일 이벤트 스트림 통합",
    problem:
      "WebSocket 연결에 여러 작업이 동시에 접근하고, 연결 상태 변화와 서버 메시지가 서로 다른 경로로 유입",
    judgment:
      "연결을 actor로 감싸 여러 작업이 한 번에 하나씩만 접근하도록 하고, 연결 상태 변화를 서버 메시지와 같은 이벤트 스트림으로 통합",
    result: "상위 Reducer가 이벤트 출처 구분 없이 스트림 하나만 처리",
    linkLabel: "PR #19",
    href: `${IOS_PR}/19`,
  },
];

export const SERVER_DECISIONS: Decision[] = [
  {
    title: "channel 기반 Room 동시성 제어",
    problem:
      "연결 · 라운드 타이머 · 곡 조회가 각자 다른 goroutine에서 같은 방 상태에 동시 접근",
    judgment:
      "Room마다 하나의 goroutine만 상태를 바꿀 수 있게 하고, 다른 작업은 channel로 변경을 요청해 순서대로 처리, 읽기 위주인 Hub에만 RWMutex 사용",
    result: "lock 없이 Room 상태 경합 제거",
    linkLabel: "PR #12",
    href: `${SERVER_PR}/12`,
  },
  {
    title: "글자 카드 더미 생성",
    problem: "더미가 부자연스럽거나 패턴이 보이면 정답 역추론 가능",
    judgment:
      "자모 분해 방식 대신 논문 근거의 고빈도 음절 풀에 저빈도 풀을 섞어 더미 구성",
    result: "정답 글자와 섞여도 눈에 띄지 않는, 실제 음절 빈도를 따르는 더미",
    linkLabel: "PR #14",
    href: `${SERVER_PR}/14`,
  },
  {
    title: "정답 판정 서버 위임",
    problem:
      "정답을 클라이언트에 보내 로컬에서 판정하면 메모리에서 정답 유출 가능",
    judgment:
      "클라이언트는 답 제출만, 판정은 서버가 수행해 결과를 모든 기기에 전달",
    result:
      "정답이 클라이언트에 전달되지 않음, 모든 기기가 같은 판정 수신, 클라이언트 상태 기계 단순화",
    linkLabel: "iOS PR #15",
    href: `${IOS_PR}/15`,
  },
];
