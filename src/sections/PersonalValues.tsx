import { useRef } from "react";
import "../styles/personalValues.css";
import { usePressable } from "../components/usePressable";
import { VALUE_DEPTH_IDS, type DepthId } from "../depth/DepthPages";
import type { SectionProps } from "./sections";

type Value = {
  title: string;
  description: string;
  depthId: DepthId;
  image?: string;
};

const VALUES: Value[] = [
  {
    title: "실패가 배움이 되는 과정",
    description:
      "사람은 직접 겪으며, 예상과 다른 결과를 만날 때 배움이 시작돼요.\n이 생각은 제가 실패를 대하는 태도, 그리고 동료와 함께 성장하는 방식의 근간이에요.",
    depthId: VALUE_DEPTH_IDS[0],
    image: "/mushroom.jpg",
  },
  {
    title: "자유와 통제의 적정선",
    description:
      "자유든 통제든, 어느 한쪽 끝으로 기울면 문제가 생겨요.\n이 생각은 제가 기술을 선택하고 팀의 규칙을 정하는 방식의 근간이에요.",
    depthId: VALUE_DEPTH_IDS[2],
    image: "/cuckoo.jpg",
  },
  {
    title: "논리로 이해하는 감정",
    description:
      "감정도 논리로 이해할 수 있다고 믿기에, 이해하기를 포기하지 않아요.\n이 생각은 제가 동료와 소통하는 방식의 근간이에요.",
    depthId: VALUE_DEPTH_IDS[1],
    image: "/emotion.jpg",
  },
  {
    title: "태도와 인성으로 쌓이는 신뢰",
    description:
      "신뢰는 꾸민다고 쌓이지 않기에, 있는 그대로 마주하려 해요.\n이 생각은 제가 사람들과 관계를 쌓아가는 방식의 근간이에요.",
    depthId: VALUE_DEPTH_IDS[3],
    image: "/faith.jpg",
  },
];

interface ValueCardProps {
  value: Value;
  onSelect: (card: HTMLElement) => void;
}

function ValueCard({ value, onSelect }: ValueCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const pressable = usePressable({
    onPress: () => {
      if (cardRef.current) onSelect(cardRef.current);
    },
    className: "glass-card value-card",
  });

  return (
    <li ref={cardRef} {...pressable}>
      {value.image ? (
        <img className="value-card-image" src={value.image} alt="" />
      ) : (
        <div className="value-card-image" />
      )}
      <div className="value-card-body">
        <span className="value-card-title">{value.title}</span>
        <p className="value-card-description">{value.description}</p>
      </div>
    </li>
  );
}

function PersonalValues({ onDescend }: SectionProps) {
  const cardsRef = useRef<HTMLOListElement>(null);

  function aimPlungeAt(card: HTMLElement) {
    const list = cardsRef.current;
    if (!list) return;

    const listRect = list.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    list.style.setProperty(
      "--plunge-origin-x",
      `${cardRect.left - listRect.left + cardRect.width / 2}px`
    );
    list.style.setProperty(
      "--plunge-origin-y",
      `${cardRect.top - listRect.top + cardRect.height / 2}px`
    );
  }

  return (
    <section className="personal-values">
      <p className="page-name">Personal values</p>

      <ol ref={cardsRef} className="personal-values-cards">
        {VALUES.map((value) => (
          <ValueCard
            key={value.title}
            value={value}
            onSelect={(card) => {
              aimPlungeAt(card);
              onDescend(value.depthId);
            }}
          />
        ))}
      </ol>
    </section>
  );
}

export default PersonalValues;
