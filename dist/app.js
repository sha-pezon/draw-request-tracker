const draws = [
  {
    id: "DR-004",
    contractor: "Northline Framing",
    project: "Maple Ridge Renovation",
    period: "Jul 1 - Jul 14",
    status: "attention",
    readiness: 78,
    requested: 84200,
    approvedBudget: 91000,
    completed: 86,
    holdbackTotal: 9100,
    holdbackEligible: 6200,
    inspection: "Scheduled",
    update: "Second-floor framing substantially complete. Stair blocking and west shear wall revisions pending.",
    requirements: [
      ["Contractor invoice", true, "Invoice #NF-2214 received"],
      ["Progress photos", true, "18 tagged photos matched to framing lines"],
      ["Inspection report", false, "Framing inspection scheduled for Jul 16"],
      ["Conditional lien waiver", false, "Requested from contractor"],
      ["eBudget line match", true, "Line 03-120 Framing"]
    ],
    lines: [
      ["03-120 Framing labor", 52000, 54800],
      ["03-125 Framing materials", 39000, 29400]
    ],
    photos: [
      ["Second-floor joists", "18 photos", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"],
      ["Stair blocking", "Needs closeout shot", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"]
    ],
    followUps: [
      ["Obtain inspection pass", "Required before lender submission"],
      ["Collect conditional lien waiver", "Package is otherwise complete"]
    ]
  },
  {
    id: "DR-005",
    contractor: "BrightPath Electrical",
    project: "Maple Ridge Renovation",
    period: "Jul 8 - Jul 14",
    status: "ready",
    readiness: 96,
    requested: 37650,
    approvedBudget: 41000,
    completed: 92,
    holdbackTotal: 4100,
    holdbackEligible: 3350,
    inspection: "Passed",
    update: "Rough-in complete at kitchen, utility, primary suite, and exterior service panel.",
    requirements: [
      ["Contractor invoice", true, "Invoice #BPE-778 received"],
      ["Progress photos", true, "Photos cover each inspected area"],
      ["Inspection report", true, "Rough electrical passed Jul 12"],
      ["Conditional lien waiver", true, "Signed waiver attached"],
      ["eBudget line match", true, "Line 16-210 Electrical rough-in"]
    ],
    lines: [
      ["16-210 Electrical rough-in", 41000, 37650]
    ],
    photos: [
      ["Service panel", "12 photos", "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"],
      ["Kitchen rough-in", "9 photos", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"]
    ],
    followUps: [
      ["Submit with draw package", "All lender requirements are satisfied"]
    ]
  },
  {
    id: "DR-006",
    contractor: "Stone & Slate Masonry",
    project: "Maple Ridge Renovation",
    period: "Jun 24 - Jul 14",
    status: "blocked",
    readiness: 42,
    requested: 61200,
    approvedBudget: 45500,
    completed: 68,
    holdbackTotal: 4550,
    holdbackEligible: 0,
    inspection: "Failed",
    update: "Exterior veneer started ahead of approved change order. Photos do not show flashing detail at openings.",
    requirements: [
      ["Contractor invoice", true, "Invoice #SSM-1042 received"],
      ["Progress photos", false, "Missing flashing and weep screed evidence"],
      ["Inspection report", false, "Failed exterior moisture barrier inspection"],
      ["Conditional lien waiver", false, "Not received"],
      ["eBudget line match", false, "Requested amount exceeds approved line"]
    ],
    lines: [
      ["04-310 Stone veneer", 45500, 61200]
    ],
    photos: [
      ["Front elevation", "5 photos", "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80"],
      ["Window returns", "Missing detail", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"]
    ],
    followUps: [
      ["Approve or reject change order", "Requested amount is $15,700 above the budget line"],
      ["Retake detail photos", "Lender requires visual evidence at openings"],
      ["Resolve inspection failure", "Holdback should remain unreleased"]
    ]
  },
  {
    id: "DR-007",
    contractor: "Clearwater Plumbing",
    project: "Maple Ridge Renovation",
    period: "Jul 5 - Jul 14",
    status: "attention",
    readiness: 70,
    requested: 29300,
    approvedBudget: 33200,
    completed: 74,
    holdbackTotal: 3320,
    holdbackEligible: 1900,
    inspection: "Partial pass",
    update: "Underground and first-floor rough plumbing accepted. Laundry wall correction remains open.",
    requirements: [
      ["Contractor invoice", true, "Invoice #CP-903 received"],
      ["Progress photos", false, "Laundry correction photo missing"],
      ["Inspection report", true, "Partial pass attached"],
      ["Conditional lien waiver", true, "Signed waiver attached"],
      ["eBudget line match", true, "Line 15-150 Plumbing rough-in"]
    ],
    lines: [
      ["15-150 Plumbing rough-in", 33200, 29300]
    ],
    photos: [
      ["Kitchen supply", "7 photos", "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"],
      ["Laundry wall", "Correction needed", "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80"]
    ],
    followUps: [
      ["Add laundry correction photo", "Needed to support partial release"],
      ["Confirm remaining scope", "Do not release full holdback yet"]
    ]
  }
];

const storageKey = "drawops-tracker-v2";
const accountKey = "drawops-account-v1";
const defaultProject = {
  projectName: "3606 Springer Street · Draw #4",
  submittedBudget: 92525,
  approvedAmount: 10773.77,
  inspectionFee: 250,
  netWireAmount: 10523.77,
  approvedDate: "2026-07-08",
  remainingBudget: 13319.14,
  nextDrawDate: "",
  reminderLeadDays: 3
};

let project = { ...defaultProject };
let activity = [];
let account = null;
let remoteReady = false;
let remoteSaveTimer = null;

const drawopsConfig = window.DRAWOPS_CONFIG || {};
const companyDomain = (drawopsConfig.companyDomain || "pezonproperties.com").toLowerCase();
const supabaseClient =
  drawopsConfig.supabaseUrl && drawopsConfig.supabaseAnonKey && window.supabase
    ? window.supabase.createClient(drawopsConfig.supabaseUrl, drawopsConfig.supabaseAnonKey)
    : null;

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved?.project) project = { ...defaultProject, ...saved.project };
  if (Array.isArray(saved?.draws)) {
    draws.splice(0, draws.length, ...saved.draws);
  }
  if (Array.isArray(saved?.activity)) activity = saved.activity;
  account = JSON.parse(localStorage.getItem(accountKey) || "null");
} catch {
  localStorage.removeItem(storageKey);
  localStorage.removeItem(accountKey);
}

if (!window.lucide) {
  const iconPaths = {
    "arrow-down-up": ["M12 3v18", "m8 7 4-4 4 4", "M4 17l4 4 4-4"],
    "bell-ring": ["M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9", "M10.3 21a2 2 0 0 0 3.4 0", "M4 2C2.8 3 2 4.5 2 6", "M22 6c0-1.5-.8-3-2-4"],
    "check": ["M20 6 9 17l-5-5"],
    "check-circle-2": ["M9 12l2 2 4-5", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
    "circle-alert": ["M12 8v5", "M12 16h.01", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
    "clipboard-check": ["M9 5h6", "M9 14l2 2 4-5", "M8 3h8v4H8z", "M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"],
    "copy": ["M8 8h11v11H8z", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"],
    "download": ["M12 3v12", "m7 10 5 5 5-5", "M5 21h14"],
    "file-check-2": ["M14 2v6h6", "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M9 15l2 2 4-5"],
    "flag": ["M5 22V4", "M5 4h11l-1.5 4L16 12H5"],
    "image": ["M4 5h16v14H4z", "m4 15 4-5 3 3 2-3 3 5", "M8 9h.01"],
    "layout-dashboard": ["M3 3h8v8H3z", "M13 3h8v5h-8z", "M13 10h8v11h-8z", "M3 13h8v8H3z"],
    "list-checks": ["M3 6l1.5 1.5L7 4", "M3 12l1.5 1.5L7 10", "M3 18l1.5 1.5L7 16", "M10 6h11", "M10 12h11", "M10 18h11"],
    "log-in": ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
    "mouse-pointer-click": ["M4 4l7 17 2-7 7-2z", "M14 4h6v6"],
    "octagon-alert": ["M8 2h8l6 6v8l-6 6H8l-6-6V8z", "M12 8v5", "M12 16h.01"],
    "plus": ["M12 5v14", "M5 12h14"],
    "rotate-ccw": ["M3 12a9 9 0 1 0 3-6.7", "M3 3v6h6"],
    "save": ["M5 3h14v18H5z", "M8 3v6h8V3", "M8 17h8"],
    "search": ["M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z", "m21 21-4.3-4.3"],
    "search-x": ["M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z", "m21 21-4.3-4.3", "m8 8 6 6", "m14 8-6 6"],
    "sparkles": ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M5 4v3", "M3.5 5.5h3", "M19 17v3", "M17.5 18.5h3"],
    "upload": ["M12 16V4", "m7 9 5-5 5 5", "M5 20h14"],
    "user": ["M20 21a8 8 0 0 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
    "user-plus": ["M16 21a6 6 0 0 0-12 0", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M19 8v6", "M16 11h6"],
    "users": ["M16 21a6 6 0 0 0-12 0", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21a5 5 0 0 0-5-5", "M17 3a3 3 0 0 1 0 6"],
    "wallet-cards": ["M4 7h16v12H4z", "M4 10h16", "M15 15h3"],
    "x": ["M18 6 6 18", "M6 6l12 12"]
  };

  window.lucide = {
    createIcons() {
      document.querySelectorAll("i[data-lucide]").forEach((placeholder) => {
        const name = placeholder.getAttribute("data-lucide");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");
        (iconPaths[name] || iconPaths["circle-alert"]).forEach((d) => {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", d);
          svg.appendChild(path);
        });
        placeholder.replaceWith(svg);
      });
    }
  };
}

let activeId = draws[0].id;
let filter = "all";
let sortHighFirst = true;
let activeView = "dashboard";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const stateLabels = {
  ready: "Ready",
  attention: "Needs docs",
  blocked: "Blocked"
};

const stateIcons = {
  ready: "check-circle-2",
  attention: "circle-alert",
  blocked: "octagon-alert"
};

function money(value) {
  return currency.format(value);
}

function moneyCents(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify({ project, draws, activity }, null, 2));
  if (remoteReady) scheduleRemoteSave();
}

function activeUser() {
  return account || { name: "Unknown user", email: "unknown@pezonproperties.com" };
}

function emailAllowed(email) {
  return String(email || "").toLowerCase().endsWith(`@${companyDomain}`);
}

function initials(name) {
  return (name || "User")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function recordActivity(action, target, detail = "") {
  const user = activeUser();
  activity.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    action,
    target,
    detail,
    userName: user.name,
    userEmail: user.email,
    timestamp: new Date().toISOString()
  });
  activity = activity.slice(0, 50);
  saveData();
  renderActivity();
  if (remoteReady) {
    supabaseClient
      .from("drawops_activity")
      .insert({
        action,
        target,
        detail,
        user_id: account?.id,
        user_name: user.name,
        user_email: user.email
      })
      .then(({ error }) => {
        if (error) console.warn("Activity sync failed", error.message);
      });
  }
}

function renderAccount() {
  const overlay = document.getElementById("loginOverlay");
  const label = document.getElementById("accountName");
  const loginCopy = document.querySelector(".login-card p:not(.eyebrow)");
  if (loginCopy) {
    loginCopy.textContent = supabaseClient
      ? `Use your @${companyDomain} email and password. New accounts need one email confirmation before first sign-in.`
      : `Use a Pezon Properties email to identify your edits and activity in this browser.`;
  }
  if (!account) {
    overlay.classList.add("active");
    label.textContent = "Sign in";
    return;
  }
  overlay.classList.remove("active");
  label.textContent = account.name;
}

function scheduleRemoteSave() {
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(syncRemoteState, 500);
}

async function syncRemoteState() {
  if (!remoteReady || !account) return;
  const { error } = await supabaseClient.from("drawops_state").upsert({
    id: "main",
    project,
    draws,
    updated_by: account.id,
    updated_at: new Date().toISOString()
  });
  if (error) console.warn("State sync failed", error.message);
}

async function loadRemoteData() {
  if (!supabaseClient || !account) return;
  const stateResult = await supabaseClient.from("drawops_state").select("project, draws").eq("id", "main").single();
  if (stateResult.data) {
    if (stateResult.data.project && Object.keys(stateResult.data.project).length) {
      project = { ...defaultProject, ...stateResult.data.project };
    }
    if (Array.isArray(stateResult.data.draws) && stateResult.data.draws.length) {
      draws.splice(0, draws.length, ...stateResult.data.draws);
      activeId = draws[0]?.id || activeId;
    }
  }

  const activityResult = await supabaseClient
    .from("drawops_activity")
    .select("id, action, target, detail, user_name, user_email, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (Array.isArray(activityResult.data)) {
    activity = activityResult.data.map((item) => ({
      id: item.id,
      action: item.action,
      target: item.target,
      detail: item.detail,
      userName: item.user_name,
      userEmail: item.user_email,
      timestamp: item.created_at
    }));
  }
  saveData();
}

async function upsertProfile(user) {
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || account?.name || user.email;
  account = {
    id: user.id,
    name: fullName,
    email: user.email,
    signedInAt: new Date().toISOString(),
    verified: true
  };
  localStorage.setItem(accountKey, JSON.stringify(account));
  await supabaseClient.from("drawops_profiles").upsert({
    user_id: user.id,
    email: user.email,
    full_name: fullName,
    last_seen_at: new Date().toISOString()
  });
}

async function hydrateSupabaseSession() {
  if (!supabaseClient) return;
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();
  const user = session?.user;
  if (!user) {
    account = null;
    localStorage.removeItem(accountKey);
    return;
  }
  if (!emailAllowed(user.email)) {
    await supabaseClient.auth.signOut();
    account = null;
    localStorage.removeItem(accountKey);
    return;
  }
  await upsertProfile(user);
  remoteReady = true;
  await loadRemoteData();
}

function renderActivity() {
  const list = document.getElementById("activityList");
  if (!activity.length) {
    list.innerHTML = `
      <div class="activity-item">
        <div class="activity-avatar">PP</div>
        <div class="activity-main">
          <strong>No edits recorded yet</strong>
          <span>Activity will show who changed the tracker and when.</span>
        </div>
        <div class="activity-time">Now</div>
      </div>
    `;
    return;
  }
  list.innerHTML = activity
    .slice(0, 6)
    .map((item) => {
      const when = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(item.timestamp));
      return `
        <div class="activity-item">
          <div class="activity-avatar">${initials(item.userName)}</div>
          <div class="activity-main">
            <strong>${item.action} · ${item.target}</strong>
            <span>${item.userName} (${item.userEmail})${item.detail ? ` · ${item.detail}` : ""}</span>
          </div>
          <div class="activity-time">${when}</div>
        </div>
      `;
    })
    .join("");
}

function updateProjectFromForm() {
  project = {
    ...project,
    projectName: document.getElementById("projectName").value.trim() || defaultProject.projectName,
    submittedBudget: Number(document.getElementById("submittedBudget").value || 0),
    approvedAmount: Number(document.getElementById("approvedAmount").value || 0),
    approvedDate: document.getElementById("approvedDate").value,
    remainingBudget: Number(document.getElementById("remainingBudget").value || 0),
    nextDrawDate: document.getElementById("nextDrawDate").value
  };
}

function renderProject() {
  document.getElementById("projectTitle").textContent = project.projectName;
  document.getElementById("submittedBudgetCard").textContent = moneyCents(project.submittedBudget);
  document.getElementById("approvedAmountCard").textContent = moneyCents(project.approvedAmount);
  document.getElementById("approvedDateCard").textContent = `Approved ${formatDate(project.approvedDate) || "date pending"}. Net wire after inspection fee: ${moneyCents(project.netWireAmount)}.`;
  document.getElementById("remainingBudgetCard").textContent = moneyCents(project.remainingBudget);
  document.getElementById("nextDrawCard").textContent = project.nextDrawDate ? formatDate(project.nextDrawDate) : "Pending SOW";
  document.getElementById("nextDrawNote").textContent = project.nextDrawDate
    ? "Reminder draft is ready. Submit only after invoices, photos, eBudget lines, and inspection status are current."
    : "Expected date should come from the executed contractor Scope of Work.";
  document.getElementById("notificationRule").textContent = project.nextDrawDate
    ? `Send the reminder ${project.reminderLeadDays} days before ${formatDate(project.nextDrawDate)} so the team can assemble invoices, photos, eBudget support, inspection status, and holdback balances.`
    : "Trigger the reminder when the executed SOW produces the next draw request date. Until that date is entered, keep the reminder inactive and flag this record for SOW follow-up.";
  const badge = document.getElementById("sowBadge");
  badge.className = `badge ${project.nextDrawDate ? "ready" : "attention"}`;
  badge.innerHTML = `<i data-lucide="${project.nextDrawDate ? "check-circle-2" : "file-check-2"}"></i>${project.nextDrawDate ? "Reminder ready" : "SOW date needed"}`;

  document.getElementById("projectName").value = project.projectName;
  document.getElementById("submittedBudget").value = project.submittedBudget;
  document.getElementById("approvedAmount").value = project.approvedAmount;
  document.getElementById("approvedDate").value = project.approvedDate;
  document.getElementById("remainingBudget").value = project.remainingBudget;
  document.getElementById("nextDrawDate").value = project.nextDrawDate;
}

function missingCount(draw) {
  return draw.requirements.filter((item) => !item[1]).length;
}

function holdbackRemaining(draw) {
  return Math.max(draw.holdbackTotal - draw.holdbackEligible, 0);
}

function renderMetrics(items) {
  document.getElementById("requestedMetric").textContent = money(
    items.reduce((sum, draw) => sum + draw.requested, 0)
  );
  document.getElementById("readyMetric").textContent = items.filter((draw) => draw.status === "ready").length;
  document.getElementById("missingMetric").textContent = items.reduce((sum, draw) => sum + missingCount(draw), 0);
  document.getElementById("holdbackMetric").textContent = money(
    items.reduce((sum, draw) => sum + holdbackRemaining(draw), 0)
  );
}

function matchesSearch(draw, term) {
  const haystack = [
    draw.id,
    draw.contractor,
    draw.project,
    draw.period,
    draw.inspection,
    draw.update,
    ...draw.requirements.flat(),
    ...draw.lines.flat(),
    ...draw.followUps.flat()
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

function filteredDraws() {
  const term = document.getElementById("searchInput").value.trim();
  return draws
    .filter((draw) => filter === "all" || draw.status === filter)
    .filter((draw) => !term || matchesSearch(draw, term))
    .sort((a, b) => (sortHighFirst ? b.readiness - a.readiness : a.readiness - b.readiness));
}

function renderList() {
  const items = filteredDraws();
  renderMetrics(items);
  const list = document.getElementById("drawList");
  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><i data-lucide="search-x"></i><h2>No matching draws</h2><p>Try a different status or search term.</p></div>`;
    lucide.createIcons();
    return;
  }

  items.forEach((draw) => {
    const card = document.createElement("button");
    card.className = `draw-card ${draw.id === activeId ? "active" : ""}`;
    card.type = "button";
    card.innerHTML = `
      <div class="draw-row-head">
        <div class="draw-title">
          <strong>${draw.id} · ${draw.contractor}</strong>
          <span>${draw.project} · ${draw.period}</span>
        </div>
        <span class="badge ${draw.status}"><i data-lucide="${stateIcons[draw.status]}"></i>${stateLabels[draw.status]}</span>
      </div>
      <p>${draw.update}</p>
      <div class="progress-bar" aria-label="Readiness ${draw.readiness}%"><span style="width:${draw.readiness}%"></span></div>
      <div class="draw-footer">
        <span><strong>${money(draw.requested)}</strong> Requested</span>
        <span><strong>${draw.readiness}%</strong> Readiness</span>
        <span><strong>${missingCount(draw)}</strong> Missing</span>
      </div>
    `;
    card.addEventListener("click", () => {
      activeId = draw.id;
      render();
    });
    list.appendChild(card);
  });
  lucide.createIcons();
}

function renderDetail() {
  const draw = draws.find((item) => item.id === activeId) || filteredDraws()[0];
  if (!draw) return;

  const overBudget = draw.requested - draw.approvedBudget;
  const eligibleRelease = Math.min(draw.requested, draw.approvedBudget) - holdbackRemaining(draw);
  const focusedTitle = {
    requirements: "Lender requirements",
    photos: "Photo evidence",
    followup: "Follow-up queue"
  }[activeView];
  const detail = document.getElementById("detailPanel");
  detail.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="eyebrow">${draw.id} ${focusedTitle ? "focused view" : "readiness review"}</p>
        <h2>${focusedTitle || draw.contractor}</h2>
        <div class="detail-meta">
          ${focusedTitle ? `<span>${draw.contractor}</span><span>·</span>` : ""}
          <span>${draw.project}</span>
          <span>·</span>
          <span>${draw.period}</span>
          <span>·</span>
          <span>${draw.inspection}</span>
        </div>
      </div>
      <span class="badge ${draw.status}"><i data-lucide="${stateIcons[draw.status]}"></i>${stateLabels[draw.status]}</span>
    </div>
    <div class="detail-content">
      ${renderDetailSections(draw, overBudget, eligibleRelease)}
    </div>
  `;
  lucide.createIcons();
}

function renderDetailSections(draw, overBudget, eligibleRelease) {
  if (activeView === "requirements") return renderRequirements(draw);
  if (activeView === "photos") return renderPhotos(draw);
  if (activeView === "followup") return renderFollowUps(draw);

  return `
    <div class="stat-grid">
      <div class="stat"><span>Requested</span><strong>${money(draw.requested)}</strong></div>
      <div class="stat"><span>Budget line total</span><strong>${money(draw.approvedBudget)}</strong></div>
      <div class="stat"><span>Completion update</span><strong>${draw.completed}%</strong></div>
      <div class="stat"><span>Holdback remaining</span><strong>${money(holdbackRemaining(draw))}</strong></div>
    </div>

    <div class="insight">
      <h3><i data-lucide="sparkles"></i>AI draw recommendation</h3>
      <p>${recommendation(draw, overBudget, eligibleRelease)}</p>
    </div>

    <div class="two-col">
      ${renderRequirements(draw)}
      ${renderBudget(draw, overBudget)}
    </div>

    ${renderPhotos(draw)}
    ${renderFollowUps(draw)}
  `;
}

function renderRequirements(draw) {
  return `
    <section class="section-box">
      <h3>Lender requirements</h3>
      <div class="requirement-list">
        ${draw.requirements
          .map(
            ([label, done, note]) => `
              <div class="requirement-row">
                <div class="requirement-label">
                  <strong>${label}</strong>
                  <span>${note}</span>
                </div>
                <span class="check ${done ? "done" : "missing"}"><i data-lucide="${done ? "check" : "x"}"></i></span>
              </div>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBudget(draw, overBudget) {
  return `
    <section class="section-box">
      <h3>Budget comparison</h3>
      <div class="budget-list">
        ${draw.lines
          .map(
            ([label, budget, requested]) => `
              <div class="line-item">
                <div class="line-title">
                  <strong>${label}</strong>
                  <span>Budget ${money(budget)}</span>
                </div>
                <div class="line-money">${money(requested)}</div>
              </div>`
          )
          .join("")}
      </div>
      <p class="budget-note">${
        overBudget > 0
          ? `Flag: requested amount is ${money(overBudget)} above approved budget.`
          : `Within approved budget with ${money(Math.abs(overBudget))} remaining before holdback.`
      }</p>
    </section>
  `;
}

function renderPhotos(draw) {
  return `
    <section class="section-box">
      <h3>Photo evidence</h3>
      <div class="photo-grid">
        ${draw.photos
          .map(
            ([title, label, url]) => `
              <div class="photo-tile" style="background-image:url('${url}')">
                <strong>${title}</strong>
                <span>${label}</span>
              </div>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFollowUps(draw) {
  return `
    <section class="section-box">
      <h3>Follow-up queue</h3>
      <div class="task-list">
        ${draw.followUps
          .map(
            ([title, note]) => `
              <div class="task">
                <span class="check ${draw.status === "ready" ? "done" : "missing"}"><i data-lucide="${
              draw.status === "ready" ? "check" : "flag"
            }"></i></span>
                <div>
                  <strong>${title}</strong>
                  <div class="task-note">${note}</div>
                </div>
              </div>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function recommendation(draw, overBudget, eligibleRelease) {
  if (draw.status === "ready") {
    return `Ready for draw submission. The request is supported by invoice, photos, inspection pass, lien waiver, and eBudget match. Estimated eligible release after holdback is ${money(Math.max(eligibleRelease, 0))}.`;
  }
  if (draw.status === "blocked") {
    return `Do not submit yet. The package has ${missingCount(draw)} missing lender requirements and a budget exception of ${money(Math.max(overBudget, 0))}. Keep holdback unreleased until the inspection and documentation issues are resolved.`;
  }
  return `Close, but not clean enough for submission. Resolve ${missingCount(draw)} missing requirement${missingCount(draw) === 1 ? "" : "s"} before sending to the lender. Holdback can be partially released once the open evidence is attached.`;
}

function bindEvents() {
  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      document.querySelectorAll(".nav-item[data-view]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      render();
      const target =
        activeView === "dashboard"
          ? document.getElementById("dashboardSection")
          : document.getElementById("drawsSection");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const error = document.getElementById("loginError");
    if (!emailAllowed(email)) {
      error.textContent = `Use an @${companyDomain} email address.`;
      return;
    }
    if (supabaseClient) {
      error.textContent = "Signing in...";
      supabaseClient.auth.signInWithPassword({ email, password }).then(({ error: signInError }) => {
        error.textContent = signInError ? signInError.message : "";
      });
      return;
    }
    account = { name, email, signedInAt: new Date().toISOString() };
    localStorage.setItem(accountKey, JSON.stringify(account));
    error.textContent = "";
    renderAccount();
    recordActivity("Signed in", "Account", email);
  });
  document.getElementById("accountButton").addEventListener("click", () => {
    document.getElementById("loginOverlay").classList.add("active");
    document.getElementById("loginName").value = account?.name || "";
    document.getElementById("loginEmail").value = account?.email || "";
  });
  document.getElementById("createAccount").addEventListener("click", async () => {
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const error = document.getElementById("loginError");
    if (!emailAllowed(email)) {
      error.textContent = `Use an @${companyDomain} email address.`;
      return;
    }
    if (password.length < 8) {
      error.textContent = "Use at least 8 characters for the password.";
      return;
    }
    if (!supabaseClient) {
      account = { name, email, signedInAt: new Date().toISOString() };
      localStorage.setItem(accountKey, JSON.stringify(account));
      renderAccount();
      recordActivity("Created local account", "Account", email);
      return;
    }
    error.textContent = "Creating account...";
    const { error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
        data: { full_name: name }
      }
    });
    error.textContent = signUpError
      ? signUpError.message
      : "Check your email once to confirm the account. After that, sign in here with your password.";
  });
  document.getElementById("searchInput").addEventListener("input", render);
  document.getElementById("projectForm").addEventListener("input", () => {
    updateProjectFromForm();
    renderProject();
    saveData();
    lucide.createIcons();
  });
  document.getElementById("saveLocal").addEventListener("click", () => {
    updateProjectFromForm();
    saveData();
    recordActivity("Saved changes", project.projectName, project.nextDrawDate ? `Next draw ${formatDate(project.nextDrawDate)}` : "SOW date still pending");
    flashButton("saveLocal", "Saved");
  });
  document.getElementById("exportData").addEventListener("click", () => {
    updateProjectFromForm();
    saveData();
    recordActivity("Exported data", "Tracker JSON");
    const payload = JSON.stringify({ project, draws, activity, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `drawops-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
  document.getElementById("importData").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const payload = JSON.parse(await file.text());
    project = { ...defaultProject, ...(payload.project || {}) };
    if (Array.isArray(payload.draws)) {
      draws.splice(0, draws.length, ...payload.draws);
      activeId = draws[0]?.id || "";
    }
    if (Array.isArray(payload.activity)) activity = payload.activity;
    recordActivity("Imported data", file.name);
    saveData();
    render();
    event.target.value = "";
  });
  document.getElementById("resetData").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    window.location.reload();
  });
  document.getElementById("newDraw").addEventListener("click", () => {
    const nextNumber = String(draws.length + 1).padStart(3, "0");
    const draw = {
      id: `DR-${nextNumber}`,
      contractor: "New contractor",
      project: project.projectName.replace(/ · .*/, ""),
      period: "Draft period",
      status: "attention",
      readiness: 25,
      requested: 0,
      approvedBudget: 0,
      completed: 0,
      holdbackTotal: 0,
      holdbackEligible: 0,
      inspection: "Pending",
      update: "Draft draw created. Add invoice, photos, eBudget line items, inspection status, and lien waiver details.",
      requirements: [
        ["Contractor invoice", false, "Needed"],
        ["Progress photos", false, "Needed"],
        ["Inspection report", false, "Needed"],
        ["Conditional lien waiver", false, "Needed"],
        ["eBudget line match", false, "Needed"]
      ],
      lines: [["Unassigned eBudget line", 0, 0]],
      photos: [["Evidence needed", "Upload or link photos", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"]],
      followUps: [["Complete draw package", "Add support before lender submission"]]
    };
    draws.unshift(draw);
    activeId = draw.id;
    recordActivity("Created draw", draw.id, draw.contractor);
    render();
  });
  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });
  document.getElementById("sortButton").addEventListener("click", () => {
    sortHighFirst = !sortHighFirst;
    renderList();
  });
  document.getElementById("copyReminder").addEventListener("click", async () => {
    updateProjectFromForm();
    const draft = [
      `Subject: ${project.projectName} - next draw request reminder`,
      "",
      project.nextDrawDate
        ? `Reminder: prepare the next draw request for ${project.projectName} by ${formatDate(project.nextDrawDate)}.`
        : `Reminder: prepare the next draw request for ${project.projectName} once the executed Ignite/contractor SOW milestone date is reached.`,
      "",
      "Current reference:",
      `- Submitted construction budget: ${moneyCents(project.submittedBudget)}`,
      `- Approved amount: ${moneyCents(project.approvedAmount)} on ${formatDate(project.approvedDate) || "date pending"}`,
      `- Remaining construction budget: ${moneyCents(project.remainingBudget)}`,
      "",
      "Before submission, confirm updated invoices, photos, eBudget line items, inspection status, and any holdback balance."
    ].join("\\n");
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(draft);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = draft;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    recordActivity("Copied reminder", project.projectName, project.nextDrawDate ? formatDate(project.nextDrawDate) : "Pending SOW date");
    flashButton("copyReminder", "Copied");
  });
}

function render() {
  const items = filteredDraws();
  if (items.length && !items.some((draw) => draw.id === activeId)) {
    activeId = items[0].id;
  }
  renderProject();
  renderAccount();
  renderActivity();
  renderList();
  renderDetail();
  lucide.createIcons();
}

function flashButton(id, label) {
  const button = document.getElementById(id);
  const span = button.querySelector("span");
  const original = span.textContent;
  span.textContent = label;
  setTimeout(() => {
    span.textContent = original;
  }, 1600);
}

async function boot() {
  bindEvents();
  await hydrateSupabaseSession();
  render();
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) return;
      if (!emailAllowed(session.user.email)) {
        await supabaseClient.auth.signOut();
        account = null;
        localStorage.removeItem(accountKey);
        render();
        return;
      }
      await upsertProfile(session.user);
      remoteReady = true;
      await loadRemoteData();
      render();
    });
  }
}

boot();
