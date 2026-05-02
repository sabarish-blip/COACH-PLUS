import { appendMemoryEntry } from "./utils/memoryStore.js";
import { finalResponseSchema, validateSchema } from "./utils/validation.js";

const voiceLocales = {
  English: "en-IN",
  Tamil: "ta-IN",
  Hindi: "hi-IN",
  Malayalam: "ml-IN",
  Kannada: "kn-IN"
};

const localized = {
  English: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    recoveryDay: "Sunday",
    recovery: "Recovery",
    summary: (profile) =>
      `${profile.name}, this ${profile.trainingDays}-session weekly plan is built for ${profile.goal.toLowerCase()} through ${profile.sport.toLowerCase()} training near ${profile.chennaiArea || "India"}. ${indiaWeatherGuidance(profile)} ${
        profile.injuryHistory
          ? `Your injury note says "${profile.injuryHistory}", so pain-free movement and conservative progression come first.`
          : "No injury history was entered, so the plan starts with normal beginner-safe checks."
      }`,
    note: (profile) =>
      `Use ${profile.language} for mentor text and ${profile.voiceLanguage} for voice conversations when the browser supports this language.`,
    focus: {
      "sprint mechanics": "Sprint Mechanics",
      "shoulder care": "Shoulder Care",
      "core rotation": "Core Rotation",
      "lower-body power": "Lower-body Power",
      "aerobic base": "Aerobic Base",
      "sprint intervals": "Sprint Intervals",
      agility: "Agility",
      "single-leg strength": "Single-leg Strength",
      footwork: "Footwork",
      "reaction speed": "Reaction Speed",
      "shoulder mobility": "Shoulder Mobility",
      "knee control": "Knee Control",
      "easy mileage": "Easy Mileage",
      intervals: "Intervals",
      "tempo effort": "Tempo Effort",
      mobility: "Mobility",
      "compound strength": "Compound Strength",
      hypertrophy: "Hypertrophy",
      conditioning: "Conditioning",
      "full-body strength": "Full-body Strength",
      "zone 2 cardio": "Zone 2 Cardio",
      "core stability": "Core Stability"
    },
    session: ({ focus, equipment, intensity, alternate }) => [
      "Warm-up: 8 minutes brisk walk or light jog, then dynamic mobility",
      `Main: ${focus} work for 25-35 minutes at ${intensity} intensity`,
      `Strength: 3 rounds of squats, lunges, push-ups, rows, and plank using ${equipment}`,
      alternate
        ? "Skill: 15 minutes of controlled technique practice with full recovery between efforts"
        : "Conditioning: 6 rounds of 30-second fast effort plus 90-second easy recovery",
      "Cooldown: 5 minutes walking and slow breathing"
    ],
    recoverySession: [
      "20-30 minutes easy walk",
      "Light stretching for hips, calves, chest, and shoulders",
      "Review weight, sleep, soreness, and training notes"
    ],
    food: (protein) => ({
      preWorkout: [
        "Banana with water",
        "Idli with sambar",
        "Small dosa with chutney if training is more than 60 minutes away"
      ],
      postWorkout: [
        `Rice or chapati with ${protein}`,
        "Curd rice or buttermilk when appetite is low after heat exposure",
        "Tender coconut water after heavy sweating"
      ],
      dailyMeals: [
        "Build each meal around protein, rice or chapati, vegetables, and a small amount of healthy fat",
        "Keep fried snacks and sugary drinks occasional, especially during fat-loss phases",
        "Do not use crash diets; adjust portions gradually and track weekly progress"
      ]
    }),
    recoveryTips: (hasInjury) => [
      "Sleep 7-9 hours when possible; recovery is part of training.",
      "Keep at least one low-intensity day after hard intervals or match play.",
      "Use 5-10 minutes of mobility for hips, ankles, thoracic spine, and shoulders.",
      hasInjury
        ? "If old injury pain returns, reduce intensity and consult a physiotherapist."
        : "If sharp pain appears, stop the session and reassess before continuing."
    ],
    safety: (isMinor) => [
      "This is fitness guidance, not a medical diagnosis.",
      "Stop exercise and seek medical help for chest pain, faintness, severe breathlessness, or dizziness.",
      "Do not train through sharp pain or swelling.",
      "Increase weekly running volume or lifting load gradually.",
      "Supplements are optional and should not replace normal food.",
      "Do not use steroids, banned substances, or crash diets.",
      "For pregnancy, chronic illness, heart symptoms, or active injuries, consult a doctor, physiotherapist, or certified coach.",
      ...(isMinor ? ["For minors, keep strength work technique-focused and avoid max-effort lifting."] : [])
    ],
    progress: (sport) => [
      "Workout completion",
      "Body weight trend",
      "Sleep duration",
      "Energy and soreness score",
      `${sport} performance notes`,
      "Weekly consistency score"
    ]
  },
  Tamil: {
    days: ["திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
    recoveryDay: "ஞாயிறு",
    recovery: "மீட்பு",
    summary: (profile) =>
      `${profile.name}, உங்கள் ${profile.trainingDays} நாள் திட்டம் ${profile.sport} பயிற்சியுடன் ${profile.goal} இலக்குக்காக உருவாக்கப்பட்டுள்ளது. சென்னையின் வெப்பம் மற்றும் ஈரப்பதம் காரணமாக கடினமான வெளிப்புற பயிற்சியை காலை 8 மணிக்கு முன் அல்லது மாலை 5:30க்கு பிறகு செய்யுங்கள். ${
        profile.injuryHistory
          ? `உங்கள் காயம் குறிப்பு: "${profile.injuryHistory}". எனவே வலியில்லாத இயக்கமும் மெதுவான முன்னேற்றமும் முதன்மை.`
          : "காயம் வரலாறு இல்லை, எனவே சாதாரண பாதுகாப்பான தொடக்க திட்டம் கொடுக்கப்பட்டுள்ளது."
      }`,
    note: (profile) =>
      `வழிகாட்டி உரைக்கு ${profile.language}, குரல் உரையாடல்களுக்கு ${profile.voiceLanguage} பயன்படுத்தப்படும்.`,
    focus: {
      "sprint mechanics": "ஸ்பிரிண்ட் முறை",
      "shoulder care": "தோள் பராமரிப்பு",
      "core rotation": "கோர் சுழற்சி",
      "lower-body power": "கீழ் உடல் சக்தி",
      "aerobic base": "ஏரோபிக் அடித்தளம்",
      "sprint intervals": "ஸ்பிரிண்ட் இடைவெளிகள்",
      agility: "சுறுசுறுப்பு",
      "single-leg strength": "ஒற்றைக் கால் பலம்",
      footwork: "கால் வேலை",
      "reaction speed": "எதிர்வினை வேகம்",
      "shoulder mobility": "தோள் இயக்கம்",
      "knee control": "முழங்கால் கட்டுப்பாடு",
      "easy mileage": "எளிய ஓட்ட தூரம்",
      intervals: "இடைவெளி ஓட்டம்",
      "tempo effort": "டெம்போ முயற்சி",
      mobility: "இயக்க திறன்",
      "compound strength": "கூட்டு பலம்",
      hypertrophy: "தசை வளர்ச்சி",
      conditioning: "கண்டிஷனிங்",
      "full-body strength": "முழு உடல் பலம்",
      "zone 2 cardio": "சோன் 2 கார்டியோ",
      "core stability": "கோர் நிலைத்தன்மை"
    },
    session: ({ focus, equipment, intensity, alternate }) => [
      "வார்ம் அப்: 8 நிமிடம் வேக நடை அல்லது மெதுவான ஜாக், பிறகு டைனமிக் மொபிலிட்டி",
      `முக்கியம்: ${focus} பயிற்சி 25-35 நிமிடம், ${intensity} தீவிரத்தில்`,
      `பலப் பயிற்சி: ${equipment} பயன்படுத்தி 3 சுற்றுகள் ஸ்குவாட், லஞ்ச், புஷ்-அப், ரோ, பிளாங்க்`,
      alternate
        ? "திறன்: முழு ஓய்வுடன் 15 நிமிடம் கட்டுப்படுத்தப்பட்ட டெக்னிக் பயிற்சி"
        : "கண்டிஷனிங்: 30 விநாடி வேக முயற்சி + 90 விநாடி மெதுவான மீட்பு, 6 சுற்றுகள்",
      "கூல் டவுன்: 5 நிமிடம் நடை மற்றும் மெதுவான மூச்சுப் பயிற்சி"
    ],
    recoverySession: [
      "20-30 நிமிடம் எளிய நடை",
      "இடுப்பு, கால்வலி பகுதி, மார்பு, தோள் ஆகியவற்றுக்கு லைட் ஸ்ட்ரெச்சிங்",
      "எடை, தூக்கம், தசை வலி, பயிற்சி குறிப்புகள் ஆகியவற்றை மதிப்பாய்வு செய்யுங்கள்"
    ],
    food: (protein) => ({
      preWorkout: ["தண்ணீருடன் வாழைப்பழம்", "சாம்பாருடன் இட்லி", "பயிற்சிக்கு 60 நிமிடம் மேல் இருந்தால் சிறிய தோசை"],
      postWorkout: [`சாதம் அல்லது சப்பாத்தியுடன் ${protein}`, "வெப்பத்தால் பசி குறைந்தால் தயிர் சாதம் அல்லது மோர்", "அதிக வியர்வைக்கு பிறகு இளநீர்"],
      dailyMeals: [
        "ஒவ்வொரு உணவிலும் புரதம், சாதம் அல்லது சப்பாத்தி, காய்கறி, சிறிது நல்ல கொழுப்பு சேர்க்கவும்",
        "வறுத்த ஸ்நாக்ஸ் மற்றும் இனிப்பு பானங்களை குறைக்கவும்",
        "கிராஷ் டயட் வேண்டாம்; அளவுகளை மெதுவாக சரிசெய்து வாராந்திர முன்னேற்றத்தை பாருங்கள்"
      ]
    }),
    recoveryTips: (hasInjury) => [
      "முடிந்தால் 7-9 மணி நேரம் தூங்குங்கள்; மீட்பும் பயிற்சியின் ஒரு பகுதி.",
      "கடின இடைவெளி பயிற்சி அல்லது போட்டிக்குப் பிறகு குறைந்த தீவிர நாள் வைத்துக்கொள்ளுங்கள்.",
      "இடுப்பு, கணுக்கால், மேல் முதுகு, தோள் ஆகியவற்றுக்கு 5-10 நிமிடம் மொபிலிட்டி செய்யுங்கள்.",
      hasInjury ? "பழைய காய வலி திரும்பினால் தீவிரத்தை குறைத்து பிஸியோதெரபிஸ்டை அணுகுங்கள்." : "கூர்மையான வலி இருந்தால் பயிற்சியை நிறுத்தி மீண்டும் மதிப்பாய்வு செய்யுங்கள்."
    ],
    safety: (isMinor) => [
      "மார்பு வலி, மயக்கம், கடுமையான மூச்சுத்திணறல் அல்லது தலைசுற்றல் இருந்தால் உடனே மருத்துவ உதவி பெறுங்கள்.",
      "கூர்மையான வலி அல்லது வீக்கம் இருந்தால் பயிற்சி செய்ய வேண்டாம்.",
      "ஓட்ட தூரம் அல்லது எடைப் பயிற்சி சுமையை மெதுவாக மட்டுமே அதிகரிக்கவும்.",
      "சப்பிளிமெண்ட்ஸ் கட்டாயமில்லை; சாதாரண உணவை மாற்றக்கூடாது.",
      ...(isMinor ? ["சிறுவர்களுக்கு டெக்னிக் முதன்மை; அதிகபட்ச எடை தூக்குதல் வேண்டாம்."] : [])
    ],
    progress: (sport) => ["பயிற்சி நிறைவு", "உடல் எடை போக்கு", "தூக்க நேரம்", "ஆற்றல் மற்றும் தசை வலி மதிப்பு", `${sport} செயல்திறன் குறிப்புகள்`]
  },
  Hindi: {
    days: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
    recoveryDay: "रविवार",
    recovery: "रिकवरी",
    summary: (profile) =>
      `${profile.name}, आपका ${profile.trainingDays} दिन का प्लान ${profile.sport} ट्रेनिंग के साथ ${profile.goal} लक्ष्य के लिए बनाया गया है। चेन्नई की गर्मी और नमी के कारण कठिन आउटडोर ट्रेनिंग सुबह 8 बजे से पहले या शाम 5:30 के बाद करें। ${
        profile.injuryHistory
          ? `आपकी इंजरी नोट है "${profile.injuryHistory}", इसलिए दर्द-मुक्त मूवमेंट और धीरे-धीरे प्रोग्रेस पहले आएगी।`
          : "कोई इंजरी हिस्ट्री नहीं दी गई है, इसलिए प्लान सामान्य सुरक्षित शुरुआत से शुरू होता है।"
      }`,
    note: (profile) =>
      `मेंटor टेक्स्ट के लिए ${profile.language} और voice conversation के लिए ${profile.voiceLanguage} इस्तेमाल होगा।`,
    focus: {
      "sprint mechanics": "स्प्रिंट तकनीक",
      "shoulder care": "शोल्डर केयर",
      "core rotation": "कोर रोटेशन",
      "lower-body power": "लोअर बॉडी पावर",
      "aerobic base": "एरोबिक बेस",
      "sprint intervals": "स्प्रिंट इंटरवल",
      agility: "एजिलिटी",
      "single-leg strength": "सिंगल लेग स्ट्रेंथ",
      footwork: "फुटवर्क",
      "reaction speed": "रिएक्शन स्पीड",
      "shoulder mobility": "शोल्डर मोबिलिटी",
      "knee control": "नी कंट्रोल",
      "easy mileage": "ईज़ी माइलेज",
      intervals: "इंटरवल",
      "tempo effort": "टेम्पो एफर्ट",
      mobility: "मोबिलिटी",
      "compound strength": "कंपाउंड स्ट्रेंथ",
      hypertrophy: "मसल ग्रोथ",
      conditioning: "कंडीशनिंग",
      "full-body strength": "फुल बॉडी स्ट्रेंथ",
      "zone 2 cardio": "ज़ोन 2 कार्डियो",
      "core stability": "कोर स्टेबिलिटी"
    },
    session: ({ focus, equipment, intensity, alternate }) => [
      "वार्म अप: 8 मिनट तेज चाल या हल्की जॉगिंग, फिर डायनामिक मोबिलिटी",
      `मुख्य भाग: ${focus} ट्रेनिंग 25-35 मिनट, ${intensity} इंटेंसिटी पर`,
      `स्ट्रेंथ: ${equipment} का उपयोग करके 3 राउंड स्क्वाट, लंज, पुश-अप, रो और प्लैंक`,
      alternate
        ? "स्किल: पूरे आराम के साथ 15 मिनट नियंत्रित तकनीक अभ्यास"
        : "कंडीशनिंग: 30 सेकंड तेज प्रयास + 90 सेकंड आसान रिकवरी, 6 राउंड",
      "कूल डाउन: 5 मिनट वॉक और धीमी सांस"
    ],
    recoverySession: ["20-30 मिनट आसान वॉक", "हिप्स, काफ, चेस्ट और शोल्डर की हल्की स्ट्रेचिंग", "वजन, नींद, soreness और ट्रेनिंग नोट्स देखें"],
    food: (protein) => ({
      preWorkout: ["पानी के साथ केला", "सांभर के साथ इडली", "अगर ट्रेनिंग 60 मिनट बाद है तो छोटा डोसा"],
      postWorkout: [`चावल या चपाती के साथ ${protein}`, "गर्मी के बाद भूख कम हो तो दही चावल या छाछ", "ज्यादा पसीना आने के बाद नारियल पानी"],
      dailyMeals: [
        "हर भोजन में प्रोटीन, चावल या चपाती, सब्जियां और थोड़ा हेल्दी फैट रखें",
        "फ्राइड स्नैक्स और शुगर ड्रिंक्स कम रखें",
        "क्रैश डाइट न करें; portions धीरे-धीरे बदलें और weekly progress देखें"
      ]
    }),
    recoveryTips: (hasInjury) => [
      "हो सके तो 7-9 घंटे सोएं; रिकवरी भी ट्रेनिंग का हिस्सा है।",
      "हार्ड इंटरवल या मैच के बाद कम इंटेंसिटी वाला दिन रखें।",
      "हिप्स, एंकल, अपर बैक और शोल्डर के लिए 5-10 मिनट मोबिलिटी करें।",
      hasInjury ? "पुरानी इंजरी का दर्द वापस आए तो इंटेंसिटी कम करें और फिजियोथेरेपिस्ट से मिलें।" : "तेज दर्द हो तो सेशन रोकें और फिर से जांचें।"
    ],
    safety: (isMinor) => [
      "छाती में दर्द, बेहोशी जैसा लगना, बहुत सांस फूलना या चक्कर आए तो मेडिकल मदद लें।",
      "तेज दर्द या सूजन में ट्रेनिंग न करें।",
      "रनिंग वॉल्यूम या वजन धीरे-धीरे बढ़ाएं।",
      "सप्लीमेंट जरूरी नहीं हैं और सामान्य भोजन की जगह नहीं लेने चाहिए।",
      ...(isMinor ? ["माइनर्स के लिए तकनीक पर ध्यान रखें और मैक्स एफर्ट लिफ्टिंग से बचें।"] : [])
    ],
    progress: (sport) => ["वर्कआउट पूरा होना", "बॉडी वेट ट्रेंड", "नींद की अवधि", "एनर्जी और soreness स्कोर", `${sport} performance notes`]
  },
  Malayalam: {
    days: ["തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"],
    recoveryDay: "ഞായർ",
    recovery: "റിക്കവറി",
    summary: (profile) =>
      `${profile.name}, ${profile.sport} പരിശീലനത്തോടെ ${profile.goal} ലക്ഷ്യത്തിനായി ${profile.trainingDays} ദിവസത്തെ പ്ലാൻ തയ്യാറാക്കിയിട്ടുണ്ട്. ചെന്നൈയിലെ ചൂടും ഈർപ്പവും കാരണം കഠിനമായ ഔട്ട്ഡോർ പരിശീലനം രാവിലെ 8 മണിക്ക് മുമ്പ് അല്ലെങ്കിൽ വൈകുന്നേരം 5:30ന് ശേഷം ചെയ്യുക. ${
        profile.injuryHistory
          ? `നിങ്ങളുടെ പരിക്ക് കുറിപ്പ് "${profile.injuryHistory}" എന്നാണ്, അതിനാൽ വേദനയില്ലാത്ത ചലനവും മിതമായ പുരോഗതിയും മുൻഗണനയാണ്.`
          : "പരിക്ക് ചരിത്രം നൽകിയിട്ടില്ല, അതിനാൽ സാധാരണ സുരക്ഷിത തുടക്കത്തോടെയാണ് പ്ലാൻ തുടങ്ങുന്നത്."
      }`,
    note: (profile) =>
      `മെന്റർ ടെക്സ്റ്റിന് ${profile.language}, വോയ്സ് സംഭാഷണത്തിന് ${profile.voiceLanguage} ഉപയോഗിക്കും.`,
    focus: {
      "sprint mechanics": "സ്പ്രിന്റ് മെക്കാനിക്സ്",
      "shoulder care": "ഷോൾഡർ കെയർ",
      "core rotation": "കോർ റോട്ടേഷൻ",
      "lower-body power": "ലോവർ ബോഡി പവർ",
      "aerobic base": "ഏറോബിക് ബേസ്",
      "sprint intervals": "സ്പ്രിന്റ് ഇന്റർവൽ",
      agility: "അജിലിറ്റി",
      "single-leg strength": "സിംഗിൾ ലെഗ് സ്ട്രെങ്ത്",
      footwork: "ഫുട്വർക്ക്",
      "reaction speed": "റിയാക്ഷൻ സ്പീഡ്",
      "shoulder mobility": "ഷോൾഡർ മൊബിലിറ്റി",
      "knee control": "നീ കൺട്രോൾ",
      "easy mileage": "ഈസി മൈലേജ്",
      intervals: "ഇന്റർവൽ",
      "tempo effort": "ടെമ്പോ എഫർട്ട്",
      mobility: "മൊബിലിറ്റി",
      "compound strength": "കമ്പൗണ്ട് സ്ട്രെങ്ത്",
      hypertrophy: "മസിൽ ഗ്രോത്ത്",
      conditioning: "കണ്ടീഷനിംഗ്",
      "full-body strength": "ഫുൾ ബോഡി സ്ട്രെങ്ത്",
      "zone 2 cardio": "സോൺ 2 കാർഡിയോ",
      "core stability": "കോർ സ്റ്റബിലിറ്റി"
    },
    session: ({ focus, equipment, intensity, alternate }) => [
      "വാർം അപ്പ്: 8 മിനിറ്റ് വേഗനട അല്ലെങ്കിൽ ലഘു ജോഗ്, പിന്നെ ഡൈനാമിക് മൊബിലിറ്റി",
      `പ്രധാന ഭാഗം: ${focus} പരിശീലനം 25-35 മിനിറ്റ്, ${intensity} തീവ്രതയിൽ`,
      `ശക്തി: ${equipment} ഉപയോഗിച്ച് 3 റൗണ്ട് സ്ക്വാട്ട്, ലഞ്ച്, പുഷ്-അപ്പ്, റോ, പ്ലാങ്ക്`,
      alternate
        ? "സ്കിൽ: പൂർണ്ണ വിശ്രമത്തോടെ 15 മിനിറ്റ് നിയന്ത്രിത ടെക്നിക് പരിശീലനം"
        : "കണ്ടീഷനിംഗ്: 30 സെക്കന്റ് വേഗ ശ്രമം + 90 സെക്കന്റ് ലഘു റിക്കവറി, 6 റൗണ്ട്",
      "കൂൾ ഡൗൺ: 5 മിനിറ്റ് നടക്കൽ, മന്ദഗതിയിലുള്ള ശ്വാസം"
    ],
    recoverySession: ["20-30 മിനിറ്റ് ലഘു നടക്കൽ", "ഹിപ്സ്, കാൽവള, നെഞ്ച്, ഷോൾഡർ എന്നിവയ്ക്ക് ലഘു സ്ട്രെച്ചിംഗ്", "ഭാരം, ഉറക്കം, soreness, പരിശീലന കുറിപ്പുകൾ പരിശോധിക്കുക"],
    food: (protein) => ({
      preWorkout: ["വെള്ളത്തോടൊപ്പം പഴം", "സാംബാറോടൊപ്പം ഇഡ്ലി", "പരിശീലനത്തിന് 60 മിനിറ്റിന് മേൽ സമയം ഉണ്ടെങ്കിൽ ചെറിയ ദോശ"],
      postWorkout: [`ചോറ് അല്ലെങ്കിൽ ചപ്പാത്തിയോടൊപ്പം ${protein}`, "ചൂടിന് ശേഷം വിശപ്പ് കുറവാണെങ്കിൽ തൈര് ചോറ് അല്ലെങ്കിൽ മോര്", "കൂടുതൽ വിയർപ്പിന് ശേഷം ഇളനീർ"],
      dailyMeals: [
        "ഓരോ ഭക്ഷണത്തിലും പ്രോട്ടീൻ, ചോറ് അല്ലെങ്കിൽ ചപ്പാത്തി, പച്ചക്കറി, ചെറിയ അളവ് നല്ല കൊഴുപ്പ് ഉൾപ്പെടുത്തുക",
        "വറുത്ത സ്നാക്കുകളും പഞ്ചസാര പാനീയങ്ങളും കുറയ്ക്കുക",
        "ക്രാഷ് ഡയറ്റ് വേണ്ട; portions മിതമായി മാറ്റി ആഴ്ചതോറും പുരോഗതി നോക്കുക"
      ]
    }),
    recoveryTips: (hasInjury) => [
      "കഴിയുമെങ്കിൽ 7-9 മണിക്കൂർ ഉറങ്ങുക; റിക്കവറിയും പരിശീലനത്തിന്റെ ഭാഗമാണ്.",
      "ഹാർഡ് ഇന്റർവൽ അല്ലെങ്കിൽ മത്സരം കഴിഞ്ഞാൽ കുറഞ്ഞ തീവ്രതയുള്ള ദിവസം വയ്ക്കുക.",
      "ഹിപ്സ്, ആങ്കിൾ, അപ്പർ ബാക്ക്, ഷോൾഡർ എന്നിവയ്ക്ക് 5-10 മിനിറ്റ് മൊബിലിറ്റി ചെയ്യുക.",
      hasInjury ? "പഴയ പരിക്ക് വേദന തിരികെ വന്നാൽ തീവ്രത കുറച്ച് ഫിസിയോതെറാപ്പിസ്റ്റിനെ കാണുക." : "മൂർച്ചയുള്ള വേദന വന്നാൽ സെഷൻ നിർത്തി വീണ്ടും വിലയിരുത്തുക."
    ],
    safety: (isMinor) => [
      "നെഞ്ചുവേദന, ബോധക്ഷയം പോലെ തോന്നൽ, കഠിനമായ ശ്വാസതടസം, തലചുറ്റൽ ഉണ്ടെങ്കിൽ മെഡിക്കൽ സഹായം തേടുക.",
      "മൂർച്ചയുള്ള വേദനയോ വീക്കമോ ഉണ്ടായാൽ പരിശീലനം ചെയ്യരുത്.",
      "റണ്ണിംഗ് വോള്യം അല്ലെങ്കിൽ ഭാരപരിശീലന ലോഡ് മിതമായി മാത്രം കൂട്ടുക.",
      "സപ്പ്ലിമെന്റുകൾ നിർബന്ധമല്ല; സാധാരണ ഭക്ഷണത്തിന് പകരമാക്കരുത്.",
      ...(isMinor ? ["കുട്ടികൾക്ക് ടെക്നിക് മുൻഗണന; മാക്സ് എഫർട്ട് ലിഫ്റ്റിംഗ് ഒഴിവാക്കുക."] : [])
    ],
    progress: (sport) => ["വർക്ക്‌ഔട്ട് പൂർത്തീകരണം", "ശരീരഭാരം ട്രെൻഡ്", "ഉറക്ക സമയം", "എനർജി, soreness സ്കോർ", `${sport} പ്രകടന കുറിപ്പുകൾ`]
  },
  Kannada: {
    days: ["ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"],
    recoveryDay: "ಭಾನುವಾರ",
    recovery: "ರಿಕವರಿ",
    summary: (profile) =>
      `${profile.name}, ${profile.sport} ತರಬೇತಿಯೊಂದಿಗೆ ${profile.goal} ಗುರಿಗಾಗಿ ನಿಮ್ಮ ${profile.trainingDays} ದಿನಗಳ ಯೋಜನೆ ಸಿದ್ಧವಾಗಿದೆ. ಚೆನ್ನೈಯ ಬಿಸಿಲು ಮತ್ತು ತೇವಾಂಶದಿಂದ ಕಠಿಣ ಹೊರಾಂಗಣ ತರಬೇತಿಯನ್ನು ಬೆಳಿಗ್ಗೆ 8 ಗಂಟೆಗೆ ಮೊದಲು ಅಥವಾ ಸಂಜೆ 5:30 ನಂತರ ಮಾಡಿ. ${
        profile.injuryHistory
          ? `ನಿಮ್ಮ ಗಾಯದ ಟಿಪ್ಪಣಿ "${profile.injuryHistory}" ಎಂದು ಇದೆ, ಆದ್ದರಿಂದ ನೋವಿಲ್ಲದ ಚಲನೆ ಮತ್ತು ನಿಧಾನವಾದ ಪ್ರಗತಿ ಮೊದಲು.`
          : "ಗಾಯದ ಇತಿಹಾಸ ನೀಡಿಲ್ಲ, ಆದ್ದರಿಂದ ಸಾಮಾನ್ಯ ಸುರಕ್ಷಿತ ಆರಂಭದ ಯೋಜನೆ ನೀಡಲಾಗಿದೆ."
      }`,
    note: (profile) =>
      `ಮೆಂಟರ್ ಪಠ್ಯಕ್ಕೆ ${profile.language}, ಧ್ವನಿ ಸಂಭಾಷಣೆಗೆ ${profile.voiceLanguage} ಬಳಸಲಾಗುತ್ತದೆ.`,
    focus: {
      "sprint mechanics": "ಸ್ಪ್ರಿಂಟ್ ತಂತ್ರ",
      "shoulder care": "ಭುಜದ ಕಾಳಜಿ",
      "core rotation": "ಕೋರ್ ರೋಟೇಶನ್",
      "lower-body power": "ಲೋವರ್ ಬಾಡಿ ಪವರ್",
      "aerobic base": "ಏರೋಬಿಕ್ ಬೇಸ್",
      "sprint intervals": "ಸ್ಪ್ರಿಂಟ್ ಇಂಟರ್ವಲ್",
      agility: "ಅಜಿಲಿಟಿ",
      "single-leg strength": "ಸಿಂಗಲ್ ಲೆಗ್ ಸ್ಟ್ರೆಂಥ್",
      footwork: "ಫುಟ್ವರ್ಕ್",
      "reaction speed": "ರಿಯಾಕ್ಷನ್ ಸ್ಪೀಡ್",
      "shoulder mobility": "ಭುಜ ಚಲನೆ",
      "knee control": "ಮಂಡಿ ನಿಯಂತ್ರಣ",
      "easy mileage": "ಈಸಿ ಮೈಲೇಜ್",
      intervals: "ಇಂಟರ್ವಲ್",
      "tempo effort": "ಟೆಂಪೋ ಪ್ರಯತ್ನ",
      mobility: "ಮೊಬಿಲಿಟಿ",
      "compound strength": "ಕಂಪೌಂಡ್ ಸ್ಟ್ರೆಂಥ್",
      hypertrophy: "ಮಸಲ್ ಗ್ರೋತ್",
      conditioning: "ಕಂಡಿಷನಿಂಗ್",
      "full-body strength": "ಪೂರ್ಣ ದೇಹದ ಬಲ",
      "zone 2 cardio": "ಜೋನ್ 2 ಕಾರ್ಡಿಯೋ",
      "core stability": "ಕೋರ್ ಸ್ಥಿರತೆ"
    },
    session: ({ focus, equipment, intensity, alternate }) => [
      "ವಾರ್ಮ್ ಅಪ್: 8 ನಿಮಿಷ ವೇಗದ ನಡೆ ಅಥವಾ ಲಘು ಜಾಗಿಂಗ್, ನಂತರ ಡೈನಾಮಿಕ್ ಮೊಬಿಲಿಟಿ",
      `ಮುಖ್ಯ ಭಾಗ: ${focus} ತರಬೇತಿ 25-35 ನಿಮಿಷ, ${intensity} ತೀವ್ರತೆಯಲ್ಲಿ`,
      `ಬಲ: ${equipment} ಬಳಸಿ 3 ರೌಂಡ್ ಸ್ಕ್ವಾಟ್, ಲಂಜ್, ಪುಷ್-ಅಪ್, ರೋ ಮತ್ತು ಪ್ಲಾಂಕ್`,
      alternate
        ? "ಸ್ಕಿಲ್: ಸಂಪೂರ್ಣ ವಿಶ್ರಾಂತಿಯೊಂದಿಗೆ 15 ನಿಮಿಷ ನಿಯಂತ್ರಿತ ತಂತ್ರ ಅಭ್ಯಾಸ"
        : "ಕಂಡಿಷನಿಂಗ್: 30 ಸೆಕೆಂಡ್ ವೇಗದ ಪ್ರಯತ್ನ + 90 ಸೆಕೆಂಡ್ ಸುಲಭ ರಿಕವರಿ, 6 ರೌಂಡ್",
      "ಕೂಲ್ ಡೌನ್: 5 ನಿಮಿಷ ನಡೆ ಮತ್ತು ನಿಧಾನ ಉಸಿರಾಟ"
    ],
    recoverySession: ["20-30 ನಿಮಿಷ ಸುಲಭ ನಡೆ", "ಹಿಪ್ಸ್, ಕಾಲ್ವ್ಸ್, ಎದೆ ಮತ್ತು ಭುಜಗಳಿಗೆ ಲಘು ಸ್ಟ್ರೆಚಿಂಗ್", "ತೂಕ, ನಿದ್ರೆ, soreness ಮತ್ತು ತರಬೇತಿ ಟಿಪ್ಪಣಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ"],
    food: (protein) => ({
      preWorkout: ["ನೀರಿನೊಂದಿಗೆ ಬಾಳೆಹಣ್ಣು", "ಸಾಂಬಾರ್ ಜೊತೆಗೆ ಇಡ್ಲಿ", "ತರಬೇತಿಗೆ 60 ನಿಮಿಷಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಮಯ ಇದ್ದರೆ ಚಿಕ್ಕ ದೋಸೆ"],
      postWorkout: [`ಅಕ್ಕಿ ಅಥವಾ ಚಪಾತಿಯೊಂದಿಗೆ ${protein}`, "ಬಿಸಿಲಿನ ನಂತರ ಹಸಿವು ಕಡಿಮೆ ಇದ್ದರೆ ಮೊಸರು ಅನ್ನ ಅಥವಾ ಮಜ್ಜಿಗೆ", "ಹೆಚ್ಚು ಬೆವರು ಬಂದ ನಂತರ ತೆಂಗಿನಕಾಯಿ ನೀರು"],
      dailyMeals: [
        "ಪ್ರತಿ ಊಟದಲ್ಲಿ ಪ್ರೋಟೀನ್, ಅಕ್ಕಿ ಅಥವಾ ಚಪಾತಿ, ತರಕಾರಿ ಮತ್ತು ಸ್ವಲ್ಪ ಒಳ್ಳೆಯ ಕೊಬ್ಬು ಇರಲಿ",
        "ಫ್ರೈಡ್ ಸ್ನ್ಯಾಕ್ಸ್ ಮತ್ತು ಸಕ್ಕರೆ ಪಾನೀಯಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ",
        "ಕ್ರ್ಯಾಶ್ ಡಯಟ್ ಬೇಡ; portions ನಿಧಾನವಾಗಿ ಬದಲಿಸಿ ವಾರದ ಪ್ರಗತಿಯನ್ನು ನೋಡಿ"
      ]
    }),
    recoveryTips: (hasInjury) => [
      "ಸಾಧ್ಯವಾದರೆ 7-9 ಗಂಟೆ ನಿದ್ರೆ ಮಾಡಿ; ರಿಕವರಿಯೂ ತರಬೇತಿಯ ಭಾಗವಾಗಿದೆ.",
      "ಕಠಿಣ ಇಂಟರ್ವಲ್ ಅಥವಾ ಪಂದ್ಯ ನಂತರ ಕಡಿಮೆ ತೀವ್ರತೆಯ ದಿನವಿರಲಿ.",
      "ಹಿಪ್ಸ್, ಆಂಕಲ್, ಅಪರ್ ಬ್ಯಾಕ್ ಮತ್ತು ಭುಜಗಳಿಗೆ 5-10 ನಿಮಿಷ ಮೊಬಿಲಿಟಿ ಮಾಡಿ.",
      hasInjury ? "ಹಳೆಯ ಗಾಯದ ನೋವು ಮರಳಿದರೆ ತೀವ್ರತೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಿ ಫಿಸಿಯೋಥೆರಪಿಸ್ಟ್ ಭೇಟಿ ಮಾಡಿ." : "ತೀಕ್ಷ್ಣ ನೋವು ಬಂದರೆ ಸೆಷನ್ ನಿಲ್ಲಿಸಿ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ."
    ],
    safety: (isMinor) => [
      "ಛಾತಿ ನೋವು, ಮೂರ್ಛೆ ಅನಿಸುವುದು, ತೀವ್ರ ಉಸಿರಾಟ ತೊಂದರೆ ಅಥವಾ ತಲೆ ಸುತ್ತಿದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ತೀಕ್ಷ್ಣ ನೋವು ಅಥವಾ ಊತ ಇದ್ದರೆ ತರಬೇತಿ ಮಾಡಬೇಡಿ.",
      "ರನ್ನಿಂಗ್ ವಾಲ್ಯೂಮ್ ಅಥವಾ ಲಿಫ್ಟಿಂಗ್ ಲೋಡ್ ಅನ್ನು ನಿಧಾನವಾಗಿ ಹೆಚ್ಚಿಸಿ.",
      "ಸಪ್ಲಿಮೆಂಟ್‌ಗಳು ಕಡ್ಡಾಯವಲ್ಲ; ಸಾಮಾನ್ಯ ಆಹಾರದ ಬದಲು ಬಳಸಬೇಡಿ.",
      ...(isMinor ? ["ಮಕ್ಕಳಿಗೆ ತಂತ್ರ ಮುಖ್ಯ; ಮ್ಯಾಕ್ಸ್ ಎಫರ್ಟ್ ಲಿಫ್ಟಿಂಗ್ ತಪ್ಪಿಸಿ."] : [])
    ],
    progress: (sport) => ["ವರ್ಕೌಟ್ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ", "ದೇಹದ ತೂಕ ಟ್ರೆಂಡ್", "ನಿದ್ರೆಯ ಅವಧಿ", "ಎನರ್ಜಿ ಮತ್ತು soreness ಸ್ಕೋರ್", `${sport} ಪ್ರದರ್ಶನ ಟಿಪ್ಪಣಿಗಳು`]
  }
};

