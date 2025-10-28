// assets/materials.js
import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const titleInput = document.getElementById("pdfTitle");
const linkInput = document.getElementById("pdfLink");
const fileInput = document.getElementById("pdfFile");
const grid = document.getElementById("materialsGrid");

const materialsRef = collection(db, "materials");

async function addMaterial() {
  const title = titleInput.value.trim();
  const link = linkInput.value.trim();
  const file = fileInput.files[0];

  if (!title) return alert("Please enter a title.");

  let pdfURL = "";

  try {
    if (file) {
      const fileRef = ref(storage, `materials/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      pdfURL = await getDownloadURL(fileRef);
    } else if (link) {
      pdfURL = link;
    } else {
      return alert("Please upload a PDF or paste a link.");
    }

    await addDoc(materialsRef, {
      title,
      pdfURL,
      createdAt: new Date(),
    });

    alert("Material uploaded successfully!");
    titleInput.value = "";
    linkInput.value = "";
    fileInput.value = "";
    loadMaterials();
  } catch (err) {
    console.error(err);
    alert("Error uploading material.");
  }
}

window.addMaterial = addMaterial;

async function loadMaterials() {
  grid.innerHTML = "<p>Loading...</p>";
  const q = query(materialsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  grid.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${data.title}</h4>
      <a href="${data.pdfURL}" target="_blank" class="btn">View PDF</a>
    `;
    grid.appendChild(card);
  });

  if (grid.innerHTML === "") {
    grid.innerHTML = "<p>No materials yet.</p>";
  }
}

loadMaterials();
// assets/materials.js