import { useEffect, useMemo, useRef, useState } from "react";
import { fetchLanguagePacks, generatePlan } from "./api/client";
import SectionCard from "./components/SectionCard";

const initialForm = {
  name: "Aarav",
  age: 20,
  gender: "Male",
  heightCm: 174,
  weightKg: 72,
  goal: "Improve stamina",
  sport: "Football",
  activityLevel: "Moderate",
  foodPreference: "Non-vegetarian",
  language: "English",
  voiceLanguage: "English",
  chennaiArea: "Bengaluru",
  outdoorTrainingTime: "Early morning",
  trainingDays: 4,
  durationWeeks: 4,
  injuryHistory: "",
  equipment: "Home/bodyweight"
};

const voiceLocales = {
  English: "en-IN",
  Tamil: "ta-IN",
  Hindi: "hi-IN",
  Malayalam: "ml-IN",
  Kannada: "kn-IN"
};

const languageOptions = ["English", "Tamil", "Hindi", "Malayalam", "Kannada"];
const foodPreferenceOptions = [
  "Vegetarian",
  "Eggitarian",
  "Non-vegetarian",
  "Vegan",
  "Pescatarian",
  "High-protein vegetarian",
  "South Indian vegetarian",
  "North Indian vegetarian",
  "No onion/garlic",
  "Jain",
  "Lactose-free",
  "Gluten-free",
  "Diabetes-friendly",
  "Budget student meals",
  "Hostel food",
  "Home-cooked mixed diet"
];
const sportOptions = [
  "General fitness",
  "Cricket",
  "Football",
  "Kabaddi",
  "Volleyball",
  "Basketball",
  "Badminton",
  "Running",
  "Gym training",
  "Tennis",
  "Hockey",
  "Swimming",
  "Boxing",
  "Table tennis",
  "Yoga"
];
const goalOptions = [
  "Lose fat",
  "Gain weight",
  "Healthy weight gain",
  "Build muscle",
  "Lean muscle gain",
  "Muscle tone",
  "Improve stamina",
  "Improve strength",
  "Improve flexibility",
  "Improve speed",
  "Improve agility",
  "Improve endurance",
  "Improve posture",
  "Improve mobility",
  "Heart health",
  "Sport performance",
  "Running performance",
  "Beginner gym training",
  "Home fitness",
  "Bodyweight strength",
  "Recover safely",
  "Maintain fitness",
  "Stay healthy"
];
const equipmentOptions = [
  "Home/bodyweight",
  "Resistance band",
  "Yoga mat",
  "Skipping rope",
  "Dumbbells",
  "Kettlebell",
  "Barbell",
  "Bench",
  "Pull-up bar",
  "Gym machines",
  "Treadmill",
  "Cycle",
  "Cones",
  "Football",
  "Cricket bat",
  "Cricket ball",
  "Badminton racket",
  "Swimming pool",
  "Foam roller"
];
const injuryOptions = [
  "No current injury",
  "Knee pain",
  "Shoulder pain",
  "Ankle sprain",
  "Lower-back pain",
  "Hamstring tightness",
  "Calf strain",
  "Wrist pain",
  "Elbow pain",
  "Neck stiffness",
  "Sharp pain during training",
  "Dizziness or faintness",
  "Chest pain",
  "Breathing difficulty",
  "Recent surgery",
  "Doctor advised caution"
];
const featuredPlans = [
  { label: "Tournament", goal: "Sport performance", activityLevel: "Active", trainingDays: 5, durationWeeks: 8 },
  { label: "Weight gain", goal: "Healthy weight gain", activityLevel: "Moderate", trainingDays: 4, durationWeeks: 8 },
  { label: "Skill boost", goal: "Improve stamina", activityLevel: "Moderate", trainingDays: 4, durationWeeks: 6 },
  { label: "Fat loss", goal: "Lose fat", activityLevel: "Moderate", trainingDays: 5, durationWeeks: 8 }
];
const experienceFeatures = [
  { title: "More main goals", detail: "Weight gain, muscle tone, posture, heart health, stamina, strength, and sport paths shape each plan." },
  { title: "Workout planner", detail: "Warm-up, main work, sets or intervals, cooldown, difficulty, and safety notes stay clear." },
  { title: "Indian nutrition", detail: "Calories, protein, hydration, and practical foods like idli, dal, eggs, paneer, and curd rice." },
  { title: "Progress and recovery", detail: "Weekly consistency, sleep, soreness, pain flags, and recovery actions are tracked together." }
];
const coachingPillars = [
  {
    label: "India",
    value: "Weather aware",
    detail: "Outdoor intensity adapts to city, heat, humidity, and training time.",
    image: "https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=900&q=80"
  },
  {
    label: "Safety",
    value: "Red flags",
    detail: "Sharp pain, dizziness, chest pain, and injury notes trigger conservative guidance.",
    image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=900&q=80"
  },
  {
    label: "Baseline",
    value: "WHO goals",
    detail: "Weekly cardio and strength targets are translated into simple next steps.",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80"
  }
];
const sportTicker = ["Cricket", "Football", "Kabaddi", "Running", "Badminton", "Gym", "Yoga", "Boxing"];
const coachModes = ["Today", "Nutrition", "Recovery", "Performance", "Safety"];
const coachQuickPrompts = [
  "What should I do today?",
  "Make my food plan simple",
  "How hard should I train in this weather?",
  "I feel pain during training",
  "How do I improve faster?",
  "Prepare me for a match"
];
const voiceSettingsUrl = "ms-settings:speech";
const voiceInstallGuideUrl =
  "https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130";

