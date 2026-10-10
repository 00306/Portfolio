import "../../../styles/earieOverview.css";

interface OverviewBox {
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  planned?: boolean;
  small?: boolean;
}

const BOX_WIDTH = 100;
const BOX_HEIGHT = 28;

const CHILD_FEATURES: OverviewBox[] = [
  { name: "Login", x: 110, y: 158, height: 46, planned: true },
  { name: "Lobby", x: 222, y: 158, height: 46, planned: true },
];

const CLIENTS: OverviewBox[] = [
  { name: "Auth", x: 110, y: 256, planned: true },
  { name: "Room", x: 222, y: 256, planned: true },
  { name: "RoomSession", x: 110, y: 290 },
  { name: "Audio", x: 222, y: 290 },
  { name: "MusicEntitlement", x: 334, y: 290, small: true },
  { name: "WebSocket", x: 110, y: 336 },
];

function Box({ box }: { box: OverviewBox }) {
  const width = box.width ?? BOX_WIDTH;
  const height = box.height ?? BOX_HEIGHT;
  return (
    <g>
      <rect
        className={`earie-overview-box${box.planned ? " is-planned" : ""}`}
        x={box.x}
        y={box.y}
        width={width}
        height={height}
        rx={9}
      />
      <text
        className={`earie-overview-box-name${box.small ? " is-small" : ""}${
          box.planned ? " is-planned" : ""
        }`}
        x={box.x + width / 2}
        y={box.y + height / 2 + 4.5}
        textAnchor="middle"
      >
        {box.name}
      </text>
    </g>
  );
}