const proteinByPreference = {
  English: {
    Vegan: "tofu, sprouts, channa, rajma, dal, or soy chunks",
    Vegetarian: "paneer, curd, dal, sprouts, channa, rajma, or tofu",
    Eggitarian: "eggs, curd, paneer, dal, sprouts, or channa",
    "Non-vegetarian": "eggs, chicken, fish, curd, dal, paneer, or channa",
    Pescatarian: "fish, eggs, curd, dal, sprouts, paneer, or channa",
    "High-protein vegetarian": "paneer, Greek-style curd, tofu, soy chunks, dal, channa, rajma, or sprouts",
    "South Indian vegetarian": "sambar, dal, curd, paneer, sprouts, channa, pesarattu, or adai",
    "North Indian vegetarian": "dal, rajma, chole, paneer, curd, sprouts, or tofu",
    "No onion/garlic": "paneer, curd, dal, sprouts, channa, rajma, tofu, or soy chunks without onion/garlic",
    Jain: "paneer, curd, milk, dal, sprouts where suitable, tofu, or nut-based sides",
    "Lactose-free": "eggs, chicken, fish, tofu, soy chunks, dal, sprouts, channa, or rajma",
    "Gluten-free": "rice, dal, eggs, chicken, fish, paneer, curd, channa, rajma, millet, or dosa/idli",
    "Diabetes-friendly": "dal, eggs, chicken, fish, paneer, tofu, sprouts, vegetables, and measured rice or roti portions",
    "Budget student meals": "eggs, dal, channa, sprouts, curd, soy chunks, peanuts, or seasonal home food",
    "Hostel food": "eggs, dal, curd, channa, sprouts, paneer when available, or soy chunks",
    "Home-cooked mixed diet": "eggs, chicken, fish, dal, curd, paneer, channa, rajma, vegetables, rice, or chapati"
  },
  Tamil: {
    Vegan: "டோஃபு, முளைகட்டிய பயறு, சன்னா, ராஜ்மா, பருப்பு அல்லது சோயா chunks",
    Vegetarian: "பனீர், தயிர், பருப்பு, முளைகட்டிய பயறு, சன்னா, ராஜ்மா அல்லது டோஃபு",
    Eggitarian: "முட்டை, தயிர், பனீர், பருப்பு, முளைகட்டிய பயறு அல்லது சன்னா",
    "Non-vegetarian": "முட்டை, சிக்கன், மீன், தயிர், பருப்பு, பனீர் அல்லது சன்னா"
  },
  Hindi: {
    Vegan: "टोफू, स्प्राउट्स, चना, राजमा, दाल या सोया चंक्स",
    Vegetarian: "पनीर, दही, दाल, स्प्राउट्स, चना, राजमा या टोफू",
    Eggitarian: "अंडे, दही, पनीर, दाल, स्प्राउट्स या चना",
    "Non-vegetarian": "अंडे, चिकन, मछली, दही, दाल, पनीर या चना"
  },
  Malayalam: {
    Vegan: "ടോഫു, മുളപ്പിച്ച പയർ, കടല, രാജ്മ, ദാൽ അല്ലെങ്കിൽ സോയ ചങ്ക്സ്",
    Vegetarian: "പനീർ, തൈര്, ദാൽ, മുളപ്പിച്ച പയർ, കടല, രാജ്മ അല്ലെങ്കിൽ ടോഫു",
    Eggitarian: "മുട്ട, തൈര്, പനീർ, ദാൽ, മുളപ്പിച്ച പയർ അല്ലെങ്കിൽ കടല",
    "Non-vegetarian": "മുട്ട, ചിക്കൻ, മീൻ, തൈര്, ദാൽ, പനീർ അല്ലെങ്കിൽ കടല"
  },
  Kannada: {
    Vegan: "ಟೋಫು, ಮೊಳಕೆ ಕಾಳು, ಚನ್ನಾ, ರಾಜ್ಮಾ, ದಾಲ್ ಅಥವಾ ಸೋಯಾ ಚಂಕ್ಸ್",
    Vegetarian: "ಪನೀರ್, ಮೊಸರು, ದಾಲ್, ಮೊಳಕೆ ಕಾಳು, ಚನ್ನಾ, ರಾಜ್ಮಾ ಅಥವಾ ಟೋಫು",
    Eggitarian: "ಮೊಟ್ಟೆ, ಮೊಸರು, ಪನೀರ್, ದಾಲ್, ಮೊಳಕೆ ಕಾಳು ಅಥವಾ ಚನ್ನಾ",
    "Non-vegetarian": "ಮೊಟ್ಟೆ, ಚಿಕನ್, ಮೀನು, ಮೊಸರು, ದಾಲ್, ಪನೀರ್ ಅಥವಾ ಚನ್ನಾ"
  }
};

