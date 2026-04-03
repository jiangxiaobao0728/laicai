import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentAnswer: number | undefined;
  onSelect: (score: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  currentAnswer,
  onSelect,
  onPrev,
  onNext,
  isLast,
}: QuestionCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-2xl w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">{question.text}</h2>
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(option.score)}
              className={`w-full text-left py-3 px-5 rounded-lg border-2 transition-all ${
                currentAnswer === option.score
                  ? 'border-amber-500 bg-amber-50 text-amber-700 font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={onPrev}
            className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
          >
            上一题
          </button>
          <button
            onClick={onNext}
            disabled={!currentAnswer}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              currentAnswer
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLast ? '查看结果' : '下一题'}
          </button>
        </div>
      </div>
    </div>
  );
}
