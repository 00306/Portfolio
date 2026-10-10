import type { DepthId } from "./DepthPages";

export const VALUE_TAGS = {
  "value-01": ["실패를_배움으로", "회복탄력성", "심리적_안전감", "책임감"],
  "value-02": ["감정_시스템", "관찰과_추정", "이해와_판단의_분리"],
  "value-03": ["규칙이_생긴_이유", "트레이드오프", "움직이는_적정선"],
  "value-04": [
    "진화심리학",
    "곁에_둘_사람",
    "꾸밀_수_없는_신호",
    "신뢰의_재료",
  ],
} satisfies Partial<Record<DepthId, string[]>>;