const sportFocus = {
  Cricket: ["sprint mechanics", "shoulder care", "core rotation", "lower-body power"],
  Football: ["aerobic base", "sprint intervals", "agility", "single-leg strength"],
  Badminton: ["footwork", "reaction speed", "shoulder mobility", "knee control"],
  Running: ["easy mileage", "intervals", "tempo effort", "mobility"],
  "Gym training": ["compound strength", "hypertrophy", "conditioning", "mobility"],
  Kabaddi: ["raid footwork", "grip escapes", "core stability", "repeat sprints"],
  Volleyball: ["jump mechanics", "shoulder power", "landing control", "court reactions"],
  Basketball: ["change of direction", "jump power", "ball handling", "defensive slides"],
  Tennis: ["lateral movement", "serve mechanics", "rotational power", "rally endurance"],
  Hockey: ["stick control", "sprint repeats", "low stance strength", "agility"],
  Swimming: ["stroke technique", "pull strength", "kick endurance", "breath control"],
  Boxing: ["footwork", "punch mechanics", "conditioning", "defensive reactions"],
  "Table tennis": ["serve control", "reaction speed", "spin reading", "footwork"],
  Yoga: ["mobility", "breath control", "core stability", "balance"],
  "General fitness": ["full-body strength", "zone 2 cardio", "mobility", "core stability"]
};

