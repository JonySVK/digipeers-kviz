/*
  Sem pridávaj otázky v tomto formáte:
  {
    question: "Text otázky",
    options: ["Možnosť A", "Možnosť B"],
    correctIndex: 0
  }
  correctIndex začína od nuly: 0 je prvá možnosť.
*/
window.QUIZ_QUESTIONS = [
  {
    question: "Čo je bezpečné urobiť, keď dostaneš podozrivý odkaz od neznámeho odosielateľa?",
    options: ["Hneď naň kliknúť", "Preposlať ho všetkým kamarátom", "Neotvárať ho a overiť si správu", "Zadať na stránke svoje heslo"],
    correctIndex: 2
  },
  {
    question: "Ktoré heslo je z týchto možností najbezpečnejšie?",
    options: ["12345678", "Meno môjho psa", "heslo2026", "Dlhá jedinečná fráza s rôznymi znakmi"],
    correctIndex: 3
  },
  {
    question: "Čo by si mal/a urobiť pred zdieľaním fotografie kamaráta na internete?",
    options: ["Získať jeho súhlas", "Zverejniť ju bez opýtania", "Pridať jeho telefónne číslo", "Označiť všetkých ľudí, ktorých poznáš"],
    correctIndex: 0
  },
  {
    question: "Čo pomáha overiť, či je informácia na internete dôveryhodná?",
    options: ["Počet farebných obrázkov na stránke", "Porovnanie s viacerými dôveryhodnými zdrojmi", "To, že ju zdieľalo veľa ľudí", "Veľké písmo v nadpise"],
    correctIndex: 1
  },
  {
    question: "Ako by si mal/a reagovať, ak zistíš, že niekto je kyberšikanovaný?",
    options: ["Ignorovať to a nezasahovať", "Napísať ponižujúcu správu agresorovi", "Pridať sa k šikanovaniu", "Podporiť obeť a nahlásiť incident dospelému"],
    correctIndex: 3
  }
];
