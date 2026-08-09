/**
 * Curriculum seed.
 *
 * Everything the Acharya has supplied so far. Paths with no stages yet are seeded
 * unpublished — they appear when their content arrives, with no code change.
 *
 * Devanagari is taken from docs/12-devanagari-reference.md and validated on load.
 */

export type SeedStage = {
  number: number;
  latin: string;
  devanagari: string;
  english: string;
  minMonths?: number;
  maxMonths?: number;
  items?: { latin: string; devanagari?: string; kind?: string }[];
};

export type SeedPath = {
  slug: string;
  latin: string;
  devanagari?: string;
  summary: string;
  minMonths?: number;
  maxMonths?: number;
  published: boolean;
  stages: SeedStage[];
};

export const curriculum: SeedPath[] = [
  {
    slug: "sanskrit",
    latin: "Sanskrit",
    devanagari: "संस्कृताध्ययनपरम्परा",
    summary:
      "From the first sound to the independent reading of Sanskrit texts. Six stages.",
    minMonths: 18,
    maxMonths: 24,
    published: true,
    stages: [
      {
        number: 1,
        latin: "Saṁskṛtapraveśaḥ",
        devanagari: "संस्कृतप्रवेशः",
        english: "Foundation, phonetics and vocabulary",
        minMonths: 2,
        maxMonths: 3,
      },
      {
        number: 2,
        latin: "Vākyanirmāṇam",
        devanagari: "वाक्यनिर्माणम्",
        english: "Sentence formation",
        minMonths: 3,
        maxMonths: 4,
      },
      {
        number: 3,
        latin: "Śabdarūpādhyayanam",
        devanagari: "शब्दरूपाध्ययनम्",
        english: "Noun declension",
        minMonths: 3,
        maxMonths: 4,
      },
      {
        number: 4,
        latin: "Dhāturūpādhyayanam",
        devanagari: "धातुरूपाध्ययनम्",
        english: "Verb structure",
        minMonths: 3,
        maxMonths: 4,
      },
      {
        number: 5,
        latin: "Vyākaraṇapraveśaḥ",
        devanagari: "व्याकरणप्रवेशः",
        english: "Structured grammar — sandhi, samāsa, kāraka",
        minMonths: 3,
        maxMonths: 4,
        items: [
          { latin: "Sandhiprakaraṇam", devanagari: "सन्धिप्रकरणम्", kind: "grammar" },
          { latin: "Samāsaprakaraṇam", devanagari: "समासप्रकरणम्", kind: "grammar" },
          { latin: "Kārakaprakaraṇam", devanagari: "कारकप्रकरणम्", kind: "grammar" },
        ],
      },
      {
        number: 6,
        latin: "Śāstrasaṁskṛtam",
        devanagari: "शास्त्रसंस्कृतम्",
        english: "Advanced traditional Sanskrit",
        minMonths: 4,
        maxMonths: 5,
        items: [
          {
            latin: "Laghusiddhāntakaumudī",
            devanagari: "लघुसिद्धान्तकौमुदी",
            kind: "text",
          },
        ],
      },
    ],
  },

  {
    slug: "bhagavad-gita",
    latin: "Bhagavad Gītā",
    devanagari: "भगवद्गीताध्ययनपरम्परा",
    summary:
      "From correct recitation to word-by-word understanding and practical application.",
    published: true,
    stages: [
      {
        number: 1,
        latin: "Ślokapraveśaḥ",
        devanagari: "श्लोकप्रवेशः",
        english: "Foundation of Gītā learning",
        items: [
          { latin: "Dhyānaślokāḥ", devanagari: "ध्यानश्लोकाः", kind: "sloka" },
          { latin: "Gurustotram", devanagari: "गुरुस्तोत्रम्", kind: "stotra" },
        ],
      },
      {
        number: 2,
        latin: "Ślokakaṇṭhapāṭhaḥ",
        devanagari: "श्लोककण्ठपाठः",
        english: "Memorisation and recitation",
        items: [
          { latin: "Chapter 12 — Bhakti Yoga", kind: "chapter" },
          { latin: "Chapter 15 — Puruṣottama Yoga", kind: "chapter" },
        ],
      },
      {
        number: 3,
        latin: "Padacchedaḥ evaṁ śabdārthaḥ",
        devanagari: "पदच्छेदः एवं शब्दार्थः",
        english: "Word separation and meaning",
      },
      {
        number: 4,
        latin: "Tātparyavicāraḥ",
        devanagari: "तात्पर्यविचारः",
        english: "Philosophical understanding",
      },
      {
        number: 5,
        latin: "Jīvanopayogigītā",
        devanagari: "जीवनोपयोगिगीता",
        english: "Practical application of Gītā wisdom",
      },
    ],
  },

  {
    slug: "krishna-yajurveda",
    latin: "Krishna Yajurveda",
    devanagari: "कृष्णयजुर्वेदाध्ययनपरम्परा",
    summary:
      "Authentic Vedic transmission in the Taittirīya śākhā, with pronunciation purity as the priority.",
    published: true,
    stages: [
      {
        number: 1,
        latin: "Mantrapraveśaḥ",
        devanagari: "मन्त्रप्रवेशः",
        english: "Foundational Vedic learning",
        items: [
          { latin: "Daśaśāntimantrāḥ", devanagari: "दशशान्तिमन्त्राः", kind: "mantra" },
          {
            latin: "Gaṇeśātharvaśīrṣam",
            devanagari: "गणेशाथर्वशीर्षम्",
            kind: "mantra",
          },
          { latin: "Gaṇapatisūktam", devanagari: "गणपतिसूक्तम्", kind: "sukta" },
        ],
      },
      {
        number: 2,
        latin: "Sūktādhyayanam",
        devanagari: "सूक्ताध्ययनम्",
        english: "Sacred hymn learning",
        items: [
          { latin: "Śrīsūktam", devanagari: "श्रीसूक्तम्", kind: "sukta" },
          { latin: "Medhāsūktam", devanagari: "मेधासूक्तम्", kind: "sukta" },
          { latin: "Durgāsūktam", devanagari: "दुर्गासूक्तम्", kind: "sukta" },
          { latin: "Puruṣasūktam", devanagari: "पुरुषसूक्तम्", kind: "sukta" },
          { latin: "Viṣṇusūktam", devanagari: "विष्णुसूक्तम्", kind: "sukta" },
          { latin: "Sarasvatīsūktam", devanagari: "सरस्वतीसूक्तम्", kind: "sukta" },
          { latin: "Devīsūktam", devanagari: "देवीसूक्तम्", kind: "sukta" },
          { latin: "Saurasūktam", devanagari: "सौरसूक्तम्", kind: "sukta" },
          { latin: "Prātaḥsūktam", devanagari: "प्रातःसूक्तम्", kind: "sukta" },
          { latin: "Gosūktam", devanagari: "गोसूक्तम्", kind: "sukta" },
          { latin: "Brahmasūktam", devanagari: "ब्रह्मसूक्तम्", kind: "sukta" },
        ],
      },
      {
        number: 3,
        latin: "Vaidikānuṣṭhānam",
        devanagari: "वैदिकानुष्ठानम्",
        english: "Ritual and practical Vedic learning",
        items: [
          { latin: "Mantrapuṣpam", devanagari: "मन्त्रपुष्पम्", kind: "mantra" },
          { latin: "Navagrahasūktam", devanagari: "नवग्रहसूक्तम्", kind: "sukta" },
          { latin: "Udakaśāntiḥ", devanagari: "उदकशान्तिः", kind: "mantra" },
          { latin: "Śrāddhasūktam", devanagari: "श्राद्धसूक्तम्", kind: "sukta" },
          {
            latin: "Vaidikarāṣṭragānam",
            devanagari: "वैदिकराष्ट्रगानम्",
            kind: "mantra",
          },
        ],
      },
      {
        number: 4,
        latin: "Mukhyayajurvedādhyayanam",
        devanagari: "मुख्ययजुर्वेदाध्ययनम्",
        english: "Core Krishna Yajurveda learning",
        items: [
          { latin: "Śrī Rudram", devanagari: "श्रीरुद्रम्", kind: "text" },
          { latin: "Chamakam", devanagari: "चमकम्", kind: "text" },
          { latin: "Dvitīyapraśnaḥ", devanagari: "द्वितीयप्रश्नः", kind: "text" },
          { latin: "Aruṇapraśnaḥ", devanagari: "अरुणप्रश्नः", kind: "text" },
        ],
      },
      {
        number: 5,
        latin: "Upaniṣadadhyayanam",
        devanagari: "उपनिषदध्ययनम्",
        english: "Advanced sacred knowledge learning",
        items: [
          {
            latin: "Mahānārāyaṇopaniṣad",
            devanagari: "महानारायणोपनिषद्",
            kind: "text",
          },
          { latin: "Śikṣāvallī", devanagari: "शिक्षावल्ली", kind: "text" },
          { latin: "Brahmānandavallī", devanagari: "ब्रह्मानन्दवल्ली", kind: "text" },
          { latin: "Bhṛguvallī", devanagari: "भृगुवल्ली", kind: "text" },
        ],
      },
    ],
  },

  // Content pending. Seeded unpublished so the path exists and can be filled in
  // through the curriculum screens without a deploy.
  {
    slug: "advaita-vedanta",
    latin: "Advaita Vedānta",
    devanagari: "अद्वैतवेदान्ताध्ययनपरम्परा",
    summary: "Prakaraṇa granthas and the commentarial tradition.",
    published: false,
    stages: [],
  },
  {
    slug: "stotras-and-suktas",
    latin: "Stotras & Sūktas",
    devanagari: "स्तोत्रसूक्ताध्ययनपरम्परा",
    summary: "Recitation of stotras and sūktas.",
    published: false,
    stages: [],
  },
];