const sportPlaybooks = {
  Cricket: {
    mentor: [
      "Build every week around batting or bowling skill blocks, fielding reactions, and shoulder care.",
      "Keep one focused net session for match scenario practice instead of only volume hitting.",
      "Track decision quality: shot choice, bowling line/length, field awareness, and calmness under pressure."
    ],
    fitness: [
      "Sprint 10-30 metres with full recovery for quick singles and fielding bursts.",
      "Train rotational core strength with medicine-ball throws, band chops, and anti-rotation holds.",
      "Use shoulder prehab before every throwing or bowling session."
    ],
    tournament: [
      "Two weeks out: reduce heavy strength volume and increase match simulation.",
      "Three days out: keep training short, sharp, and skill-focused.",
      "Game day: hydrate early, warm up shoulders thoroughly, and review role-specific cues."
    ],
    drills: ["Throwing accuracy ladder", "Slip catching reactions", "Power-hitting zones", "Yorker or line-length targets"],
    milestones: ["Consistent warm-up routine", "Lower dropped-catch count", "Stable sprint repeat speed", "Clear match role"]
  },
  Football: {
    mentor: [
      "Balance stamina with ball work so fitness transfers directly into match decisions.",
      "Use small-sided games for scanning, passing timing, pressing, and recovery runs.",
      "Review one tactical theme each week: positioning, transition, pressing, or finishing."
    ],
    fitness: [
      "Alternate aerobic base runs with sprint intervals and change-of-direction work.",
      "Add single-leg strength for acceleration, deceleration, and knee control.",
      "Keep mobility for hips, ankles, hamstrings, and calves after every session."
    ],
    tournament: [
      "Ten days out: make sessions more match-like and reduce extra conditioning.",
      "Two days out: use light touches, passing rhythm, and set-piece rehearsal.",
      "Game day: eat early, hydrate steadily, and warm up with progressive sprints."
    ],
    drills: ["5v5 possession", "Cone agility with ball", "First-touch wall passes", "Finishing after sprint"],
    milestones: ["Better beep-test or timed-run score", "Cleaner first touch", "More successful presses", "Stable late-game energy"]
  },
  Badminton: {
    mentor: [
      "Prioritize footwork quality before adding longer rallies.",
      "Train shot selection around lift, drop, clear, smash, and net control patterns.",
      "Use short video checks for split-step timing and recovery position."
    ],
    fitness: [
      "Use court shuttles for repeated acceleration and braking.",
      "Strengthen calves, quads, glutes, shoulders, and forearms without overloading joints.",
      "Add mobility for ankles, hips, thoracic spine, and shoulder rotation."
    ],
    tournament: [
      "One week out: play practice matches with scoring pressure.",
      "Two days out: reduce volume and sharpen serve/return patterns.",
      "Match day: warm up footwork first, then progress into clears, drops, smashes, and net shots."
    ],
    drills: ["Four-corner footwork", "Multi-shuttle defense", "Serve-return targets", "Net kill reactions"],
    milestones: ["Faster recovery to base", "Fewer unforced errors", "Sharper serve accuracy", "Better rally patience"]
  },
  Running: {
    mentor: [
      "Keep most running easy so the hard sessions are high quality.",
      "Use one speed or tempo session weekly based on the goal.",
      "Track distance, pace, perceived effort, sleep, soreness, and heat stress."
    ],
    fitness: [
      "Build aerobic base with easy runs and gradual weekly volume increases.",
      "Add strength for calves, glutes, hamstrings, and core two times per week.",
      "Use strides after easy runs to improve form without heavy fatigue."
    ],
    tournament: [
      "Two weeks out: taper volume while keeping short fast efforts.",
      "Three days out: avoid new workouts, shoes, food, or routes.",
      "Race day: start controlled, hydrate by weather, and finish with a planned effort increase."
    ],
    drills: ["Easy run plus strides", "Tempo blocks", "Hill repeats", "Cadence and posture checks"],
    milestones: ["Lower easy-run heart strain", "Consistent weekly volume", "Improved time trial", "No pain during taper"]
  },
  "Gym training": {
    mentor: [
      "Anchor the week around compound lifts, accessory balance, and recovery.",
      "Progress only one variable at a time: load, reps, sets, or tempo.",
      "Use a training log for technique notes, load, reps, and readiness."
    ],
    fitness: [
      "Prioritize squat, hinge, push, pull, carry, and core patterns.",
      "Use conditioning finishers only after strength quality is complete.",
      "Keep mobility for hips, shoulders, ankles, and thoracic spine."
    ],
    tournament: [
      "For physique or strength events: peak technique first, then reduce fatigue.",
      "Seven days out: avoid max attempts unless planned by a coach.",
      "Event day: warm up gradually and keep attempts or sets within the plan."
    ],
    drills: ["Technique warm-up sets", "Tempo reps", "Loaded carries", "Core bracing practice"],
    milestones: ["Cleaner lift form", "Progressive overload", "Stable energy", "Better recovery between sessions"]
  },
  "General fitness": {
    mentor: [
      "Blend strength, cardio, mobility, and habit consistency.",
      "Choose repeatable sessions first, then slowly increase difficulty.",
      "Measure progress with energy, movement quality, sleep, and consistency."
    ],
    fitness: [
      "Use full-body strength two to three times per week.",
      "Add zone 2 cardio for heart health and stamina.",
      "Keep daily mobility short and consistent."
    ],
    tournament: [
      "For any event or challenge: practice the exact format before increasing intensity.",
      "One week out: reduce soreness and keep movement familiar.",
      "Event day: warm up gently, pace early, and finish with control."
    ],
    drills: ["Full-body circuit", "Zone 2 walk or cycle", "Mobility flow", "Core stability set"],
    milestones: ["Weekly consistency", "Better stamina", "Lower soreness", "Improved movement confidence"]
  }
};

