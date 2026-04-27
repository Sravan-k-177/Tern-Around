const loginScreen = document.querySelector("#login-screen");
const signupScreen = document.querySelector("#signup-screen");
const verifyScreen = document.querySelector("#verify-screen");
const appView = document.querySelector("#app-view");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const verifyForm = document.querySelector("#verify-form");
const loginIdentifierInput = document.querySelector("#login-identifier-input");
const loginPasswordInput = document.querySelector("#login-password-input");
const signupUsernameInput = document.querySelector("#signup-username-input");
const signupEmailInput = document.querySelector("#signup-email-input");
const signupPasswordInput = document.querySelector("#signup-password-input");
const verifyEmailInput = document.querySelector("#verify-email-input");
const verifyCodeInput = document.querySelector("#verify-code-input");
const goSignupButton = document.querySelector("#go-signup-button");
const goLoginButton = document.querySelector("#go-login-button");
const resendCodeButton = document.querySelector("#resend-code-button");
const verifyBackLoginButton = document.querySelector("#verify-back-login-button");
const navExploreButton = document.querySelector("#nav-explore-button");
const navWishlistButton = document.querySelector("#nav-wishlist-button");
const openProfileButton = document.querySelector("#open-profile-button");
const exploreSection = document.querySelector("#explore-section");
const profileSection = document.querySelector("#profile-section");
const wishlistSection = document.querySelector("#wishlist-section");
const profileContactDetails = document.querySelector("#profile-contact-details");
const profileBadges = document.querySelector("#profile-badges");
const wishlistList = document.querySelector("#wishlist-list");
const userName = document.querySelector("#user-name");
const passStatus = document.querySelector("#pass-status");
const profileLogoutButton = document.querySelector("#profile-logout-button");
const searchInput = document.querySelector("#search-input");
const countryFilter = document.querySelector("#country-filter");
const stateFilter = document.querySelector("#state-filter");
const typeFilter = document.querySelector("#type-filter");
const apiSearchButton = document.querySelector("#api-search-button");
const apiStatus = document.querySelector("#api-status");
const resultCount = document.querySelector("#result-count");
const placeList = document.querySelector("#place-list");
const detailPanel = document.querySelector("#detail-panel");
const bookingForm = document.querySelector("#booking-form");
const bookingDestination = document.querySelector("#booking-destination");
const bookingResults = document.querySelector("#results-container");
const originInput = document.querySelector("#origin-input");
const departDateInput = document.querySelector("#depart-date-input");
const returnDateInput = document.querySelector("#return-date-input");
const travelersInput = document.querySelector("#travelers-input");
const loginStatus = document.querySelector("#login-status");
const signupStatus = document.querySelector("#signup-status");
const verifyStatus = document.querySelector("#verify-status");
const LOCAL_APP_ORIGIN = "http://127.0.0.1:5000";

if (window.location.protocol === "file:") {
  // The app must be served by Flask so /api routes stay same-origin.
  window.location.replace(`${LOCAL_APP_ORIGIN}/`);
}

const WIKIPEDIA_IMAGE_API = "https://en.wikipedia.org/w/api.php";
const COUNTRIES_NOW_STATES_API = "https://countriesnow.space/api/v0.1/countries/states";
const OURAIRPORTS_AIRPORTS_CSV =
  "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";
