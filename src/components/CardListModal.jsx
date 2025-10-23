import { getAllCardNames } from '../data/cardData';

/**
 * Modal component to display all available cards in the game
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback to close the modal
 */
export default function CardListModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const cardNames = getAllCardNames();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gradient-royal rounded-3xl shadow-clash max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-royal-blue-950 p-6 border-b border-clash-yellow-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-gold">
              All Cards ({cardNames.length})
            </h2>
            <button
              onClick={onClose}
              className="text-clash-yellow-400 hover:text-clash-yellow-300 text-3xl font-bold transition-colors"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Card List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cardNames.map((name, index) => (
              <div
                key={index}
                className="bg-royal-blue-900 bg-opacity-50 rounded-xl p-3 text-center text-white text-sm font-medium hover:bg-opacity-70 transition-all hover:scale-105"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-royal-blue-950 p-4 border-t border-clash-yellow-600">
          <button
            onClick={onClose}
            className="w-full bg-gradient-gold text-royal-blue-950 font-bold py-3 rounded-xl hover:shadow-yellow-glow transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