Object.assign(sportPlaybooks, {
  Kabaddi: {
    mentor: ["Train raiding, tackling, and mat awareness together.", "Use short high-intensity bursts with full recovery.", "Practice decision-making under breath-control pressure."],
    fitness: ["Build repeat sprint ability, grip strength, hip mobility, and trunk control.", "Add low stance holds and lateral shuffles.", "Use partner-resisted drills only after a full warm-up."],
    tournament: ["Two weeks out: increase match simulation and reduce extra lifting.", "Three days out: sharpen raids, ankle holds, and chain defense.", "Game day: warm hips, groin, shoulders, and fingers carefully."],
    drills: ["Bonus-line footwork", "Dubki movement practice", "Ankle-hold entries", "Chain defense reactions"],
    milestones: ["Longer controlled breath holds", "Cleaner raid exit", "Stronger grip escapes", "Better repeat sprint recovery"]
  },
  Volleyball: {
    mentor: ["Pair jump skill with landing control.", "Train serve receive before power hitting.", "Practice communication on every rally."],
    fitness: ["Use plyometrics carefully with full landing quality.", "Strengthen shoulders, calves, quads, and core.", "Add reaction drills for blocking and digging."],
    tournament: ["One week out: reduce jump volume and rehearse rotations.", "Two days out: sharpen serving, passing, and first tempo.", "Match day: warm shoulders and ankles before hitting."],
    drills: ["Serve target zones", "Approach jump timing", "Block footwork", "Dig reaction lanes"],
    milestones: ["Higher controlled jump", "Better serve accuracy", "Cleaner receive platform", "Fewer landing errors"]
  },
  Basketball: {
    mentor: ["Connect conditioning with dribbling, passing, and shot selection.", "Train defense as seriously as scoring.", "Use small-sided games for spacing and decisions."],
    fitness: ["Build change-of-direction speed, vertical power, and trunk stiffness.", "Add ankle, knee, and hip control for landings.", "Use intervals that mimic possessions."],
    tournament: ["Ten days out: prioritize scrimmage rhythm and free throws.", "Two days out: keep shooting volume moderate and legs fresh.", "Game day: rehearse warm-up shots, defensive slides, and transition sprints."],
    drills: ["Cone dribble changes", "Closeout to box-out", "Form shooting ladder", "Fast-break finishing"],
    milestones: ["Cleaner weak-hand control", "Better free-throw routine", "Quicker defensive recovery", "Stable fourth-quarter legs"]
  },
  Tennis: {
    mentor: ["Build footwork patterns around the serve, return, and rally ball.", "Train controlled depth before winners.", "Review unforced errors after every set."],
    fitness: ["Use lateral shuffles, split-step timing, and rotational strength.", "Protect shoulders and elbows with warm-up bands.", "Condition with point-style intervals."],
    tournament: ["One week out: play practice sets with score pressure.", "Two days out: reduce serving load and sharpen return patterns.", "Match day: warm serve gradually and manage hydration between games."],
    drills: ["Cross-court consistency", "Serve plus one", "Return targets", "Approach and volley"],
    milestones: ["Higher first-serve percentage", "Longer rally tolerance", "Fewer unforced errors", "Better split-step timing"]
  },
  Hockey: {
    mentor: ["Train low body position with stick skill.", "Use sprint repeats and passing under pressure.", "Practice scanning before receiving."],
    fitness: ["Build hip strength, hamstring resilience, and repeated acceleration.", "Add low stance isometrics.", "Use agility with ball control."],
    tournament: ["Ten days out: increase tactical game reps.", "Two days out: keep stick touches sharp and legs fresh.", "Game day: warm hips, ankles, and wrists thoroughly."],
    drills: ["Cone dribble gates", "Push-pass targets", "1v1 channel defense", "Sprint to shot"],
    milestones: ["Cleaner first touch", "Lower stance endurance", "Faster recovery runs", "Better passing accuracy"]
  },
  Swimming: {
    mentor: ["Technique comes before extra metres.", "Track stroke count and breathing rhythm.", "Keep dryland strength supportive, not exhausting."],
    fitness: ["Build pull strength, kick endurance, shoulder mobility, and core control.", "Use interval sets with clean stroke form.", "Add recovery work for lats and shoulders."],
    tournament: ["Two weeks out: rehearse race pace and turns.", "Three days out: taper volume and keep feel for water.", "Race day: warm up gradually and commit to the planned stroke rhythm."],
    drills: ["Catch-up drill", "Kickboard intervals", "Turn practice", "Breathing pattern sets"],
    milestones: ["Lower stroke count", "Cleaner turns", "Better pacing", "Stable breathing under fatigue"]
  },
  Boxing: {
    mentor: ["Footwork and defense are the base of every punch.", "Use bag rounds with a technical theme.", "Stay controlled: speed and accuracy before power."],
    fitness: ["Build shoulder endurance, core rotation, calves, and conditioning rounds.", "Add neck and wrist care carefully.", "Use intervals that match round timing."],
    tournament: ["Two weeks out: spar selectively and sharpen combinations.", "Three days out: keep work light, fast, and technical.", "Bout day: warm shoulders, hips, wrists, and breathing rhythm."],
    drills: ["Shadowboxing angles", "Jab-cross defense", "Slip rope rounds", "Bag combination rounds"],
    milestones: ["Better guard recovery", "Cleaner foot pivots", "Higher punch accuracy", "More consistent round pace"]
  },
  "Table tennis": {
    mentor: ["Train serve, receive, and third-ball attack.", "Learn to read spin before adding speed.", "Use short focused drills rather than random rallies."],
    fitness: ["Build reaction speed, wrist control, forearm endurance, and light footwork.", "Add shoulder and neck mobility.", "Use short burst intervals."],
    tournament: ["One week out: practice match starts and serve patterns.", "Two days out: reduce volume and sharpen receive.", "Match day: warm wrists, shoulders, and footwork."],
    drills: ["Serve spin targets", "Multiball forehand", "Backhand block control", "Third-ball attack"],
    milestones: ["Better serve variation", "Fewer receive errors", "Quicker ready position", "Cleaner spin control"]
  },
  Yoga: {
    mentor: ["Use breath-led movement and gradual range.", "Balance strength, mobility, and recovery.", "Track consistency and calmness, not only flexibility."],
    fitness: ["Build core stability, hip mobility, shoulder control, and balance.", "Use progressive holds instead of forcing depth.", "Pair breath work with movement quality."],
    tournament: ["For demos or events: rehearse sequence flow and breathing.", "Two days out: keep practice light and familiar.", "Event day: warm joints and avoid new peak poses."],
    drills: ["Sun salutation flow", "Balance holds", "Hip mobility series", "Breathing practice"],
    milestones: ["Longer steady breathing", "Better posture control", "Improved balance", "Less stiffness"]
  }
});

