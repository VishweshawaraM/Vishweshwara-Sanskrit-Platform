# Devanagari Reference — canonical strings for the platform

**Purpose:** the single source of truth for every Sanskrit term the platform displays.
Reconstructed from the Acharya's own curriculum documents, whose Devanagari was corrupted by
PDF conjunct-mapping failure.

**Status of each entry:**
- ✅ **CONFIRMED** — verified by the Acharya
- 🔷 **RECONSTRUCTED** — standard orthography, high confidence; the Acharya's term, correctly spelled
- 🟠 **PROPOSED** — no source exists; drafted for the Acharya's approval
- ⚠️ **QUERY** — the source reading is irregular; see the note

Nothing here invents content. Every term except those marked 🟠 is the Acharya's own, restored
to correct spelling. All strings are Unicode **NFC**.

---

## 1. Institution

| Term | Devanagari | IAST | Status |
|---|---|---|---|
| Vishweshwara Sanskrit | विश्वेश्वरसंस्कृतम् | Viśveśvarasaṁskṛtam | 🟠 |
| Digital Gurukula | डिजिटलगुरुकुलम् | Ḍijiṭalagurukulam | 🟠 |
| Guru–Śiṣya Paramparā | गुरुशिष्यपरम्परा | Guruśiṣyaparamparā | 🔷 |

The Sanskrit institution name is proposed, not attested. The Acharya may prefer to leave the
institution name in Latin only.

---

## 2. Path names

Taken from the Acharya's own curriculum document titles.

| Path | Devanagari | IAST | Status |
|---|---|---|---|
| Sanskrit | संस्कृताध्ययनपरम्परा | Saṁskṛtādhyayanaparamparā | 🔷 |
| Bhagavad Gītā | भगवद्गीताध्ययनपरम्परा | Bhagavadgītādhyayanaparamparā | 🔷 |
| Krishna Yajurveda | कृष्णयजुर्वेदाध्ययनपरम्परा | Kṛṣṇayajurvedādhyayanaparamparā | 🔷 |
| Advaita Vedānta | अद्वैतवेदान्ताध्ययनपरम्परा | Advaitavedāntādhyayanaparamparā | 🟠 |
| Stotras & Sūktas | स्तोत्रसूक्ताध्ययनपरम्परा | Stotrasūktādhyayanaparamparā | 🟠 |

The last two are formed on the pattern of the first three. No curriculum document exists for
either — see doc 04.

---

## 3. Sanskrit — six stages

| # | Devanagari | IAST | English | Status |
|---|---|---|---|---|
| I | संस्कृतप्रवेशः | Saṁskṛtapraveśaḥ | Entry into Sanskrit | 🔷 |
| II | वाक्यनिर्माणम् | Vākyanirmāṇam | Sentence formation | ✅ |
| III | शब्दरूपाध्ययनम् | Śabdarūpādhyayanam | Noun declension | 🔷 |
| IV | धातुरूपाध्ययनम् | Dhāturūpādhyayanam | Verb structure | 🔷 |
| V | व्याकरणप्रवेशः | Vyākaraṇapraveśaḥ | Entry into grammar | 🔷 |
| VI | शास्त्रसंस्कृतम् | Śāstrasaṁskṛtam | Śāstric Sanskrit | 🔷 |

**Governing maxim** (Sanskrit curriculum, p.1):

> संस्कृतव्याकरणं विना संस्कृतज्ञानं न सिध्यति।
> *Saṁskṛtavyākaraṇaṁ vinā saṁskṛtajñānaṁ na sidhyati.*
> Without Sanskrit grammar, true Sanskrit knowledge cannot arise.

🔷 The verb appeared as `न सद्ध्यत` in the PDF; the correct form is **सिध्यति**.

### Grammatical terms used in the stages

स्वराः · व्यञ्जनानि · ह्रस्वः · दीर्घः · प्लुतः · अल्पप्राणः · महाप्राणः · अनुस्वारः · विसर्गः · योगवाहाः
लिङ्गम् · वचनम् · विभक्तिः · प्रथमा · द्वितीया · तृतीया · चतुर्थी · पञ्चमी · षष्ठी · सप्तमी
लकाराः · लट् · लङ् · लृट् · लोट्
सन्धिप्रकरणम् · समासप्रकरणम् · कारकप्रकरणम् · विभक्तिव्यवस्था
तत्पुरुषः · कर्मधारयः · द्वन्द्वः · बहुव्रीहिः
कर्ता · कर्म · करणम् · सम्प्रदानम् · अपादानम् · अधिकरणम्

