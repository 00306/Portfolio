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

function AreaName({
  x,
  y,
  role,
  tech,
}: {
  x: number;
  y: number;
  role: string;
  tech?: string;
}) {
  return (
    <text x={x} y={y}>
      <tspan className="system-overview-name">{role}</tspan>
      {tech && (
        <tspan className="system-overview-caption" dx={8}>
          {tech}
        </tspan>
      )}
    </text>
  );
}

const BOUNDARY_CENTER_X = 430;

function Crossing({
  y,
  direction,
  role,
  tech,
  payload,
}: {
  y: number;
  direction: "toWeb" | "toApp";
  role: string;
  tech: string;
  payload: string;
}) {
  const [x1, x2] = direction === "toWeb" ? [354, 529] : [506, 356];
  return (
    <>
      <text
        className="system-overview-tag-text"
        x={BOUNDARY_CENTER_X}
        y={y - 24}
        textAnchor="middle"
      >
        {role}
      </text>
      <text
        className="system-overview-caption"
        x={BOUNDARY_CENTER_X}
        y={y - 9}
        textAnchor="middle"
      >
        {tech}
      </text>
      <line
        className="system-overview-flow"
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <text
        className="system-overview-caption"
        x={BOUNDARY_CENTER_X}
        y={y + 19}
        textAnchor="middle"
      >
        {payload}
      </text>
    </>
  );
}

export function CatalystSystemOverview() {
  return (
    <svg
      className="system-overview"
      viewBox="0 0 860 620"
      role="img"
      aria-labelledby="catalystOverviewTitle catalystOverviewDesc"
    >
      <title id="catalystOverviewTitle">Catalyst 시스템 흐름</title>
      <desc id="catalystOverviewDesc">
        Agilent GPC 장비가 남긴 .D 폴더에서 앱이 .ch 시그널 파일을
        AgilentParser로 읽고, GPCEngine과 COS2DEngine으로 계산한 뒤
        PlotBuilder가 그래프 데이터를 만든다. 앱은 JS 호출(runJavaScript)로
        데이터와 테마를 웹뷰에 넣고, 웹뷰는 메시지 전달(QWebChannel)로 샘플
        클릭과 범위 드래그를, 다운로드 요청(downloadRequested)으로 이미지 저장을
        앱에 돌려준다.
      </desc>

      <defs>
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
        height="84"
        rx="14"
      />
      <rect
        className="system-overview-layer"
        x="12"
        y="128"
        width="340"
        height="480"
        rx="14"
      />
      <rect
        className="system-overview-layer is-core"
        x="508"
        y="128"
        width="340"
        height="480"
        rx="14"
      />

      <AreaName x={30} y={60} role="Lab" />
      <Tag x={120} y={41} width={140} label="Agilent GPC" />
      <line className="system-overview-link" x1="262" y1="54" x2="288" y2="54" />
      <Tag x={290} y={41} width={140} label=".D 폴더" />
      <line className="system-overview-link" x1="432" y1="54" x2="458" y2="54" />
      <Tag x={460} y={41} width={140} label=".ch 시그널" />

      <path
        className="system-overview-flow"
        d="M530 69 L530 112 L182 112 L182 232"
        markerEnd="url(#systemOverviewFlowArrow)"
      />

      <AreaName x={30} y={166} role="App" tech="PyQt5" />

      <Tag x={37} y={236} width={290} label="AgilentParser" />
      <line
        className="system-overview-flow"
        x1="130"
        y1="262"
        x2="108"
        y2="362"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="234"
        y1="262"
        x2="256"
        y2="362"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <Tag x={37} y={366} width={140} label="GPCEngine" />
      <Tag x={187} y={366} width={140} label="COS2DEngine" />
      <line
        className="system-overview-flow"
        x1="108"
        y1="392"
        x2="130"
        y2="492"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <line
        className="system-overview-flow"
        x1="256"
        y1="392"
        x2="234"
        y2="492"
        markerEnd="url(#systemOverviewFlowArrow)"
      />
      <Tag x={37} y={496} width={290} label="PlotBuilder" />

      <text
        className="system-overview-caption"
        x={BOUNDARY_CENTER_X}
        y="166"
        textAnchor="middle"
      >
        프로세스 경계
      </text>
      <Crossing
        y={262}
        direction="toWeb"
        role="JS 호출"
        tech="runJavaScript"
        payload="데이터 · 테마 주입"
      />
      <Crossing
        y={392}
        direction="toApp"
        role="메시지 전달"
        tech="QWebChannel"
        payload="샘플 클릭 · 범위 드래그"
      />
      <Crossing
        y={522}
        direction="toApp"
        role="다운로드 요청"
        tech="downloadRequested"
        payload="저장 다이얼로그로"
      />

      <AreaName x={526} y={166} role="WebView" tech="QtWebEngine" />
      <Tag x={533} y={249} width={290} label="Plotly 그래프" />
      <Tag x={533} y={379} width={290} label="그래프에서 범위 드래그" />
      <Tag x={533} y={509} width={290} label="이미지 저장 버튼" />
    </svg>
  );
}
