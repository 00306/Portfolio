# Portfolio

iOS 개발자 송지혁의 포트폴리오 사이트입니다.

## 실행

```bash
npm install
npm run dev
```

배포용 빌드는 `npm run build`, 결과물은 `dist/`에 생깁니다.

## 구성

- React 19, TypeScript, Vite
- 배경의 물 효과와 스티커는 WebGL로 그립니다 (`src/effects`).
- 데스크톱 화면은 1512×861 기준 캔버스를 화면 크기에 맞춰 확대·축소합니다 (`src/styles/index.css`의 `--u`).
- 기준 캔버스가 너무 작아지는 화면(폰 등)에서는 안내 화면만 보여줍니다 (`src/mobile`).

## 폴더

| 경로 | 내용 |
| --- | --- |
| `src/sections` | 스크롤로 넘기는 첫 화면들 (Hero, About, Values, Projects, Footer) |
| `src/depth` | 카드를 눌러 내려가는 세부 페이지와 전환 상태 |
| `src/effects` | WebGL 물 효과, 스티커 물리, 기준 캔버스 계산 |
| `src/components` | 여러 페이지가 함께 쓰는 컴포넌트 |
| `src/navigation` | 휠 한 번에 한 섹션씩 넘기는 스크롤 처리 |
| `src/styles` | 화면별 스타일 |
