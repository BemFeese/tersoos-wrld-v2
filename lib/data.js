// ============================================================
//  TERSOO'S WRLD — the source of truth
//  ------------------------------------------------------------
//  Everything personal lives here: the art, the words, the shop.
//  Tersoo edits THIS file to evolve the brand. No code needed.
// ============================================================

// ---------- ARTWORKS (exhibited pieces) ----------
// To show real artwork: drop the file into /public/art/<fileName>
// The "img" path below is the exact filename to use.
// Until the file exists, the site paints a generative stand-in.
export const artworks = [
  {
    id: "monstroid",
    title: "MONSTROÏD MÒBILE",
    img: "/art/monstroid-mobile.jpg",
    kind: "Official Cover Art",
    year: "2021",
    story:
      "Official cover and background art for Monstroid Mobile — a game that amassed over 7,000 downloads across the Apple App Store and Samsung Play Store. A monster lost in the forest, trying to find his way back to his land, facing obstacles in the wilderness on his way to salvation.",
    link: "https://apps.apple.com/us/app/monstroid-mobile/id1589401705",
    linkLabel: "PLAY THE GAME",
    tags: ["Digital", "Game Art"],
  },
  {
    id: "silent-demise",
    title: "SÌLENT DEMÌSE",
    img: "/art/silent-demise.jpg",
    kind: "Poster colour on paper",
    year: "2021",
    story:
      "The reality of nature's wildlife. A crocodile draws an antelope under water, ready to devour it as it cries in silence. Texture against texture — the crocodile's scales against the antelope's hide — down to the bubbling water itself.",
    tags: ["Traditional", "Wildlife"],
  },
  {
    id: "self-elevation",
    title: "SËLF ËLEVATION",
    img: "/art/self-elevation.jpg",
    kind: "Digital Art",
    year: "2021",
    story:
      "Growth. Change. Self elevation. The keys to the padlock preventing elevation lie in the hands of the one who needs this liberation from all of life's hinderances.",
    tags: ["Digital", "Symbolism"],
  },
  {
    id: "crule-wrld",
    title: "CRULE WRLD",
    img: "/art/crule-wrld.jpg",
    kind: "Collection Art",
    year: "2021",
    story:
      "Cruel world — spelt wrong on purpose. A clothing collection piece starring myself as a designer and a business mogul, coming together from unique backgrounds and struggles to make advancements in life. I had a hard time spelling words as a child — the wrong spelling is the symbol. He is a stammerer and an African business tycoon — a monkey with a mouth full, unable to talk.",
    tags: ["Digital", "Symbolism", "The Signature"],
  },
  {
    id: "genius-hood",
    title: "A GENÌUS FROM THE HOOD",
    img: "/art/genius-from-the-hood.jpg",
    kind: "Illustration",
    year: "2021",
    story:
      "Made for my friend — a tech enthusiast from a hard and uninspiring environment who thrived to a point of success in his career. The reference of Basquiat symbolises controversy and sharp intelligence. The flames in his hair — grit, and an endless zeal to thrive.",
    link: "https://youtube.com/shorts/wvp_vKZFsTQ?feature=share",
    linkLabel: "WATCH THE PROCESS",
    tags: ["Digital", "Portraits"],
  },
  {
    id: "free-bird",
    title: "FREE BÏRD",
    img: "/art/free-bird.jpg",
    kind: "Digital Art",
    year: "2021",
    story: "All birds born in a cage think flying is an illness.",
    tags: ["Digital", "Message"],
  },
  {
    id: "damn",
    title: "DAMN.",
    img: "/art/damn.jpg",
    kind: "Motion Graphic",
    year: "2021",
    story:
      "Created in my image and likeness — for a period where I needed change from an upside-down state to a new stable phase of life. The inspiration: Kendrick Lamar's album title.",
    link: "https://youtube.com/shorts/oAA4d3Ux5CU?feature=share",
    linkLabel: "WATCH THE MOTION",
    tags: ["Motion", "Message"],
  },
  {
    id: "war-in-mind",
    title: "WAR ÌN MÏND",
    img: "/art/war-in-mind.jpg",
    kind: "Motion Graphic",
    year: "2021",
    story:
      "Cover for an expressive fashion collection. A make-a-statement piece: there is always something to say... quietness comes with consequences.",
    link: "https://youtube.com/shorts/GEfu8N9qHl4?feature=share",
    linkLabel: "WATCH THE MOTION",
    tags: ["Motion", "Fashion"],
  },
  {
    id: "crisis",
    title: "CRÌSÌS",
    img: "/art/crisis.jpg",
    kind: "Illustration",
    year: "2021",
    story:
      "A re-imagination of an art photograph in my own style — an expressive illustration depicting crisis.",
    link: "https://youtube.com/shorts/Fmrtnh32pCs?feature=share",
    linkLabel: "WATCH THE PROCESS",
    tags: ["Digital", "Message"],
  },
  {
    id: "ciu-arena",
    title: "CÌU ARÈNA",
    img: "/art/ciu-arena.jpg",
    kind: "Hand-crafted abstraction",
    year: "2021",
    story:
      "A hand-crafted abstracted image of Cyprus International University Arena — a building from my first university.",
    tags: ["Architecture", "Abstract"],
  },
  {
    id: "jealous",
    title: "JÈALOUS",
    img: "/art/jealous.jpg",
    kind: "Digital Art",
    year: "2021",
    story: "Say less. Feel more.",
    link: "https://youtube.com/shorts/r8MklePStf4?feature=share",
    linkLabel: "WATCH THE PROCESS",
    tags: ["Digital", "Portraits"],
  },
];