**Stage VI text:** लघुसिद्धान्तकौमुदी — *Laghusiddhāntakaumudī*
**Prakaraṇas:** अजन्तप्रकरणम् · हलन्तप्रकरणम् · सन्धिप्रकरणम् · समासप्रकरणम् · कारकप्रकरणम् ·
कृदन्तप्रकरणम् · तद्धितप्रकरणम्

---

## 4. Bhagavad Gītā — five stages

| # | Devanagari | IAST | English | Status |
|---|---|---|---|---|
| I | श्लोकप्रवेशः | Ślokapraveśaḥ | Entry into the śloka | 🔷 |
| II | श्लोककण्ठपाठः | Ślokakaṇṭhapāṭhaḥ | Memorisation and recitation | 🔷 |
| III | पदच्छेदः एवं शब्दार्थः | Padacchedaḥ evaṁ śabdārthaḥ | Word separation and meaning | 🔷 |
| IV | तात्पर्यविचारः | Tātparyavicāraḥ | Philosophical understanding | 🔷 |
| V | जीवनोपयोगिगीता | Jīvanopayogigītā | The Gītā applied to life | ⚠️ |

⚠️ **QUERY on Stage V.** The source reads **जीवनोपयोगीगीता**, with a long ī. In a compound, the
stem जीवनोपयोगिन् drops its final न् and shortens, giving **जीवनोपयोगिगीता**. If the Acharya
intends two words with feminine agreement, the form would be **जीवनोपयोगिनी गीता**. Three options,
his choice:

1. **जीवनोपयोगिगीता** — compound, regular *(recommended)*
2. **जीवनोपयोगिनी गीता** — two words, feminine agreement
3. **जीवनोपयोगीगीता** — as originally written

**Stage I items:** प्रारम्भिकश्लोकाः · ध्यानश्लोकाः · गुरुस्तोत्रम्
**Vocabulary (Stage III):** धर्मः · कर्म · योगः · आत्मा · बुद्धिः · मोक्षः · भक्तिः
**Advanced:** भगवद्गीताभाष्यम् — *Bhagavadgītābhāṣyam*

---

## 5. Krishna Yajurveda — five stages

| # | Devanagari | IAST | English | Status |
|---|---|---|---|---|
| I | मन्त्रप्रवेशः | Mantrapraveśaḥ | Entry into mantra | 🔷 |
| II | सूक्ताध्ययनम् | Sūktādhyayanam | Study of the sūktas | 🔷 |
| III | वैदिकानुष्ठानमन्त्राः | Vaidikānuṣṭhānamantrāḥ | Mantras of Vedic practice | ⚠️ |
| IV | मुख्ययजुर्वेदाध्ययनम् | Mukhyayajurvedādhyayanam | Core Yajurveda study | 🔷 |
| V | उपनिषदध्ययनम् | Upaniṣadadhyayanam | Study of the Upaniṣads | 🔷 |

⚠️ **QUERY on Stage III.** The source shows the two words uncombined (वैदिक + अनुष्ठानमन्त्राः).
With sandhi the compound is **वैदिकानुष्ठानमन्त्राः**, which is recommended. Retain
**वैदिकअनुष्ठानमन्त्राः** only if the separation is deliberate.

### Text and mantra titles

**Stage I** — दशशान्तिमन्त्राः · गणेशाथर्वशीर्षम् · गणपतिसूक्तम्
वर्णशुद्धिः (Varṇaśuddhi — pronunciation purity)

**Stage II** — श्रीसूक्तम् · मेधासूक्तम् · दुर्गासूक्तम् · पुरुषसूक्तम् · विष्णुसूक्तम् · सरस्वतीसूक्तम् ·
देवीसूक्तम् · सौरसूक्तम् · प्रातःसूक्तम् · गोसूक्तम् · ब्रह्मसूक्तम्

**Stage III** — मन्त्रपुष्पम् · नवग्रहसूक्तम् · उदकशान्तिः · श्राद्धसूक्तम् · वैदिकराष्ट्रगानम्

**Stage IV** — श्रीरुद्रम् · चमकम् · द्वितीयप्रश्नः · अरुणप्रश्नः

