document.addEventListener("DOMContentLoaded", () => {
  const layout = document.getElementById("layout");
  const sidebar = document.getElementById("sidebar");

  if (!layout || !sidebar) {
    console.error("Missing #layout or #sidebar in HTML");
    return;
  }

  // Restore last state
  const saved = localStorage.getItem("sidebarState");
  if (saved === "collapsed") layout.classList.add("is-collapsed");

  // Toggle on sidebar click (anywhere)
  sidebar.addEventListener("click", () => {
    layout.classList.toggle("is-collapsed");
    localStorage.setItem(
      "sidebarState",
      layout.classList.contains("is-collapsed") ? "collapsed" : "open"
    );
  });

  // ===== Export CSV =====
  const exportBtn = document.getElementById("exportBtn");
  const tbody = document.getElementById("motionsTbody");

  function toCSV() {
    const rows = [["Video Timestamp", "Movement Detected"]];
    [...tbody.querySelectorAll("tr")].forEach(tr => {
      const tds = tr.querySelectorAll("td");
      rows.push([tds[0].innerText.trim(), tds[1].innerText.trim()]);
    });

    return rows.map(r =>
      r.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")
    ).join("\n");
  }

  function downloadFile(filename, content, mime = "text/csv;charset=utf-8;") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  exportBtn?.addEventListener("click", (e) => {
    // عشان لو ضغطتي زر داخل السايدبار بالغلط ما يقلبه
    e.stopPropagation();
    downloadFile("recorded_motions.csv", toCSV());
  });
});