const sportKnowledge = {
  Cricket: {
    equipment: ["Bat, ball, stumps, gloves, pads, helmet, abdominal guard", "Supportive shoes or spikes based on surface", "Resistance band for shoulder warm-up"],
    tactics: ["Rotate strike instead of forcing every ball", "Bowl to a field plan, not only to the batter", "Protect shoulders by managing throwing and bowling volume"],
    injuryPrevention: ["Warm up rotator cuff and thoracic spine", "Limit sudden bowling workload spikes", "Use landing mechanics and calf strength for fast bowling"],
    nutrition: ["Use light carbs before nets", "Add electrolytes during long hot-weather sessions", "Recover with protein plus rice, chapati, or fruit"],
    eventFormats: ["T20 match day", "One-day tournament", "School or club trials", "Net selection camp"],
    mistakes: ["Skipping shoulder prep", "Only training batting power", "Ignoring fielding speed and catching volume"]
  },
  Football: {
    equipment: ["Studs or turf shoes, shin guards, ball, cones, bibs", "Foam roller or massage ball", "Hydration bottle for interval sessions"],
    tactics: ["Scan before receiving the ball", "Create passing angles after every pass", "Press as a unit and recover shape quickly"],
    injuryPrevention: ["Train hamstring eccentric strength", "Practice deceleration and knee alignment", "Keep ankle and hip mobility consistent"],
    nutrition: ["Use carb-rich meals 3-4 hours before matches", "Hydrate before warm-up, not only after sweating", "Recover with protein and fluids within 60 minutes"],
    eventFormats: ["League match", "Knockout tournament", "Five-a-side event", "Selection trial"],
    mistakes: ["Running without ball work", "Overtraining sprints before matches", "Skipping cool-down after hard play"]
  },
  Badminton: {
    equipment: ["Racket, shuttle, court shoes, grip tape", "Resistance band for shoulder activation", "Skipping rope for footwork conditioning"],
    tactics: ["Recover to base after every shot", "Change pace with drops, clears, and pushes", "Attack weak returns instead of forcing smashes"],
    injuryPrevention: ["Build calf and Achilles tolerance", "Warm up wrist, elbow, and shoulder", "Manage jump-smash volume"],
    nutrition: ["Keep pre-match meals light", "Sip fluids between games", "Use fruit or simple carbs between long matches"],
    eventFormats: ["Singles tournament", "Doubles tournament", "Round-robin league", "Club ladder match"],
    mistakes: ["Training only smashes", "Late split-step timing", "Ignoring grip and forearm fatigue"]
  },
  Running: {
    equipment: ["Running shoes matched to comfort and surface", "Light breathable clothing", "Watch or phone timer for pacing"],
    tactics: ["Start easier than target pace", "Use effort-based pacing in heat", "Practice race-day fueling before the event"],
    injuryPrevention: ["Increase weekly volume gradually", "Strengthen calves, glutes, and hamstrings", "Rotate easy days after hard sessions"],
    nutrition: ["Use familiar carbs before long runs", "Replace fluids and sodium in humid weather", "Eat protein and carbs after long or fast sessions"],
    eventFormats: ["5K race", "10K race", "School endurance test", "Charity run"],
    mistakes: ["Running every session hard", "Changing shoes on race day", "Skipping strength work"]
  },
  "Gym training": {
    equipment: ["Dumbbells, barbell, plates, bench, cable or bands", "Lifting belt only when technique is stable", "Training log for progressive overload"],
    tactics: ["Prioritize clean reps before heavier load", "Plan push, pull, squat, hinge, core, and carry patterns", "Use deload weeks before fatigue builds too high"],
    injuryPrevention: ["Brace before heavy lifts", "Warm up movement patterns, not only muscles", "Avoid max attempts when sleep or readiness is poor"],
    nutrition: ["Keep protein consistent each day", "Use carbs around hard lifting", "Hydrate well before long gym sessions"],
    eventFormats: ["Strength test", "Body transformation challenge", "Powerlifting-style mock meet", "Fitness assessment"],
    mistakes: ["Changing programs too often", "Skipping legs or pulling work", "Training to failure every set"]
  },
  "General fitness": {
    equipment: ["Comfortable shoes, mat, water bottle", "Resistance band or light dumbbells", "Timer for circuits and walks"],
    tactics: ["Build consistency before intensity", "Mix strength, cardio, and mobility", "Choose simple habits that fit the week"],
    injuryPrevention: ["Warm up joints before circuits", "Keep effort moderate while learning", "Stop sharp pain early"],
    nutrition: ["Build meals around protein and vegetables", "Keep hydration visible through the day", "Avoid crash diets for quick changes"],
    eventFormats: ["Fitness challenge", "Health assessment", "Community sports day", "Personal milestone week"],
    mistakes: ["Doing random workouts only", "Ignoring sleep", "Trying to change food and training too aggressively"]
  }
};