const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const ATTRACTION_SEARCH_RADIUS_METERS = 12000;
const ATTRACTION_FETCH_LIMIT = 80;
const ATTRACTION_RESULT_LIMIT = 24;
const VISIT_CAPTURE_RADIUS_METERS = 500;
const ALLOW_PHOTO_ONLY_FALLBACK = true;
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
      <defs>
        <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#dff3ff"/>
          <stop offset="1" stop-color="#f6faf8"/>
        </linearGradient>
      </defs>
      <rect width="900" height="600" fill="url(#sky)"/>
      <path d="M0 430 210 260l150 118 125-160 415 272v110H0z" fill="#b9d8cc"/>
      <path d="M0 492 240 338l168 115 108-94 384 187v54H0z" fill="#087f5b" opacity=".72"/>
      <circle cx="702" cy="142" r="64" fill="#f4b942"/>
    </svg>
  `);

const places = [
  {
    id: "gateway-of-india",
    name: "Gateway of India",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    type: "Monument",
    imageQuery: "Gateway of India Mumbai",
    summary:
      "A waterfront monument facing Mumbai Harbour, popular for ferry rides, evening walks, and Colaba food trails.",
    bestTime: "6:30 PM",
    tags: ["harbor", "history", "photography", "ferry"],
    transport: [
      "Metro or train to Churchgate, then 12 min cab",
      "BEST bus toward Colaba Depot",
      "Ferry arrival from Elephanta Caves"
    ],
    ticketing: [
      {
        service: "MakeMyTrip",
        label: "Flights and stays",
        url: "https://www.makemytrip.com/"
      },
      {
        service: "RedBus",
        label: "Intercity buses",
        url: "https://www.redbus.in/"
      },
      {
        service: "IRCTC",
        label: "Train tickets",
        url: "https://www.irctc.co.in/"
      }
    ],
    challenge:
      "Find one stone arch detail, take a pause facing the harbor, and mark the quest complete.",
    underdog: {
      name: "Sassoon Dock Art Walk",
      distance: "1.4 km",
      transport: "8 min auto or 18 min walk through Colaba lanes",
      description:
        "A working dock with murals, fishing boats, and a raw local rhythm before the dinner rush."
    }
  },
  {
    id: "amber-fort",
    name: "Amber Fort",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur",
    type: "Fort",
    imageQuery: "Amber Fort Jaipur",
    summary:
      "A hilltop fort known for courtyards, mirror work, old royal routes, and wide Aravalli views.",
    bestTime: "8:00 AM",
    tags: ["fort", "palace", "architecture", "heritage"],
    transport: [
      "AC bus from Ajmeri Gate toward Amer",
      "Cab via Amer Road",
      "E-rickshaw from Amer town"
    ],
    ticketing: [
      {
        service: "Rajasthan Tourism",
        label: "Official information",
        url: "https://www.tourism.rajasthan.gov.in/"
      },
      {
        service: "MakeMyTrip",
        label: "Hotels and flights",
        url: "https://www.makemytrip.com/"
      },
      {
        service: "RedBus",
        label: "Bus tickets",
        url: "https://www.redbus.in/"
      }
    ],
    challenge:
      "Find the mirror-work courtyard and complete the quest after reaching the viewpoint.",
    underdog: {
      name: "Panna Meena ka Kund",
      distance: "900 m",
      transport: "12 min downhill walk or 5 min e-rickshaw",
      description: "A geometric stepwell with quiet corners just below the fort road."
    }
  },
  {
    id: "charminar",
    name: "Charminar",
    country: "India",
    state: "Telangana",
    city: "Hyderabad",
    type: "Monument",
    imageQuery: "Charminar Hyderabad",
    summary:
      "A historic Old City landmark surrounded by bazaars, pearls, bangles, snacks, and busy street life.",
    bestTime: "5:30 PM",
    tags: ["bazaar", "food", "heritage", "shopping"],
    transport: [
      "Metro to MGBS, then 10 min auto",
      "Cab drop near Gulzar Houz",
      "Walk from Laad Bazaar"
    ],
    ticketing: [
      {
        service: "TSRTC",
        label: "State buses",
        url: "https://www.tsrtconline.in/"
      },
      {
        service: "IRCTC",
        label: "Train tickets",
        url: "https://www.irctc.co.in/"
      },
      {
        service: "MakeMyTrip",
        label: "Flights and stays",
        url: "https://www.makemytrip.com/"
      }
    ],
    challenge: "Stand where all four minarets are visible and mark the quest complete.",
    underdog: {
      name: "Badshahi Ashurkhana",
      distance: "650 m",
      transport: "9 min walk through the bazaar",
      description:
        "A calmer Old City stop with tile work, history, and space to slow down."
    }
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    type: "Monument",
    imageQuery: "Qutub Minar Delhi",
    summary:
      "A towering heritage complex with stone carvings, lawns, ruins, and easy metro access.",
    bestTime: "4:30 PM",
    tags: ["heritage", "architecture", "metro", "unesco"],
    transport: [
      "Yellow Line metro to Qutub Minar",
      "Auto from Saket or Mehrauli",
      "Cab drop at the main complex gate"
    ],
    ticketing: [
      {
        service: "ASI Payumoney",
        label: "Monument tickets",
        url: "https://asi.payumoney.com/"
      },
      {
        service: "Delhi Metro",
        label: "Metro route planning",
        url: "https://www.delhimetrorail.com/"
      },
      {
        service: "MakeMyTrip",
        label: "Flights and hotels",
        url: "https://www.makemytrip.com/"
      }
    ],
    challenge:
      "Find the Iron Pillar signboard and complete the quest before exiting the complex.",
    underdog: {
      name: "Mehrauli Archaeological Park",
      distance: "1.1 km",
      transport: "14 min walk or 6 min auto",
      description:
        "Ruins, tombs, trails, and quieter heritage corners next to the famous complex."
    }
  },
  {
    id: "statue-of-liberty",
    name: "Statue of Liberty",
    country: "United States",
    state: "New York",
    city: "New York City",
    type: "Landmark",
    imageQuery: "Statue of Liberty New York",
    summary:
      "A harbor icon reached by ferry, paired with skyline views and Ellis Island history.",
    bestTime: "9:00 AM",
    tags: ["ferry", "skyline", "history", "harbor"],
    transport: [
      "Subway to Bowling Green, then walk to Battery Park",
      "Official ferry from Battery Park",
      "Cab or rideshare to Castle Clinton"
    ],
    ticketing: [
      {
        service: "Statue City Cruises",
        label: "Official ferry tickets",
        url: "https://www.cityexperiences.com/new-york/city-cruises/statue/"
      },
      {
        service: "MTA",
        label: "Subway and bus routes",
        url: "https://new.mta.info/"
      },
      {
        service: "Expedia",
        label: "Flights and stays",
        url: "https://www.expedia.com/"
      }
    ],
    challenge:
      "Reach the harbor-facing side and complete the quest after spotting Manhattan's skyline.",
    underdog: {
      name: "Governors Island Hammock Grove",
      distance: "2.6 mi by ferry route",
      transport: "Ferry from Lower Manhattan",
      description:
        "Open lawns, harbor views, public art, and a slower island feel close to the famous route."
    }
  },
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    country: "France",
    state: "Ile-de-France",
    city: "Paris",
    type: "Landmark",
    imageQuery: "Eiffel Tower Paris",
    summary:
      "Paris's classic iron landmark with river walks, viewpoints, gardens, and night lighting.",
    bestTime: "8:45 PM",
    tags: ["viewpoint", "river", "architecture", "romantic"],
    transport: [
      "Metro to Bir-Hakeim",
      "RER C to Champ de Mars Tour Eiffel",
      "Walk from Trocadero across the Seine"
    ],
    ticketing: [
      {
        service: "Eiffel Tower Official",
        label: "Tower tickets",
        url: "https://www.toureiffel.paris/en"
      },
      {
        service: "SNCF Connect",
        label: "Trains in France",
        url: "https://www.sncf-connect.com/"
      },
      {
        service: "Booking.com",
        label: "Paris stays",
        url: "https://www.booking.com/"
      }
    ],
    challenge:
      "Reach the Trocadero view line and complete the quest when the tower is fully visible.",
    underdog: {
      name: "Rue Cler Market Street",
      distance: "1.2 km",
      transport: "15 min walk through the 7th arrondissement",
      description:
        "A neighborhood market street with bakeries, cheese shops, cafes, and everyday Paris energy."
    }
  }
];

let selectedPlaceId = places[0]?.id || "";
let apiPlaces = [];
let completedQuestIds = new Set();
let currentUser = null;
let lastApiRequestAt = 0;
let activeBookingPlaceId = "";
let activeAppSection = "explore";
let locationCatalog = [];
let airportCatalog = [];
let userAirport = null;
let userAirportLookupStarted = false;
let pendingVerificationEmail = "";
let wishlistEntries = [];
let activeCameraStream = null;
let profileExtras = {
  phone: "",
  phoneVerified: false,
  alternateEmail: "",
  homeCity: "",
  notesByPlaceId: {}
};
const imageCache = new Map();
const coordinateCache = new Map();
const destinationAirportCache = new Map();
let backendPlaces = [];

/* ── Avatar system ── */
const AVATARS = [
  { id: 1,  bg: "#6366f1", fg: "#fff",    emoji: "🏔️" },
  { id: 2,  bg: "#ec4899", fg: "#fff",    emoji: "🌸" },
  { id: 3,  bg: "#f59e0b", fg: "#fff",    emoji: "🌞" },
  { id: 4,  bg: "#10b981", fg: "#fff",    emoji: "🌿" },
  { id: 5,  bg: "#3b82f6", fg: "#fff",    emoji: "🌊" },
  { id: 6,  bg: "#8b5cf6", fg: "#fff",    emoji: "🔭" },
  { id: 7,  bg: "#ef4444", fg: "#fff",    emoji: "🗺️" },
  { id: 8,  bg: "#0ea5e9", fg: "#fff",    emoji: "✈️" },
  { id: 9,  bg: "#d97706", fg: "#fff",    emoji: "🏕️" },
  { id: 10, bg: "#64748b", fg: "#fff",    emoji: "🧭" }
];
let selectedAvatarId = Number(localStorage.getItem("tern-avatar") || "1");

function getAvatar() {
  return AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[0];
}

function renderAvatarCircle(el) {
  if (!el) return;
  const av = getAvatar();
  el.style.background = av.bg;
  el.style.color = av.fg;
  el.textContent = av.emoji;
}

function renderTopBarAvatar() {
  renderAvatarCircle(document.getElementById("top-bar-avatar"));
}

function renderProfileAvatarPreview() {
  renderAvatarCircle(document.getElementById("profile-avatar-preview"));
  const previewName = document.getElementById("profile-avatar-preview-name");
  if (previewName) {
    previewName.textContent = currentUser
      ? (currentUser.username || currentUser.name || "Traveler")
      : "Traveler";
  }
}

function saveAvatar(id) {
  selectedAvatarId = id;
  localStorage.setItem("tern-avatar", String(id));
  renderTopBarAvatar();
  renderProfileAvatarPreview();
  // refresh avatar picker if profile is open
  document.querySelectorAll(".avatar-picker-item").forEach(el => {
    el.classList.toggle("is-selected", Number(el.dataset.avatarId) === id);
  });
}

function showAuthScreen(screen) {
  loginScreen.classList.toggle("is-hidden", screen !== "login");
  signupScreen.classList.toggle("is-hidden", screen !== "signup");
  verifyScreen.classList.toggle("is-hidden", screen !== "verify");
}

function getWishlistIds() {
  return new Set(wishlistEntries.map((entry) => entry.placeId));
}

function setAppSection(section) {
  activeAppSection = section;
  const badgesAllSection = document.getElementById("badges-all-section");
  exploreSection.classList.toggle("is-hidden", section !== "explore");
  profileSection.classList.toggle("is-hidden", section !== "profile");
  wishlistSection.classList.toggle("is-hidden", section !== "wishlist");
  if (badgesAllSection) badgesAllSection.classList.toggle("is-hidden", section !== "badges-all");

  navExploreButton.classList.toggle("is-active", section === "explore");
  navWishlistButton.classList.toggle("is-active", section === "wishlist");

  const mainTopBar = document.getElementById("main-top-bar");
  const mainAppNav = document.querySelector(".app-view > .app-nav");
  const hideTopChrome = section === "profile" || section === "badges-all";
  if (mainTopBar) mainTopBar.classList.toggle("is-hidden", hideTopChrome);
  if (mainAppNav) mainAppNav.classList.toggle("is-hidden", hideTopChrome);
}

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(value).replace(/[&<>"']/g, (c) => entities[c]);
}

/** Shorthand for JSON POST requests */
async function postJson(url, body) {
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

/** Default blank profile state — single source of truth */
const BLANK_PROFILE_EXTRAS = Object.freeze({
  phone: "",
  phoneVerified: false,
  alternateEmail: "",
  homeCity: "",
  notesByPlaceId: {}
});

/** Clear all auth status messages */
function clearAuthStatus() {
  loginStatus.textContent = "";
  signupStatus.textContent = "";
  verifyStatus.textContent = "";
}

/** Toggle success/error class on a status element */
function setStatus(el, message, isSuccess) {
  el.textContent = message;
  el.classList.toggle("success", isSuccess);
  el.classList.toggle("error", !isSuccess);
}

function getLocalDateInputValue(dateValue) {
  const date = new Date(dateValue);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function requestGeoPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getCurrentGeoPosition() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  try {
    // First attempt: high-accuracy (GPS if available).
    return await requestGeoPosition({
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    });
  } catch (primaryError) {
    try {
      // Retry: allow network-assisted location (Wi-Fi/IP/cell) from browser provider.
      return await requestGeoPosition({
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000
      });
    } catch (secondaryError) {
      throw new Error(
        "Could not get device location. Turn on Location Services, keep Wi-Fi enabled, allow browser location permission, and retry."
      );
    }
  }
}

function markPlaceVisitedWithCapture(place, capturedAt, captureMeta = {}) {
  return postJson("/api/quests/complete", { placeId: place.id }).then((data) => {
    completedQuestIds = new Set(data.completedQuestIds || []);
    upsertVisitedEntry(place.id, {
      visitedOn: getLocalDateInputValue(capturedAt),
      capturedAt: capturedAt.toISOString(),
      ...captureMeta
    });
    saveProfileExtras();
  });
}

function stopCameraStream() {
  if (!activeCameraStream) {
    return;
  }

  activeCameraStream.getTracks().forEach((track) => track.stop());
  activeCameraStream = null;
}

async function startCameraStream(videoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not supported in this browser.");
  }

  stopCameraStream();
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: "environment"
      }
    },
    audio: false
  });
  activeCameraStream = stream;
  videoElement.srcObject = stream;
  await videoElement.play();
}

function upsertVisitedEntry(placeId, updates = {}) {
  const existingEntry = profileExtras.notesByPlaceId?.[placeId] || {};
  profileExtras.notesByPlaceId[placeId] = {
    ...existingEntry,
    ...updates
  };
}

function buildCapturedPhotoThumbnailDataUrl(sourceCanvas) {
  const maxWidth = 320;
  const sourceWidth = sourceCanvas.width || 320;
  const sourceHeight = sourceCanvas.height || 240;
  const scale = Math.min(1, maxWidth / sourceWidth);
  const thumbnailCanvas = document.createElement("canvas");
  thumbnailCanvas.width = Math.max(1, Math.round(sourceWidth * scale));
  thumbnailCanvas.height = Math.max(1, Math.round(sourceHeight * scale));

  const thumbnailContext = thumbnailCanvas.getContext("2d");
  if (!thumbnailContext) {
    return "";
  }

  thumbnailContext.drawImage(sourceCanvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
  return thumbnailCanvas.toDataURL("image/jpeg", 0.72);
}

function getProfileStorageKey() {
  if (!currentUser) {
    return "";
  }

  const accountKey = currentUser.email || currentUser.username || currentUser.name || "guest";
  return `tern-around-profile:${accountKey.toLowerCase()}`;
}

function validatePhoneNumber(phone) {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Check if it's a valid international phone format (10-15 digits)
  return digits.length >= 10 && digits.length <= 15;
}

function loadProfileExtras() {
  profileExtras = { ...BLANK_PROFILE_EXTRAS, notesByPlaceId: {} };

  if (!currentUser) return;

  try {
    const rawValue = localStorage.getItem(getProfileStorageKey());
    if (!rawValue) return;
    const parsed = JSON.parse(rawValue);
    profileExtras = {
      phone:          parsed.phone          || "",
      phoneVerified:  parsed.phoneVerified  || false,
      alternateEmail: parsed.alternateEmail || "",
      homeCity:       parsed.homeCity       || "",
      notesByPlaceId: parsed.notesByPlaceId || {}
    };
  } catch {
    profileExtras = { ...BLANK_PROFILE_EXTRAS, notesByPlaceId: {} };
  }
}

function saveProfileExtras() {
  if (!currentUser) {
    return;
  }

  localStorage.setItem(getProfileStorageKey(), JSON.stringify(profileExtras));
}

function getAllPlaces() {
  return [...(backendPlaces.length > 0 ? backendPlaces : places), ...apiPlaces];
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    let payload = null;

    try {
      payload = await response.json();
      if (payload?.error) {
        errorMessage = payload.error;
      }
    } catch (error) {
      // Keep the fallback error message.
    }

    const requestError = new Error(errorMessage);
    requestError.payload = payload;
    throw requestError;
  }

  return response.json();
}

async function loadBootstrapData() {
  try {
    const data = await fetchJson("/api/bootstrap");
    backendPlaces = data.places || [];
    locationCatalog = data.catalog || [];
    completedQuestIds = new Set(data.completedQuestIds || []);
    wishlistEntries = data.wishlistEntries || [];
    currentUser = data.user || null;
    loadProfileExtras();
    loginStatus.textContent = "";
    signupStatus.textContent = "";
    verifyStatus.textContent = "";

    if (currentUser) {
      loginScreen.classList.add("is-hidden");
      signupScreen.classList.add("is-hidden");
      verifyScreen.classList.add("is-hidden");
      appView.classList.remove("is-hidden");
      setAppSection(activeAppSection);
    } else {
      appView.classList.add("is-hidden");
      showAuthScreen("login");
      setAppSection("explore");
    }

    renderApp();
  } catch (error) {
    loginStatus.textContent = "MySQL backend is not ready yet. Check Flask and database settings.";
    apiStatus.textContent = "Backend sync failed, so the app is using the built-in dataset for now.";
    showAuthScreen("login");
    renderApp();
  }
}

function getImageLookupQuery(place) {
  return place.imageQuery || `${place.name} ${place.city} ${place.country}`;
}

function getPlaceImage(place) {
  const cachedImage = imageCache.get(place.id);

  if (cachedImage?.status === "loaded") {
    return cachedImage.url;
  }

  if (!cachedImage) {
    fetchPlaceImage(place);
  }

  return PLACEHOLDER_IMAGE;
}

function renderImageSource(place) {
  const cachedImage = imageCache.get(place.id);

  if (cachedImage?.status !== "loaded") {
    return "";
  }

  const title = cachedImage.title ? `: ${escapeHtml(cachedImage.title)}` : "";
  return `<p class="source-note">Photo from Wikipedia${title}.</p>`;
}

async function fetchPlaceImage(place) {
  imageCache.set(place.id, { status: "loading" });

  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: getImageLookupQuery(place),
      gsrlimit: "3",
      prop: "pageimages",
      piprop: "thumbnail|original",
      pithumbsize: "900",
      format: "json",
      origin: "*"
    });

    const response = await fetch(`${WIKIPEDIA_IMAGE_API}?${params}`);

    if (!response.ok) {
      throw new Error("Wikipedia image API request failed");
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const imagePage = pages.find((page) => page.thumbnail?.source || page.original?.source);
    const imageUrl = imagePage?.thumbnail?.source || imagePage?.original?.source;

    if (!imageUrl) {
      throw new Error("No image found for place");
    }

    imageCache.set(place.id, {
      status: "loaded",
      url: imageUrl,
      title: imagePage.title
    });
  } catch (error) {
    imageCache.set(place.id, { status: "failed" });
  }

  renderApp();
}

function getSelectedPlace() {
  return getAllPlaces().find((place) => place.id === selectedPlaceId) || getAllPlaces()[0];
}

function getSelectedDestinationLabel() {
  const place = getSelectedPlace();

  if (!place) {
    return "";
  }

  return `${place.city}, ${place.country}`;
}

function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function parseCsvLine(line) {
  const values = [];
  let currentValue = "";
  let isQuoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
    } else if (character === '"') {
      isQuoted = !isQuoted;
    } else if (character === "," && !isQuoted) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += character;
    }
  }

  values.push(currentValue);
  return values;
}

function parseAirportsCsv(csvText) {
  const [headerLine, ...lines] = csvText.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines
    .map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce((airport, header, index) => {
        airport[header] = values[index] || "";
        return airport;
      }, {});
    })
    .filter(
      (airport) =>
        airport.iata_code &&
        airport.scheduled_service === "yes" &&
        ["large_airport", "medium_airport"].includes(airport.type)
    )
    .map((airport) => ({
      name: airport.name,
      iata: airport.iata_code,
      lat: Number(airport.latitude_deg),
      lon: Number(airport.longitude_deg)
    }))
    .filter((airport) => Number.isFinite(airport.lat) && Number.isFinite(airport.lon));
}

async function loadAirportCatalog() {
  if (airportCatalog.length > 0) {
    return airportCatalog;
  }

  const response = await fetch(OURAIRPORTS_AIRPORTS_CSV);

  if (!response.ok) {
    throw new Error("Airport dataset request failed");
  }

  airportCatalog = parseAirportsCsv(await response.text());
  return airportCatalog;
}

function getDistanceKm(start, end) {
  const earthRadiusKm = 6371;
  const startLat = (start.lat * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const latDelta = ((end.lat - start.lat) * Math.PI) / 180;
  const lonDelta = ((end.lon - start.lon) * Math.PI) / 180;
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lonDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function findNearestAirport(coords) {
  if (!coords || airportCatalog.length === 0) {
    return null;
  }

  return airportCatalog.reduce((nearest, airport) => {
    const distanceKm = getDistanceKm(coords, airport);

    if (!nearest || distanceKm < nearest.distanceKm) {
      return { ...airport, distanceKm };
    }

    return nearest;
  }, null);
}

function getPlaceCoordinateQuery(place) {
  return `${place.name}, ${place.city}, ${place.state}, ${place.country}`;
}

async function getPlaceCoordinates(place) {
  if (place.lat && place.lon) {
    return { lat: Number(place.lat), lon: Number(place.lon) };
  }

  if (coordinateCache.has(place.id)) {
    return coordinateCache.get(place.id);
  }

  const params = new URLSearchParams({
    q: getPlaceCoordinateQuery(place),
    format: "jsonv2",
    limit: "1",
    "accept-language": "en"
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);

  if (!response.ok) {
    throw new Error("Location geocoding failed");
  }

  const [result] = await response.json();
  const coords = result ? { lat: Number(result.lat), lon: Number(result.lon) } : null;
  coordinateCache.set(place.id, coords);
  return coords;
}

async function ensureDestinationAirport(place) {
  if (destinationAirportCache.has(place.id)) {
    return destinationAirportCache.get(place.id);
  }

  try {
    await loadAirportCatalog();
    const coords = await getPlaceCoordinates(place);
    const airport = findNearestAirport(coords);
    destinationAirportCache.set(place.id, airport);
    renderApp();
    return airport;
  } catch (error) {
    destinationAirportCache.set(place.id, null);
    return null;
  }
}

function detectUserNearestAirport() {
  if (!navigator.geolocation || userAirport || userAirportLookupStarted) {
    return;
  }

  userAirportLookupStarted = true;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await loadAirportCatalog();
        userAirport = findNearestAirport({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        renderApp();
      } catch (error) {
        userAirport = null;
      }
    },
    () => {
      userAirport = null;
    },
    { maximumAge: 3600000, timeout: 8000 }
  );
}

function getMapUrl(place) {
  if (place.lat && place.lon) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    getPlaceCoordinateQuery(place)
  )}`;
}

