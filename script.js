// ✅ Firebase SDKs (already included in index.html)
const firebaseConfig = {
  apiKey: "AIzaSyD2ms0toD6WVISdk8Nma22pxaX0oLADGvs",
  authDomain: "montessori-student-portal.firebaseapp.com",
  projectId: "montessori-student-portal",
  storageBucket: "montessori-student-portal.firebasestorage.app",
  messagingSenderId: "737984627380",
  appId: "1:737984627380:web:66cdd1c1af2495b2c04de1"
};

// ✅ Initialize Firebase App and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Post submission function
function submitPost() {
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && message) {
    db.collection("posts").add({
      name,
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById("message").value = "";
    }).catch(error => {
      console.error("Error posting:", error);
    });
  }
}

// ✅ Live post display
db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const post = doc.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<strong>${post.name}</strong><br>${post.message}`;
    postsDiv.appendChild(div);
  });
});
