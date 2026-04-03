'use client';

import { useTest } from '../hooks/useTest';
import Welcome from '../components/Welcome';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Result from '../components/Result';

export default function Home() {
  const {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    answers,
    results,
    lieScore,
    mixedTypeLabel,
    mixedTypeDescription,
    startTest,
    selectAnswer,
    goNext,
    goPrev,
    restart,
  } = useTest();

  if (phase === 'welcome') {
    return <Welcome onStart={startTest} />;
  }

  if (phase === 'result') {
    return (
      <Result
        results={results}
        lieScore={lieScore}
        mixedTypeLabel={mixedTypeLabel}
        mixedTypeDescription={mixedTypeDescription}
        onRestart={restart}
      />
    );
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-3">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} percentage={progress} />
      </div>
      <div className="pt-20">
        <QuestionCard
          question={currentQuestion}
          currentAnswer={answers.get(currentQuestion.id)}
          onSelect={selectAnswer}
          onPrev={goPrev}
          onNext={goNext}
          isLast={currentIndex === totalQuestions - 1}
        />
      </div>
    </div>
  );
}
