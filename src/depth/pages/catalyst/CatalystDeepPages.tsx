import type { DepthPageProps } from "../../DepthPages";
import { DeepPage } from "../DeepPage";
import {
  DeepSection,
  DeepList,
  DeepChecklist,
  DeepDecisionTree,
  DeepPairs,
  DeepBoundaryList,
} from "../DeepBlocks";

export function CatalystRuntimeDeepPage({ onExit, phase }: DepthPageProps) {
  return (
    <DeepPage
      onExit={onExit}
      phase={phase}
      eyebrow="Catalyst · Core Decision 01"
      title="연구실 환경에 맞춘 Python 전환"
    >
      <DeepSection index="01" name="context">
        <DeepList
          items={[
            "연구실에 먼저 찾아가 분석 과정에서 불편한 점을 묻다가, GPC 장비의 데이터를 여러 외부 프로그램(Origin · Excel)으로 옮겨야 분석할 수 있고 3D 크로마토그램은 아예 볼 수 없다는 문제를 알게 됨",
            "이를 통합할 분석 소프트웨어를 만들기로 했고, 처음에는 iOS 프로젝트로 진행할 생각이었음",
            "실제 워크플로우를 보니 연구실 PC는 Windows이고, 장비도 그 PC에서만 호환되어 iOS가 들어갈 수 없는 환경이었음",
          ]}
        />
      </DeepSection>

      <DeepSection index="02" name="options">
        <DeepChecklist
          items={[
            { label: "그만두기" },
            { label: "Swift로 진행하기" },
            { label: "Python으로 전환하기", checked: true },
          ]}
        />
      </DeepSection>

      <DeepSection index="03" name="criteria">
        <DeepDecisionTree
          steps={[
            {
              question: "계속할지? (iOS가 아니어도 할 가치가 있는가)",
              branches: [
                {
                  label:
                    "학부생한테 연구실이 쓸 도구를 요구사항부터 배포까지 통째로 맡긴다는 건, 다시 오기 힘든 기회라고 느낌",
                },
                {
                  label:
                    "연구실 현장의 상황과 사람들을 직접 이해하며, 실제 문제들을 찾고 풀어볼 수 있음",
                },
                {
                  label: "화면 밖, 실제 장비가 남기는 데이터를 다뤄볼 수 있음",
                },
              ],
              conclusion: "계속할 가치 있음",
            },
            {
              question: "무엇으로 할지? (Swift vs Python)",
              given: [
                {
                  label: "데이터",
                  text: "장비가 .D 폴더 안에 .ch 파일로 남기는 측정 데이터",
                },
                {
                  label: "분석",
                  text: "분자량(Mn · Mw · PDI), 3D 크로마토그램",
                },
              ],
              branches: [
                {
                  label: "Windows 실행",
                  verdicts: [
                    {
                      option: "Swift",
                      pass: false,
                      text: "Windows 지원 · UI 생태계가 빈약함",
                    },
                    {
                      option: "Python",
                      pass: true,
                      text: "Windows에서 바로 동작",
                    },
                  ],
                },
                {
                  label: "측정 데이터 읽기",
                  verdicts: [
                    {
                      option: "Swift",
                      pass: false,
                      text: "디코딩 코드를 직접 작성",
                    },
                    {
                      option: "Python",
                      pass: true,
                      text: "rainbow-api로 .ch 파일을 바로 읽음",
                    },
                  ],
                },
                {
                  label: "신호 연산",
                  verdicts: [
                    { option: "Swift", pass: false, text: "직접 구현" },
                    { option: "Python", pass: true, text: "NumPy · SciPy" },
                  ],
                },
              ],
            },
          ]}
          conclusion="세 기준 모두 Python 적합"
        />
      </DeepSection>

      <DeepSection index="04" name="trade-off">
        <DeepPairs
          items={[
            {
              label: "iOS 공백",
              text: "방학 동안 계획했던 iOS 프로젝트를 미룸",
            },
            {
              label: "학습 비용",
              text: "익숙한 Swift 대신 Python과 데스크톱 UI를 처음부터 익힘",
            },
          ]}
        />
      </DeepSection>
    </DeepPage>
  );
}