function getFlightUrl(destinationAirport, place) {
  const origin = userAirport?.iata || "nearest airport";
  const destination = destinationAirport?.iata || `${place.city}, ${place.country}`;

  return buildUrl("https://www.google.com/travel/flights", {
    q: `flights from ${origin} to ${destination}`
  });
}

function getBookingComUrl(place, dates = {}) {
  return buildUrl("https://www.booking.com/searchresults.html", {
    ss: `${place.name}, ${place.city}, ${place.country}`,
    checkin: dates.departDate,
    checkout: dates.returnDate,
    group_adults: dates.travelers
  });
}

function getTicketUrl(ticket, place) {
  if (ticket.service === "Booking.com") {
    return getBookingComUrl(place);
  }

  return ticket.url;
}

function renderTravelActions(place) {
  const hasAirportResult = destinationAirportCache.has(place.id);
  const destinationAirport = destinationAirportCache.get(place.id);
  ensureDestinationAirport(place);
  detectUserNearestAirport();

  return `
    <div class="travel-actions" aria-label="Destination actions">
      <a href="${getMapUrl(place)}" target="_blank" rel="noreferrer">
        <span>Google Maps</span>
        <small>Open this location</small>
      </a>
      <a href="${getFlightUrl(destinationAirport, place)}" target="_blank" rel="noreferrer">
        <span>Flights</span>
        <small>${
          destinationAirport
            ? `${userAirport?.iata || "Your airport"} to ${destinationAirport.iata}`
            : hasAirportResult
              ? "No scheduled airport found nearby"
              : "Finding nearest destination airport"
        }</small>
      </a>
    </div>
  `;
}

