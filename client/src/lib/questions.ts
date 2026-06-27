/**
 * 학습·인지·적응기능 선별 체크리스트 문항 데이터
 *
 * 표준화 지능검사(K-WAIS/K-WISC 등), 적응행동검사(Vineland, ABAS, NISE-K·ABS 등)의
 * 평가 영역 구조를 참고하되, 실제 검사 문항을 복제하지 않고 자체 행동 관찰 문항으로 구성했습니다.
 *
 * 주의: 이 체크리스트는 진단 도구가 아니라 선별용 자가체크입니다.
 * 정확한 평가는 임상심리사, 정신건강의학과, 특수교육 전문가 등이 실시하는
 * 표준화 지능검사와 적응행동검사, 면담을 통해 이루어져야 합니다.
 */

import {
  DIFFERENTIAL_GUIDANCE,
  SCREENING_DISCLAIMER,
  getRiskLevelDisplay,
  getRiskResultDescription,
} from "./riskLevels";

export interface Question {
  id: number;
  text: string;
  category: string;
  description?: string;
}

export interface QuestionSet {
  title: string;
  description: string;
  targetAge: string;
  questions: Question[];
  disclaimer: string;
}

export const adultQuestions: QuestionSet = {
  title: "성인 학습·인지·적응기능 자가체크",
  description: "일상생활, 학업·직업 상황에서의 학습·인지·적응기능 어려움 가능성을 점검하는 선별 체크리스트입니다.",
  targetAge: "만 18세 이상 성인",
  disclaimer: `${SCREENING_DISCLAIMER} ${DIFFERENTIAL_GUIDANCE}`,
  questions: [
    {
      id: 1,
      text: "새로운 것을 배울 때, 구체적인 예나 여러 번의 설명이 필요한 편인가요?",
      category: "학습/개념 이해",
      description: "예를 들어 새로운 스마트폰 기능이나 일하는 방법을 배울 때, 남들보다 더 자세한 설명이나 반복된 시범이 있어야 마음이 편안해집니다."
    },
    {
      id: 2,
      text: "들은 설명을 직접 실행할 때, 순서를 다시 확인해야 할 때가 많나요?",
      category: "작업기억",
      description: "예를 들어 길 안내를 듣고 나서 돌아서면 기억이 잘 나지 않아, 지도 앱이나 메모를 다시 켜서 하나씩 확인하며 움직이곤 합니다."
    },
    {
      id: 3,
      text: "긴 글이나 안내문을 읽고 중요한 내용을 파악하는 데 시간이 오래 걸리는 편인가요?",
      category: "처리속도",
      description: "예를 들어 업무 지침서나 계약조건 같은 설명서를 읽을 때, 한 번에 읽기보다는 여러 번 곱씹어 읽어야 무슨 뜻인지 이해가 됩니다."
    },
    {
      id: 4,
      text: "약속 시간이나 챙겨야 할 물건을 자주 깜빡해서 알림이나 메모가 꼭 필요한가요?",
      category: "실행기능",
      description: "예를 들어 약속 시간을 잊어버리거나 필요한 짐을 두고 나올 때가 많아, 스마트폰 알림이나 메모장에 빼곡히 적어두어야 안심이 됩니다."
    },
    {
      id: 5,
      text: "여러 단계를 거쳐야 하는 일을 할 때, 미리 적어둔 순서를 보면서 해야 실수가 적은가요?",
      category: "실행기능",
      description: "예를 들어 요리를 하거나 기계를 조립할 때, 조리법이나 설명서의 단계별 순서를 수시로 쳐다보며 작업해야 빠뜨리는 부분 없이 완료할 수 있습니다."
    },
    {
      id: 6,
      text: "대화 중에 상대방의 농담이나 비유적인 표현의 속뜻을 바로 알아채기 힘들 때가 있나요?",
      category: "사회적 판단",
      description: "예를 들어 '눈치가 빠르다'거나 비꼬는 말, 돌려 말하는 의도를 즉시 이해하지 못해 나중에 그 말이 무슨 의미였는지 곱씹어 생각할 때가 있습니다."
    },
    {
      id: 7,
      text: "낯선 사람이 제안하거나 부탁할 때, 그것이 나에게 해가 되는지 스스로 판단하기 조심스럽나요?",
      category: "사회적 판단",
      description: "예를 들어 권유 전화나 솔깃한 제안을 받았을 때 바로 판단을 내리지 못하고, 주변 사람들에게 물어보고 나서야 결정을 내리는 편이 안전하다고 느낍니다."
    },
    {
      id: 8,
      text: "피곤하거나 마음이 불안할 때, 생각을 하거나 결정하는 데 더 큰 어려움을 느끼나요?",
      category: "정서/주의/수면 등 혼동 요인",
      description: "예를 들어 잠을 잘 못 자거나 큰 스트레스를 받으면 평소에 잘 풀리던 쉬운 문제나 간단한 업무 처리에서도 버벅거리거나 판단력이 흐려질 때가 있습니다."
    },
    {
      id: 9,
      text: "기간이 긴 프로젝트나 큰일을 준비할 때, 계획표를 아주 촘촘하게 쪼개서 짜야 실행이 가능한가요?",
      category: "실행기능",
      description: "예를 들어 시험공부나 여행 준비를 할 때, '오늘은 몇 페이지까지'처럼 일정을 세부적으로 쪼개서 체크해 나가야 차근차근 해낼 수 있습니다."
    },
    {
      id: 10,
      text: "반복되는 일상 업무나 가사일에서도 체크리스트가 있어야 실수 없이 끝낼 수 있나요?",
      category: "학업/직업 적응",
      description: "예를 들어 매일 하는 서류 처리나 외출 준비를 할 때도, 직접 종이에 적은 체크리스트를 하나씩 지워가며 일해야 빠뜨리는 부분 없이 완료할 수 있습니다."
    },
    {
      id: 11,
      text: "생소한 개념이나 낯선 용어를 익힐 때, 예시를 보고 직접 여러 번 연습해봐야 완전히 내 것이 되나요?",
      category: "학습/개념 이해",
      description: "예를 들어 새로운 프로그램이나 규칙을 사용할 때, 이론 설명만 듣고는 이해가 어려워 실제 예시를 따라 하며 여러 번 다뤄봐야 알 수 있습니다."
    },
    {
      id: 12,
      text: "낯선 장소, 복잡한 신청 절차, 혹은 새로운 모임에 적응하는 데 남들보다 오랜 시간이 걸리나요?",
      category: "일상생활 적응",
      description: "예를 들어 새로 이사한 동네의 길을 익히거나, 낯선 행정 절차를 밟을 때 남들보다 긴장하고 익숙해지는 데 며칠 혹은 몇 주가 필요합니다."
    },
    {
      id: 13,
      text: "주변 소리가 시끄럽거나 걱정거리가 있을 때, 하려던 일에 집중하지 못하고 주의가 흩어지나요?",
      category: "정서/주의/수면 등 혼동 요인",
      description: "예를 들어 카페의 작은 대화 소리나 마음속 걱정거리가 계속 맴돌면, 하려던 공부나 업무를 시작조차 못 하고 시간을 보내기도 합니다."
    },
    {
      id: 14,
      text: "중요한 계약서나 행정 서류를 작성할 때, 다른 사람과 함께 검토해야 마음이 든든하고 안심이 되나요?",
      category: "일상생활 적응",
      description: "예를 들어 은행 대출 서류, 전세 계약서, 혹은 복잡한 보험 청구서를 작성할 때 서명하기 전 신뢰할 수 있는 지인에게 내용 확인을 요청하곤 합니다."
    },
    {
      id: 15,
      text: "민원 신청이나 정부 지원금 신청 같은 복잡한 온라인 절차는 가이드가 꼭 있어야 처리할 수 있나요?",
      category: "학업/직업 적응",
      description: "예를 들어 연말정산이나 여권 신청처럼 여러 페이지를 거치는 온라인 신청을 할 때, 인터넷 블로그의 캡처 화면 설명이나 단계별 가이드라인이 필수적입니다."
    }
  ]
};