export function CatalystWebviewDeepPage({ onExit, phase }: DepthPageProps) {
  return (
    <DeepPage
      onExit={onExit}
      phase={phase}
      eyebrow="Catalyst · Core Decision 02"
      title="앱과 웹뷰 사이의 경계 처리"
    >
      <DeepSection index="01" name="context">
        <DeepList
          items={[
            "3D 크로마토그램 그래프는 여러 샘플의 신호를 입체로 겹친 그래프라 회전시키면서 보는 일이 많고, 논문용으로 저장하려면 축 라벨 · 눈금 · 테마 같은 형태도 갖춰야 했음",
            "두 조건을 함께 갖춘 그래프 라이브러리는 웹 기반의 Plotly였고, 웹 화면을 앱 안에 띄우기 위해 웹뷰를 도입",
            "웹뷰의 페이지는 앱과 분리된 렌더러 프로세스에서 실행되어, 앱과 페이지는 메모리를 공유하지 못하고 IPC로만 데이터를 주고받을 수 있음",
            "그래서 앱이 페이지에 리소스 · 데이터를 넘기는 네이티브 → 웹, 페이지의 JS 이벤트를 앱이 받는 웹 → 네이티브 두 방향의 통로를 직접 설계함",
          ]}
        />
      </DeepSection>

      <DeepSection index="02" name="native → web">
        <DeepBoundaryList
          items={[
            {
              question:
                "Plotly를 런타임에 받을지, 앱에 포함할지? (CDN vs Bundle)",
              problem:
                "CDN은 첫 로드나 캐시 만료 시 네트워크가 필요해, 오프라인이면 스크립트 로드에 실패함",
              resolution:
                "Plotly 스크립트를 앱에 번들하고, 웹뷰가 로컬 경로에서 로드하게 함",
            },
            {
              question: "페이지를 어떻게 로드할지? (setHtml vs 로컬 파일)",
              problem:
                "setHtml은 HTML 내용 전체를 URL 안에 담아(data: URL) 넘기는데, Chromium은 IPC로 넘길 수 있는 URL 길이를 2MB로 제한해 Plotly(약 4.8MB)를 담은 페이지가 로드되지 않음",
              resolution:
                "HTML을 디스크에 임시 파일로 쓰고 URL에는 파일 경로만 담아, 렌더러 프로세스가 그 파일을 직접 읽게 함",
            },
            {
              question: "페이지 로드 전에 데이터가 오면?",
              problem:
                "페이지는 비동기로 로드돼, 로드 완료 전에 runJavaScript를 호출하면 받을 함수가 없어 무시됨",
              resolution: "데이터를 보관해 두었다가, loadFinished 이후에 주입함",
            },
          ]}
        />
      </DeepSection>

      <DeepSection index="03" name="web → native">
        <DeepBoundaryList
          items={[
            {
              question: "웹뷰의 JS 이벤트를 네이티브로 어떻게 전달할지?",
              problem:
                "웹뷰 안에서 발생하는 JS 이벤트들은 네이티브 코드가 받을 수 없음",
              resolution:
                "QWebChannel 브리지로 JS 이벤트를 네이티브 코드에 전달함",
            },
          ]}
        />
      </DeepSection>

      <DeepSection index="04" name="trade-off">
        <DeepPairs
          items={[
            {
              label: "앱 무게",
              text: "브라우저 엔진(QtWebEngine)과 Plotly까지 앱 안에 들어가 무거워짐",
            },
            {
              label: "디스크 I/O",
              text: "IPC URL 길이 제한을 피하는 대신, 페이지를 띄울 때마다 디스크에 쓰고 읽는 과정과 임시 파일을 관리할 책임이 생김",
            },
            {
              label: "경계 처리",
              text: "프로세스 경계를 넘는 일마다, 앱이 통로를 직접 짜고 유지해야 함",
            },
          ]}
        />
      </DeepSection>
    </DeepPage>
  );
}
