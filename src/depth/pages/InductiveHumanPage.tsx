import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { ValueTags } from "../../components/ValueTags";
import { VALUE_TAGS } from "../valueTags";
import "../../styles/valuePage.css";
import mushroomImage from "../../../public/mushroom.jpg";

export function InductiveHumanPage({ onExit }: DepthPageProps) {
  return (
    <section className="depth-page value-page">
      <div className="value-page-column">
        <BlurredEdgeScroll className="value-page-body">
          <header className="value-page-header">
            <h2 className="value-page-title">실패가 배움이 되는 과정</h2>
            <ValueTags
              tags={VALUE_TAGS["value-01"]}
              className="value-page-tags"
            />
          </header>
          <p>
            인간도 다른 동물들과 같은 진화의 흐름 속에서 태어났고, 우연히 뇌라는
            기관이 크게 발달하면서 먹이사슬의 꼭대기에 올랐다고 생각해요. 인간의
            발달된 뇌가 만들어낸 부가가치는 경이로울 정도로 대단하지만,
            근본적으로 인간은 세상에 대해 아무것도 모르는 채로 태어나 배워가는
            동물인거죠.
          </p>

          <p>
            저는 그 배움의 기본적인 플로우는 오감으로 세상을 직접 겪어보고,
            거기서 알게 된 것들을 하나씩 쌓아가는 거라고 생각해요. 예를 들면,
            원시시대에는 독버섯에 대한 지식이 없었으니 누군가는 '먹던 버섯과
            비슷하게 생겼으니 괜찮겠지' 하고 먹어봤을 거예요. 그 후, 구토와
            오한에 시달리거나 목숨을 잃는 것을 보고 사람들은 이런 색과 모양의
            버섯은 위험하다는 걸 알게 되는거죠. 그렇게 먹어보고, 아파보고,
            데여도 보면서 인간은 조금씩 세상을 이해해왔어요.
          </p>

          <img className="value-page-image" src={mushroomImage} alt="" />

          <p>
            이 과정에는 '맞을 거라고 생각했던 짐작이 틀려버린 실패의 순간'이
            반드시 찾아와요. 그리고 무언가를 새로 알게 되는 것도 바로 그때부터
            시작된다고 생각해요. 짐작이 맞았다면 원래 알던 그대로였을 테니까요.
            그래서 저는 실패를 세상을 알아가고자 하는 인간에게 배움이 시작되는
            자연스러운 출발점이라고 생각해요.
          </p>
          <p>
            그러다보니 저는 실수하거나 실패한 사람에게 크게 박하게 굴지 않아요.
            오히려 그들에게 동질감을 느끼게 되고, 거기서 무엇을 배울 수 있을지를
            먼저 보게 돼요. 그리고 같은 이유로 저 자신도 실수나 실패 앞에서 쉽게
            무너지지 않고 다시 나아갈 힘을 얻어요.
          </p>
          <p>
            다만 실패가 그 자체로 큰 가치를 갖지는 않는다고 생각해요. 틀렸다는
            걸 알아챈 건 배움의 시작일 뿐, 아직 배움은 아니니까요. 독버섯의
            교훈이 의미를 가진 건 누군가 탈이 났기 때문이 아니라, 그 경험이
            정리되고 전해져 다음에 같은 버섯을 먹지 않게 됐기 때문이라고
            생각하거든요. 왜 실패했는지 돌아보고, 알게 된 것을 통해 같은 실수가
            반복되지 않게 될 때, 비로소 배움이 완성되는 거죠.
          </p>
          <p>
            특히 동료들과 함께 일하는 곳에서 이 배움의 과정은 더 중요해진다고
            생각해요. 제가 돌아보지 않고 넘긴 실패의 비용은 결국 동료와 팀이
            떠안게 되니까요. 같은 실패가 반복되지 않는 지점까지 끌고 가는게,
            좋은 동료로서 실패에 대해 져야 할 책임이라고 생각해요.
          </p>
        </BlurredEdgeScroll>
      </div>

      <button type="button" className="depth-page-exit" onClick={onExit}>
        올라가기
      </button>
    </section>
  );
}