function getFilteredPlaces() {
  const query = searchInput.value.trim().toLowerCase();
  const country = countryFilter.value;
  const state = stateFilter.value;
  const type = typeFilter.value;

  return getAllPlaces().filter((place) => {
    const searchTarget = [
      place.name,
      place.city,
      place.state,
      place.country,
      place.type,
      place.summary,
      ...place.transport,
      ...place.tags
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchTarget.includes(query)) &&
      (!country || place.country === country) &&
      (!state || place.state === state) &&
      (!type || place.type === type)
    );
  });
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function getCatalogCountries() {
  return locationCatalog.map((country) => country.name);
}

function getCatalogStates(countryName) {
  if (!countryName) {
    return [];
  }

  const country = locationCatalog.find((entry) => entry.name === countryName);
  return country?.states?.map((state) => state.name) || [];
}

async function loadLocationCatalog() {
  try {
    const response = await fetch(COUNTRIES_NOW_STATES_API);

    if (!response.ok) {
      throw new Error("Country/state API request failed");
    }

    const data = await response.json();
    locationCatalog = (data.data || [])
      .map((country) => ({
        name: country.name || country.country,
        iso2: country.iso2,
        iso3: country.iso3,
        states: country.states || []
      }))
      .filter((country) => country.name);

    renderApp();
  } catch (error) {
    apiStatus.textContent =
      "Country and state catalog could not load. Curated places and live search still work.";
  }
}

function renderFilters() {
  const selectedCountry = countryFilter.value;
  const selectedState = stateFilter.value;
  const selectedType = typeFilter.value;
  const allPlaces = getAllPlaces();

  const countries = uniqueSorted([...getCatalogCountries(), ...allPlaces.map((place) => place.country)]);
  const catalogStates = getCatalogStates(selectedCountry);
  const placeStates = allPlaces
    .filter((place) => !selectedCountry || place.country === selectedCountry)
    .map((place) => place.state);
  const states = uniqueSorted(
    selectedCountry && catalogStates.length > 0 ? [...catalogStates, ...placeStates] : placeStates
  );
  const types = uniqueSorted(allPlaces.map((place) => place.type));

  countryFilter.innerHTML = renderOptions("All countries", countries, selectedCountry);
  stateFilter.innerHTML = renderOptions("All states", states, selectedState);
  typeFilter.innerHTML = renderOptions("All types", types, selectedType);

  if (selectedState && !states.includes(selectedState)) {
    stateFilter.value = "";
  }
}

function renderOptions(defaultLabel, values, selectedValue) {
  return [
    `<option value="">${defaultLabel}</option>`,
    ...values.map((value) => {
      const selected = value === selectedValue ? " selected" : "";
      return `<option value="${value}"${selected}>${value}</option>`;
    })
  ].join("");
}

