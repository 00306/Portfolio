import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { ValueTags } from "../../components/ValueTags";
import { VALUE_TAGS } from "../valueTags";
import "../../styles/valuePage.css";
import emotionImage from "../../../public/emotion.jpg";
import emotionSystemImage from "../../../public/emotion_system.jpg";

export function LogicEmotionPage({ onExit }: DepthPageProps) {
  return (
    <section className="depth-page value-page">
      <div className="value-page-column">
        <BlurredEdgeScroll className="value-page-body">
          <header className="value-page-header">
            <h2 className="value-page-title">논리로 이해하는 감정</h2>
            <ValueTags
              tags={VALUE_TAGS["value-02"]}
              className="value-page-tags"
            />
          </header>
          <p>
            같은 말도 누가, 어떤 상황에서, 어떤 말투로 하느냐에 따라 다르게
            들리곤 해요. 분명 맞는 말인데도 선뜻 받아들여지지 않을 때가 있고요.
            논리적으로만 놓고 보면 달라질 이유가 없는데 말이죠. 이런 순간들
            때문에 감정은 흔히 논리의 반대편에 있는 것처럼, 설명할 수 없는
            영역으로 그려지곤 하는 것 같아요.
          </p>

          <img className="value-page-image" src={emotionImage} alt="" />

          <p>
            하지만 저는 감정도 논리로 충분히 해석할 수 있는 영역이라고 생각해요.
            사람마다 어떤 일을 겪었을 때 그 일이 자신에게 어떤 의미인지를
            가늠하는 저마다의 기준이 있다고 보거든요. 저는 이 기준을 감정
            시스템이라고 부르고 있어요. 무엇을 중요하게 여기는지에 따라, 같은
            일도 누군가에게는 크게, 누군가에게는 별일 아니게 다가오죠. 같은
            피드백을 듣고도 누군가는 내용에 먼저 집중하고, 누군가는 말투에 먼저
            마음이 쓰이는 것처럼요.
          </p>
          <p>
            이 시스템은 그 사람이 살아온 삶과 겪어온 경험 속에서 오랜 시간에
            걸쳐 형성된다고 생각해요. 그런데 서로의 삶을 다 들여다보기는 쉽지
            않아서, 우리는 상대의 시스템을 정확히 알 수 없는 경우가 많은 것
            같아요. 그래서 상대에 대한 정보가 부족하거나 이유가 너무 복잡하게
            얽혀 있을 때, 상대의 반응이 비합리적이고 이해할 수 없는 것처럼
            보이기도 해요.
          </p>

          <img className="value-page-image" src={emotionSystemImage} alt="" />
          <p>
            그럼에도 저는 이해하기를 포기하지 않으려 노력해요. 어떤 순간에 어떤
            반응이 나오는지 관찰하고, 그 아래에 어떤 이유가 있을지 소통하고
            추정하면서 조금씩 그 사람을 알아가요.
          </p>
          <p>
            동료와 이야기할 때도 마찬가지예요. 동료의 언행이 선뜻 이해되지 않을
            때도 비합리적이라고 넘기지 않고, 제가 말을 할 때도 같은 말도 누가,
            어떤 말투로 하느냐에 따라 다르게 들린다는 걸 감안하려 해요.
          </p>
          <p>
            다만 이해한다고 해서 모든 반응에 무조건적인 공감을 한다는 건
            아니에요. 무언가를 이해하는 것과, 그것의 옳고 그름을 판단하는 것은
            항상 분리해 두려고 해요.
          </p>
        </BlurredEdgeScroll>
      </div>

      <button type="button" className="depth-page-exit" onClick={onExit}>
        올라가기
      </button>
    </section>
  );
}
