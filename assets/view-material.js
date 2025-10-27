const materials = JSON.parse(localStorage.getItem("tgMaterials")) || [];
const list = document.getElementById("materialsList");
const viewer = document.getElementById("pdfViewer");

function loadMaterials() {
  if (materials.length === 0) {
    list.innerHTML = "<p>No materials uploaded yet.</p>";
    return;
  }

  materials.forEach(m => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.textContent = m.title;
    div.onclick = () => viewPDF(m.link);
    list.appendChild(div);
  });
}

function viewPDF(link) {
  viewer.innerHTML = `<iframe src="${link}" frameborder="0"></iframe>`;
}

loadMaterials();
