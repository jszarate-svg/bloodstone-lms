const fs = require('fs');
const filePath = 'app/teacher/page.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Strip any misplaced previous button references
content = content.replace(/\{?/\* Gemini Parser Action Header \*/\}?[\s\S]*?<\/div>/g, '');

// Target the top action bar containing "Clear All DLP Fields"
const buttonGroupAnchor = '<div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">';

const newButtonAndModal = `
        <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
          <button
            type="button"
            onClick={() => setIsAutoFillOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95 text-sm"
          >
            ⚡ Auto-Fill DLP from Gemini Text
          </button>`;

if (content.includes(buttonGroupAnchor)) {
  content = content.replace(buttonGroupAnchor, newButtonAndModal);
} else {
  // Fallback: place right above the form card header
  const cardHeaderAnchor = 'DepEd Order No. 016, s. 2026';
  const fallbackUI = `
        <div className="mb-4 print:hidden">
          <button
            type="button"
            onClick={() => setIsAutoFillOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95 text-sm"
          >
            ⚡ Auto-Fill DLP from Gemini Text
          </button>
        </div>\n`;
  content = content.replace(cardHeaderAnchor, fallbackUI + cardHeaderAnchor);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Placed Auto-Fill button at the top action bar!');