Object.assign(sportKnowledge, {
  Kabaddi: {
    equipment: ["Kabaddi mat, knee support if needed, grip towel", "Light breathable clothing", "Resistance band for hip and shoulder warm-up"],
    tactics: ["Raid with a planned exit route", "Defend in chains instead of isolated tackles", "Use breath and timing to force mistakes"],
    injuryPrevention: ["Warm up groin, hips, fingers, and shoulders", "Build neck and trunk control gradually", "Avoid reckless tackles during fatigue"],
    nutrition: ["Use carbs before high-intensity sessions", "Replace salt and fluids after mat work", "Recover with protein and rice or chapati"],
    eventFormats: ["School tournament", "Club league", "Selection trial", "Knockout event"],
    mistakes: ["Holding breath too early", "Weak exit planning", "Skipping grip and hip mobility"]
  },
  Volleyball: {
    equipment: ["Volleyball, court shoes, knee pads, net access", "Resistance band for shoulder activation", "Cones for approach and block footwork"],
    tactics: ["Call the ball early", "Serve to weak receive zones", "Recover blocking position after every jump"],
    injuryPrevention: ["Manage jump volume", "Strengthen calves and landing mechanics", "Warm up shoulders before serving and spiking"],
    nutrition: ["Use light carbs before matches", "Hydrate between sets", "Recover with protein and fruit or rice"],
    eventFormats: ["League match", "Knockout tournament", "Beach volleyball", "School or college trials"],
    mistakes: ["Jumping without landing control", "Silent court communication", "Only practicing spikes"]
  },
  Basketball: {
    equipment: ["Basketball, court shoes, cones, resistance band", "Foam roller for calves and hips", "Water bottle for possession intervals"],
    tactics: ["Create spacing after passing", "Attack closeouts with control", "Defend with chest first, hands second"],
    injuryPrevention: ["Train ankle stiffness and landing control", "Build hamstring and glute strength", "Avoid overloaded jump sessions"],
    nutrition: ["Eat carbs before long games", "Hydrate before warm-up", "Recover with protein and fluids"],
    eventFormats: ["5v5 game", "3x3 tournament", "Selection trial", "Shooting challenge"],
    mistakes: ["Dribbling with head down", "Skipping defense", "Practicing only highlight shots"]
  },
  Tennis: {
    equipment: ["Racket, balls, court shoes, grip tape", "Resistance band for shoulder care", "Water and towel for heat management"],
    tactics: ["Play high percentage cross-court balls", "Use serve plus one patterns", "Attack short balls with footwork first"],
    injuryPrevention: ["Warm shoulder and elbow before serving", "Build calf and hip mobility", "Manage serving volume"],
    nutrition: ["Use fluids and electrolytes between games", "Keep snacks simple for long matches", "Recover with protein and carbs"],
    eventFormats: ["Singles tournament", "Doubles tournament", "Ladder match", "Selection trial"],
    mistakes: ["Trying winners too early", "Ignoring split-step", "Over-serving in practice"]
  },
  Hockey: {
    equipment: ["Stick, ball, shin guards, mouth guard, turf shoes", "Cones for dribbling", "Grip tape"],
    tactics: ["Scan before receiving", "Use quick passes to beat pressure", "Stay low for tackles and ball control"],
    injuryPrevention: ["Warm hips, groin, wrists, and ankles", "Build hamstring strength", "Avoid low-stance fatigue breakdown"],
    nutrition: ["Fuel sprint-heavy sessions with carbs", "Hydrate steadily", "Recover with protein and sodium after heat exposure"],
    eventFormats: ["League match", "Knockout tournament", "School trials", "Five-a-side hockey"],
    mistakes: ["Standing tall while dribbling", "Late scanning", "Skipping wrist and hip warm-up"]
  },
  Swimming: {
    equipment: ["Swimsuit, goggles, cap, kickboard, pull buoy", "Resistance band for dryland activation", "Towel and hydration"],
    tactics: ["Control stroke count", "Use turns as speed opportunities", "Pace the first half calmly"],
    injuryPrevention: ["Warm shoulders before water work", "Balance pulling with mobility", "Avoid sudden distance spikes"],
    nutrition: ["Avoid heavy meals right before swimming", "Hydrate despite being in water", "Recover with protein and carbs"],
    eventFormats: ["50m sprint", "100m or 200m race", "Relay", "School swim meet"],
    mistakes: ["Chasing metres with poor stroke", "Ignoring breathing rhythm", "Skipping shoulder care"]
  },
  Boxing: {
    equipment: ["Hand wraps, gloves, skipping rope, bag, mouth guard for sparring", "Mirror or camera for technique", "Timer for rounds"],
    tactics: ["Win position with footwork", "Punch in combinations, not single guesses", "Exit after attacking"],
    injuryPrevention: ["Wrap hands correctly", "Warm wrists, shoulders, neck, and hips", "Spar only with supervision and control"],
    nutrition: ["Fuel rounds with carbs", "Hydrate before sweating heavily", "Recover with protein and electrolytes"],
    eventFormats: ["Technical spar", "Fitness boxing challenge", "Amateur bout prep", "Pad-work assessment"],
    mistakes: ["Dropping guard after punching", "Power before technique", "Skipping defensive drills"]
  },
  "Table tennis": {
    equipment: ["Racket, balls, table, court shoes", "Grip cleaner if needed", "Cones or markers for footwork"],
    tactics: ["Serve with a third-ball plan", "Read spin from racket angle", "Change placement before increasing speed"],
    injuryPrevention: ["Warm wrists and shoulders", "Avoid overgripping", "Add neck and upper-back mobility"],
    nutrition: ["Keep meals light before matches", "Sip water between games", "Use simple snacks for long events"],
    eventFormats: ["Singles ladder", "Doubles match", "Round-robin event", "School tournament"],
    mistakes: ["Standing flat-footed", "Ignoring serve receive", "Hitting hard without spin control"]
  },
  Yoga: {
    equipment: ["Mat, block, strap, towel", "Quiet practice space", "Timer for breath work"],
    tactics: ["Move with breath", "Use props to keep alignment", "Progress range patiently"],
    injuryPrevention: ["Never force end range", "Warm wrists and hips", "Keep pain-free positions"],
    nutrition: ["Practice away from heavy meals", "Hydrate gently", "Use balanced meals for recovery"],
    eventFormats: ["Daily mobility routine", "Yoga demonstration", "Recovery block", "Balance challenge"],
    mistakes: ["Forcing flexibility", "Holding breath", "Skipping foundational poses"]
  }
});

export async function generateRoadmap(userProfile) {
  const response = buildFitnessPlan(userProfile);
  const validatedResponse = validateSchema(finalResponseSchema, response, "FinalResponse");

  try {
    await appendMemoryEntry({
      generatedAt: validatedResponse.generatedAt,
      userProfile: validatedResponse.userProfile,
      roadmap: validatedResponse
    });
  } catch (error) {
    validatedResponse.success = false;
    validatedResponse.partial = true;
    validatedResponse.errors.push({
      agent: "MemoryStore",
      message: error.message,
      code: error.code || null
    });
  }

  return validatedResponse;
}

function buildFitnessPlan(userProfile) {
  const copy = localized[userProfile.language] || localized.English;
  const bmr = calculateBmr(userProfile);
  const multiplier = activityMultiplier(userProfile.activityLevel);
  const maintenanceCalories = Math.round((bmr * multiplier) / 10) * 10;
  const targetCalories = calculateTargetCalories(maintenanceCalories, userProfile.goal);
  const proteinGrams = Math.round(userProfile.weightKg * proteinMultiplier(userProfile.goal));
  const hydrationLitres = Number((Math.max(2.5, userProfile.weightKg * 0.04) + hydrationHeatBuffer(userProfile)).toFixed(1));

  const weeklyPlan = buildWeeklyPlan(userProfile, copy);
  const progressMetrics = copy.progress(userProfile.sport);

  return {
    success: true,
    partial: false,
    generatedAt: new Date().toISOString(),
    errors: [],
    userProfile,
    mentorSummary: copy.summary(userProfile),
    caloriePlan: {
      maintenanceCalories,
      targetCalories,
      proteinGrams,
      hydrationLitres
    },
    weeklyPlan,
    multiWeekPlan: buildMultiWeekPlan(userProfile, copy),
    foodGuidance: buildFoodGuidance(userProfile, copy),
    languageSupport: {
      selectedLanguage: userProfile.language,
      selectedVoiceLanguage: userProfile.voiceLanguage,
      voiceLocale: voiceLocales[userProfile.voiceLanguage] || "en-IN",
      note: copy.note(userProfile)
    },
    voiceScript: buildVoiceScript(userProfile, {
      maintenanceCalories,
      targetCalories,
      proteinGrams,
      hydrationLitres
    }),
    sportGuidance: buildSportGuidance(userProfile),
    recovery: copy.recoveryTips(Boolean(userProfile.injuryHistory)),
    safetyChecks: copy.safety(userProfile.age < 18),
    baselineGuidance: buildBaselineGuidance(userProfile),
    progressMetrics,
    progressPlan: buildProgressPlan(userProfile, progressMetrics),
    dailyChallenges: buildDailyChallenges(userProfile)
  };
}