function renderPlaceList() {
  const filteredPlaces = getFilteredPlaces();

  if (!filteredPlaces.some((place) => place.id === selectedPlaceId)) {
    selectedPlaceId = filteredPlaces[0]?.id || "";
  }

  resultCount.textContent = `${filteredPlaces.length} place${
    filteredPlaces.length === 1 ? "" : "s"
  }`;
  placeList.innerHTML = "";

  if (filteredPlaces.length === 0) {
    placeList.innerHTML = `
      <div class="empty-state">
        <strong>No places found</strong>
        <p>Try a different country, state, type, or search term.</p>
      </div>
    `;
    return;
  }

  filteredPlaces.forEach((place) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `place-card${place.id === selectedPlaceId ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", place.id === selectedPlaceId);
    button.addEventListener("click", () => {
      selectedPlaceId = place.id;
      renderApp();
    });

    button.innerHTML = `
      <img src="${getPlaceImage(place)}" alt="${place.name}">
      <span>
        <strong>${place.name}</strong>
        <small>${place.city}, ${place.state}</small>
        <em>${place.type}${place.source ? " / API" : ""}</em>
      </span>
    `;

    placeList.append(button);
  });
}

function renderDetailPanel() {
  stopCameraStream();
  const place = getSelectedPlace();

  if (!place) {
    detailPanel.innerHTML = `
      <div class="empty-state">
        <strong>Select a place</strong>
        <p>Search or adjust the filters to find a destination.</p>
      </div>
    `;
    return;
  }

  const questComplete = completedQuestIds.has(place.id);
  const isSelectCustomer = Boolean(currentUser?.isSelectCustomer);
  const canReveal = isSelectCustomer && questComplete;
  const isInWishlist = getWishlistIds().has(place.id);

  detailPanel.innerHTML = `
    <img class="detail-image" src="${getPlaceImage(place)}" alt="${place.name}">
    <div class="detail-content">
      <div class="detail-heading">
        <div>
          <span class="section-kicker">${place.country} / ${place.state}</span>
          <h2>${place.name}</h2>
          <p>${place.city} · Best around ${place.bestTime}</p>
        </div>
        <span class="type-pill">${place.type}</span>
      </div>

      ${renderTravelActions(place)}

      <p>${place.summary}</p>
      ${place.source ? `<p class="source-note">Location data from ${place.source}.</p>` : ""}
      ${renderImageSource(place)}

      <section class="transport-panel" aria-label="Transport options">
        <h3>Transportation</h3>
        <ul>
          ${place.transport.map((option) => `<li>${option}</li>`).join("")}
        </ul>
      </section>

      <section class="ticket-panel" aria-label="Ticketing services">
        <h3>Tickets and travel</h3>
        <div class="ticket-links">
          ${place.ticketing
            .map(
              (ticket) => `
                <a href="${getTicketUrl(ticket, place)}" target="_blank" rel="noreferrer">
                  <span>${ticket.service}</span>
                  <small>${ticket.label}</small>
                </a>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="quest-panel ${questComplete ? "is-complete" : ""}" aria-label="Unlock quest">
        <span class="section-kicker">Location quest</span>
        <h3>${questComplete ? "Quest complete" : "Complete this visit challenge"}</h3>
        <p>${place.challenge}</p>
        <div class="detail-actions-row">
          <button class="primary-action" type="button" id="complete-quest">
            ${questComplete ? "Completed" : "Complete quest"}
          </button>
          <button class="secondary-action" type="button" id="wishlist-toggle">
            ${isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </button>
          <button class="secondary-action" type="button" id="capture-visit-button">
            ${questComplete ? "Capture again" : "Capture visit"}
          </button>
        </div>
        <div class="visit-capture-panel is-hidden" id="visit-capture-panel">
          <video id="visit-camera-preview" playsinline muted></video>
          <div class="visit-capture-actions">
            <button class="primary-action" type="button" id="capture-photo-button">Take photo and verify</button>
            <button class="text-action" type="button" id="close-capture-button">Close</button>
          </div>
          <p class="capture-status" id="capture-status" aria-live="polite"></p>
        </div>
      </section>

      <section class="hidden-panel ${canReveal ? "is-unlocked" : ""}" aria-label="Hidden underdog spot">
        ${renderHiddenSpot(place, isSelectCustomer, questComplete)}
      </section>
    </div>
  `;

  document.querySelector("#complete-quest").addEventListener("click", async () => {
    try {
      const data = await postJson("/api/quests/complete", { placeId: place.id });
      completedQuestIds = new Set(data.completedQuestIds || []);
      renderApp();
    } catch (error) {
      apiStatus.textContent = error.message;
    }
  });

  document.querySelector("#wishlist-toggle").addEventListener("click", async () => {
    if (!currentUser) {
      apiStatus.textContent = "Log in to save places to your wishlist.";
      return;
    }
    try {
      const data = isInWishlist
        ? await fetchJson("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeId: place.id })
          })
        : await postJson("/api/wishlist", {
            placeId: place.id,
            name: place.name,
            country: place.country,
            state: place.state,
            city: place.city,
            type: place.type
          });
      wishlistEntries = data.wishlistEntries || [];
      renderApp();
    } catch (error) {
      apiStatus.textContent = error.message;
    }
  });

  const captureVisitButton = document.querySelector("#capture-visit-button");
  const visitCapturePanel = document.querySelector("#visit-capture-panel");
  const cameraPreview = document.querySelector("#visit-camera-preview");
  const capturePhotoButton = document.querySelector("#capture-photo-button");
  const closeCaptureButton = document.querySelector("#close-capture-button");
  const captureStatus = document.querySelector("#capture-status");

  captureVisitButton?.addEventListener("click", async () => {
    if (!currentUser) {
      apiStatus.textContent = "Log in first to capture and verify visits.";
      return;
    }

    visitCapturePanel?.classList.remove("is-hidden");
    captureStatus.textContent = "Requesting camera access...";
    captureStatus.classList.remove("success", "error");

    try {
      await startCameraStream(cameraPreview);
      captureStatus.textContent = "Camera ready. Capture your visit photo on-site.";
    } catch (error) {
      captureStatus.textContent = error.message;
      captureStatus.classList.add("error");
    }
  });

  closeCaptureButton?.addEventListener("click", () => {
    stopCameraStream();
    visitCapturePanel?.classList.add("is-hidden");
    captureStatus.textContent = "";
    captureStatus.classList.remove("success", "error");
  });

  capturePhotoButton?.addEventListener("click", async () => {
    if (!cameraPreview) {
      return;
    }

    capturePhotoButton.disabled = true;
    closeCaptureButton.disabled = true;
    captureStatus.textContent = "Capturing photo and checking location...";
    captureStatus.classList.remove("success", "error");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = cameraPreview.videoWidth || 720;
      canvas.height = cameraPreview.videoHeight || 480;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not capture photo from camera.");
      }

      context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

      const capturedAt = new Date();
      const capturedPhotoDataUrl = buildCapturedPhotoThumbnailDataUrl(canvas);
      try {
        const geolocationResult = await getCurrentGeoPosition();
        const userCoords = {
          lat: geolocationResult.coords.latitude,
          lon: geolocationResult.coords.longitude
        };
        const placeCoords = await getPlaceCoordinates(place);

        if (!placeCoords) {
          throw new Error("Could not determine destination coordinates for this place.");
        }

        const distanceMeters = Math.round(getDistanceKm(userCoords, placeCoords) * 1000);

        if (distanceMeters > VISIT_CAPTURE_RADIUS_METERS) {
          throw new Error(
            `You are ${distanceMeters}m away. Move within ${VISIT_CAPTURE_RADIUS_METERS}m and try again.`
          );
        }

        await markPlaceVisitedWithCapture(place, capturedAt, {
          captureMethod: "geo-verified",
          capturePhotoDataUrl: capturedPhotoDataUrl || undefined,
          captureLat: Number(userCoords.lat.toFixed(6)),
          captureLon: Number(userCoords.lon.toFixed(6)),
          captureDistanceMeters: distanceMeters
        });

        captureStatus.textContent = `Visit captured. Verified at ${distanceMeters}m from ${place.name}.`;
        captureStatus.classList.add("success");
      } catch (geoError) {
        if (!ALLOW_PHOTO_ONLY_FALLBACK) {
          throw geoError;
        }

        await markPlaceVisitedWithCapture(place, capturedAt, {
          captureMethod: "photo-only",
          capturePhotoDataUrl: capturedPhotoDataUrl || undefined
        });

        captureStatus.textContent =
          "GPS unavailable on this device. Visit marked using photo-only capture.";
        captureStatus.classList.add("success");
      }

      stopCameraStream();
      renderApp();
    } catch (error) {
      captureStatus.textContent = error.message;
      captureStatus.classList.add("error");
    } finally {
      capturePhotoButton.disabled = false;
      closeCaptureButton.disabled = false;
    }
  });
}

function renderHiddenSpot(place, isSelectCustomer, questComplete) {
  if (!isSelectCustomer) {
    return `
      <span class="lock-label">Hidden spot locked</span>
      <h3>Select customer access required</h3>
      <p>Hidden underdog spots are available only for Explorer Select customers.</p>
    `;
  }

  if (!questComplete) {
    return `
      <span class="lock-label">Hidden spot locked</span>
      <h3>Finish the quest first</h3>
      <p>Complete the on-site challenge to reveal a less crowded spot nearby.</p>
    `;
  }

  return `
    <span class="unlock-label">Underdog spot unlocked</span>
    <h3>${place.underdog.name}</h3>
    <p>${place.underdog.description}</p>
    <dl>
      <div>
        <dt>Distance</dt>
        <dd>${place.underdog.distance}</dd>
      </div>
      <div>
        <dt>Go by</dt>
        <dd>${place.underdog.transport}</dd>
      </div>
    </dl>
  `;
}

function renderUser() {
  if (!currentUser) {
    userName.textContent = "Guest";
    passStatus.textContent = "Explorer Select";
    renderTopBarAvatar();
    return;
  }

  userName.textContent = currentUser.username || currentUser.name;
  passStatus.textContent = currentUser.isSelectCustomer
    ? "Explorer Select"
    : "Standard traveler";
  renderTopBarAvatar();
}

