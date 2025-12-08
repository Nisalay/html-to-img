const textarea = document.getElementById('html-input');
const captureBtn = document.getElementById('capture-btn');
const output = document.getElementById('image-output');

const defaultBlock = `
<div id="capture" style="width: 360px; min-height: 200px; border-radius: 16px; padding: 24px; background: linear-gradient(135deg, #eef2ff, #e0ecff); color: #1f2937; box-shadow: 0 12px 30px rgba(92, 107, 247, 0.25);">
  <p style="margin: 0; font-size: 14px; opacity: 0.8;">Example</p>
  <h2 style="margin: 6px 0 10px;">Puppeteer Capture</h2>
  <p style="margin: 0; line-height: 1.4;">Edit this HTML and click Capture to get a PNG of the element with id="capture".</p>
</div>
`;

textarea.value = defaultBlock.trim();

async function createScreenshot() {
  output.textContent = 'Generating...';

  try {
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: textarea.value })
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Request failed');
    }

    const { image } = await response.json();
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Captured block';

    output.innerHTML = '';
    output.appendChild(img);
  } catch (error) {
    output.textContent = error.message;
  }
}

captureBtn.addEventListener('click', () => {
  createScreenshot();
});