const sportVisuals = {
  Cricket: {
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1400&q=80",
    accent: "#087f5b",
    label: "Net practice, power, fielding reactions"
  },
  Football: {
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1400&q=80",
    accent: "#2563eb",
    label: "Stamina, agility, first touch, match speed"
  },
  Badminton: {
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80",
    accent: "#c2410c",
    label: "Footwork, reactions, rally control"
  },
  Running: {
    image:
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1400&q=80",
    accent: "#7c3aed",
    label: "Pacing, endurance, race readiness"
  },
  "Gym training": {
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
    accent: "#b45309",
    label: "Strength, conditioning, progressive overload"
  },
  Kabaddi: {
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1400&q=80",
    accent: "#be123c",
    label: "Raids, tackles, grip strength, repeat sprints"
  },
  Volleyball: {
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1400&q=80",
    accent: "#ea580c",
    label: "Jump power, serve receive, landing control"
  },
  Basketball: {
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    accent: "#dc2626",
    label: "Handles, vertical power, defense, court speed"
  },
  Tennis: {
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1400&q=80",
    accent: "#65a30d",
    label: "Serve patterns, lateral movement, rally endurance"
  },
  Hockey: {
    image:
      "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?auto=format&fit=crop&w=1400&q=80",
    accent: "#0891b2",
    label: "Stick control, low stance, sprint repeats"
  },
  Swimming: {
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1400&q=80",
    accent: "#0284c7",
    label: "Stroke technique, breath control, race pacing"
  },
  Boxing: {
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1400&q=80",
    accent: "#991b1b",
    label: "Footwork, combinations, defense, round fitness"
  },
  "Table tennis": {
    image:
      "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1400&q=80",
    accent: "#16a34a",
    label: "Spin reading, serve control, reactions"
  },
  Yoga: {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
    accent: "#9333ea",
    label: "Mobility, breath, balance, recovery"
  },
  "General fitness": {
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    accent: "#087f5b",
    label: "Strength, cardio, mobility, consistency"
  }
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [languagePacks, setLanguagePacks] = useState([]);
  const [error, setError] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMode, setChatMode] = useState("Today");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "coach",
      mode: "Today",
      text: "Hi, I am Coach Plus. Build a plan, then ask about workouts, Indian food, recovery, safety, weather, progress, or match prep."
    }
  ]);
  const speechChunksRef = useRef([]);
  const speechIndexRef = useRef(0);

  useEffect(() => {
    if (!window.speechSynthesis) {
      return undefined;
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    const retryTimers = [250, 750, 1500].map((delay) => window.setTimeout(loadVoices, delay));
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchLanguagePacks()
      .then((packs) => {
        if (!ignore) {
          setLanguagePacks(packs);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLanguagePacks([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const bmi = useMemo(() => {
    const heightM = Number(form.heightCm) / 100;
    return heightM ? (Number(form.weightKg) / (heightM * heightM)).toFixed(1) : "--";
  }, [form.heightCm, form.weightKg]);

  const selectedVoiceLocale = voiceLocales[form.voiceLanguage] || "en-IN";
  const selectedBrowserVoice = findVoiceForLocale(selectedVoiceLocale, voices);
  const selectedLanguagePack = languagePacks.find(
    (pack) => pack.language === form.language || pack.language === form.voiceLanguage
  );
  const activeSportVisual = sportVisuals[form.sport] || sportVisuals["General fitness"];
  const weeklyLoad = Number(form.trainingDays) * Number(form.durationWeeks);
  const readinessScore = useMemo(() => {
    const days = Number(form.trainingDays);
    const weeks = Number(form.durationWeeks);
    const activityScore = { Beginner: 10, Moderate: 18, Active: 26, Athlete: 32 }[form.activityLevel] || 16;
    const goalScore = form.goal === "Stay healthy" ? 12 : form.goal === "Sport performance" ? 22 : 18;
    const injuryPenalty = form.injuryHistory.trim() ? 10 : 0;
    return Math.max(42, Math.min(96, 44 + activityScore + goalScore + days * 2 + Math.min(weeks, 8) - injuryPenalty));
  }, [form.activityLevel, form.goal, form.injuryHistory, form.trainingDays, form.durationWeeks]);
  const intensityLabel = readinessScore >= 82 ? "High" : readinessScore >= 66 ? "Balanced" : "Steady";

  async function handleSubmit(event) {
    event.preventDefault();
    await buildDirectPlan(form);
  }

  async function buildDirectPlan(nextForm = form, scrollTarget = ".results-column") {
    setLoading(true);
    setError("");

    try {
      const data = await generatePlan(nextForm);
      setResult(data);
      window.setTimeout(() => {
        document.querySelector(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (submitError) {
      setError(submitError.message);
      document.querySelector(".form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleListValue(field, value) {
    setForm((current) => {
      if (value === "No current injury" && field === "injuryHistory") {
        return { ...current, injuryHistory: current.injuryHistory === value ? "" : value };
      }

      const items = current[field]
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => !(field === "injuryHistory" && item === "No current injury"));
      const nextItems = items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value];

      return { ...current, [field]: nextItems.join(", ") };
    });
  }

  function isListValueSelected(field, value) {
    return form[field]
      .split(",")
      .map((item) => item.trim())
      .includes(value);
  }

  function applyFeaturedPlan(plan, shouldBuild = false) {
    const nextForm = { ...form, ...plan };
    setForm(nextForm);

    if (shouldBuild) {
      buildDirectPlan(nextForm);
    }
  }

  function openSportDirect(sportLabel) {
    const sport = sportLabel === "Gym" ? "Gym training" : sportLabel;
    const sportGoal = sport === "Running" ? "Running performance" : "Sport performance";
    const nextForm = {
      ...form,
      sport,
      goal: sportGoal,
      trainingDays: Math.max(Number(form.trainingDays) || 4, 4),
      durationWeeks: Math.max(Number(form.durationWeeks) || 4, 4)
    };

    setForm(nextForm);
    buildDirectPlan(nextForm);
  }

  function toggleChallenge(index) {
    setCompletedChallenges((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
  }

  function notifyToday() {
    const message = `Coach Plus reminder: complete today's ${form.sport} challenge and log your progress.`;

    if (!("Notification" in window)) {
      setError(message);
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("Coach Plus", { body: message });
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Coach Plus", { body: message });
      } else {
        setError("Notifications are blocked. You can still use daily challenges inside Coach Plus.");
      }
    });
  }

  function sendCoachMessage(event) {
    event.preventDefault();
    const text = chatInput.trim();

    if (!text) {
      return;
    }

    const reply = buildCoachReply(text, result, form, chatMode);
    setChatMessages((current) => [
      ...current,
      { role: "you", mode: chatMode, text },
      { role: "coach", mode: chatMode, text: reply }
    ]);
    setChatInput("");
  }

  function sendQuickCoachPrompt(prompt) {
    const reply = buildCoachReply(prompt, result, form, chatMode);
    setChatMessages((current) => [
      ...current,
      { role: "you", mode: chatMode, text: prompt },
      { role: "coach", mode: chatMode, text: reply }
    ]);
  }

  function startVoiceNote() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedVoiceLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    setError("");

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setForm((current) => ({
        ...current,
        injuryHistory: [current.injuryHistory, transcript].filter(Boolean).join(" ")
      }));
    };

    recognition.onerror = () => {
      setError("Voice input stopped. Check microphone permission and try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function speakPlan() {
    if (!result) {
      return;
    }

    if (!window.speechSynthesis) {
      setError("Voice playback is not supported in this browser.");
      return;
    }

    const locale = result.languageSupport?.voiceLocale || selectedVoiceLocale;
    const voice = findVoiceForLocale(locale, voices);
    const text = result.voiceScript || result.mentorSummary;
    const voiceLanguage = result.languageSupport?.selectedVoiceLanguage || form.voiceLanguage;

    window.speechSynthesis.cancel();
    if (!voice) {
      speechChunksRef.current = [];
      speechIndexRef.current = 0;
      setSpeaking(false);
      setError(voiceMissingMessage(voiceLanguage, locale));
      return;
    }

    speechChunksRef.current = splitSpeechText(text);
    speechIndexRef.current = 0;
    setSpeaking(true);
    setError("");

    speakNextChunk(locale, voice);
  }

  function speakNextChunk(locale, voice) {
    const chunk = speechChunksRef.current[speechIndexRef.current];

    if (!chunk) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = locale;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      speechIndexRef.current += 1;
      speakNextChunk(locale, voice);
    };

    utterance.onerror = () => {
      speechChunksRef.current = [];
      speechIndexRef.current = 0;
      setSpeaking(false);
      setError("Voice playback failed. Reopen the browser after installing the selected language voice pack.");
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  }

  function testNativeVoice() {
    if (!window.speechSynthesis) {
      setError("Voice playback is not supported in this browser.");
      return;
    }

    const samples = {
      English: "Voice assistant is ready.",
      Tamil: "வணக்கம். தமிழ் குரல் உதவியாளர் தயாராக உள்ளது.",
      Hindi: "नमस्ते. हिंदी वॉइस असिस्टेंट तैयार है।",
      Malayalam: "നമസ്കാരം. മലയാളം വോയ്സ് അസിസ്റ്റന്റ് തയ്യാറാണ്.",
      Kannada: "ನಮಸ್ಕಾರ. ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ ಸಿದ್ಧವಾಗಿದೆ."
    };

    const voice = findVoiceForLocale(selectedVoiceLocale, voices);
    if (!voice) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setError(voiceMissingMessage(form.voiceLanguage, selectedVoiceLocale));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(samples[form.voiceLanguage] || samples.English);
    utterance.lang = selectedVoiceLocale;
    utterance.rate = 0.88;
    utterance.voice = voice;
    utterance.onerror = () => {
      setSpeaking(false);
      setError(`${form.voiceLanguage} playback failed. Install the language voice pack, then reopen the browser.`);
    };
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    setError("");
    window.speechSynthesis.speak(utterance);
  }

  function stopVoice() {
    speechChunksRef.current = [];
    speechIndexRef.current = 0;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  function jumpToPlanForm() {
    document.querySelector(".form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main
      className="app-shell"
      style={{
        "--sport-bg": `url("${activeSportVisual.image}")`,
        "--sport-accent": activeSportVisual.accent
      }}
    >
      <div className="motion-backdrop" aria-hidden="true">
        <span className="beam beam-one" />
        <span className="beam beam-two" />
        <span className="beam beam-three" />
      </div>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Local-first AI sports mentor</p>
          <h1>Coach Plus</h1>
          <p className="hero-copy">
            A structured fitness assistant for students, athletes, runners, gym users,
            and India-based players who need practical workouts, Indian food guidance,
            recovery checks, and weather-aware safety.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <button className="hero-primary" type="button" onClick={() => buildDirectPlan(form)} disabled={loading}>
              {loading ? "Creating..." : "Create plan"}
            </button>
            <button
              className="hero-secondary"
              type="button"
              onClick={() => applyFeaturedPlan(featuredPlans[0], true)}
              disabled={loading}
            >
              Tournament preset
            </button>
          </div>
          <div className="readiness-panel" aria-label="Training readiness summary">
            <div>
              <span>Readiness</span>
              <strong>{readinessScore}%</strong>
            </div>
            <div className="readiness-meter" style={{ "--readiness": `${readinessScore}%` }} aria-hidden="true">
              <span />
            </div>
            <p>{intensityLabel} load for {form.sport.toLowerCase()} with {weeklyLoad} planned sessions.</p>
          </div>
          <div className="sport-ticker" aria-label="Supported sport categories">
            <div>
              {[...sportTicker, ...sportTicker].map((sport, index) => (
                <button
                  type="button"
                  key={`${sport}-${index}`}
                  onClick={() => openSportDirect(sport)}
                  disabled={loading}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-label={`${form.sport} training visual`}>
          <img src={activeSportVisual.image} alt={`${form.sport} training`} />
          <div className="sport-holo" aria-hidden="true">
            <span className="holo-ring ring-one" />
            <span className="holo-ring ring-two" />
            <span className="holo-ring ring-three" />
            <span className="holo-core" />
            <span className="holo-card card-one">Goal</span>
            <span className="holo-card card-two">Fuel</span>
            <span className="holo-card card-three">Heat</span>
            <span className="holo-card card-four">Track</span>
            <span className="holo-dot dot-one" />
            <span className="holo-dot dot-two" />
            <span className="holo-dot dot-three" />
          </div>
          <div className="hero-visual-overlay">
            <span>{form.sport}</span>
            <strong>{activeSportVisual.label}</strong>
          </div>
          <div className="hero-metrics" aria-label="Current profile summary">
            <Metric label="BMI" value={bmi} />
            <Metric label="Days" value={form.trainingDays} />
            <Metric label="Weeks" value={form.durationWeeks} />
            <Metric label="Time" value={form.outdoorTrainingTime} />
          </div>
        </div>
      </section>

      <section className="feature-showcase" aria-label="Coach Plus feature overview">
        {experienceFeatures.map((feature, index) => (
          <article className="feature-tile" style={{ "--tile-index": index }} key={feature.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{feature.title}</h2>
            <p>{feature.detail}</p>
          </article>
        ))}
      </section>

      <section className="coach-lab" aria-label="Coach Plus coaching signals">
        <div className="coach-lab-main">
          <p className="eyebrow">India coaching lab</p>
          <h2>Personal training that respects city weather, food, recovery, and real schedules.</h2>
          <p>
            The mentor asks for the essentials first, then turns public-health activity
            guidance into weekly cardio, strength, mobility, nutrition, and safety steps.
          </p>
        </div>
        <div className="coach-pillar-grid">
          {coachingPillars.map((pillar, index) => (
            <article
              className="coach-pillar"
              style={{ "--pillar-index": index, "--pillar-image": `url("${pillar.image}")` }}
              key={pillar.label}
            >
              <span>{pillar.label}</span>
              <strong>{pillar.value}</strong>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <p className="eyebrow">Profile</p>
            <h2>Create plan</h2>
          </div>

          <div className="featured-options" aria-label="Featured generation options">
            {featuredPlans.map((plan) => (
              <button className="preset-chip" type="button" key={plan.label} onClick={() => applyFeaturedPlan(plan, true)}>
                {plan.label}
              </button>
            ))}
          </div>

          <div className="profile-identity">
            <label>
              Name
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
            </label>
            <div className="field-grid">
              <label>
                Age
                <input
                  type="number"
                  min="10"
                  max="80"
                  value={form.age}
                  onChange={(event) => updateField("age", event.target.value)}
                  required
                />
              </label>
              <label>
                Gender
                <select value={form.gender} onChange={(event) => updateField("gender", event.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
            </div>
          </div>

          <div className="field-grid">
            <label>
              Height cm
              <input
                type="number"
                min="100"
                max="230"
                value={form.heightCm}
                onChange={(event) => updateField("heightCm", event.target.value)}
                required
              />
            </label>
            <label>
              Weight kg
              <input
                type="number"
                min="25"
                max="220"
                value={form.weightKg}
                onChange={(event) => updateField("weightKg", event.target.value)}
                required
              />
            </label>
          </div>

          <label>
            Main goal
            <select value={form.goal} onChange={(event) => updateField("goal", event.target.value)}>
              {goalOptions.map((goal) => (
                <option key={goal}>{goal}</option>
              ))}
            </select>
          </label>

          <label>
            Sport
            <select value={form.sport} onChange={(event) => updateField("sport", event.target.value)}>
              {sportOptions.map((sport) => (
                <option key={sport}>{sport}</option>
              ))}
            </select>
          </label>

          <div className="field-grid">
            <label>
              Activity
              <select
                value={form.activityLevel}
                onChange={(event) => updateField("activityLevel", event.target.value)}
              >
                <option>Beginner</option>
                <option>Moderate</option>
                <option>Active</option>
                <option>Athlete</option>
              </select>
            </label>
            <label>
              Sessions/week
              <input
                type="number"
                min="1"
                max="14"
                value={form.trainingDays}
                onChange={(event) => updateField("trainingDays", event.target.value)}
              />
            </label>
            <label>
              Weeks
              <input
                type="number"
                min="1"
                max="52"
                value={form.durationWeeks}
                onChange={(event) => updateField("durationWeeks", event.target.value)}
              />
            </label>
          </div>

          <label>
            Food preference
            <select
              value={form.foodPreference}
              onChange={(event) => updateField("foodPreference", event.target.value)}
            >
              {foodPreferenceOptions.map((preference) => (
                <option key={preference}>{preference}</option>
              ))}
            </select>
          </label>

          <div className="field-grid">
            <label>
              India city or area
              <input
                value={form.chennaiArea}
                onChange={(event) => updateField("chennaiArea", event.target.value)}
                placeholder="Chennai, Mumbai, Bengaluru, Delhi, Kochi"
              />
            </label>
            <label>
              Outdoor time
              <select
                value={form.outdoorTrainingTime}
                onChange={(event) => updateField("outdoorTrainingTime", event.target.value)}
              >
                <option>Early morning</option>
                <option>Midday</option>
                <option>Evening</option>
                <option>Mostly indoors</option>
              </select>
            </label>
          </div>

          <label>
            Mentor text language
            <select value={form.language} onChange={(event) => updateField("language", event.target.value)}>
              {languageOptions.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>

          <label>
            Voice assistant language
            <select
              value={form.voiceLanguage}
              onChange={(event) => updateField("voiceLanguage", event.target.value)}
            >
              {languageOptions.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>

          <p className="voice-status">
            {selectedBrowserVoice
              ? `Native browser voice: ${selectedBrowserVoice.name} (${selectedBrowserVoice.lang})`
              : `Native ${form.voiceLanguage} voice not detected yet. Install the language voice pack for natural speech.`}
            {!selectedBrowserVoice ? (
              <>
                {" "}
                <VoiceInstallLinks />
              </>
            ) : null}
          </p>

          {selectedLanguagePack ? <LanguagePackNotice pack={selectedLanguagePack} /> : null}

          <div className="selector-panel">
            <div className="selector-heading">
              <span>Equipment matrix</span>
              <strong>{form.equipment ? form.equipment.split(",").filter(Boolean).length : 0} selected</strong>
            </div>
            <div className="chip-grid" aria-label="Equipment quick selector">
              {equipmentOptions.map((item) => (
                <button
                  className={`smart-chip ${isListValueSelected("equipment", item) ? "active" : ""}`}
                  type="button"
                  key={item}
                  onClick={() => toggleListValue("equipment", item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>
              Custom equipment
              <input
                value={form.equipment}
                onChange={(event) => updateField("equipment", event.target.value)}
                placeholder="Home/bodyweight, dumbbells, gym, cones"
              />
            </label>
          </div>

          <div className="selector-panel injury-panel">
            <div className="selector-heading">
              <span>Injury and safety scanner</span>
              <strong>{form.injuryHistory ? "active notes" : "clear"}</strong>
            </div>
            <div className="chip-grid" aria-label="Injury history quick selector">
              {injuryOptions.map((item) => (
                <button
                  className={`smart-chip ${isListValueSelected("injuryHistory", item) ? "active" : ""} ${
                    ["Chest pain", "Breathing difficulty", "Dizziness or faintness", "Sharp pain during training"].includes(item)
                      ? "risk-chip"
                      : ""
                  }`}
                  type="button"
                  key={item}
                  onClick={() => toggleListValue("injuryHistory", item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>
              Custom injury notes
              <textarea
                value={form.injuryHistory}
                onChange={(event) => updateField("injuryHistory", event.target.value)}
                placeholder="Optional: knee pain, shoulder issue, ankle sprain, pain level, how long it has been present"
                rows="3"
              />
            </label>
          </div>

          <button className="secondary-button" type="button" onClick={startVoiceNote} disabled={listening}>
            {listening ? "Listening..." : `Add ${form.voiceLanguage} voice note`}
          </button>

          <button className="secondary-button" type="button" onClick={testNativeVoice}>
            Test {form.voiceLanguage} voice
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Building plan..." : "Build my plan"}
          </button>

          {error ? <p className="status error">{error}</p> : null}
        </form>

        <section className="results-column">
          <div className="panel result-header">
            <p className="eyebrow">Dashboard</p>
            <h2>{result ? "Personal plan ready" : "Your mentor output appears here"}</h2>
            <p>
              {result
                ? `Generated ${new Date(result.generatedAt).toLocaleString()}`
                : "Enter profile, goal, sport, food, injury, and India-local context, then generate a plan."}
            </p>
          </div>

          {loading ? <LoadingPanel /> : null}
          {result ? (
            <Results
              result={result}
              onSpeak={speakPlan}
              onStop={stopVoice}
              speaking={speaking}
              browserVoice={findVoiceForLocale(result.languageSupport?.voiceLocale, voices)}
              languagePack={languagePacks.find(
                (pack) =>
                  pack.language === result.languageSupport?.selectedLanguage ||
                  pack.language === result.languageSupport?.selectedVoiceLanguage
              )}
              completedChallenges={completedChallenges}
              onToggleChallenge={toggleChallenge}
              onNotify={notifyToday}
              chatInput={chatInput}
              onChatInput={setChatInput}
              chatMessages={chatMessages}
              chatMode={chatMode}
              onChatMode={setChatMode}
              onQuickPrompt={sendQuickCoachPrompt}
              onSendCoachMessage={sendCoachMessage}
            />
          ) : (
            <StarterCards />
          )}
        </section>
      </div>
    </main>
  );
}

function findVoiceForLocale(locale, voices = []) {
  if (!locale) {
    return null;
  }

  const normalizedLocale = normalizeVoiceLocale(locale);
  const languageCode = locale.slice(0, 2).toLowerCase();
  const languageNames = {
    en: ["english", "india"],
    ta: ["tamil"],
    hi: ["hindi"],
    ml: ["malayalam"],
    kn: ["kannada"]
  }[languageCode] || [];

  return (
    voices.find((voice) => normalizeVoiceLocale(voice.lang) === normalizedLocale) ||
    voices.find((voice) => normalizeVoiceLocale(voice.lang).startsWith(languageCode)) ||
    voices.find((voice) => languageNames.some((name) => voice.name?.toLowerCase().includes(name))) ||
    null
  );
}

function normalizeVoiceLocale(locale = "") {
  return locale.toLowerCase().replace("_", "-");
}

function voiceMissingMessage(language, locale) {
  return `Native ${language} voice (${locale}) is not installed. Download the Windows language voice pack, then close and reopen the browser.`;
}

function VoiceInstallLinks() {
  return (
    <>
      <a href={voiceSettingsUrl}>Download voice pack</a>
      {" "}
      <a href={voiceInstallGuideUrl} target="_blank" rel="noreferrer">
        Install guide
      </a>
    </>
  );
}

function LanguagePackNotice({ pack }) {
  return (
    <div className="language-pack-notice">
      <strong>{pack.name}</strong>
      <span>{pack.description}</span>
      <a href={pack.downloadUrl}>Download from project ({formatBytes(pack.sizeBytes)})</a>
      {!pack.voiceCapable ? <small>{pack.notes?.[0]}</small> : null}
    </div>
  );
}

function formatBytes(bytes = 0) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function buildCoachReply(message, result, form, mode = "Today") {
  const lowerMessage = message.toLowerCase();
  const sport = result?.sportGuidance?.sport || form.sport;
  const goal = result?.userProfile?.goal || form.goal;
  const today = result?.weeklyPlan?.find((day) => !String(day.focus).toLowerCase().includes("recovery")) || result?.weeklyPlan?.[0];
  const weather = result?.baselineGuidance?.find((item) => item.label === "India")?.detail || "";
  const safety = result?.baselineGuidance?.find((item) => item.label === "Safety")?.detail || "";
  const redFlagTerms = ["chest pain", "dizzy", "dizziness", "faint", "sharp pain", "breathing", "breathless", "swelling"];
  const asksSafety = redFlagTerms.some((term) => lowerMessage.includes(term)) || mode === "Safety";

  if (!result) {
    return `Choose ${sport}, set your weeks and days, then build a plan. After that I can coach workouts, food, recovery, safety, weather intensity, progress, and match preparation with your actual plan data.`;
  }

  if (asksSafety) {
    return [
      "Safety scan: stop the session now if there is chest pain, dizziness, faintness, severe breathlessness, swelling, or sharp pain.",
      safety,
      "Next step: switch to easy walking or rest today, log exactly where the symptom appears, and get medical or physiotherapy help if it is strong, repeated, or linked to breathing or chest symptoms."
    ].join(" ");
  }

  if (lowerMessage.includes("food") || lowerMessage.includes("diet") || lowerMessage.includes("eat")) {
    return [
      `Nutrition mode for ${goal}: target ${result.caloriePlan.targetCalories} kcal, ${result.caloriePlan.proteinGrams} g protein, and ${result.caloriePlan.hydrationLitres} L water.`,
      `Before training: ${result.foodGuidance.preWorkout.slice(0, 2).join(" or ")}.`,
      `After training: ${result.foodGuidance.postWorkout.slice(0, 2).join(" Also: ")}.`,
      goal.toLowerCase().includes("gain")
        ? "For weight gain, add one extra steady snack daily: milk or curd with banana, eggs, paneer, channa, soy chunks, peanuts, or rice plus dal."
        : "Keep the plan simple: protein each meal, carbs around training, and no crash dieting."
    ].join(" ");
  }

  if (lowerMessage.includes("recover") || lowerMessage.includes("pain") || lowerMessage.includes("rest")) {
    return [
      `Recovery mode: ${result.recovery.slice(0, 2).join(" ")}`,
      `Today, reduce intensity if soreness is above 3/5 or sleep was poor.`,
      "Keep mobility light, breathe slowly after training, and do not chase missed workouts by doubling tomorrow."
    ].join(" ");
  }

  if (lowerMessage.includes("tournament") || lowerMessage.includes("match")) {
    return [
      `Match prep for ${sport}: ${result.sportGuidance.tournament.join(" ")}`,
      `Useful drills: ${result.sportGuidance.drills.slice(0, 3).join(", ")}.`,
      "Keep the final hard session short and sharp, then arrive fresh."
    ].join(" ");
  }

  if (lowerMessage.includes("progress")) {
    return [
      `Progress dashboard: track ${result.progressPlan.map((item) => item.metric).join(", ")}.`,
      `This week, your target is: ${result.progressPlan[0]?.target}.`,
      "Use a simple 1-5 score for energy, soreness, and confidence after each session."
    ].join(" ");
  }

  if (lowerMessage.includes("weather") || lowerMessage.includes("heat") || lowerMessage.includes("humid")) {
    return [
      `Weather coach: ${weather}`,
      "Use the talk test: if speaking short sentences feels hard during an easy session, lower pace or move indoors.",
      `Hydration target today: ${result.caloriePlan.hydrationLitres} L, with extra fluids after heavy sweating.`
    ].join(" ");
  }

  if (mode === "Nutrition") {
    return buildCoachReply("food", result, form, mode);
  }

  if (mode === "Recovery") {
    return buildCoachReply("recover", result, form, mode);
  }

  if (mode === "Performance") {
    return [
      `Performance mode for ${sport}: focus on ${result.sportGuidance.focusMap.map((item) => item.focus).join(", ")}.`,
      `Do one quality drill today: ${result.sportGuidance.drills[0]}.`,
      "Finish by writing one technical cue that worked and one thing to practice next."
    ].join(" ");
  }

  return [
    `Today for ${sport}: ${today ? `${today.focus}. ${today.session.slice(0, 3).join(" ")}` : "complete one planned session."}`,
    `Goal: ${goal}.`,
    weather ? `Weather note: ${weather}` : "",
    "Finish with the skill touch challenge, then log energy and soreness."
  ]
    .filter(Boolean)
    .join(" ");
}

function splitSpeechText(text) {
  const sentences = String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।])\s+/u)
    .filter(Boolean);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (`${current} ${sentence}`.trim().length > 180) {
      if (current) {
        chunks.push(current);
      }
      current = sentence;
    } else {
      current = `${current} ${sentence}`.trim();
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length ? chunks : [String(text || "")];
}

function Results({
  result,
  onSpeak,
  onStop,
  speaking,
  browserVoice,
  languagePack,
  completedChallenges,
  onToggleChallenge,
  onNotify,
  chatInput,
  onChatInput,
  chatMessages,
  chatMode,
  onChatMode,
  onQuickPrompt,
  onSendCoachMessage
}) {
  const activeDay = result.weeklyPlan.find((day) => !String(day.focus).toLowerCase().includes("recovery")) || result.weeklyPlan[0];
  const coachContext = [
    { label: "Goal", value: result.userProfile.goal },
    { label: "Sport", value: result.sportGuidance?.sport || result.userProfile.sport },
    { label: "Today", value: activeDay?.focus || "Plan session" },
    { label: "Calories", value: `${result.caloriePlan.targetCalories} kcal` },
    { label: "Water", value: `${result.caloriePlan.hydrationLitres} L` }
  ];

  return (
    <>
      <SectionCard title="Mentor summary">
        <p className="lead">{result.mentorSummary}</p>
        <div className="action-row">
          <button className="secondary-button compact" type="button" onClick={onSpeak}>
            {speaking ? "Speaking..." : `Speak in ${result.languageSupport.selectedVoiceLanguage}`}
          </button>
          <button className="secondary-button compact" type="button" onClick={onStop}>
            Stop voice
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Language and voice">
        <div className="metric-grid language-grid">
          <Metric label="Text" value={result.languageSupport.selectedLanguage} />
          <Metric label="Voice" value={result.languageSupport.selectedVoiceLanguage} />
          <Metric label="Locale" value={result.languageSupport.voiceLocale} />
        </div>
        <p className="lead">{result.languageSupport.note}</p>
        <p className="voice-status">
          {browserVoice
            ? `Using native browser voice: ${browserVoice.name} (${browserVoice.lang})`
            : "Native voice is not installed for this language. The browser can only use fallback speech until the OS voice pack is added."}
          {!browserVoice ? (
            <>
              {" "}
              <VoiceInstallLinks />
            </>
          ) : null}
        </p>
        {languagePack ? <LanguagePackNotice pack={languagePack} /> : null}
      </SectionCard>

      {result.sportGuidance ? <SportGuidance guidance={result.sportGuidance} /> : null}

      <SectionCard title="Calories and hydration">
        <div className="metric-grid">
          <Metric label="Maintenance" value={`${result.caloriePlan.maintenanceCalories} kcal`} />
          <Metric label="Target" value={`${result.caloriePlan.targetCalories} kcal`} />
          <Metric label="Protein" value={`${result.caloriePlan.proteinGrams} g`} />
          <Metric label="Water" value={`${result.caloriePlan.hydrationLitres} L`} />
        </div>
      </SectionCard>

      <SectionCard title={`${result.userProfile.durationWeeks}-week program`}>
        <div className="program-weeks">
          {result.multiWeekPlan.map((week) => (
            <article className="week-card" key={week.week}>
              <span>Week {week.week}</span>
              <h3>{week.theme}</h3>
              <p>{week.coachingCue}</p>
              <strong>{week.days.length} training/recovery days</strong>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="This week training plan">
        <div className="timeline">
          {result.weeklyPlan.map((day) => (
            <article className="timeline-item" key={`${day.day}-${day.focus}`}>
              <span>{day.day}</span>
              <h3>{day.focus}</h3>
              <List items={day.session} />
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Indian food guidance">
        <div className="three-column">
          <List title="Pre-workout" items={result.foodGuidance.preWorkout} />
          <List title="Post-workout" items={result.foodGuidance.postWorkout} />
          <List title="Daily meals" items={result.foodGuidance.dailyMeals} />
        </div>
      </SectionCard>

      <SectionCard title="Recovery and safety">
        <div className="two-column">
          <List title="Recovery" items={result.recovery} />
          <List title="Safety checks" items={result.safetyChecks} />
        </div>
      </SectionCard>

      {result.baselineGuidance ? (
        <SectionCard title="India weather, red flags, and WHO baseline">
          <div className="baseline-grid">
            {result.baselineGuidance.map((item) => (
              <article className="baseline-card" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.value}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Progress tracking">
        <div className="progress-grid">
          {result.progressPlan.map((item) => (
            <article className="progress-card" key={item.metric}>
              <h3>{item.metric}</h3>
              <p>{item.target}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Daily challenges and notifications">
        <div className="challenge-grid">
          {result.dailyChallenges.map((challenge, index) => (
            <button
              className={`challenge-card ${completedChallenges.includes(index) ? "complete" : ""}`}
              type="button"
              onClick={() => onToggleChallenge(index)}
              key={challenge.title}
            >
              <strong>{challenge.title}</strong>
              <span>{challenge.description}</span>
            </button>
          ))}
        </div>
        <button className="secondary-button compact notify-button" type="button" onClick={onNotify}>
          Enable daily reminder
        </button>
      </SectionCard>

      <SectionCard title="AI coach command center">
        <div className="coach-chat advanced-coach">
          <div className="coach-console-head">
            <div>
              <p className="eyebrow">Live plan assistant</p>
              <h3>Ask, adjust, recover, or prepare</h3>
            </div>
            <span>{chatMode} mode</span>
          </div>

          <div className="coach-mode-tabs" aria-label="Coach chat modes">
            {coachModes.map((mode) => (
              <button
                className={chatMode === mode ? "active" : ""}
                type="button"
                onClick={() => onChatMode(mode)}
                key={mode}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="coach-context-strip" aria-label="Current coach context">
            {coachContext.map((item) => (
              <div className="coach-context-chip" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="quick-prompt-grid" aria-label="Quick coach prompts">
            {coachQuickPrompts.map((prompt) => (
              <button type="button" onClick={() => onQuickPrompt(prompt)} key={prompt}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-log">
            {chatMessages.map((message, index) => (
              <article className={message.role === "you" ? "chat-user" : "chat-coach"} key={`${message.role}-${index}`}>
                <span>{message.role === "you" ? "You" : `Coach Plus${message.mode ? ` - ${message.mode}` : ""}`}</span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>
          <form className="chat-form" onSubmit={onSendCoachMessage}>
            <input
              value={chatInput}
              onChange={(event) => onChatInput(event.target.value)}
              placeholder={`Ask in ${chatMode.toLowerCase()} mode about workouts, food, weather, safety, or progress`}
            />
            <button type="submit">Ask</button>
          </form>
        </div>
      </SectionCard>
    </>
  );
}

function StarterCards() {
  return (
    <div className="starter-grid">
      <article className="info-card">
        <h3>Beginner friendly</h3>
        <p>Use presets, choose days and weeks, then Coach Plus builds a clear path.</p>
      </article>
      <article className="info-card">
        <h3>AI coach chat</h3>
        <p>Ask about training, food, recovery, tournament prep, and progress after generation.</p>
      </article>
      <article className="info-card">
        <h3>Daily challenges</h3>
        <p>Complete small challenges, enable reminders, and keep progress moving.</p>
      </article>
    </div>
  );
}

function SportGuidance({ guidance }) {
  const visual = sportVisuals[guidance.sport] || sportVisuals["General fitness"];

  return (
    <>
      <SectionCard title={`${guidance.sport} mentor board`}>
        <div className="sport-command">
          <div
            className="sport-command-main"
            style={{
              "--sport-card-bg": `url("${visual.image}")`,
              "--sport-accent": visual.accent
            }}
          >
            <p className="eyebrow">Goal path</p>
            <h3>{guidance.goal}</h3>
            <p>{guidance.level} training level with sport-specific coaching, fitness, and tournament preparation.</p>
          </div>
          <div className="focus-orbit" aria-label={`${guidance.sport} focus phases`}>
            {guidance.focusMap.map((item, index) => (
              <span style={{ "--orbit-index": index }} key={`${item.phase}-${item.focus}`}>
                {item.focus}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Guidance hub">
        <div className="guidance-grid">
          <GuidancePanel title="Mentor" items={guidance.mentor} />
          <GuidancePanel title="Fitness" items={guidance.fitness} />
          <GuidancePanel title="Tournament" items={guidance.tournament} />
        </div>
      </SectionCard>

      <SectionCard title="Drills and milestones">
        <div className="two-column">
          <List title="Practice drills" items={guidance.drills} />
          <List title="Progress milestones" items={guidance.milestones} />
        </div>
      </SectionCard>

      <SectionCard title="Training images and sport info">
        <div className="training-media-grid">
          <TrainingImageCard title="Training Focus" image={visual.image} items={guidance.focusMap.map((item) => item.focus)} />
          <TrainingInfoPanel title="Equipment" items={guidance.equipment} />
          <TrainingInfoPanel title="Rules and tactics" items={guidance.tactics} />
          <TrainingInfoPanel title="Injury prevention" items={guidance.injuryPrevention} />
          <TrainingInfoPanel title="Sport nutrition" items={guidance.nutrition} />
          <TrainingInfoPanel title="Tournament formats" items={guidance.eventFormats} />
          <TrainingInfoPanel title="Avoid these mistakes" items={guidance.mistakes} />
        </div>
      </SectionCard>

      <SectionCard title="Video practice and mentors">
        <div className="video-mentor-grid">
          {guidance.videoMentors.map((video, index) => (
            <VideoMentorCard video={video} index={index} key={video.title} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function VideoMentorCard({ video, index }) {
  return (
    <article className="video-mentor-card" style={{ "--video-index": index }}>
      <div className="video-frame" aria-hidden="true">
        <span />
      </div>
      <h3>{video.title}</h3>
      <p>{video.topic}</p>
      <a href={video.url} target="_blank" rel="noreferrer">
        Open video search
      </a>
    </article>
  );
}

function TrainingImageCard({ title, image, items }) {
  return (
    <article className="training-image-card">
      <img src={image} alt={title} />
      <div>
        <h3>{title}</h3>
        <List items={items} />
      </div>
    </article>
  );
}

function TrainingInfoPanel({ title, items }) {
  return (
    <article className="training-info-panel">
      <h3>{title}</h3>
      <List items={items} />
    </article>
  );
}

function GuidancePanel({ title, items }) {
  return (
    <article className="guidance-panel">
      <h3>{title}</h3>
      <List items={items} />
    </article>
  );
}

function List({ title, items }) {
  return (
    <div className="list-block">
      {title ? <h3>{title}</h3> : null}
      <ul className="list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="panel loading-panel">
      <div className="pulse-line wide" />
      <div className="pulse-line" />
      <div className="pulse-line" />
      <div className="pulse-line wide" />
    </div>
  );
}