// ---------- WRLDSHOP ----------
// The Rakitecht soul: limited editions, misspelled loud, made by hand.
// Money is in kobo! ₦12,500 = 1250000  (multiplied by 100, like Stripe).
// "editions" = units ever made. When stock hits 0 the card stamps SOLD.
export const products = [
  {
    id: "speling-lessons-tee",
    name: "SPELING LESSONS TEE",
    price: 3800000, // ₦38,000
    editions: "ONLY 100 EVER",
    stock: 100,
    collection: "TEES",
    img: "/art/shop-speling-lessons-tee.jpg",
    accent: "#ff5d1f",
    blurb: "Heavyweight cotton. A tee that admits it, so you never have to.",
    sizes: ["M", "L", "XL", "XXL"],
    colorway: "BONE / INK",
  },
  {
    id: "crule-wrld-hoodie",
    name: "CRULE WRLD HOODÏE",
    price: 6500000, // ₦65,000
    editions: "ONLY 50 EVER",
    stock: 50,
    collection: "TEES",
    img: "/art/shop-crule-wrld-hoodie.jpg",
    accent: "#f4d903",
    blurb: "The wrong spelling, meant on purpose, worn on purpose.",
    sizes: ["L", "XL", "XXL"],
    colorway: "WÏLD SLËVE",
  },
  {
    id: "self-elevation-print",
    name: "SËLF ËLEVATION POSTER",
    price: 2200000, // ₦22,000
    editions: "OPEN ËDITION",
    stock: 999,
    collection: "PRINTS",
    img: "/art/shop-self-elevation-poster.jpg",
    accent: "#19c8c8",
    blurb: "The keys are in your hands. Framed or naked — choose.",
    sizes: ["A3", "A2", "A1 FRAME"],
  },
  {
    id: "free-bird-print",
    name: "FREE BÌRD POSTER",
    price: 1900000, // ₦19,000
    editions: "OPEN ËDITION",
    stock: 999,
    collection: "PRINTS",
    img: "/art/shop-free-bird-poster.jpg",
    accent: "#f4d903",
    blurb: "All birds born in a cage think flying is an illness.",
    sizes: ["A3", "A2", "A1 FRAME"],
  },
  {
    id: "monstroid-plush",
    name: "MONSTROÏD PLUSHÏE",
    price: 4500000, // ₦45,000
    editions: "ONLY 20 EVER",
    stock: 8,
    collection: "OBJECTS",
    img: "/art/shop-monstroid-plushie.jpg",
    accent: "#c6f24e",
    blurb: "The monster found his way off the cover art. He is soft now.",
  },
  {
    id: "wrld-cube",
    name: "THE WRLD CUBE",
    price: 7900000, // ₦79,000
    editions: "ONLY 15 EVER",
    stock: 15,
    collection: "OBJECTS",
    img: "/art/shop-the-wrld-cube.jpg",
    accent: "#ff5d1f",
    blurb: "A hand-painted cube holding six of my works. Spin the wrld.",
  },
  {
    id: "silent-demise-print",
    name: "SÌLENT DEMÌSE POSTER",
    price: 1900000, // ₦19,000
    editions: "OPEN ËDITION",
    stock: 999,
    collection: "PRINTS",
    img: "/art/shop-silent-demise-poster.jpg",
    accent: "#19c8c8",
    blurb: "The cry no one heard, hung quietly on your wall.",
    sizes: ["A3", "A2", "A1 FRAME"],
  },
  {
    id: "damn-cap",
    name: "DAMN. CAP",
    price: 2900000, // ₦29,000
    editions: "ONLY 40 EVER",
    stock: 40,
    collection: "OBJECTS",
    img: "/art/shop-damn-cap.jpg",
    accent: "#f4d903",
    blurb: "For the phase of life where the only word left is — damn.",
  },
];

