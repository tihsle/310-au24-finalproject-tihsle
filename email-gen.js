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

  //check
  console.log({
    url: CHATGPT_API_URL,
    apiKey: API_KEY,
    requestBody: {
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Generate a professional email based on this prompt: ${prompt}`,
      max_tokens: 150,
    },
  });

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

    emailContainer.innerHTML = `
      <div class="border rounded p-3">
        <h4>Generated Email:</h4>
        <p>${email.replace(/\n/g, '<br>')}</p>
      </div>
    `;
  } catch (error) {
    emailContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
});