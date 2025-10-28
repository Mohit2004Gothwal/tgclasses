// const materials = JSON.parse(localStorage.getItem("tgMaterials")) || [];
// const list = document.getElementById("materialsList");
// const viewer = document.getElementById("pdfViewer");

// function loadMaterials() {
//   if (materials.length === 0) {
//     list.innerHTML = "<p>No materials uploaded yet.</p>";
//     return;
//   }

//   materials.forEach(m => {
//     const div = document.createElement("div");
//     div.className = "list-item";
//     div.textContent = m.title;
//     div.onclick = () => viewPDF(m.link);
//     list.appendChild(div);
//   });
// }

// function viewPDF(link) {
//   viewer.innerHTML = `<iframe src="${link}" frameborder="0"></iframe>`;
// }

// loadMaterials();

import { storage, db } from './assets/firebase.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Example: Upload file
async function uploadPDF(file, title) {
  const storageRef = ref(storage, 'materials/' + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await addDoc(collection(db, "materials"), { title, link: url });
  alert("Material uploaded successfully!");
}
