import type { ReactNode } from "react";
import type { DepthId } from "../depth/DepthPages";
import "../styles/decisionList.css";

export interface Decision {
  title: string;
  problem: string;
  judgment: string;
  result: string;
  linkLabel: string;
  href?: string;
  depthId?: DepthId;
}

export function DecisionList({
  decisions,
  onDescend,
}: {
  decisions: Decision[];
  onDescend?: (id: DepthId) => void;
}) {
  return (
    <ul className="decision-list">
      {decisions.map((decision) => {
        const { depthId } = decision;
        const content: ReactNode = (
          <>
            <span className="decision-list-title">{decision.title}</span>
            <span className="decision-list-body">
              <span className="decision-list-label">Problem</span>
              <span className="decision-list-problem">{decision.problem}</span>
              <span className="decision-list-label">Solution</span>
              <span className="decision-list-judgment">{decision.judgment}</span>
              <span className="decision-list-label">Result</span>
              <span className="decision-list-result">{decision.result}</span>
            </span>
            <span className="decision-list-link">
              {decision.linkLabel} {depthId ? "↓" : "↗"}
            </span>
          </>
        );

        return (
          <li key={decision.title}>
            {depthId && onDescend ? (
              <button
                type="button"
                className="decision-list-row"
                onClick={() => onDescend(depthId)}
              >
                {content}
              </button>
            ) : (
              <a
                className="decision-list-row"
                href={decision.href}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