**Stage V** — महानारायणोपनिषद् · शिक्षावल्ली · ब्रह्मानन्दवल्ली · भृगुवल्ली

> 🔴 **Still needed from the Acharya:** the **śākhā**. The Stage IV–V syllabus — Rudram,
> Chamakam, Aruṇapraśna, and the Taittirīya Upaniṣad vallīs — is **तैत्तिरीयशाखा**
> (Taittirīyaśākhā), but the curriculum never states it. Saying so explicitly is a precision
> signal to anyone inside the tradition, and costs nothing.

---

## 6. Platform vocabulary

| Concept | Devanagari | IAST | Where used |
|---|---|---|---|
| Practice | अभ्यासः | Abhyāsaḥ | Daily practice log |
| Assessment | अवलोकनम् | Avalokanam | Assessment module |
| Admission | प्रवेशः | Praveśaḥ | Admissions |
| Orientation | परिचयसत्रम् | Paricayasatram | 🟠 orientation session |
| Stage | सोपानम् | Sopānam | Curriculum stage |
| Path | परम्परा | Paramparā | Learning path |
| Certificate | आशंसनपत्रम् | Āśaṁsanapatram | Following the Acharya's own dīkṣānta |
| Teacher | आचार्यः | Ācāryaḥ | The Acharya |
| Student | शिष्यः / शिष्या | Śiṣyaḥ / Śiṣyā | Student — note gendered forms |

⚠️ **शिष्यः is masculine, शिष्या feminine.** Wherever the platform addresses a student in Sanskrit
it must select by gender, or use a neutral construction. This needs a ruling: does the platform
address students in gendered Sanskrit, and if so, is gender captured on the student record?

### Proposed grading scale

| Devanagari | IAST | Sense |
|---|---|---|
| उत्तमम् | Uttamam | Excellent |
| मध्यमम् | Madhyamam | Middling |
| साधारणम् | Sādhāraṇam | Fair |
| पुनरभ्यासः | Punarabhyāsaḥ | Practise again |

🟠 Proposed in the PRD. The Acharya may use marks instead, or a different scale entirely.

---

## 7. Pañcāṅga terms — for certificate dating

Following the Acharya's own dīkṣānta certificate, which is dated
*विश्वावसु संवत्सरे, चैत्र-शुद्ध-त्रयोदशी, गुरुवासरः*.

संवत्सरः · मासः · पक्षः (शुद्ध/शुक्ल · कृष्ण/बहुल) · तिथिः · वासरः

**Weekdays:** भानुवासरः · इन्दुवासरः · भौमवासरः · सौम्यवासरः · गुरुवासरः · भृगुवासरः · स्थिरवासरः

**Months:** चैत्रः · वैशाखः · ज्येष्ठः · आषाढः · श्रावणः · भाद्रपदः · आश्विनः · कार्तिकः ·
मार्गशीर्षः · पौषः · माघः · फाल्गुनः

🔴 The pañcāṅga source must be settled — the Acharya's tradition uses a specific
almanac and reckoning (amānta or pūrṇimānta), and certificates must match it.

---

## 8. Engineering rules this document establishes

1. **Store these strings as Unicode NFC, verbatim.** Never generate Devanagari by transliterating
   at display time.
2. **Never round-trip Sanskrit through PDF, DOCX, or any format that reorders combining marks.**
   The corruption in the source documents is the proof.
3. **`lib/sanskrit/validate.ts` rejects on ingest** any string containing an isolated combining
   mark, a virāma at end-of-word where none belongs, or the specific broken sequences observed
   in the source PDFs.
4. **Every displayable term carries both a Devanagari and a Latin/IAST column** (doc 07). Neither
   is derived from the other.
5. **Vedic accent marks** — udātta `U+0951`, anudātta `U+0952` — must survive storage, search
   normalisation, and font subsetting. Include them in the subset range even where no current
   text uses them; Yajurveda content will.

---

## What remains for the Acharya

1. Confirm or correct every 🔷 entry — most should pass at a glance.
2. Rule on the two ⚠️ queries: जीवनोपयोगि/गीता, and वैदिकानुष्ठानमन्त्राः sandhi.
3. Approve or replace the 🟠 proposals — especially the two missing path names.
4. Supply the **śākhā** (§5) and rule on **gendered student address** (§6).
5. Name the **pañcāṅga reckoning** used (§7).