function buildSportGuidance(profile) {
  const playbook = sportPlaybooks[profile.sport] || sportPlaybooks["General fitness"];
  const knowledge = sportKnowledge[profile.sport] || sportKnowledge["General fitness"];
  const focusKeys = sportFocus[profile.sport] || sportFocus["General fitness"];

  return {
    sport: profile.sport,
    level: profile.activityLevel,
    goal: profile.goal,
    mentor: playbook.mentor,
    fitness: playbook.fitness,
    tournament: playbook.tournament,
    drills: playbook.drills,
    milestones: playbook.milestones,
    equipment: knowledge.equipment,
    tactics: knowledge.tactics,
    injuryPrevention: knowledge.injuryPrevention,
    nutrition: knowledge.nutrition,
    eventFormats: knowledge.eventFormats,
    mistakes: knowledge.mistakes,
    videoMentors: buildVideoMentors(profile.sport, playbook.drills),
    focusMap: focusKeys.map((focus, index) => ({
      phase: `Phase ${index + 1}`,
      focus: titleCase(focus)
    }))
  };
}

function buildVideoMentors(sport, drills) {
  return [
    {
      title: `${sport} beginner mentor`,
      topic: "Technique basics and coaching cues",
      url: youtubeSearchUrl(`${sport} beginner training tutorial`)
    },
    {
      title: `${sport} practice drills`,
      topic: drills.slice(0, 2).join(" + "),
      url: youtubeSearchUrl(`${sport} practice drills ${drills[0] || "training"}`)
    },
    {
      title: `${sport} tournament preparation`,
      topic: "Match readiness, warm-up, and pressure practice",
      url: youtubeSearchUrl(`${sport} tournament preparation training`)
    }
  ];
}

function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function buildVoiceScript(profile, caloriePlan) {
  const copy = localized[profile.voiceLanguage] || localized.English;
  const weeklyPlan = buildWeeklyPlan(profile, copy);
  const foodGuidance = buildFoodGuidance({ ...profile, language: profile.voiceLanguage }, copy);
  const firstDay = weeklyPlan[0];

  return [
    copy.summary({ ...profile, language: profile.voiceLanguage }),
    localizedNumberLine(profile.voiceLanguage, caloriePlan),
    firstDay ? `${firstDay.day}. ${firstDay.focus}. ${firstDay.session.join(" ")}` : "",
    foodGuidance.preWorkout.join(" "),
    foodGuidance.postWorkout.join(" "),
    copy.safety(profile.age < 18).join(" ")
  ]
    .filter(Boolean)
    .join(" ");
}

function localizedNumberLine(language, { targetCalories, proteinGrams, hydrationLitres }) {
  return {
    English: `Target calories: ${targetCalories}. Protein: ${proteinGrams} grams. Water: ${hydrationLitres} litres.`,
    Tamil: `இலக்கு கலோரி: ${targetCalories}. புரதம்: ${proteinGrams} கிராம். தண்ணீர்: ${hydrationLitres} லிட்டர்.`,
    Hindi: `लक्ष्य कैलोरी: ${targetCalories}. प्रोटीन: ${proteinGrams} ग्राम. पानी: ${hydrationLitres} लीटर.`,
    Malayalam: `ലക്ഷ്യ കലോറി: ${targetCalories}. പ്രോട്ടീൻ: ${proteinGrams} ഗ്രാം. വെള്ളം: ${hydrationLitres} ലിറ്റർ.`,
    Kannada: `ಗುರಿ ಕ್ಯಾಲೊರಿ: ${targetCalories}. ಪ್ರೋಟೀನ್: ${proteinGrams} ಗ್ರಾಂ. ನೀರು: ${hydrationLitres} ಲೀಟರ್.`
  }[language] || `Target calories: ${targetCalories}. Protein: ${proteinGrams} grams. Water: ${hydrationLitres} litres.`;
}

function indiaWeatherGuidance(profile) {
  const place = profile.chennaiArea || "your city";

  if (profile.outdoorTrainingTime === "Midday") {
    return `Midday outdoor training in ${place} can be high risk in hot or humid weather, so shift intense work before 8 AM or after 5:30 PM and keep midday training indoors or very light.`;
  }

  if (profile.outdoorTrainingTime === "Mostly indoors") {
    return `Keep hydration visible even indoors; many Indian cities can still raise sweat loss through heat, humidity, or poor ventilation.`;
  }

  if (profile.outdoorTrainingTime === "Evening") {
    return `Evening training is usually a better India outdoor window, but use shade, fluids, and a slower warm-up if ${place} stayed hot or humid.`;
  }

  return `Early morning is usually the best outdoor window in India for harder sessions; still carry water and watch for heat stress.`;
}

function hydrationHeatBuffer(profile) {
  if (profile.outdoorTrainingTime === "Midday") {
    return 0.7;
  }

  if (profile.outdoorTrainingTime === "Evening") {
    return 0.4;
  }

  return 0.3;
}

function calculateBmr({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (gender.toLowerCase().startsWith("female") ? -161 : 5));
}

function activityMultiplier(level) {
  return {
    Beginner: 1.35,
    Moderate: 1.5,
    Active: 1.7,
    Athlete: 1.9
  }[level];
}

function calculateTargetCalories(maintenance, goal) {
  if (goal === "Lose fat") {
    return maintenance - 350;
  }

  if (["Gain weight", "Healthy weight gain"].includes(goal)) {
    return maintenance + 350;
  }

  if (["Build muscle", "Lean muscle gain", "Muscle tone", "Improve strength"].includes(goal)) {
    return maintenance + 250;
  }

  return maintenance;
}

function proteinMultiplier(goal) {
  if (
    goal === "Build muscle" ||
    goal === "Lean muscle gain" ||
    goal === "Muscle tone" ||
    goal === "Gain weight" ||
    goal === "Healthy weight gain" ||
    goal === "Improve strength" ||
    goal === "Bodyweight strength"
  ) {
    return 1.8;
  }

  if (
    goal === "Lose fat" ||
    goal === "Sport performance" ||
    goal === "Improve speed" ||
    goal === "Improve agility" ||
    goal === "Improve endurance" ||
    goal === "Heart health" ||
    goal === "Running performance"
  ) {
    return 1.6;
  }

  return 1.4;
}

function buildWeeklyPlan(profile, copy) {
  const focuses = sportFocus[profile.sport] || sportFocus["General fitness"];
  const sessions = [];

  for (let index = 0; index < profile.trainingDays; index += 1) {
    const focusKey = focuses[index % focuses.length];
    const focus = copy.focus[focusKey] || titleCase(focusKey);
    sessions.push({
      day: copy.days[index] || `Day ${index + 1}`,
      focus,
      session: buildSession(profile, copy, focus, index)
    });
  }

  sessions.push({
    day: copy.recoveryDay,
    focus: copy.recovery,
    session: copy.recoverySession
  });

  return sessions;
}

function buildMultiWeekPlan(profile, copy) {
  const themes = ["Foundation", "Skill Build", "Intensity", "Tournament Ready"];
  const totalWeeks = profile.durationWeeks || 4;

  return Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const week = weekIndex + 1;
    const theme = themes[Math.min(Math.floor((weekIndex / Math.max(totalWeeks, 1)) * themes.length), themes.length - 1)];
    const weeklyProfile = {
      ...profile,
      activityLevel: weekIndex < 1 ? profile.activityLevel : profile.activityLevel === "Beginner" ? "Moderate" : profile.activityLevel
    };

    return {
      week,
      theme,
      coachingCue:
        week === totalWeeks
          ? "Keep sessions sharp and reduce extra fatigue so performance feels fresh."
          : "Progress only when movement quality, sleep, and soreness are under control.",
      days: buildWeeklyPlan(weeklyProfile, copy).map((day) => ({
        ...day,
        focus: `${day.focus}${day.focus === copy.recovery ? "" : ` - ${theme}`}`
      }))
    };
  });
}

function buildProgressPlan(profile, metrics) {
  return metrics.map((metric, index) => ({
    metric,
    target:
      index === 0
        ? `Complete ${profile.trainingDays} planned sessions each week`
        : index === 1
          ? "Update once weekly, same time of day"
          : "Log a simple 1-5 score after each training day"
  }));
}

function buildBaselineGuidance(profile) {
  const weeklyStrength = Math.max(2, Math.min(Number(profile.trainingDays) || 2, 4));
  const city = profile.chennaiArea || "your city";
  const safetyDetail = profile.injuryHistory
    ? `Logged notes include "${profile.injuryHistory}". Keep the next session easy if symptoms are active, and get qualified help for red flags.`
    : "No injury notes were entered, so the plan still checks for sharp pain, dizziness, chest pain, swelling, and unusual breathlessness.";

  return [
    {
      label: "India",
      value: "Weather aware",
      detail: `${indiaWeatherGuidance(profile)} Hydration is adjusted for ${city}, training time, heat, and humidity.`
    },
    {
      label: "Safety",
      value: "Red flags",
      detail: safetyDetail
    },
    {
      label: "Baseline",
      value: "WHO goals",
      detail: `Aim for 150-300 minutes of moderate cardio each week plus ${weeklyStrength} strength sessions. This plan turns that baseline into simple weekly steps.`
    }
  ];
}

function buildDailyChallenges(profile) {
  return [
    {
      title: "Five-minute warm-up streak",
      description: `Before every ${profile.sport} session, finish mobility, breathing, and easy movement first.`
    },
    {
      title: "Skill touch challenge",
      description: "Spend 10 focused minutes on one technical drill before conditioning."
    },
    {
      title: "Recovery check-in",
      description: "Rate sleep, soreness, hydration, and energy before increasing intensity."
    },
    {
      title: "Coach note",
      description: "Write one thing that improved and one thing to practice next session."
    }
  ];
}

function buildSession(profile, copy, focus, index) {
  const equipment = profile.equipment || "Home/bodyweight";
  const intensity = profile.activityLevel === "Beginner" ? "easy to moderate" : "moderate";
  const session = copy.session({
    focus,
    equipment,
    intensity,
    alternate: index % 2 !== 0
  });

  if (profile.language === "English") {
    return [
      ...session,
      `India weather note: ${indiaWeatherGuidance(profile)}`
    ];
  }

  return session;
}

function buildFoodGuidance(profile, copy) {
  const proteins = proteinByPreference[profile.language] || proteinByPreference.English;
  const protein =
    proteins[profile.foodPreference] ||
    proteinByPreference.English[profile.foodPreference] ||
    proteins["Non-vegetarian"] ||
    proteinByPreference.English["Non-vegetarian"];
  return copy.food(protein);
}

function titleCase(value) {
  return value
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}