function renderProfileDetails() {
  if (!currentUser) {
    profileContactDetails.innerHTML = "<p>Log in to view profile details.</p>";
    profileBadges.innerHTML = "<p>Your visited locations will appear here.</p>";
    return;
  }

  const avatarPickerHtml = `
    <div class="avatar-preview-card">
      <div class="avatar-preview-circle" id="profile-avatar-preview" aria-hidden="true"></div>
      <p class="avatar-preview-name" id="profile-avatar-preview-name">Traveler</p>
    </div>
    <div class="avatar-picker-section">
      <p class="avatar-picker-label">Choose your avatar</p>
      <div class="avatar-picker-grid">
        ${AVATARS.map(av => `
          <button
            type="button"
            class="avatar-picker-item${av.id === selectedAvatarId ? " is-selected" : ""}"
            data-avatar-id="${av.id}"
            style="background:${av.bg};color:${av.fg}"
            title="Avatar ${av.id}"
            aria-label="Select avatar ${av.emoji}"
          >${av.emoji}</button>
        `).join("")}
      </div>
    </div>
  `;

  profileContactDetails.innerHTML = avatarPickerHtml + `
    <form class="profile-form" id="profile-details-form">
      <dl class="profile-list">
        <div><dt>Username</dt><dd>${escapeHtml(currentUser.username || currentUser.name || "-")}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(currentUser.email || "-")}</dd></div>
        <div><dt>Email status</dt><dd>${currentUser.emailVerified ? "Verified" : "Not verified"}</dd></div>
        <div><dt>Plan</dt><dd>${currentUser.isSelectCustomer ? "Explorer Select" : "Standard traveler"}</dd></div>
      </dl>

      <div class="profile-form-grid">
        <label>Phone Verification</label>
        <small style="color: #999; padding: 8px 0;">Phone verification is coming soon!</small>

        <label for="profile-alt-email-input">Alternate email</label>
        <input id="profile-alt-email-input" name="alternateEmail" type="email" placeholder="backup@example.com" value="${escapeHtml(profileExtras.alternateEmail)}">

        <label for="profile-home-city-input">Home city</label>
        <input id="profile-home-city-input" name="homeCity" type="text" placeholder="Hyderabad" value="${escapeHtml(profileExtras.homeCity)}">
      </div>

      <p class="api-status" id="profile-save-status" aria-live="polite"></p>
      <button class="primary-action" type="submit">Save contact details</button>
    </form>
  `;

  const visitedIds = Array.from(completedQuestIds);
  const allPlaces = getAllPlaces();
  const visitedPlaces = visitedIds
    .map((id) => allPlaces.find((place) => place.id === id))
    .filter(Boolean);

  if (visitedPlaces.length === 0) {
    profileBadges.innerHTML = "<p>Complete location quests to unlock visited locations and badges.</p>";
  } else {
    // ── Horizontal scroll strip with "All →" chip at the end
    profileBadges.innerHTML = `
      <div class="badge-strip">
        ${visitedPlaces.map((place) => {
          const entry = profileExtras.notesByPlaceId?.[place.id] || {};
          const dateLabel = entry.visitedOn
            ? new Date(entry.visitedOn).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
            : "Pending";
          return `
            <article class="badge-chip">
              <div class="badge-chip-emoji">${entry.capturePhotoDataUrl
                ? `<img src="${entry.capturePhotoDataUrl}" alt="">`
                : "📍"}
              </div>
              <div class="badge-chip-info">
                <strong>${escapeHtml(place.name)}</strong>
                <small>${escapeHtml(place.city)}, ${escapeHtml(place.country)}</small>
                <small class="badge-chip-date">${escapeHtml(dateLabel)}</small>
              </div>
            </article>
          `;
        }).join("")}
        <button type="button" class="badge-strip-all-btn" id="badges-view-all-btn">
          <span>All</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
    document.getElementById("badges-view-all-btn")?.addEventListener("click", () => {
      renderBadgesAll();
      setAppSection("badges-all");
    });
  }

  const profileForm = document.querySelector("#profile-details-form");
  const profileSaveStatus = document.querySelector("#profile-save-status");

  // Avatar picker
  renderProfileAvatarPreview();
  document.querySelectorAll(".avatar-picker-item").forEach(btn => {
    btn.addEventListener("click", () => {
      saveAvatar(Number(btn.dataset.avatarId));
    });
  });

  profileForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(profileForm);
    const newPhone = String(formData.get("phone") || "").trim();
    
    // If phone changed, reset verification status
    if (newPhone !== profileExtras.phone) {
      profileExtras.phoneVerified = false;
    }
    
    profileExtras.phone = newPhone;
    profileExtras.alternateEmail = String(formData.get("alternateEmail") || "").trim();
    profileExtras.homeCity = String(formData.get("homeCity") || "").trim();
    saveProfileExtras();

    if (profileSaveStatus) {
      profileSaveStatus.textContent = "Profile details saved on this device.";
    }
  });

  // Phone verification temporarily disabled
  /*
  const sendPhoneCodeButton = profileForm?.querySelector("#send-phone-code-button");
  const phoneInput = profileForm?.querySelector("#profile-phone-input");
  const phoneCodeStatus = profileForm?.querySelector("#phone-code-status");
  const phoneCodeInputContainer = profileForm?.querySelector("#phone-code-input-container");
  const phoneCodeInput = profileForm?.querySelector("#profile-phone-code-input");
  const verifyPhoneCodeButton = profileForm?.querySelector("#verify-phone-code-button");

  sendPhoneCodeButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    const phone = phoneInput?.value.trim() || "";
    const digitsOnly = phone.replace(/\D/g, "");

    if (!phone) {
      setStatus(phoneCodeStatus, "Please enter a phone number.", false);
      return;
    }
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setStatus(phoneCodeStatus, "Phone number must be 10-15 digits.", false);
      return;
    }
    if (profileExtras.phoneVerified) {
      setStatus(phoneCodeStatus, "Phone is already verified.", true);
      return;
    }

    sendPhoneCodeButton.disabled = true;
    phoneCodeStatus.textContent = "Sending verification code...";
    phoneCodeStatus.classList.remove("error", "success");

    try {
      await postJson("/api/phone/send-code", { phone });
      setStatus(phoneCodeStatus, "Code sent! Enter it below.", true);
      phoneCodeInputContainer.style.display = "block";
      phoneCodeInput.value = "";
      phoneCodeInput.focus();
    } catch (error) {
      setStatus(phoneCodeStatus, error.message, false);
    } finally {
      sendPhoneCodeButton.disabled = false;
    }
  });

  verifyPhoneCodeButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    const code = phoneCodeInput?.value.trim() || "";

    if (!code) {
      setStatus(phoneCodeStatus, "Please enter the verification code.", false);
      return;
    }
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setStatus(phoneCodeStatus, "Verification code must be 6 digits.", false);
      return;
    }

    verifyPhoneCodeButton.disabled = true;
    phoneCodeStatus.textContent = "Verifying...";
    phoneCodeStatus.classList.remove("error", "success");

    try {
      await postJson("/api/phone/verify-code", { code });
      profileExtras.phoneVerified = true;
      saveProfileExtras();
      setStatus(phoneCodeStatus, "✓ Phone verified successfully!", true);
      sendPhoneCodeButton.textContent = "✓ Verified";
      sendPhoneCodeButton.disabled = true;
      phoneCodeInputContainer.style.display = "none";
    } catch (error) {
      setStatus(phoneCodeStatus, error.message, false);
    } finally {
      verifyPhoneCodeButton.disabled = false;
    }
  });
  */

}

function renderBadgesAll() {
  const grid = document.getElementById("badges-all-grid");
  if (!grid) return;

  const visitedIds = Array.from(completedQuestIds);
  const visitedPlaces = visitedIds
    .map((id) => getAllPlaces().find((p) => p.id === id))
    .filter(Boolean);

  if (visitedPlaces.length === 0) {
    grid.innerHTML = "<p style='padding:20px;color:var(--muted)'>No visited locations yet. Complete quests to earn badges.</p>";
    return;
  }

  grid.innerHTML = `
    <div class="badges-all-grid-inner">
      ${visitedPlaces.map((place) => {
        const entry = profileExtras.notesByPlaceId?.[place.id] || {};
        const dateLabel = entry.visitedOn
          ? new Date(entry.visitedOn).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
          : "Capture pending";
        const distLabel = Number.isFinite(entry.captureDistanceMeters)
          ? `${entry.captureDistanceMeters}m from target`
          : entry.captureMethod === "photo-only"
            ? "Photo-only capture"
            : "Manual completion";
        return `
          <article class="badge-card compact-badge${entry.capturePhotoDataUrl ? " has-photo" : ""}">
            <div class="badge-copy">
              <span class="section-kicker">Visited location</span>
              <h3>${escapeHtml(place.name)}</h3>
              <p>${escapeHtml(place.city)}, ${escapeHtml(place.country)}</p>
              <small class="badge-meta">Visited: ${escapeHtml(dateLabel)}</small>
              <small class="badge-meta">${escapeHtml(distLabel)}</small>
            </div>
            ${entry.capturePhotoDataUrl
              ? `<img class="badge-photo" src="${entry.capturePhotoDataUrl}" alt="Visit photo for ${escapeHtml(place.name)}">`
              : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderWishlist() {
  if (!currentUser) {
    wishlistList.innerHTML = "<p>Log in to start building your wishlist.</p>";
    return;
  }

  if (wishlistEntries.length === 0) {
    wishlistList.innerHTML = "<p>No wishlist items yet. Open a place and tap Add to wishlist.</p>";
    return;
  }

  wishlistList.innerHTML = wishlistEntries
    .map(
      (entry) => `
        <article class="wishlist-entry" data-place-id="${escapeHtml(entry.placeId)}">
          <div>
            <h3>${escapeHtml(entry.name)}</h3>
            <p>${escapeHtml(entry.city)}, ${escapeHtml(entry.state)}, ${escapeHtml(entry.country)}</p>
            <small>${escapeHtml(entry.type)}</small>
          </div>
          <div class="wishlist-actions">
            <button type="button" class="secondary-action" data-action="open">Open</button>
            <button type="button" class="text-action" data-action="remove">Remove</button>
          </div>
        </article>
      `
    )
    .join("");

  wishlistList.querySelectorAll(".wishlist-entry").forEach((element) => {
    const placeId = element.getAttribute("data-place-id");
    const openButton = element.querySelector('button[data-action="open"]');
    const removeButton = element.querySelector('button[data-action="remove"]');

    openButton?.addEventListener("click", () => {
      selectedPlaceId = placeId || "";
      setAppSection("explore");
      renderApp();
    });

    removeButton?.addEventListener("click", async () => {
      try {
        const data = await fetchJson("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId })
        });
        wishlistEntries = data.wishlistEntries || [];
        renderApp();
      } catch (error) {
        apiStatus.textContent = error.message;
      }
    });
  });
}

function renderBookingDestination() {
  const place = getSelectedPlace();

  if (!place) {
    bookingDestination.textContent = "Select a place to build booking searches.";
    return;
  }

  bookingDestination.textContent = `Destination: ${place.name}, ${place.city}.`;

  if (activeBookingPlaceId !== place.id) {
    activeBookingPlaceId = place.id;
    bookingResults.innerHTML =
      "<p>Choose dates to compare routes, stays, and packages for the selected place.</p>";
  }
}

function getBookingOptions(place, tripDetails) {
  const destination = getSelectedDestinationLabel();
  const destinationAirport = destinationAirportCache.get(place.id);
  const flightDestination = destinationAirport?.iata || destination;
  const flightOrigin = tripDetails.origin || userAirport?.iata || "nearest airport";
  const flightQuery = `flights from ${flightOrigin} to ${flightDestination} ${tripDetails.departDate}`;
  const packageQuery = `${destination} flights hotels ${tripDetails.departDate}`;

  return [
    {
      type: "Flights",
      title: "Compare flight routes",
      description: `${flightOrigin} to ${flightDestination}`,
      url: buildUrl("https://www.google.com/travel/flights", {
        q: flightQuery
      }),
      meta: tripDetails.returnDate
        ? `${tripDetails.departDate} to ${tripDetails.returnDate}`
        : `Depart ${tripDetails.departDate}`
    },
    {
      type: "Hotels",
      title: "Check available stays",
      description: `${tripDetails.travelers} traveler${
        tripDetails.travelers === "1" ? "" : "s"
      } near ${place.name}`,
      url: getBookingComUrl(place, tripDetails),
      meta: tripDetails.returnDate ? "Dates included" : "Add return date for exact stay prices"
    },
    {
      type: "Packages",
      title: "Build a flight and hotel search",
      description: `${destination} trip bundles`,
      url: buildUrl("https://www.google.com/search", {
        q: packageQuery
      }),
      meta: "Compare package providers"
    }
  ];
}

function renderBookingResults(options) {
  bookingResults.innerHTML = options
    .map(
      (option) => `
        <article class="booking-card">
          <span>${option.type}</span>
          <h3>${option.title}</h3>
          <p>${option.description}</p>
          <small>${option.meta}</small>
          <a href="${option.url}" target="_blank" rel="noreferrer">Open live prices</a>
        </article>
      `
    )
    .join("");
}

function searchBookingOptions(event) {
  event.preventDefault();

  const place = getSelectedPlace();

  if (!place) {
    bookingResults.innerHTML = "<p>Select a destination before checking booking options.</p>";
    return;
  }

  const tripDetails = {
    origin: originInput.value.trim(),
    departDate: departDateInput.value,
    returnDate: returnDateInput.value,
    travelers: travelersInput.value
  };

  if (!tripDetails.departDate) {
    bookingResults.innerHTML = "<p>Add a departure date to continue.</p>";
    return;
  }

  if (!tripDetails.origin && !userAirport) {
    detectUserNearestAirport();
    bookingResults.innerHTML =
      "<p>Add an origin airport or allow location access so the app can find your nearest airport.</p>";
    return;
  }

  if (tripDetails.returnDate && tripDetails.returnDate < tripDetails.departDate) {
    bookingResults.innerHTML = "<p>Return date must be after the departure date.</p>";
    return;
  }

  renderBookingResults(getBookingOptions(place, tripDetails));
}

function getApiPlaceName(result) {
  const displayParts = result.display_name.split(",").map((part) => part.trim());
  return result.name || displayParts[0] || "Live location";
}

function getApiPlaceType(result) {
  return slugToLabel(result.type || result.class || "Location");
}

function getResultCoordinates(result) {
  const lat = Number(result.lat);
  const lon = Number(result.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon };
}

function isBroadLocationResult(result) {
  const broadClasses = ["boundary", "place"];
  const broadTypes = [
    "administrative",
    "city",
    "town",
    "village",
    "municipality",
    "borough",
    "suburb",
    "county",
    "state",
    "province",
    "region",
    "country"
  ];

  return broadClasses.includes(result.class) || broadTypes.includes(result.type);
}

function buildAttractionQuery(lat, lon) {
  return `
    [out:json][timeout:25];
    (
      nwr(around:${ATTRACTION_SEARCH_RADIUS_METERS},${lat},${lon})["name"]["tourism"~"^(attraction|museum|gallery|viewpoint|theme_park|zoo|aquarium)$"];
      nwr(around:${ATTRACTION_SEARCH_RADIUS_METERS},${lat},${lon})["name"]["historic"~"^(castle|monument|memorial|archaeological_site|ruins)$"];
      nwr(around:${ATTRACTION_SEARCH_RADIUS_METERS},${lat},${lon})["name"]["amenity"~"^(arts_centre|theatre)$"];
    );
    out tags center ${ATTRACTION_FETCH_LIMIT};
  `;
}

function getAttractionCoords(element) {
  const lat = Number(element.lat || element.center?.lat);
  const lon = Number(element.lon || element.center?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon };
}

function slugToLabel(s) { return s.replace(/_/g, " "); }

function getAttractionType(tags) {
  return slugToLabel(tags.tourism || tags.historic || tags.amenity || "Attraction");
}

function getAttractionSummary(name, type, context) {
  return `${name} is listed in OpenStreetMap as ${type} near ${context.city}. Use the map link for live directions and nearby details.`;
}

function getAttractionScore(element) {
  const tags = element.tags || {};
  let score = 0;

  if (tags.wikidata) {
    score += 8;
  }

  if (tags.wikipedia) {
    score += 8;
  }

  if (tags.website) {
    score += 3;
  }

  if (tags.tourism === "attraction") {
    score += 5;
  }

  if (["museum", "gallery", "viewpoint", "zoo", "aquarium", "theme_park"].includes(tags.tourism)) {
    score += 4;
  }

  if (["castle", "monument", "archaeological_site", "ruins"].includes(tags.historic)) {
    score += 5;
  }

  if (element.type === "relation" || element.type === "way") {
    score += 2;
  }

  return score;
}

function normalizeAttraction(element, context) {
  const tags = element.tags || {};
  const coords = getAttractionCoords(element);
  const name = tags.name;
  const type = getAttractionType(tags);

  return {
    id: `osm-attraction-${element.type}-${element.id}`,
    name,
    country: context.country,
    state: context.state,
    city: context.city,
    type: type.charAt(0).toUpperCase() + type.slice(1),
    lat: coords?.lat,
    lon: coords?.lon,
    imageQuery: `${name} ${context.city}`,
    summary: getAttractionSummary(name, type, context),
    bestTime: "Check current opening hours",
    source: "OpenStreetMap Overpass",
    tags: [type, context.city, context.country, "openstreetmap", "attraction"],
    transport: [
      "Open Google Maps for live directions",
      "Check public transport and walking routes near the destination",
      "Use local taxi or ride options based on distance and timing"
    ],
    ticketing: [
      {
        service: "Google Maps",
        label: "Open exact location",
        url: getMapUrl({
          name,
          city: context.city,
          state: context.state,
          country: context.country,
          lat: coords?.lat,
          lon: coords?.lon
        })
      },
      {
        service: "Booking.com",
        label: "Nearby stays",
        url: "https://www.booking.com/"
      },
      {
        service: "Google Search",
        label: "Tickets and hours",
        url: buildUrl("https://www.google.com/search", {
          q: `${name} ${context.city} tickets opening hours`
        })
      }
    ],
    challenge: `Visit ${name}, confirm one real-world detail, and mark the quest complete.`,
    underdog: {
      name: `Nearby places around ${name}`,
      distance: "Use live map results",
      transport: "Open Google Maps from the travel actions above",
      description:
        "Use live map data to find quieter places, cafes, parks, or smaller attractions nearby."
    }
  };
}

function getSearchContext(result) {
  const address = result.address || {};
  const name = getApiPlaceName(result);

  return {
    city:
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.county ||
      name,
    state: address.state || address.region || address.county || "Unlisted state",
    country: address.country || "Unlisted country"
  };
}

async function fetchAttractionsForResult(result) {
  const coords = getResultCoordinates(result);

  if (!coords || !isBroadLocationResult(result)) {
    return [];
  }

  const response = await fetch(OVERPASS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: `data=${encodeURIComponent(buildAttractionQuery(coords.lat, coords.lon))}`
  });

  if (!response.ok) {
    throw new Error("Attraction API request failed");
  }

  const data = await response.json();
  const context = getSearchContext(result);
  const seenNames = new Set();

  return (data.elements || [])
    .filter((element) => element.tags?.name && getAttractionCoords(element))
    .sort((a, b) => getAttractionScore(b) - getAttractionScore(a))
    .map((element) => normalizeAttraction(element, context))
    .filter((place) => {
      const key = place.name.toLowerCase();

      if (seenNames.has(key)) {
        return false;
      }

      seenNames.add(key);
      return true;
    })
    .slice(0, ATTRACTION_RESULT_LIMIT);
}

function normalizeApiPlace(result) {
  const address = result.address || {};
  const name = getApiPlaceName(result);
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.county ||
    "Nearby area";
  const state = address.state || address.region || address.county || "Unlisted state";
  const country = address.country || "Unlisted country";
  const type = getApiPlaceType(result);

  return {
    id: `osm-${result.osm_type}-${result.osm_id}`,
    name,
    country,
    state,
    city,
    type,
    lat: result.lat,
    lon: result.lon,
    imageQuery: `${name} ${city} ${country}`,
    summary: `${name} is a live OpenStreetMap location result in ${city}. Tern-Around can use it as a planning stop while richer travel content is added later.`,
    bestTime: "Plan around daylight",
    source: "OpenStreetMap Nominatim",
    tags: [type, city, state, country, "openstreetmap"],
    transport: [
      "Use maps for the fastest current route",
      "Check local public transport near the destination",
      "Use cab, walk, or bike options based on distance"
    ],
    ticketing: [
      {
        service: "Google Maps",
        label: "Open route search",
        url: `https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`
      },
      {
        service: "Booking.com",
        label: "Nearby stays",
        url: "https://www.booking.com/"
      },
      {
        service: "Expedia",
        label: "Flights and hotels",
        url: "https://www.expedia.com/"
      }
    ],
    challenge: `Reach ${name}, confirm one real-world detail around you, and mark the quest complete.`,
    underdog: {
      name: `Explore nearby places around ${name}`,
      distance: "Use live map results",
      transport: "Open Google Maps from the travel actions above",
      description:
        "This live result does not include a verified hidden spot yet. Use the map link for nearby places from live map data."
    }
  };
}

async function searchLiveLocations() {
  const query = searchInput.value.trim();
  const scopedQuery = [query, stateFilter.value, countryFilter.value].filter(Boolean).join(", ");

  if (query.length < 3) {
    apiStatus.textContent = "Type at least 3 characters before live search.";
    return;
  }

  const now = Date.now();
  const waitMs = Math.max(0, 1100 - (now - lastApiRequestAt));

  apiSearchButton.disabled = true;
  apiStatus.textContent = waitMs > 0 ? "Waiting for API rate limit..." : "Searching live locations...";

  window.setTimeout(async () => {
    try {
      const params = new URLSearchParams({
        q: scopedQuery,
        format: "jsonv2",
        addressdetails: "1",
        limit: "6",
        "accept-language": "en"
      });

      lastApiRequestAt = Date.now();
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);

      if (!response.ok) {
        throw new Error("Location API request failed");
      }

      const results = await response.json();
      const locationPlaces = results.map(normalizeApiPlace);
      let attractionPlaces = [];

      if (results[0]) {
        try {
          attractionPlaces = await fetchAttractionsForResult(results[0]);
        } catch (error) {
          attractionPlaces = [];
        }
      }

      apiPlaces = [
        ...locationPlaces.slice(0, 1),
        ...attractionPlaces,
        ...locationPlaces.slice(1)
      ];

      if (apiPlaces.length > 0) {
        selectedPlaceId = attractionPlaces[0]?.id || apiPlaces[0].id;
        apiStatus.textContent =
          attractionPlaces.length > 0
            ? `${attractionPlaces.length} nearby attraction${
                attractionPlaces.length === 1 ? "" : "s"
              } loaded with location details from OpenStreetMap.`
            : `${apiPlaces.length} live location${
                apiPlaces.length === 1 ? "" : "s"
              } loaded from OpenStreetMap.`;
      } else {
        apiStatus.textContent = "No live locations found. Try a broader search.";
      }

      renderApp();
    } catch (error) {
      apiStatus.textContent =
        "Live location search failed. The curated places are still available.";
    } finally {
      apiSearchButton.disabled = false;
    }
  }, waitMs);
}

function renderApp() {
  setAppSection(activeAppSection);
  renderUser();
  renderFilters();
  renderPlaceList();
  renderDetailPanel();
  renderProfileDetails();
  renderWishlist();
  renderBookingDestination();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.textContent = "Signing in...";
  try {
    await postJson("/api/login", {
      login: loginIdentifierInput.value.trim(),
      password: loginPasswordInput.value
    });
    loginStatus.textContent = "";
    await loadBootstrapData();
  } catch (error) {
    if (error.payload?.requiresVerification && error.payload?.email) {
      pendingVerificationEmail = error.payload.email;
      verifyEmailInput.value = pendingVerificationEmail;
      verifyStatus.textContent = "Email is not verified yet. Enter the code sent to your inbox.";
      loginStatus.textContent = "";
      showAuthScreen("verify");
      return;
    }
    loginStatus.textContent = error.message;
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupStatus.textContent = "Creating account...";
  try {
    const data = await postJson("/api/signup", {
      username: signupUsernameInput.value.trim(),
      email: signupEmailInput.value.trim(),
      password: signupPasswordInput.value
    });
    pendingVerificationEmail = data.email || signupEmailInput.value.trim().toLowerCase();
    verifyEmailInput.value = pendingVerificationEmail;
    verifyCodeInput.value = "";
    signupStatus.textContent = "";
    verifyStatus.textContent = data.message || "Verification code sent. Check your email.";
    showAuthScreen("verify");
  } catch (error) {
    signupStatus.textContent = error.message;
  }
});

verifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  verifyStatus.textContent = "Verifying...";
  try {
    await postJson("/api/verify-email", {
      email: verifyEmailInput.value.trim(),
      code: verifyCodeInput.value.trim()
    });
    verifyStatus.textContent = "";
    await loadBootstrapData();
  } catch (error) {
    verifyStatus.textContent = error.message;
  }
});

resendCodeButton.addEventListener("click", async () => {
  const email = verifyEmailInput.value.trim() || pendingVerificationEmail;
  if (!email) {
    verifyStatus.textContent = "Enter your email to resend the verification code.";
    return;
  }
  verifyStatus.textContent = "Sending a new code...";
  try {
    const data = await postJson("/api/resend-verification", { email });
    verifyStatus.textContent = data.message || "Verification code sent.";
  } catch (error) {
    verifyStatus.textContent = error.message;
  }
});

goSignupButton.addEventListener("click", () => { clearAuthStatus(); showAuthScreen("signup"); });
goLoginButton.addEventListener("click",  () => { clearAuthStatus(); showAuthScreen("login");  });

verifyBackLoginButton.addEventListener("click", () => {
  verifyStatus.textContent = "";
  showAuthScreen("login");
});

async function handleLogout() {
  try {
    await fetchJson("/api/logout", {
      method: "POST"
    });
  } catch (error) {
    // Continue with the local sign-out flow even if the backend is unreachable.
  }

  currentUser = null;
  completedQuestIds = new Set();
  backendPlaces = [];
  apiPlaces = [];
  appView.classList.add("is-hidden");
  showAuthScreen("login");
  loginForm.reset();
  signupForm.reset();
  verifyForm.reset();
  pendingVerificationEmail = "";
  wishlistEntries = [];
  activeAppSection = "explore";
  loginStatus.textContent = "";
  signupStatus.textContent = "";
  verifyStatus.textContent = "";
  profileExtras = { ...BLANK_PROFILE_EXTRAS, notesByPlaceId: {} };
  renderApp();
}

const logoutModal = document.getElementById("logout-modal");

function showLogoutModal() {
  logoutModal?.classList.remove("is-hidden");
}
function hideLogoutModal() {
  logoutModal?.classList.add("is-hidden");
}

profileLogoutButton?.addEventListener("click", showLogoutModal);

document.getElementById("logout-cancel-btn")?.addEventListener("click", hideLogoutModal);

// Close on backdrop click
logoutModal?.addEventListener("click", (e) => {
  if (e.target === logoutModal) hideLogoutModal();
});

document.getElementById("logout-confirm-btn")?.addEventListener("click", () => {
  hideLogoutModal();
  handleLogout();
});

navExploreButton.addEventListener("click", () => {
  setAppSection("explore");
});

openProfileButton?.addEventListener("click", () => {
  setAppSection("profile");
  renderProfileDetails();
});

document.querySelector("#close-profile-button")?.addEventListener("click", () => {
  setAppSection("explore");
});

navWishlistButton.addEventListener("click", () => {
  setAppSection("wishlist");
  renderWishlist();
});

searchInput.addEventListener("input", renderApp);
apiSearchButton.addEventListener("click", searchLiveLocations);
bookingForm.addEventListener("submit", searchBookingOptions);
countryFilter.addEventListener("change", () => {
  stateFilter.value = "";
  renderApp();
});
stateFilter.addEventListener("change", renderApp);
typeFilter.addEventListener("change", renderApp);

document.getElementById("badges-back-button")?.addEventListener("click", () => {
  setAppSection("profile");
  renderProfileDetails();
});

renderApp();
loadBootstrapData();
