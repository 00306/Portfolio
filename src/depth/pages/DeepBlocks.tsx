import type { ReactNode } from "react";
import { TypedText } from "../typing/TypedText";

export function DeepSection({
  index,
  name,
  children,
}: {
  index: string;
  name: string;
  children: ReactNode;
}) {
  return (
    <section className="deep-section">
      <h2 className="deep-section-title">
        <TypedText text={`## ${index} ${name}`} />
      </h2>
      {children}
    </section>
  );
}

export function DeepList({ items }: { items: string[] }) {
  return (
    <ul className="deep-list">
      {items.map((item) => (
        <li key={item}>
          <TypedText text={item} />
        </li>
      ))}
    </ul>
  );
}

export function DeepChecklist({
  caption,
  items,
}: {
  caption?: string;
  items: { label: string; note?: string; checked?: boolean }[];
}) {
  return (
    <>
      {caption && (
        <p className="deep-checklist-caption">
          <TypedText text={caption} />
        </p>
      )}
      <ul className="deep-checklist">
        {items.map((item) => (
          <li
            key={item.label}
            className={item.checked ? "is-checked" : undefined}
          >
            <span className="deep-check-mark">
              <TypedText text={item.checked ? "[x] " : "[ ] "} />
            </span>
            <TypedText text={item.label} />
            {item.note && (
              <span className="deep-check-note">
                <TypedText text={` — ${item.note}`} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export function DeepPairs({
  items,
}: {
  items: { label: string; text: string }[];
}) {
  return (
    <dl className="deep-pairs">
      {items.map((item) => (
        <div key={item.label} className="deep-pairs-row">
          <dt>
            <TypedText text={item.label} />
          </dt>
          <dd>
            <TypedText text={item.text} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface DecisionBranch {
  label: string;
  verdicts?: { option: string; pass: boolean; text: string }[];
}

function treeColumns(branches: DecisionBranch[]) {
  const verdictCount = Math.max(
    2,
    ...branches.map((branch) => branch.verdicts?.length ?? 0)
  );
  return `max-content max-content ${"max-content ".repeat(
    verdictCount - 1
  )}minmax(0, 1fr)`;
}

export function DeepDecisionTree({
  steps,
  conclusion,
}: {
  steps: {
    question: string;
    given?: { label: string; text: string }[];
    branches: DecisionBranch[];
    conclusion?: string;
  }[];
  conclusion?: string;
}) {
  return (
    <div className="deep-tree">
      {steps.map((step) => (
        <div key={step.question} className="deep-tree-step">
          <div className="deep-tree-question">
            <TypedText text={step.question} />
          </div>
          <div
            className="deep-tree-rows"
            style={{ gridTemplateColumns: treeColumns(step.branches) }}
          >
            {step.given?.map((item) => (
              <div key={item.label} className="deep-tree-row">
                <span className="deep-tree-branch">
                  <TypedText text="│" />
                </span>
                <span className="deep-tree-given">
                  <span className="deep-tree-given-label">
                    <TypedText text={item.label} />
                  </span>
                  <TypedText text={item.text} />
                </span>
              </div>
            ))}
            {step.branches.map((branch, index) => (
              <div key={branch.label} className="deep-tree-row">
                <span className="deep-tree-branch">
                  <TypedText
                    text={index === step.branches.length - 1 ? "└─" : "├─"}
                  />
                </span>
                <span className={branch.verdicts ? undefined : "deep-tree-wide"}>
                  <TypedText text={branch.label} />
                </span>
                {branch.verdicts?.map((verdict) => (
                  <span
                    key={verdict.option}
                    className={`deep-tree-verdict ${
                      verdict.pass ? "is-pass" : "is-fail"
                    }`}
                  >
                    <span className="deep-tree-option">
                      <TypedText text={`${verdict.option} `} />
                    </span>
                    <span className="deep-tree-mark">
                      <TypedText text={verdict.pass ? "✓ " : "✗ "} />
                    </span>
                    <TypedText text={verdict.text} />
                  </span>
                ))}
              </div>
            ))}
          </div>
          {step.conclusion && (
            <div className="deep-tree-conclusion">
              <TypedText text={`→ ${step.conclusion}`} />
            </div>
          )}
        </div>
      ))}
      {conclusion && (
        <div className="deep-tree-conclusion">
          <TypedText text={`→ ${conclusion}`} />
        </div>
      )}
    </div>
  );
}

export function DeepBoundaryList({
  items,
}: {
  items: { question: string; problem?: string; resolution: string }[];
}) {
  return (
    <div className="deep-boundary">
      {items.map((item) => (
        <div key={item.question} className="deep-boundary-item">
          <div className="deep-boundary-question">
            <TypedText text={item.question} />
          </div>
          {item.problem && (
            <div className="deep-boundary-line">
              <span className="deep-tree-branch">
                <TypedText text="├─" />
              </span>
              <span className="deep-boundary-problem">
                <span className="deep-boundary-mark">
                  <TypedText text="✗ " />
                </span>
                <TypedText text={item.problem} />
              </span>
            </div>
          )}
          <div className="deep-boundary-line">
            <span className="deep-tree-branch">
              <TypedText text="└─" />
            </span>
            <span className="deep-boundary-resolution">
              <TypedText text={`→ ${item.resolution}`} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