export const childQuestions: QuestionSet = {
  title: "아동 학습·인지·적응기능 선별검사 (보호자용)",
  description: "자녀의 최근 6개월간 학습, 인지, 사회적 판단, 일상 적응 모습을 관찰하여 응답해 주세요.",
  targetAge: "만 5세 ~ 만 15세 아동·청소년",
  disclaimer: `${SCREENING_DISCLAIMER} ${DIFFERENTIAL_GUIDANCE}`,
  questions: [
    {
      id: 1,
      text: "아이가 새로운 단어나 공부 주제를 배울 때, 쉬운 예와 함께 여러 번 설명해 주어야 이해하나요?",
      category: "학습/개념 이해",
      description: "예를 들어 '양보'라는 단어를 배울 때, 말로 정의를 설명하기보다 '친구에게 장난감을 먼저 쓰게 해주는 것'처럼 실제 상황을 들어 여러 번 이야기해야 이해합니다."
    },
    {
      id: 2,
      text: "아이가 두 가지 이상의 심부름이나 지시를 들었을 때, 순서를 헷갈려 하거나 중간에 멈칫하나요?",
      category: "작업기억",
      description: "예를 들어 '가방에서 공책 꺼내고, 양치한 다음, 식탁에 앉아라'처럼 연달아 지시하면 두 번째나 세 번째 행동을 잊고 다시 물어볼 때가 있습니다."
    },
    {
      id: 3,
      text: "아이가 해야 할 숙제나 과제가 무엇인지 파악하고 실제로 행동으로 옮기기까지 오랜 시간이 걸리나요?",
      category: "학업/직업 적응",
      description: "예를 들어 학교나 학원 숙제를 시작하라고 하면, 책을 펴고 연필을 잡기까지 멍하게 앉아 있거나 시작 방법을 몰라 꾸물거릴 때가 있습니다."
    },
    {
      id: 4,
      text: "아이가 책을 소리 내어 읽거나 받아쓰기 같은 쓰기 과제를 할 때, 조금 더 세심한 관심이나 지도가 필요한가요?",
      category: "학습/개념 이해",
      description: "예를 들어 또래 친구들에 비해 문장을 더듬거리며 천천히 읽거나, 단어의 맞춤법을 자주 틀리고, 방금 읽은 문단의 내용을 요약하기 어려워할 때가 있습니다."
    },
    {
      id: 5,
      text: "아이가 덧셈이나 뺄셈 같은 수학 기초를 배울 때, 바둑돌이나 손가락을 사용해 눈으로 보여주어야 수월해하나요?",
      category: "학습/개념 이해",
      description: "예를 들어 머릿속으로 '5 더하기 3'을 계산하는 대신 손가락을 꼽아 세거나, 그림책에 그려진 사과 개수를 하나하나 손으로 짚어가며 연산하곤 합니다."
    },
    {
      id: 6,
      text: "아이가 새로운 놀이나 스포츠, 공부 규칙을 배우고 혼자서 능숙하게 해내기까지 남들보다 많은 연습이 필요한가요?",
      category: "처리속도",
      description: "예를 들어 보드게임의 규칙이나 자전거 타는 법을 배운 뒤, 바로 하기 어려워하여 천천히 손을 잡고 여러 차례 반복해서 맞춰봐야 스스로 할 수 있습니다."
    },
    {
      id: 7,
      text: "아이가 친구들과 모여 놀 때, 순서를 지키거나 친구의 기분을 이해할 수 있도록 어른이 곁에서 짚어주어야 하나요?",
      category: "사회적 판단",
      description: "예를 들어 숨바꼭질이나 보드게임을 할 때 규칙을 어겨 다툼이 생기거나, 친구가 싫어하는 표정을 알아채지 못해 '친구가 속상하대'라고 어른이 개입해야 조화롭게 놉니다."
    },
    {
      id: 8,
      text: "아이가 갑자기 시간표가 바뀌거나 계획이 틀어졌을 때, 당황해서 어떻게 행동해야 할지 알려주어야 하나요?",
      category: "사회적 판단",
      description: "예를 들어 비가 와서 야외 체육 대신 실내 독서로 변경되었을 때, 고집을 부리거나 멍하니 서 있어 '선생님 따라 교실로 가자'고 직접 알려주어야 움직입니다."
    },
    {
      id: 9,
      text: "아이가 떼를 쓰거나 화가 났을 때, 마음이 가라앉도록 돕고 왜 속상했는지 천천히 물어봐 주어야 안정을 찾나요?",
      category: "정서/주의/수면 등 혼동 요인",
      description: "예를 들어 원하는 장난감을 갖지 못해 울거나 화를 낼 때, 혼내기보다 꼭 안아주고 '가지고 싶어서 속상했구나'라고 감정을 말로 짚어주어야 진정이 됩니다."
    },
    {
      id: 10,
      text: "아이가 잠을 덜 잤거나 방 안이 시끄러울 때, 평소보다 금방 집중력이 흩어지고 딴청을 피우나요?",
      category: "정서/주의/수면 등 혼동 요인",
      description: "예를 들어 늦게 잠든 다음 날이나 옆방에서 텔레비전 소리가 들릴 때, 하던 숙제를 끝내지 못하고 연필을 굴리며 주변을 두리번거립니다."
    },
    {
      id: 11,
      text: "아이가 혼자서 옷을 입거나 학교 가방을 챙길 때, 그림이나 글자로 그린 순서표를 보여주면 실수가 적어지나요?",
      category: "일상생활 적응",
      description: "예를 들어 현관문 앞에 붙여놓은 '양말 신기, 가방 챙기기, 신발 신기' 순서 그림판을 보면서 스스로 챙기고 어른이 검토해 주는 과정이 필요합니다."
    },
    {
      id: 12,
      text: "아이가 이미 배운 인사법이나 예절을 머리로는 알아도, 실제 상황에서 다시 말해주어야 올바르게 행동하나요?",
      category: "실행기능",
      description: "예를 들어 어른을 만났을 때 인사해야 한다는 것을 알지만, 쭈뼛거리거나 잊고 있을 때 곁에서 '어른을 보면 고개 숙여 인사하는 거야'라고 리마인드해 주면 비로소 실천합니다."
    },
    {
      id: 13,
      text: "아이가 학교에서 있었던 일을 이야기할 때, 어른이 세세하게 질문을 던져주어야 끝까지 설명할 수 있나요?",
      category: "작업기억",
      description: "예를 들어 '오늘 학교 어땠어?'라고 물으면 '몰라요'라고 하지만, '오늘 점심 뭐 나왔어? 누구랑 놀았어?'처럼 질문을 쪼개어 물어보면 신나서 잘 설명합니다."
    },
    {
      id: 14,
      text: "아이가 새 학년이 되거나 이사를 할 때, 미리 충분히 마음의 준비를 할 수 있도록 설명해 주면 적응을 더 잘하나요?",
      category: "일상생활 적응",
      description: "예를 들어 다음 주에 새 학원이 시작된다면 며칠 전부터 '어떤 반에서 어떤 선생님을 만날 것'인지 차분히 설명해 주어야 당황하지 않고 수월하게 진입합니다."
    },
    {
      id: 15,
      text: "아이가 숙제를 시작하고 끝마칠 때까지, 옆에서 일정표를 봐주거나 다 끝냈는지 확인해 주는 편이 좋나요?",
      category: "실행기능",
      description: "예를 들어 일기 쓰기를 시작할 때 지켜봐 주고, 끝내고 나면 '일기장 가방에 넣었니?'라고 어른이 마지막 마무리까지 확인해 주는 편이 누락이 없습니다."
    },
    {
      id: 16,
      text: "아이가 놀이 규칙이나 체육 동작을 배울 때, 말로 설명하는 것보다 어른이 몸으로 먼저 보여주는 것이 효과적인가요?",
      category: "처리속도",
      description: "예를 들어 야구 룰이나 축구 패스법을 말로만 일러주면 헷갈려 하지만, 눈앞에서 공을 차는 시범을 보여주고 손을 잡아 연습시키면 훨씬 빠르게 이해합니다."
    },
    {
      id: 17,
      text: "아이가 학교 시험 문제를 풀 때, 문제에 든 예시를 잘 보거나 중요한 단어에 표시를 해두면 실수가 줄어드나요?",
      category: "학업/직업 적응",
      description: "예를 들어 '가장 알맞은 것은?'이라는 문장에서 '알맞지 않은 것'으로 착각하는 실수를 막기 위해, 핵심 단어에 밑줄을 긋거나 동그라미를 그리며 풀도록 도우면 오답이 줍니다."
    },
    {
      id: 18,
      text: "아이가 학교에서 숙제나 가정통신문을 제시간에 제출하는 규칙을 익힐 때, 여러 번 잔소리처럼 알려주어야 기억하나요?",
      category: "학업/직업 적응",
      description: "예를 들어 '아침에 등교하면 사물함에 숙제장부터 넣기'라는 약속을 혼자 지키기 힘들어서, 매일 아침 가방을 쌀 때마다 반복해서 상기시켜 주는 지도가 필요합니다."
    }
  ]
};

