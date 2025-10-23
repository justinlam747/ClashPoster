import { useRef } from 'react';

/**
 * ShareImage component - Generates a shareable PNG image of game results
 * Uses html2canvas approach (to be installed via npm)
 */
export default function ShareImage({
  discussionSummary,
  imposterIndices,
  realCard,
  imposterCard,
  imposterMode,
}) {
  const shareRef = useRef(null);

  const handleDownload = async () => {
    // Note: This requires html2canvas to be installed
    // For now, we'll use a simpler approach with canvas API
    try {
      // Create a data URL from the share content
      const element = shareRef.current;

      // Use html2canvas if available (need to install: npm install html2canvas)
      if (window.html2canvas) {
        const canvas = await window.html2canvas(element, {
          backgroundColor: '#1e1b4b',
          scale: 2,
        });

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `clashimposter-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      } else {
        // Fallback: inform user to install html2canvas
        alert(
          'Image export requires html2canvas library. For now, take a screenshot of this page!'
        );
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please take a screenshot instead!');
    }
  };

  return (
    <div>
      {/* Hidden div for screenshot generation */}
      <div
        ref={shareRef}
        className="hidden absolute top-0 left-0 bg-gradient-clash p-8 w-[600px]"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Logo Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-gold mb-2">
            ClashImposter
          </h1>
          <p className="text-clash-yellow-400">Game Results</p>
        </div>

        {/* Discussion Summary */}
        <div className="bg-royal-blue-950 bg-opacity-90 rounded-xl p-6 mb-6">
          <h3 className="text-clash-yellow-400 font-bold text-lg mb-3">
            Discussion:
          </h3>
          {discussionSummary.map((entry, index) => (
            <div key={index} className="mb-2 text-white">
              <span className="text-clash-yellow-400 font-semibold">
                Player {entry.player}:
              </span>{' '}
              {entry.words || <em className="text-gray-400">No input</em>}
            </div>
          ))}
        </div>

        {/* Imposter Reveal */}
        <div className="bg-red-900 bg-opacity-90 rounded-xl p-6 border-2 border-red-500">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Imposter Revealed!</h2>
            <p className="text-3xl font-bold text-yellow-300 mb-4">
              {imposterIndices.map((idx) => `Player ${idx + 1}`).join(' & ')}
            </p>

            <div className="space-y-2 text-left">
              <div className="bg-royal-blue-950 bg-opacity-50 rounded-lg p-3">
                <p className="text-clash-yellow-400 text-sm font-semibold">
                  Real Card:
                </p>
                <p className="text-white text-lg font-bold">{realCard.name}</p>
              </div>

              {imposterMode === 'similar' && imposterCard && (
                <div className="bg-red-950 bg-opacity-50 rounded-lg p-3">
                  <p className="text-red-300 text-sm font-semibold">
                    Imposter's Card:
                  </p>
                  <p className="text-white text-lg font-bold">
                    {imposterCard.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-clash-yellow-400 text-sm">
          Generated with ClashImposter
        </div>
      </div>

      {/* Download Button (visible) */}
      <button
        onClick={handleDownload}
        className="w-full bg-clash-yellow-600 text-white font-bold py-4 rounded-xl hover:bg-clash-yellow-500 transition-all text-lg"
      >
        📸 Download Results
      </button>

      <p className="text-center text-clash-yellow-400 text-xs mt-2">
        Or take a screenshot of the results screen!
      </p>
    </div>
  );
}
