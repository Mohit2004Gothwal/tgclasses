let materials = JSON.parse(localStorage.getItem("tgMaterials")) || [];

function addMaterial() {
  const title = document.getElementById("pdfTitle").value.trim();
  const link = document.getElementById("pdfLink").value.trim();
  const file = document.getElementById("pdfFile").files[0];

  if (!title) return alert("Enter a material title");

  if (link) {
    materials.push({ title, link: formatLink(link) });
    save();
    alert("Material added successfully!");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      materials.push({ title, link: e.target.result });
      save();
      alert("PDF uploaded successfully!");
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a file or add a link");
  }
}

function formatLink(link) {
  if (link.includes("drive.google.com")) {
    if (link.includes("/view")) link = link.replace("/view", "/preview");
  }
  return link;
}

function save() {
  localStorage.setItem("tgMaterials", JSON.stringify(materials));
  renderMaterials();
  document.getElementById("pdfTitle").value = "";
  document.getElementById("pdfLink").value = "";
  document.getElementById("pdfFile").value = "";
}

function renderMaterials() {
  const grid = document.getElementById("materialsGrid");
  grid.innerHTML = "";
  materials.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${m.title}</h4>
      <a href="${m.link}" target="_blank">View / Download</a>
      <button onclick="deleteMaterial(${i})">Delete</button>
    `;
    grid.appendChild(card);
  });
}

function deleteMaterial(i) {
  if (confirm("Delete this material?")) {
    materials.splice(i, 1);
    save();
  }
}

renderMaterials();
