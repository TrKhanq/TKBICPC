/* ================= DATA ================= */

const studyPlan = Array.from({ length: 84 }, (_, i) => ({
  day: i + 1,
  title: `Ngày ${i + 1}`,
  topics: [
    "Học lý thuyết",
    "Xem ví dụ",
    "Làm bài tập"
  ],
  practice: "Giải 1–2 bài trên Codeforces",
  links: [
    {
      name: "Codeforces",
      url: "https://codeforces.com/problemset"
    }
  ]
}));

/* ================= RENDER CALENDAR ================= */

const calendar = document.getElementById("calendar");

studyPlan.forEach(d => {
  const div = document.createElement("div");
  div.className = "day";
  div.textContent = "Day " + d.day;
  div.dataset.day = d.day;

  if (localStorage.getItem("day_" + d.day) === "done") {
    div.classList.add("done");
  }

  calendar.appendChild(div);
});

/* ================= MODAL ================= */

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const topicList = document.getElementById("topicList");
const practice = document.getElementById("practice");
const linksBox = document.getElementById("links");
let currentDay = null;

document.querySelectorAll(".day").forEach(dayEl => {
  dayEl.onclick = () => {
    const dayNum = Number(dayEl.dataset.day);
    const data = studyPlan[dayNum - 1];
    currentDay = dayNum;

    modalTitle.textContent = `Day ${data.day}: ${data.title}`;

    topicList.innerHTML = "";
    data.topics.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      topicList.appendChild(li);
    });

    practice.textContent = "📝 " + data.practice;

    linksBox.innerHTML = "";
    data.links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.url;
      a.textContent = "🔗 " + l.name;
      a.target = "_blank";
      linksBox.appendChild(a);
    });

    modal.style.display = "flex";
  };
});

document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
};

/* ================= DONE + PROGRESS ================= */

document.getElementById("doneBtn").onclick = () => {
  localStorage.setItem("day_" + currentDay, "done");
  document
    .querySelector(`.day[data-day="${currentDay}"]`)
    .classList.add("done");

  modal.style.display = "none";
  updateProgress();
};

function updateProgress() {
  let done = 0;
  for (let i = 1; i <= 84; i++) {
    if (localStorage.getItem("day_" + i) === "done") done++;
  }
  const percent = Math.round((done / 84) * 100);
  document.getElementById("progressText").textContent =
    `${done} / 84 ngày (${percent}%)`;
  document.getElementById("progressFill").style.width = percent + "%";
}

updateProgress();

/* ================= THEME ================= */

const themeBtn = document.getElementById("themeBtn");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ================= NOTIFICATION ================= */

document.getElementById("notifyBtn").onclick = async () => {
  const p = await Notification.requestPermission();
  if (p === "granted") {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification("📘 ICPC", {
        body: "Đến giờ học rồi!",
        icon: "icons/icon-192.png"
      });
    });
  }
};

/* ================= SERVICE WORKER ================= */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
