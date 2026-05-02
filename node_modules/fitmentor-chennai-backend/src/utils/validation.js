import Joi from "joi";

export const requestSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age: Joi.number().integer().min(10).max(80).required(),
  gender: Joi.string().trim().max(40).allow("").default(""),
  heightCm: Joi.number().min(100).max(230).required(),
  weightKg: Joi.number().min(25).max(220).required(),
  goal: Joi.string()
    .valid(
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
    )
    .required(),
  sport: Joi.string()
    .valid(
      "General fitness",
      "Cricket",
      "Football",
      "Badminton",
      "Running",
      "Gym training",
      "Kabaddi",
      "Volleyball",
      "Basketball",
      "Tennis",
      "Hockey",
      "Swimming",
      "Boxing",
      "Table tennis",
      "Yoga"
    )
    .required(),
  activityLevel: Joi.string()
    .valid("Beginner", "Moderate", "Active", "Athlete")
    .required(),
  foodPreference: Joi.string()
    .valid(
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
    )
    .required(),
  language: Joi.string()
    .valid("English", "Tamil", "Hindi", "Malayalam", "Kannada")
    .default("English"),
  voiceLanguage: Joi.string()
    .valid("English", "Tamil", "Hindi", "Malayalam", "Kannada")
    .default("English"),
  chennaiArea: Joi.string().trim().max(120).allow("").default("India"),
  outdoorTrainingTime: Joi.string()
    .valid("Early morning", "Midday", "Evening", "Mostly indoors")
    .default("Early morning"),
  trainingDays: Joi.number().integer().min(1).max(14).required(),
  durationWeeks: Joi.number().integer().min(1).max(52).default(4),
  injuryHistory: Joi.string().trim().max(500).allow("").default(""),
  equipment: Joi.string().trim().max(300).allow("").default("Home/bodyweight")
});

export const finalResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  partial: Joi.boolean().required(),
  generatedAt: Joi.string().isoDate().required(),
  errors: Joi.array()
    .items(
      Joi.object({
        agent: Joi.string().required(),
        message: Joi.string().required(),
        code: Joi.string().allow(null)
      })
    )
    .required(),
  userProfile: requestSchema.required(),
  mentorSummary: Joi.string().required(),
  caloriePlan: Joi.object({
    maintenanceCalories: Joi.number().integer().required(),
    targetCalories: Joi.number().integer().required(),
    proteinGrams: Joi.number().integer().required(),
    hydrationLitres: Joi.number().precision(1).required()
  }).required(),
  weeklyPlan: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        focus: Joi.string().required(),
        session: Joi.array().items(Joi.string()).required()
      })
    )
    .min(1)
    .required(),
  multiWeekPlan: Joi.array()
    .items(
      Joi.object({
        week: Joi.number().integer().required(),
        theme: Joi.string().required(),
        coachingCue: Joi.string().required(),
        days: Joi.array()
          .items(
            Joi.object({
              day: Joi.string().required(),
              focus: Joi.string().required(),
              session: Joi.array().items(Joi.string()).required()
            })
          )
          .required()
      })
    )
    .required(),
  foodGuidance: Joi.object({
    preWorkout: Joi.array().items(Joi.string()).required(),
    postWorkout: Joi.array().items(Joi.string()).required(),
    dailyMeals: Joi.array().items(Joi.string()).required()
  }).required(),
  languageSupport: Joi.object({
    selectedLanguage: Joi.string().required(),
    selectedVoiceLanguage: Joi.string().required(),
    voiceLocale: Joi.string().required(),
    note: Joi.string().required()
  }).required(),
  voiceScript: Joi.string().required(),
  sportGuidance: Joi.object({
    sport: Joi.string().required(),
    level: Joi.string().required(),
    goal: Joi.string().required(),
    mentor: Joi.array().items(Joi.string()).required(),
    fitness: Joi.array().items(Joi.string()).required(),
    tournament: Joi.array().items(Joi.string()).required(),
    drills: Joi.array().items(Joi.string()).required(),
    milestones: Joi.array().items(Joi.string()).required(),
    equipment: Joi.array().items(Joi.string()).required(),
    tactics: Joi.array().items(Joi.string()).required(),
    injuryPrevention: Joi.array().items(Joi.string()).required(),
    nutrition: Joi.array().items(Joi.string()).required(),
    eventFormats: Joi.array().items(Joi.string()).required(),
    mistakes: Joi.array().items(Joi.string()).required(),
    videoMentors: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required(),
          topic: Joi.string().required(),
          url: Joi.string().uri().required()
        })
      )
      .required(),
    focusMap: Joi.array()
      .items(
        Joi.object({
          phase: Joi.string().required(),
          focus: Joi.string().required()
        })
      )
      .required()
  }).required(),
  recovery: Joi.array().items(Joi.string()).required(),
  safetyChecks: Joi.array().items(Joi.string()).required(),
  baselineGuidance: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().required(),
        value: Joi.string().required(),
        detail: Joi.string().required()
      })
    )
    .required(),
  progressMetrics: Joi.array().items(Joi.string()).required(),
  progressPlan: Joi.array()
    .items(
      Joi.object({
        metric: Joi.string().required(),
        target: Joi.string().required()
      })
    )
    .required(),
  dailyChallenges: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
      })
    )
    .required()
});

export function validateSchema(schema, value, label) {
  const { error, value: validatedValue } = schema.validate(value, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationError = new Error(`${label} validation failed.`);
    validationError.code = "SCHEMA_VALIDATION_ERROR";
    validationError.details = error.details.map((detail) => detail.message);
    throw validationError;
  }

  return validatedValue;
}
