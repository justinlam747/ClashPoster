import { useState } from 'react';

/**
 * DiscussionRound component - Captures what each player says during discussion rounds
 * Shows previous words said by the player in earlier rounds
 */
export default function DiscussionRound({
  roundNumber,
  playerName,
  previousWords,
  onSubmit,
}) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onSubmit(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="card-base card-noise p-8">
      {/* Round and Player Header */}
      <div className="text-center mb-8">
        <div className="text-clash-yellow-400 text-xl font-bold mb-4 text-3d-blue">
          Round {roundNumber}
        </div>
        <h2 className="text-4xl text-3d-gold">
          {playerName}
        </h2>
      </div>

      {/* Previous Words (if any) */}
      {previousWords && previousWords.trim() !== '' && (
        <div className="bg-royal-blue-900 bg-opacity-50 rounded-xl p-6 mb-8 border border-clash-yellow-600">
          <p className="text-clash-yellow-300 text-lg font-bold mb-3">
            You previously said:
          </p>
          <p className="text-white text-xl">{previousWords}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-8">
        <p className="text-white text-center mb-4 text-xl font-medium">
          What did you say in this round?
        </p>
        <p className="text-clash-yellow-400 text-lg text-center opacity-75">
          (Optional - leave blank to skip)
        </p>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter what you said..."
        className="w-full bg-royal-blue-900 bg-opacity-50 text-white rounded-xl px-4 py-4 mb-8 focus:outline-none focus:ring-2 focus:ring-clash-yellow-500 placeholder-gray-400 border border-clash-yellow-600 text-lg"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-gold text-royal-blue-950 font-bold py-4 rounded-xl hover:shadow-yellow-glow transition-all text-xl"
      >
        Next
      </button>

      {/* Helper Text */}
      <p className="text-center text-white text-sm mt-6 opacity-50">
        Press Enter or tap Next to continue
      </p>
    </div>
  );
}
