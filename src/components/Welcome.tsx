interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center">
        <div className="text-5xl mb-6">💰</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">测测你的天生来财方式</h1>
        <p className="text-gray-600 mb-2">
          通过 20 道题目，发现你最适合自己的赚钱方式。
        </p>
        <p className="text-gray-500 text-sm mb-8">
          四大类型：斜杠青年、投资小能手、职场卷王、社交调解者
        </p>
        <div className="bg-amber-50 rounded-lg p-4 mb-8 text-left text-sm text-gray-600">
          <p className="font-medium mb-2">测试说明：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>共 20 题，请根据真实感受作答</li>
            <li>每题没有对错之分，选择最符合你的选项</li>
            <li>预计用时 3-5 分钟</li>
          </ul>
        </div>
        <button
          onClick={onStart}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          开始测试
        </button>
      </div>
    </div>
  );
}