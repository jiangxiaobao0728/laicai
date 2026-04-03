import { useState, useMemo, useCallback } from 'react';
import { questions, lieDetectionQuestions, dimensions } from '../data/questions';
import { TestPhase, Answer } from '../types';

// 测谎题插入位置：每5题后插入1道测谎题
function buildQuestionFlow() {
  const all: typeof questions = [];
  const lieQs = [...lieDetectionQuestions];
  let lieIndex = 0;
  questions.forEach((q, i) => {
    all.push(q);
    if ((i + 1) % 5 === 0 && lieIndex < lieQs.length) {
      all.push(lieQs[lieIndex]);
      lieIndex++;
    }
  });
  return all;
}

export function useTest() {
  const [phase, setPhase] = useState<TestPhase>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());

  const allQuestions = useMemo(() => buildQuestionFlow(), []);
  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const startTest = useCallback(() => {
    setPhase('testing');
    setCurrentIndex(0);
    setAnswers(new Map());
  }, []);

  const selectAnswer = useCallback((score: number) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(currentQuestion.id, score);
      return next;
    });
  }, [currentQuestion]);

  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('result');
    }
  }, [currentIndex, totalQuestions]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const restart = useCallback(() => {
    setPhase('welcome');
    setCurrentIndex(0);
    setAnswers(new Map());
  }, []);

  const results = useMemo(() => {
    return dimensions.map((dim) => {
      const dimQuestions = questions.filter((q) => q.dimensionId === dim.id);
      const totalScore = dimQuestions.reduce((sum, q) => {
        return sum + (answers.get(q.id) || 0);
      }, 0);
      const maxScore = dimQuestions.length * 5;
      const percentage = Math.round((totalScore / maxScore) * 100);
      return { ...dim, totalScore, maxScore, percentage };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [answers]);

  // 测谎分数：测谎题选"非常符合"(5分)越多，测谎分越高
  const lieScore = useMemo(() => {
    const lieIds = lieDetectionQuestions.map((q) => q.id);
    let total = 0;
    let count = 0;
    lieIds.forEach((id) => {
      const answer = answers.get(id);
      if (answer !== undefined) {
        total += answer;
        count++;
      }
    });
    return count > 0 ? Math.round((total / (count * 5)) * 100) : 0;
  }, [answers]);

  // 混合类型：取前两名
  const primaryType = results[0];
  const secondaryType = results[1];
  const gap = primaryType.percentage - secondaryType.percentage;

  let mixedTypeLabel = '';
  let mixedTypeDescription = '';
  if (gap < 10) {
    // 差距很小，典型混合型
    const combos: Record<string, string> = {
      'slash-investor': '斜杠投资者',
      'investor-slash': '斜杠投资者',
      'slash-climber': '斜杠攀登者',
      'climber-slash': '斜杠攀登者',
      'slash-connector': '社交斜杠',
      'connector-slash': '社交斜杠',
      'investor-climber': '投资型攀登者',
      'climber-investor': '投资型攀登者',
      'investor-connector': '社交投资者',
      'connector-investor': '社交投资者',
      'climber-connector': '社交型卷王',
      'connector-climber': '社交型卷王',
    };
    const key = `${primaryType.id}-${secondaryType.id}`;
    mixedTypeLabel = combos[key] || `${primaryType.name}+${secondaryType.name}`;
    mixedTypeDescription = `你的${primaryType.name}和${secondaryType.name}特质非常接近（差距仅${gap}分），属于「${mixedTypeLabel}」混合型。你同时具备两种类型的核心特征：既有${primaryType.name}的${primaryType.strengths[0]?.replace(/，.*$/, '') || '特质'}，又有${secondaryType.name}的${secondaryType.strengths[0]?.replace(/，.*$/, '') || '特质'}。这种组合让你在跨领域发展时更具优势。`;
  } else if (gap < 25) {
    // 中等差距，有主有次
    mixedTypeLabel = `${primaryType.name}（主）+ ${secondaryType.name}（辅）`;
    mixedTypeDescription = `你的主要来财方式是${primaryType.name}，同时${secondaryType.name}是你的重要辅助（差距${gap}分）。这意味着你在发挥${primaryType.name}优势的同时，可以适当融入${secondaryType.name}的策略，比如用${secondaryType.name}的方式来放大你的主要收入来源。`;
  } else {
    // 差距大，单一型
    mixedTypeLabel = primaryType.name;
    mixedTypeDescription = `你的${primaryType.name}特质非常突出（领先第二名${gap}分），属于典型的${primaryType.name}型。你的赚钱方式有明确的倾向性，专注于发挥这一类型的优势就能获得最好的结果。`;
  }

  return {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    answers,
    results,
    lieScore,
    primaryType,
    secondaryType,
    mixedTypeLabel,
    mixedTypeDescription,
    startTest,
    selectAnswer,
    goNext,
    goPrev,
    restart,
  };
}