export type AnswerValue = 0 | 1 | 2 | 3;

export const answerOptions = [
  { value: 0 as AnswerValue, label: "전혀 그렇지 않다" },
  { value: 1 as AnswerValue, label: "가끔 그렇다" },
  { value: 2 as AnswerValue, label: "자주 그렇다" },
  { value: 3 as AnswerValue, label: "항상 그렇다" },
];

export interface ResultLevel {
  min: number;
  max: number;
  level: string;
  title: string;
  description: string;
  recommendation: string;
  color: string;
}

export const adultResultLevels: ResultLevel[] = [
  {
    min: 0, max: 10,
    level: "low",
    title: getRiskLevelDisplay("low").resultTitle,
    description: getRiskResultDescription("low", "adult"),
    recommendation: `지금처럼 일상 루틴과 강점을 유지해 주세요. 특정 어려움이 새로 생기거나 오래 지속된다면 상담이나 평가를 통해 원인을 확인할 수 있습니다. ${DIFFERENTIAL_GUIDANCE}`,
    color: getRiskLevelDisplay("low").resultColor
  },
  {
    min: 11, max: 22,
    level: "caution",
    title: getRiskLevelDisplay("caution").resultTitle,
    description: getRiskResultDescription("caution", "adult"),
    recommendation: "어려움이 반복되거나 학업·직업·대인관계에 영향을 준다면 상담이나 검사를 권합니다. 최근 컨디션과 생활 변화도 함께 기록해 보세요.",
    color: getRiskLevelDisplay("caution").resultColor
  },
  {
    min: 23, max: 45,
    level: "consult",
    title: getRiskLevelDisplay("consult").resultTitle,
    description: getRiskResultDescription("consult", "adult"),
    recommendation: "임상심리사, 정신건강의학과, 상담센터 등에서 표준화 지능검사와 적응행동검사, 면담을 포함한 평가를 받아보는 것을 권합니다. 필요한 지원을 찾기 위한 참고 자료로 활용해 주세요.",
    color: getRiskLevelDisplay("consult").resultColor
  },
];

