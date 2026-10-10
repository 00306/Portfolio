import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { ValueTags } from "../../components/ValueTags";
import { VALUE_TAGS } from "../valueTags";
import "../../styles/valuePage.css";
import cuckooImage from "../../../public/cuckoo.jpg";
import architectureImage from "../../../public/architecture.jpg";

export function FreedomControlPage({ onExit }: DepthPageProps) {
  return (
    <section className="depth-page value-page">
      <div className="value-page-column">
        <BlurredEdgeScroll className="value-page-body">
          <header className="value-page-header">
            <h2 className="value-page-title">자유와 통제의 적정선</h2>
            <ValueTags
              tags={VALUE_TAGS["value-03"]}
              className="value-page-tags"
            />
          </header>
          <p>
            뻐꾸기는 다른 새의 둥지에 알을 낳아 기르게 하고, 그렇게 태어난
            뻐꾸기 새끼는 원래 둥지에 있던 알들을 밖으로 밀어내 먹이를
            독차지해요. 인간의 기준으로 보면 가혹해 보이지만, 자연은 그게 옳은지
            그른지 판단하지 않아요. 그저 시스템상 가능한 일이 일어났을 뿐이죠.
            그런 의미에서 물리법칙만 있는 자연은 우리 세상에서 가능한 모든
            행동이 허용되는 자유, 그 자체라고 생각해요.
          </p>

          <p>
            인간도 자연 속 동물이니 처음에는 이런 자연의 방식 그대로 살았을
            거예요. 하지만 혼자서는 살아남기 어려웠던 인간은 무리를 지어야 했고,
            그 무리 안에서 자연계의 모든 행동이 허용된다면 서로를 믿을 수 없어
            함께 살아갈 수 없었을 거라고 생각해요. 그래서 인간은 자유의 일부를
            내어주고, 규범과 법이라는 개념으로 몇몇 행동을 통제하면서 그
            불안감을 해소해오지 않았을까 싶어요. 그런데 통제가 생기면 이번에는
            줄어든 자유가 또 다른 불편이 돼요. 결국 자유와 통제 중 어느 한쪽으로
            기울면 기울수록 문제가 생기는 거죠. 그 적정선을 찾으면 해결될 것
            같지만, 그 선은 여러 요인에 따라 계속 달라져서 지금까지도 최적의
            경계를 찾기란 쉽지 않은 것 같아요.
          </p>

          <img
            className="value-page-image"
            src={cuckooImage}
            alt=""
            style={{ objectPosition: "50% 20%" }}
          />

          <p>
            이런 자유와 통제에 대한 고민은 개발 업무에서도 똑같이 나타난다고
            생각해요. 예를 들면, 프레임워크라는 통제를 따르면 복잡한 기능도
            손쉽게 구현할 수 있지만, 동시에 프레임워크가 지원하지 않는 구현은
            기술적으로 가능하더라도 그 안에서는 제한돼요. 반대로 프레임워크를
            벗어나면 원하는 대로 만들 수 있지만, 프레임워크가 대신 챙겨주던
            것들을 직접 떠안아야 하고 서로의 코드를 읽을 때마다 그 사람의 방식을
            새로 익혀야 해요.
          </p>

          <p>
            아키텍처를 얼마나 엄격하게 둘지도 그래요. 흐름을 강하게 묶으면
            코드를 예측하기 쉬워지지만 작은 변경에도 거쳐야 할 절차가 늘고,
            느슨하게 두면 빠르게 만들 수 있지만 금세 서로의 코드를 믿기
            어려워져요. 그 외에도 팀의 컨벤션과 리뷰 규칙을 얼마나 촘촘하게
            둘지, 아예 각자의 판단에 맡길지 같은 고민들도 모두 같은 맥락의
            문제라고 생각해요.
          </p>

          <img className="value-page-image" src={architectureImage} alt="" />

          <p>
            그리고 이 문제들의 적정선도 한 번 정하면 끝나는 게 아니라, 팀과
            제품과 상황이 바뀌면 함께 달라진다고 생각해요. 그래서 저는 선이 계속
            움직인다는 걸 받아들이고, 어느 한쪽 끝으로 기울었을 때 생기는
            문제들을 알고 경계해요.
          </p>
        </BlurredEdgeScroll>
      </div>

      <button type="button" className="depth-page-exit" onClick={onExit}>
        올라가기
      </button>
    </section>
  );
}