// ---------- 1/1 GALLERY — BUY THE PAINTING, NOT THE PRINT ----------
// The actual physical pieces. museum-grade. one of one. when it's gone,
// it belongs to someone's wall and exists nowhere else.
// "cert" pieces ship with the hand-signed CÈRTIFICATE OF MÏSSPELLING.
export const originals = [
  {
    id: "og-silent-demise",
    name: "SÌLENT DEMÌSE (THE ORIGINAL)",
    price: 45000000, // ₦450,000
    editions: "1 ÒF 1",
    stock: 1,
    collection: "ORIGINALS",
    img: "/art/orig-silent-demise.jpg",
    accent: "#19c8c8",
    medium: "POSTER CÒLOUR ON PAPER",
    blurb:
      "The actual paper. The actual crocodile. The antelope's silent cry hangs in whoever's room owns it next. Texture you can touch, bubbling water you can't.",
  },
  {
    id: "og-ciu-arena",
    name: "CÌU ARÈNA (THE ORIGINAL)",
    price: 32000000, // ₦320,000
    editions: "1 ÒF 1",
    stock: 1,
    collection: "ORIGINALS",
    img: "/art/orig-ciu-arena.jpg",
    accent: "#f4d903",
    medium: "HAND-CRAFTED ABSTRACTION",
    blurb:
      "His first university, abstracted by hand. A building that watched a young artist become an artist. Now it watches your wall.",
  },
  {
    id: "og-radical-boy-prototype",
    name: "RADÌCAL BØY (PROTOTYPE)",
    price: 60000000, // ₦600,000
    editions: "1 ÒF 1",
    stock: 1,
    collection: "ORIGINALS",
    img: "/art/orig-radical-boy.jpg",
    accent: "#ff5d1f",
    medium: "PHYSÌCAL PROTOTYPE + PHOTOGRAPHY",
    blurb:
      "The physical prototype from the 'RADICAL BOY' shoot. Not a print of the idea — the idea, standing in a room. Museum plaque not included. Museum attitude included.",
  },
];

// ---------- COMMISSION NAMES (project types) ----------
export const commissionTypes = [
  "CÒVER ART (games / albums)",
  "BRAND & IDENTÌTY",
  "PØRTRAIT OF YOU, GLÏCHED",
  "FASHIÒN / COLLECTION ART",
  "SOMETHÌNG ELSE ENTIRELY",
];

export const commissionBudgets = ["₦50K–150K", "₦150K–400K", "₦400K–800K", "₦800K+ (DREAM)"];
export const commissionTimelines = ["2 WEEKS", "1 MONTH", "FLOW WÌTH ME"];

// ---------- THE MANIFESTO (largest statements) ----------
export const manifesto = [
  "My art is me, misspelled.",
  "I don't make pretty pictures.",
  "I make the cage visible.",
  "Then I hand you the key.",
];

export const site = {
  name: "TERSOO'S WRLD",
  artist: "Tersoo Timothy Dzoho",
  role: "GRAPHIC DESIGNER & ILLUSTRATOR",
  email: "hello@tersooswrld.com",
  location: "LAGOS / EVERYWHR",
};
