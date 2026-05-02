# Coach Plus India

Coach Plus India is a local-first sports and fitness mentor for Indian users. It creates structured workout plans, calorie and protein targets, Indian food suggestions, recovery guidance, safety checks, progress metrics, weather-aware guidance, and multilingual voice support.

## Features

- Personalized fitness profile form
- Goals for fat loss, weight gain, healthy weight gain, lean muscle, muscle tone, stamina, strength, posture, mobility, heart health, sport performance, and general health
- Sport modes for cricket, football, badminton, running, gym training, and general fitness
- India city-aware heat, humidity, hydration, and outdoor intensity advice
- Red-flag safety checks for sharp pain, dizziness, chest pain, breathing difficulty, and injury notes
- WHO baseline activity guidance translated into weekly cardio and strength steps
- Indian food suggestions for vegetarian, eggitarian, non-vegetarian, and vegan users
- English, Tamil, Hindi, and Malayalam language preference
- Browser voice input for notes
- Browser text-to-speech for reading the plan aloud
- Backend validation and JSON plan generation
- Local history storage in `backend/memory.json`

## Project Structure

```text
NovaX/
  README.md
  sportx.txt
  backend/
    .env.example
    memory.json
    package.json
    package-lock.json
    src/
      orchestrator.js
      server.js
      utils/
        memoryStore.js
        validation.js
  frontend/
    index.html
    package.json
    package-lock.json
    vite.config.js
    public/
      .gitkeep
    src/
      App.jsx
      main.jsx
      styles.css
      api/
        client.js
      components/
        SectionCard.jsx
```

## Requirements

- Node.js 18+
- A Chromium-based browser such as Chrome or Edge for best voice input support

No Ollama setup is required for the current MVP. The backend uses deterministic planning rules so the app can run reliably offline.

Native Tamil, Hindi, Malayalam, and Kannada speech depends on the operating system/browser voice pack. This cannot be installed with an npm package. Install voices through Windows language settings or follow Microsoft's guide:

https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130

## Run Locally

Start the backend:

```bash
cd backend
npm install
npm run server
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run client
```

Open:

```text
http://127.0.0.1:3000
```

The API runs at:

```text
http://127.0.0.1:4000
```

## API

### `GET /api/health`

Returns backend health status.

### `POST /api/generate`

Example request:

```json
{
  "name": "Aarav",
  "age": 20,
  "gender": "Male",
  "heightCm": 174,
  "weightKg": 72,
  "goal": "Improve stamina",
  "sport": "Football",
  "activityLevel": "Moderate",
  "foodPreference": "Non-vegetarian",
  "language": "Tamil",
  "trainingDays": 4,
  "injuryHistory": "",
  "equipment": "Home/bodyweight"
}
```

The response includes:

- Mentor summary
- Maintenance and target calories
- Protein and hydration targets
- Weekly training plan
- Food guidance
- Recovery guidance
- Safety checks
- Language and voice locale metadata
- Progress metrics

## Notes

- Voice input and text-to-speech depend on browser support.
- This app is a fitness assistant, not a medical diagnosis tool.
- Users should seek medical help for chest pain, fainting, severe breathlessness, dizziness, sharp pain, or injury symptoms.
