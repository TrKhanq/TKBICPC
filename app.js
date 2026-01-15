const app = document.getElementById("app");
let total = 0, done = 0;

schedule.forEach((week, wi) => {
  const w = document.createElement("div");
  w.className = "week";
  w.innerHTML = `<h2>${week.week}</h2>`;
  const d = document.createElement("div");
  d.className = "days";

  week.days.forEach((day, di) => {
    total++;
    const key = `w${wi}d${di}`;
    const checked = localStorage.getItem(key) === "true";
    if (checked) done++;

    const label = document.createElement("label");
    label.className = "day" + (checked ? " done" : "");
    label.innerHTML = `<input type="checkbox" ${checked?"checked":""}> ${day}`;

    label.querySelector("input").onchange = e => {
      localStorage.setItem(key, e.target.checked);
      label.classList.toggle("done");
      updateProgress();
    };

    d.appendChild(label);
  });

  w.appendChild(d);
  app.appendChild(w);
});

function updateProgress() {
  done = [...document.querySelectorAll("input")]
    .filter(cb => cb.checked).length;
  const percent = Math.round(done / total * 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = percent + "%";
}
updateProgress();

/* theme */
document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};
if (localStorage.getItem("theme") === "true")
  document.body.classList.add("dark");

/* register PWA */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}const notifyBtn = document.getElementById("notifyBtn");

notifyBtn.onclick = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("📘 Đến giờ học ICPC rồi!");
    localStorage.setItem("notify", "true");
  } else {
    alert("Bạn chưa cho phép thông báo 😢");
  }
};
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("✅ SW registered"))
    .catch(err => console.error("❌ SW error", err));
}
document.getElementById("notifyBtn").onclick = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification("📘 ICPC", {
        body: "Đến giờ học ICPC rồi!",
        icon: "icons/icon-192.png",
        badge: "icons/icon-192.png"
      });
    });
  }
};
