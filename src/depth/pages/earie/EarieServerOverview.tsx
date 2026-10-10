import "../../../styles/earieOverview.css";

export function EarieServerOverview() {
  return (
    <svg
      className="earie-overview"
      viewBox="0 0 460 440"
      role="img"
      aria-labelledby="earieServerOverviewTitle earieServerOverviewDesc"
    >
      <title id="earieServerOverviewTitle">Earie 서버 구조</title>
      <desc id="earieServerOverviewDesc">
        handleWebSocket이 /ws 연결을 받아 room.Hub에서 Room을 생성하거나
        조회하고, 연결마다 client.Client를 만든다. room.Hub는 방 목록을
        RWMutex로 보호하고, Room을 go Run()으로 띄운다. room.Room은 goroutine
        하나가 chan으로 들어온 일을 순서대로 처리해 lock 없이 상태를 보호한다.
        client.Client는 incoming chan으로 메시지를 보내고 Send chan으로 받는다.
        Room은 game.Game에 라운드를 맡기고, 라운드 시간이 끝나면 time.AfterFunc
        콜백이 internal chan으로 알린다. 곡 조회는 별도 goroutine에서
        music.Store로 PostgreSQL을 조회한 뒤 결과를 internal chan으로 보낸다.
      </desc>

      <defs>
        <marker
          id="earieServerArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path className="earie-overview-arrow-head" d="M2 1L8 5L2 9" />
        </marker>
        <mask id="earieServerClientStack">
          <rect x="0" y="0" width="460" height="440" fill="white" />
          <rect x="230" y="108" width="196" height="46" rx="10" fill="black" />
        </mask>
      </defs>

      <rect
        className="earie-overview-boundary"
        x="10"
        y="12"
        width="440"
        height="380"
        rx="16"
      />
      <text className="earie-overview-caption" x="26" y="34">
        Go Server
      </text>

      <line
        className="earie-overview-arrow is-chan"
        x1="352"
        y1="30"
        x2="374"
        y2="30"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="380" y="34">
        chan 전송
      </text>

      <rect
        className="earie-overview-box"
        x="26"
        y="44"
        width="408"
        height="38"
        rx="12"
      />
      <text className="earie-overview-box-name" x="44" y="68">
        handleWebSocket
      </text>

      <line
        className="earie-overview-arrow"
        x1="120"
        y1="84"
        x2="120"
        y2="106"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="130" y="99">
        Room 생성 · 조회
      </text>
      <line
        className="earie-overview-arrow"
        x1="328"
        y1="84"
        x2="328"
        y2="98"
        markerEnd="url(#earieServerArrow)"
      />

      <rect
        className="earie-overview-box"
        x="26"
        y="108"
        width="188"
        height="46"
        rx="10"
      />
      <text
        className="earie-overview-box-name"
        x="120"
        y="127"
        textAnchor="middle"
      >
        room.Hub
      </text>
      <rect
        className="earie-overview-tag"
        x="88"
        y="133"
        width="64"
        height="16"
        rx="8"
      />
      <text
        className="earie-overview-tag-text"
        x="120"
        y="145"
        textAnchor="middle"
      >
        RWMutex
      </text>

      <g mask="url(#earieServerClientStack)">
        <rect
          className="earie-overview-box is-stacked"
          x="238"
          y="100"
          width="196"
          height="46"
          rx="10"
        />
        <rect
          className="earie-overview-box is-stacked"
          x="234"
          y="104"
          width="196"
          height="46"
          rx="10"
        />
      </g>
      <rect
        className="earie-overview-box"
        x="230"
        y="108"
        width="196"
        height="46"
        rx="10"
      />
      <text
        className="earie-overview-box-name"
        x="328"
        y="136"
        textAnchor="middle"
      >
        client.Client
      </text>

      <line
        className="earie-overview-arrow"
        x1="120"
        y1="156"
        x2="120"
        y2="176"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="130" y="170">
        go Run()
      </text>

      <line
        className="earie-overview-arrow is-chan"
        x1="296"
        y1="156"
        x2="296"
        y2="176"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="288" y="170" textAnchor="end">
        incoming
      </text>
      <line
        className="earie-overview-arrow is-chan"
        x1="368"
        y1="176"
        x2="368"
        y2="156"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="376" y="170">
        Send
      </text>

      <rect
        className="earie-overview-box"
        x="26"
        y="178"
        width="408"
        height="56"
        rx="12"
      />
      <text className="earie-overview-box-name" x="44" y="201">
        room.Room
      </text>
      <text className="earie-overview-caption" x="44" y="220">
        단일 goroutine · lock 없음
      </text>

      <line
        className="earie-overview-arrow"
        x1="60"
        y1="236"
        x2="60"
        y2="298"
        markerEnd="url(#earieServerArrow)"
      />
      <line
        className="earie-overview-arrow is-chan"
        x1="90"
        y1="298"
        x2="90"
        y2="236"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="98" y="262">
        AfterFunc 콜백
      </text>
      <text className="earie-overview-caption" x="98" y="277">
        → internal
      </text>

      <line
        className="earie-overview-arrow"
        x1="250"
        y1="236"
        x2="250"
        y2="298"
        markerEnd="url(#earieServerArrow)"
      />
      <line
        className="earie-overview-arrow is-chan"
        x1="280"
        y1="298"
        x2="280"
        y2="236"
        markerEnd="url(#earieServerArrow)"
      />
      <text className="earie-overview-caption" x="288" y="262">
        go FetchSongs
      </text>
      <text className="earie-overview-caption" x="288" y="277">
        → internal
      </text>

      <rect
        className="earie-overview-box"
        x="26"
        y="300"
        width="188"
        height="46"
        rx="10"
      />
      <text
        className="earie-overview-box-name"
        x="120"
        y="328"
        textAnchor="middle"
      >
        game.Game
      </text>

      <rect
        className="earie-overview-box"
        x="230"
        y="300"
        width="204"
        height="46"
        rx="10"
      />
      <text
        className="earie-overview-box-name"
        x="332"
        y="328"
        textAnchor="middle"
      >
        music.Store
      </text>

      <line className="earie-overview-link" x1="332" y1="346" x2="332" y2="404" />
      <rect
        className="earie-overview-service"
        x="230"
        y="404"
        width="204"
        height="30"
        rx="15"
      />
      <text
        className="earie-overview-service-name"
        x="332"
        y="424"
        textAnchor="middle"
      >
        PostgreSQL
      </text>
    </svg>
  );
}