export function EarieIosOverview() {
  return (
    <svg
      className="earie-overview"
      viewBox="0 0 460 440"
      role="img"
      aria-labelledby="earieIosOverviewTitle earieIosOverviewDesc"
    >
      <title id="earieIosOverviewTitle">Earie iOS 구조</title>
      <desc id="earieIosOverviewDesc">
        MGAMEApp이 루트 Reducer인 AppFeature로 Store를 만들고,
        withDependencies로 각 Client의 .live 구현을 주입한다. AppFeature는
        ifLet으로 하위 Reducer를 합성하며, Room은 다시 Game을 품는다. Login과
        Lobby는 아직 구현되지 않았다. Reducer는 Client를 @Dependency로 꺼내
        쓴다. Client마다 Interface, Live, Test 모듈로 나뉘며, Auth와 Room
        Client는 Live 구현이 비어 있다. RoomSession은 하위 Client인 WebSocket을
        @Dependency로 써서 Go 서버와 통신하고, Audio와 MusicEntitlement는
        MusicKit으로 Apple Music과 통신한다. Models와 디자인 시스템 MDS는 모든
        모듈이 함께 쓰며, MDS는 아직 구현되지 않았다.
      </desc>

      <defs>
        <marker
          id="earieIosArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path className="earie-overview-arrow-head" d="M2 1L8 5L2 9" />
        </marker>
      </defs>

      <rect
        className="earie-overview-boundary"
        x="10"
        y="12"
        width="440"
        height="372"
        rx="16"
      />
      <text className="earie-overview-caption" x="26" y="34">
        iOS App
      </text>

      <rect
        className="earie-overview-box is-planned"
        x="372"
        y="25"
        width="16"
        height="11"
        rx="3"
      />
      <text className="earie-overview-caption" x="394" y="34">
        미구현
      </text>

      <rect
        className="earie-overview-box"
        x="26"
        y="44"
        width="408"
        height="34"
        rx="12"
      />
      <text className="earie-overview-box-name" x="44" y="66">
        MGAMEApp
      </text>

      <line
        className="earie-overview-arrow"
        x1="271"
        y1="80"
        x2="271"
        y2="98"
        markerEnd="url(#earieIosArrow)"
      />

      <rect
        className="earie-overview-group"
        x="26"
        y="100"
        width="76"
        height="272"
        rx="12"
      />
      <text
        className="earie-overview-section-name is-small"
        x="64"
        y="120"
        textAnchor="middle"
      >
        Shared
      </text>
      <rect
        className="earie-overview-box"
        x="34"
        y="132"
        width="60"
        height="28"
        rx="8"
      />
      <text
        className="earie-overview-box-name is-small"
        x="64"
        y="150"
        textAnchor="middle"
      >
        Models
      </text>
      <rect
        className="earie-overview-box is-planned"
        x="34"
        y="168"
        width="60"
        height="40"
        rx="8"
      />
      <text
        className="earie-overview-box-name is-small is-planned"
        x="64"
        y="185"
        textAnchor="middle"
      >
        MDS
      </text>
      <text
        className="earie-overview-tiny-caption"
        x="64"
        y="199"
        textAnchor="middle"
      >
        디자인 시스템
      </text>

      <rect
        className="earie-overview-group"
        x="106"
        y="100"
        width="332"
        height="110"
        rx="12"
      />
      <text className="earie-overview-section-name" x="114" y="117">
        Feature
      </text>
      <text className="earie-overview-caption" x="168" y="117">
        TCA
      </text>

      <rect
        className="earie-overview-box"
        x="110"
        y="123"
        width="324"
        height="24"
        rx="8"
      />
      <text
        className="earie-overview-box-name is-small"
        x="272"
        y="139"
        textAnchor="middle"
      >
        AppFeature
      </text>

      <line className="earie-overview-link" x1="160" y1="147" x2="160" y2="158" />
      <line className="earie-overview-link" x1="272" y1="147" x2="272" y2="158" />
      <line className="earie-overview-link" x1="384" y1="147" x2="384" y2="158" />
      {CHILD_FEATURES.map((box) => (
        <Box key={`feature-${box.name}`} box={box} />
      ))}

      <rect
        className="earie-overview-box"
        x="334"
        y="158"
        width="100"
        height="46"
        rx="9"
      />
      <text
        className="earie-overview-box-name"
        x="384"
        y="174"
        textAnchor="middle"
      >
        Room
      </text>
      <rect
        className="earie-overview-box"
        x="346"
        y="180"
        width="76"
        height="18"
        rx="6"
      />
      <text
        className="earie-overview-box-name is-small"
        x="384"
        y="193"
        textAnchor="middle"
      >
        Game
      </text>

      <line
        className="earie-overview-arrow"
        x1="271"
        y1="212"
        x2="271"
        y2="230"
        markerEnd="url(#earieIosArrow)"
      />
      <text className="earie-overview-caption" x="281" y="225">
        @Dependency
      </text>

      <rect
        className="earie-overview-group"
        x="106"
        y="232"
        width="332"
        height="140"
        rx="12"
      />
      <text className="earie-overview-section-name" x="114" y="249">
        Client
      </text>
      <text className="earie-overview-caption" x="160" y="249">
        Client마다 Interface · Live · Test 모듈
      </text>
      {CLIENTS.map((box) => (
        <Box key={`client-${box.name}`} box={box} />
      ))}

      <line
        className="earie-overview-arrow"
        x1="160"
        y1="318"
        x2="160"
        y2="334"
        markerEnd="url(#earieIosArrow)"
      />
      <text className="earie-overview-caption" x="168" y="330">
        @Dependency
      </text>

      <line className="earie-overview-link" x1="160" y1="364" x2="160" y2="398" />
      <rect
        className="earie-overview-service"
        x="106"
        y="398"
        width="140"
        height="30"
        rx="15"
      />
      <text
        className="earie-overview-service-name"
        x="176"
        y="418"
        textAnchor="middle"
      >
        Go Server
      </text>

      <line className="earie-overview-link" x1="272" y1="318" x2="272" y2="398" />
      <line className="earie-overview-link" x1="384" y1="318" x2="384" y2="398" />
      <rect
        className="earie-overview-service"
        x="262"
        y="398"
        width="176"
        height="30"
        rx="15"
      />
      <text
        className="earie-overview-service-name"
        x="350"
        y="418"
        textAnchor="middle"
      >
        Apple Music · MusicKit
      </text>
    </svg>
  );
}
