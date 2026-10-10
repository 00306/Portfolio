import "../../../styles/systemOverview.css";

function Tag({
  x,
  y,
  width,
  label,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
}) {
  return (
    <>
      <rect
        className="system-overview-tag"
        x={x}
        y={y}
        width={width}
        height={26}
        rx={13}
      />
      <text
        className="system-overview-tag-text"
        x={x + width / 2}
        y={y + 18}
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
}

function Step({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <rect
        className="system-overview-step"
        x={x}
        y={y}
        width={110}
        height={40}
        rx={10}
      />
      <text
        className="system-overview-tag-text"
        x={x + 55}
        y={y + 25}
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  );
}

const ROOT_REDUCERS = [
  { name: "Session", x: 250 },
  { name: "Router", x: 336 },
  { name: "Toast", x: 422 },
];
const ROOT_REDUCER_WIDTH = 76;
const ROOT_REDUCER_Y = 88;
const APP_FEATURE_BOTTOM = { x: 355, y: 58 };

const DOMAIN_TAGS = [
  { name: "UseCase", y: 250 },
  { name: "Repository Protocol", y: 315 },
  { name: "ErrorMapper", y: 380 },
  { name: "UserSyncService", y: 445 },
  { name: "AuthFacade", y: 510 },
];
const USE_CASE_CENTER_Y = 263;
const REPOSITORY_PROTOCOL_CENTER_Y = 328;

const SERVICES = [
  { name: "SwiftData", x: 602, y: 442, width: 118 },
  { name: "iCloud", x: 730, y: 442, width: 118 },
  { name: "Firestore", x: 602, y: 490, width: 118 },
  { name: "Firebase Auth", x: 730, y: 490, width: 118 },
  { name: "Gemini (Cloud Functions)", x: 602, y: 538, width: 246 },
];

const INFRASTRUCTURE = [
  { name: "Apple Sign In", x: 170, width: 120 },
  { name: "Network Monitor", x: 302, width: 136 },
  { name: "Prompt Generator", x: 450, width: 140 },
  { name: "StoreKit Client", x: 602, width: 130 },
];

export function PreludeSystemOverview() {
  return (
    <svg
      className="system-overview"
      viewBox="0 0 860 740"
      role="img"
      aria-labelledby="systemOverviewTitle systemOverviewDesc"
    >
      <title id="systemOverviewTitle">Prelude 시스템 구조</title>
      <desc id="systemOverviewDesc">
        App은 의존성을 등록하고, 루트 리듀서 AppFeature가 Session, Router,
        Toast를 조합한다. Presentation이 보낸 이벤트는 EventBus를 거쳐
        AppFeature가 받아 Toast로 띄운다. Presentation 안에서는 View, Action,
        Reducer, State가 단방향으로 돌고, Reducer가 낸 Effect는 Domain의
        UseCase를 호출한 뒤 그 결과를 다시 Action으로 보낸다. Domain에는
        UseCase, Repository Protocol, ErrorMapper, UserSyncService, AuthFacade가
        있다. Data는 Repository Protocol을 구현해 SwiftData, iCloud, Firestore,
        Firebase Auth, Gemini와 통신한다. Infrastructure는 Apple 로그인,
        네트워크 감지, 프롬프트 생성, StoreKit을 맡는다.
      </desc>

      <defs>
        <marker
          id="systemOverviewArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path className="system-overview-arrow-head" d="M2 1L8 5L2 9" />
        </marker>
        <marker
          id="systemOverviewFlowArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path className="system-overview-flow-head" d="M2 1L8 5L2 9" />
        </marker>
      </defs>

      <rect
        className="system-overview-layer"
        x="12"
        y="12"
        width="836"
        height="120"
        rx="14"
      />
      <text className="system-overview-name" x="30" y="50">
        App
      </text>
      <Tag x={100} y={32} width={120} label="@Dependency" />
      <Tag x={300} y={32} width={110} label="AppFeature" />
      <Tag x={640} y={32} width={90} label="EventBus" />

      {ROOT_REDUCERS.map((reducer) => (
        <g key={reducer.name}>
          <line
            className="system-overview-link"
            x1={APP_FEATURE_BOTTOM.x}
            y1={APP_FEATURE_BOTTOM.y}
            x2={reducer.x + ROOT_REDUCER_WIDTH / 2}
            y2={ROOT_REDUCER_Y - 2}
          />
          <Tag
            x={reducer.x}
            y={ROOT_REDUCER_Y}
            width={ROOT_REDUCER_WIDTH}
            label={reducer.name}
          />
        </g>
      ))}

      <line
        className="system-overview-flow"
        x1="638"
        y1="45"
        x2="414"
        y2="45"
        markerEnd="url(#systemOverviewFlowArrow)"
      />

      <path
        className="system-overview-flow"
        d="M320 162 L320 148 L780 148 L780 45 L734 45"
        markerEnd="url(#systemOverviewFlowArrow)"
      />

      <rect
        className="system-overview-layer"
        x="12"
        y="164"
        width="330"
        height="460"
        rx="14"
      />
      <text className="system-overview-name" x="30" y="196">
        Presentation
      </text>
      <Tag x={134} y={177} width={52} label="TCA" />

      <Step x={36} y={240} label="View" />
      <Step x={200} y={240} label="Action" />
      <Step x={36} y={380} label="State" />
      <Step x={200} y={380} label="Reducer" />
      <Step x={200} y={520} label="Effect" />

      <line
        className="system-overview-flow"
        x1="148"
        y1="260"
        x2="196"
        y2="260"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="255"
        y1="282"
        x2="255"
        y2="376"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="198"
        y1="400"
        x2="150"
        y2="400"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="91"
        y1="378"
        x2="91"
        y2="284"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="255"
        y1="422"
        x2="255"
        y2="516"
        markerEnd="url(#systemOverviewFlowArrow)"
      />

      <path
        className="system-overview-flow"
        d="M312 540 L326 540 L326 260 L314 260"
        markerEnd="url(#systemOverviewFlowArrow)"
      />

      <rect
        className="system-overview-layer is-core"
        x="372"
        y="164"
        width="200"
        height="460"
        rx="14"
      />
      <text className="system-overview-name" x="472" y="196" textAnchor="middle">
        Domain
      </text>
      {DOMAIN_TAGS.map((tag) => (
        <Tag key={tag.name} x={387} y={tag.y} width={170} label={tag.name} />
      ))}

      <path
        className="system-overview-dependency"
        d={`M255 562 L255 590 L356 590 L356 ${USE_CASE_CENTER_Y} L383 ${USE_CASE_CENTER_Y}`}
        markerEnd="url(#systemOverviewArrow)"
      />

      <rect
        className="system-overview-layer"
        x="602"
        y="164"
        width="246"
        height="250"
        rx="14"
      />
      <text className="system-overview-name" x="725" y="276" textAnchor="middle">
        Data
      </text>
      <text
        className="system-overview-caption"
        x="725"
        y="300"
        textAnchor="middle"
      >
        Repository Implementation
      </text>

      <line
        className="system-overview-dependency"
        x1="600"
        y1={REPOSITORY_PROTOCOL_CENTER_Y}
        x2="561"
        y2={REPOSITORY_PROTOCOL_CENTER_Y}
        markerEnd="url(#systemOverviewArrow)"
      />

      <line
        className="system-overview-link"
        x1="725"
        y1="414"
        x2="725"
        y2="440"
      />
      {SERVICES.map((service) => (
        <g key={service.name}>
          <rect
            className="system-overview-service"
            x={service.x}
            y={service.y}
            width={service.width}
            height={34}
            rx={17}
          />
          <text
            className="system-overview-service-name"
            x={service.x + service.width / 2}
            y={service.y + 22}
            textAnchor="middle"
          >
            {service.name}
          </text>
        </g>
      ))}

      <rect
        className="system-overview-layer"
        x="12"
        y="656"
        width="836"
        height="64"
        rx="14"
      />
      <text className="system-overview-name" x="30" y="694">
        Infrastructure
      </text>
      {INFRASTRUCTURE.map((item) => (
        <Tag
          key={item.name}
          x={item.x}
          y={675}
          width={item.width}
          label={item.name}
        />
      ))}
    </svg>
  );
}
