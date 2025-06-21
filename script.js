// Firebase Config (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Submit Post
function submitPost() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const youtube = document.getElementById("youtube-link").value;
  const image = document.getElementById("image-upload").files[0];

  if (!name || !message) return alert("Please fill in name and message");

  let postData = {
    name,
    message,
    youtube,
    timestamp: new Date()
  };

  if (image) {
    const reader = new FileReader();
    reader.onload = function(e) {
      postData.imageData = e.target.result;
      db.collection("posts").add(postData).then(loadPosts);
    };
    reader.readAsDataURL(image);
  } else {
    db.collection("posts").add(postData).then(loadPosts);
  }

  document.getElementById("message").value = "";
  document.getElementById("youtube-link").value = "";
  document.getElementById("image-upload").value = "";
}

// Load Posts
function loadPosts() {
  const feed = document.getElementById("post-feed");
  feed.innerHTML = "";

  db.collection("posts").orderBy("timestamp", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const post = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <strong>${post.name}</strong><br>
        <p>${post.message}</p>
        ${post.imageData ? `<img src="${post.imageData}" style="max-width:100%">` : ""}
        ${post.youtube ? `<iframe width="300" height="200" src="https://www.youtube.com/embed/${extractYouTubeID(post.youtube)}" frameborder="0" allowfullscreen></iframe>` : ""}
      `;
      feed.appendChild(div);
    });
  });
}

function extractYouTubeID(url) {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length == 11) ? match[1] : null;
}

// Chat Logic
function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  db.collection("chat").add({ text, timestamp: new Date() });
  input.value = "";
}

function loadChat() {
  const chatBox = document.getElementById("chat-box");
  db.collection("chat").orderBy("timestamp").onSnapshot(snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.textContent = msg.text;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Homework logic
function assignTask() {
  const task = document.getElementById("teacher-task").value;
  if (!task) return;

  db.collection("homework").add({ task, timestamp: new Date() }).then(() => {
    document.getElementById("teacher-task").value = "";
    loadHomework();
  });
}

function loadHomework() {
  const hwList = document.getElementById("homework-list");
  hwList.innerHTML = "";

  db.collection("homework").orderBy("timestamp", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const hw = doc.data();
      const div = document.createElement("div");
      div.textContent = hw.task;
      hwList.appendChild(div);
    });
  });
}

// Init on load
window.onload = () => {
  loadPosts();
  loadChat();
  loadHomework();
};
