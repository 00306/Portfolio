import type { Decision } from "../../../components/DecisionList";

const IOS_PR = "https://github.com/temp-pj/temp-iOS/pull";
const SERVER_PR = "https://github.com/temp-pj/temp-ws/pull";

export const IOS_DECISIONS: Decision[] = [
  {
    title: "게임 상태 기계 분리",
    problem:
      "게임 규칙을 담당하는 GameReducer가 서버 연결 · 연결 상태까지 맡고, 방 이벤트까지 게임 메시지에 섞이기 시작함",
    judgment:
      "GameReducer를 서버 · 소켓 의존 없는 순수 FSM으로 분리하고, 서버 통신은 delegate로 RoomReducer에 위임",
    result: "Game 테스트 6개는 mock 없이, Room 테스트 11개는 Client mock으로 검증",
    linkLabel: "PR #19",
    href: `${IOS_PR}/19`,
  },
  {
    title: "Client 계층 분리",
    problem:
      "Feature가 Client 구현에 직접 의존하면 실행 환경과 테스트 환경을 나눌 수 없고, 전송 기술인 WebSocket이 도메인 Client와 같은 계층에 혼재",
    judgment:
      "모든 Client를 Interface · Live · Test 모듈로 분리해 Feature는 Interface에만 의존, WebSocket은 도메인 Client 하위 계층으로 이동",
    result: "Client 6개의 구조 통일, Feature 수정 없이 Live · Test 구현 교체",
    linkLabel: "PR #5 ~ #13",
    href: `${IOS_PR}/5`,
  },
  {
    title: "연결 상태를 이벤트 스트림으로 통합",
    problem:
      "connect 호출이 끝나면 연결된 것으로 처리해 실제 연결 시점과 어긋나고, 끊긴 이유도 구분 불가",
    judgment:
      "연결 성공은 URLSessionWebSocketDelegate로, 끊김은 수신 에러로 감지해 서버 메시지와 같은 이벤트 스트림으로 전달",
    result:
      "연결 상태가 실제 연결 시점과 일치, 정상 종료와 네트워크 오류 구분, 상위 Reducer는 스트림 하나만 처리",
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