export const childResultLevels: ResultLevel[] = [
  {
    min: 0, max: 12,
    level: "low",
    title: getRiskLevelDisplay("low").resultTitle,
    description: getRiskResultDescription("low", "child"),
    recommendation: `지금처럼 자녀의 강점과 작은 성취를 지지해 주세요. 어려움이 새로 생기거나 오래 지속된다면 담임교사나 전문가와 상의할 수 있습니다. ${DIFFERENTIAL_GUIDANCE}`,
    color: getRiskLevelDisplay("low").resultColor
  },
  {
    min: 13, max: 26,
    level: "caution",
    title: getRiskLevelDisplay("caution").resultTitle,
    description: getRiskResultDescription("caution", "child"),
    recommendation: "어려움이 지속된다면 담임교사, Wee센터, 발달센터 등과 상담해 보세요. 가정에서는 반복 안내, 시각 단서, 칭찬 중심의 지원이 도움이 될 수 있습니다.",
    color: getRiskLevelDisplay("caution").resultColor
  },
  {
    min: 27, max: 54,
    level: "consult",
    title: getRiskLevelDisplay("consult").resultTitle,
    description: getRiskResultDescription("consult", "child"),
    recommendation: "가능하면 소아정신건강의학과, 임상심리사, 특수교육 전문가와 상의해 K-WISC 등 표준화 지능검사, Vineland·ABAS·NISE-K·ABS 등 적응행동검사, 면담을 포함한 평가를 받아보세요. 결과는 자녀에게 맞는 지원을 찾기 위한 참고 자료로 활용해 주세요.",
    color: getRiskLevelDisplay("consult").resultColor
  },
];

