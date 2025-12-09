const textarea = document.getElementById('html-input');
const captureBtn = document.getElementById('capture-btn');
const output = document.getElementById('image-output');

const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : window.location.origin;

function buildListHtml() {
  const items = Array.from({ length: 200 }, (_, index) => {
    const rowNumber = index + 1;
    const background = rowNumber % 2 === 0 ? '#f9fafb' : '#ffffff';
    return `    <li style="height: 50px; line-height: 50px; padding: 0 16px; border-bottom: 1px solid #e5e7eb; background: ${background};">Строка ${rowNumber}</li>`;
  });

  return `
<div id="capture" style="width: 420px; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(27, 35, 50, 0.08); background: #fff;">
  <header style="padding: 16px; background: linear-gradient(120deg, #5c6bf7, #8b9bff); color: white;">
    <p style="margin: 0 0 4px; font-size: 13px; opacity: 0.85;">Демонстрация</p>
    <h2 style="margin: 0; font-size: 18px;">Список из 200 строк (50px каждая)</h2>
  </header>
  <ul style="margin: 0; padding: 0; list-style: none;">
${items.join('\n')}
  </ul>
</div>
`;
}

textarea.value = buildListHtml().trim();

async function createScreenshot() {
  output.textContent = 'Generating...';

  try {
    const response = await fetch(`${API_BASE_URL}/api/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: textarea.value })
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Request failed');
    }

    const { image, width, height } = await response.json();
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Captured block';
    if (width && height) {
      img.width = width;
      img.height = height;
    }

    output.innerHTML = '';
    output.appendChild(img);

    if (width && height) {
      const note = document.createElement('p');
      note.textContent = `Original size: ${width}px × ${height}px (ready for printing without scaling).`;
      note.style.margin = '8px 0 0';
      note.style.color = '#4b5563';
      output.appendChild(note);
    }
  } catch (error) {
    output.textContent = error.message;
  }
}

captureBtn.addEventListener('click', () => {
  createScreenshot();
});
