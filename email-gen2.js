const formEl = document.getElementById('email-generator-form');
const promptEl = document.getElementById('prompt');
const emailContainer = document.getElementById('email-container');

const CHATGPT_API_URL = 'https://api.openai.com/v1/completions';

formEl.addEventListener('submit', async function (e) {
  e.preventDefault();

  const prompt = promptEl.value.trim();

  if (!prompt) {
    emailContainer.innerHTML = `<p class="text-danger">Please enter a prompt.</p>`;
    return;
  }

  emailContainer.innerHTML = '<p class="text-info">Generating email...</p>';

  // Timing function
  setTimeout(async () => {
    try {
      const response = await fetch(CHATGPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Generate a professional email based on this prompt: ${prompt}`,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email. Please try again later.');
      }

      const data = await response.json();
      const email = data.choices[0].text.trim();

      // Save to local storage
      const emailHistory = JSON.parse(localStorage.getItem('emailHistory')) || [];
      emailHistory.push({ prompt, email, timestamp: new Date().toISOString() });
      localStorage.setItem('emailHistory', JSON.stringify(emailHistory));

      // Display email
      emailContainer.innerHTML = `
        <div class="border rounded p-3">
          <h4>Generated Email:</h4>
          <p>${email.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    } catch (error) {
      emailContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
  }, 2000); // 2 seconds delay
});

// Validate form fields
promptEl.addEventListener('input', () => {
  if (promptEl.value.trim() === '') {
    promptEl.classList.add('is-invalid');
  } else {
    promptEl.classList.remove('is-invalid');
  }
});

// load from local storage
function loadEmailHistory() {
  const emailHistory = JSON.parse(localStorage.getItem('emailHistory')) || [];
  if (emailHistory.length > 0) {
    emailContainer.innerHTML = '<h4>Email History:</h4>';
    emailHistory.forEach((entry) => {
      emailContainer.innerHTML += `
        <div class="border rounded p-2 my-2">
          <p><strong>Prompt:</strong> ${entry.prompt}</p>
          <p><strong>Email:</strong> ${entry.email.replace(/\n/g, '<br>')}</p>
          <p><em>Generated on: ${new Date(entry.timestamp).toLocaleString()}</em></p>
        </div>
      `;
    });
  }
}

// Load history on page load if one exists
document.addEventListener('DOMContentLoaded', loadEmailHistory);