export function getResultLevel(score: number, type: 'adult' | 'child'): ResultLevel {
  const levels = type === 'adult' ? adultResultLevels : childResultLevels;
  return levels.find(l => score >= l.min && score <= l.max) || levels[levels.length - 1];
}

export function getCategoryScores(answers: Record<number, AnswerValue>, questions: Question[]): Record<string, { score: number; max: number }> {
  const categories: Record<string, { score: number; max: number }> = {};

  questions.forEach(q => {
    if (!categories[q.category]) {
      categories[q.category] = { score: 0, max: 0 };
    }
    categories[q.category].max += 3;
    if (answers[q.id] !== undefined) {
      categories[q.category].score += answers[q.id];
    }
  });

  return categories;
}

export const supportResources = [
  {
    name: "정신건강위기상담전화",
    phone: "1577-0199",
    description: "24시간 정신건강 상담",
  },
  {
    name: "서울시 경계선지능인 평생교육지원센터",
    url: "https://sbifc.org",
    description: "경계선 지능 관련 교육·상담·지원 정보",
  },
  {
    name: "국가기초학력지원포털",
    url: "https://www.basics.re.kr",
    description: "기초학력 및 학습 지원 정보",
  },
  {
    name: "Wee센터",
    phone: "1588-7179",
    description: "학생 상담 및 심리검사 지원",
  },
  {
    name: "발달장애인지원센터",
    phone: "1644-8295",
    description: "발달·적응 관련 종합 지원",
  },
];
