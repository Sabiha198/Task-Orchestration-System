// ========== VARIABLES ==========
let tasks = [], editIdx = -1, isLogin = false, user = null;

// ========== ALGORITHM DATA ==========
const algos = {
  merge: {
    title: "Merge Sort",
    code: `<span class="cm">// Merge Sort - Divide & Conquer</span>
<span class="kw">function</span> <span class="fn">mergeSort</span>(arr) {
  <span class="kw">if</span> (arr.length <= <span class="num">1</span>) <span class="kw">return</span> arr;
  <span class="kw">let</span> mid = Math.floor(arr.length / <span class="num">2</span>);
  <span class="kw">let</span> left = mergeSort(arr.slice(<span class="num">0</span>, mid));
  <span class="kw">let</span> right = mergeSort(arr.slice(mid));
  <span class="kw">return</span> merge(left, right);
}

<span class="kw">function</span> <span class="fn">merge</span>(L, R) {
  <span class="kw">let</span> result = [];
  <span class="kw">while</span> (L.length && R.length)
    result.push(L[<span class="num">0</span>] < R[<span class="num">0</span>] ? L.shift() : R.shift());
  <span class="kw">return</span> [...result, ...L, ...R];
}`,
    time: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n log n)"]],
    space: "O(n)",
    visual: "Splits array in half recursively, then merges back in sorted order. Used to sort tasks alphabetically."
  },
  greedy: {
    title: "Greedy Algorithm",
    code: `<span class="cm">// Greedy Sort - Priority First</span>
<span class="kw">function</span> <span class="fn">greedySort</span>(tasks) {
  <span class="kw">let</span> priority = {High: <span class="num">3</span>, Medium: <span class="num">2</span>, Low: <span class="num">1</span>};
  
  tasks.sort((a, b) => {
    <span class="cm">// Compare priority first</span>
    <span class="kw">let</span> diff = priority[b.priority] - priority[a.priority];
    <span class="kw">if</span> (diff !== <span class="num">0</span>) <span class="kw">return</span> diff;
    <span class="cm">// Then by date</span>
    <span class="kw">return</span> <span class="kw">new</span> Date(a.date) - <span class="kw">new</span> Date(b.date);
  });
}`,
    time: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n log n)"]],
    space: "O(1)",
    visual: "Makes best choice at each step. High priority tasks first, then earlier deadlines."
  },
  search: {
    title: "Linear Search",
    code: `<span class="cm">// Linear Search - Find by filtering</span>
<span class="kw">function</span> <span class="fn">searchTasks</span>(query) {
  <span class="kw">return</span> tasks.filter(task => 
    task.name.toLowerCase().includes(query) ||
    task.details.toLowerCase().includes(query)
  );
}`,
    time: [["Best", "O(1)"], ["Average", "O(n)"], ["Worst", "O(n)"]],
    space: "O(1)",
    visual: "Checks each task one by one. Simple and works well for small lists."
  },
  lcs: {
    title: "Longest Common Subsequence",
    code: `<span class="cm">// LCS using Dynamic Programming</span>
<span class="kw">function</span> <span class="fn">findLCS</span>(s1, s2) {
  <span class="kw">let</span> m = s1.length, n = s2.length;
  <span class="kw">let</span> dp = Array(m+<span class="num">1</span>).fill(<span class="num">0</span>)
    .map(() => Array(n+<span class="num">1</span>).fill(<span class="num">0</span>));
  
  <span class="cm">// Fill DP table</span>
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">1</span>; i <= m; i++) {
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="num">1</span>; j <= n; j++) {
      <span class="kw">if</span> (s1[i-<span class="num">1</span>] === s2[j-<span class="num">1</span>])
        dp[i][j] = dp[i-<span class="num">1</span>][j-<span class="num">1</span>] + <span class="num">1</span>;
      <span class="kw">else</span>
        dp[i][j] = Math.max(dp[i-<span class="num">1</span>][j], dp[i][j-<span class="num">1</span>]);
    }
  }
  
  <span class="cm">// Backtrack to find LCS string</span>
  <span class="kw">let</span> lcs = "", i = m, j = n;
  <span class="kw">while</span> (i > <span class="num">0</span> && j > <span class="num">0</span>) {
    <span class="kw">if</span> (s1[i-<span class="num">1</span>] === s2[j-<span class="num">1</span>]) {
      lcs = s1[i-<span class="num">1</span>] + lcs; i--; j--;
    } <span class="kw">else if</span> (dp[i-<span class="num">1</span>][j] > dp[i][j-<span class="num">1</span>]) i--;
    <span class="kw">else</span> j--;
  }
  <span class="kw">return</span> lcs;
}`,
    time: [["All Cases", "O(m * n)", "m, n = string lengths"]],
    space: "O(m * n)",
    visual: "Finds longest sequence that appears in same order in both strings. Example: 'ABCD' & 'AEBD' = 'ABD'"
  }
};

// ========== PAGE LOAD ==========
window.onload = () => {
  let saved = localStorage.getItem("currentUser");
  if (saved) { user = JSON.parse(saved); showApp(); }
};

// ========== AUTH FUNCTIONS ==========
function openAuth(login) {
  isLogin = login;
  document.getElementById("authTitle").textContent = login ? "Login" : "Sign Up";
  document.getElementById("name").style.display = login ? "none" : "block";
  document.querySelector("#authModal .btn-primary").textContent = login ? "Login" : "Sign Up";
  document.getElementById("switchText").textContent = login ? "No account?" : "Have account?";
  document.querySelector("#authModal .switch button").textContent = login ? "Sign Up" : "Login";
  document.getElementById("authModal").classList.add("active");
}

function toggleAuthMode() { openAuth(!isLogin); }

function handleAuth() {
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("pass").value.trim();
  let name = document.getElementById("name").value.trim();
  
  if (!email || !pass || (!isLogin && !name)) return alert("Fill all fields!");
  
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  
  if (isLogin) {
    user = users.find(u => u.email === email && u.password === pass);
    if (!user) return alert("Invalid credentials!");
  } else {
    if (users.find(u => u.email === email)) return alert("Email exists!");
    user = { name, email, password: pass };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  localStorage.setItem("currentUser", JSON.stringify(user));
  document.getElementById("authModal").classList.remove("active");
  showApp();
}

function showApp() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").classList.add("active");
  document.getElementById("userName").textContent = user.name;
  tasks = JSON.parse(localStorage.getItem("tasks_" + user.email) || "[]");
  render();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

// ========== TASK FUNCTIONS ==========
function save() { localStorage.setItem("tasks_" + user.email, JSON.stringify(tasks)); }

function openTask() {
  editIdx = -1;
  document.getElementById("taskTitle").textContent = "Add Task";
  document.getElementById("taskBtn").textContent = "Add";
  ["tName", "tDetails", "tDate", "tTime", "tPriority"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("taskModal").classList.add("active");
}

function saveTask() {
  let name = document.getElementById("tName").value.trim();
  let details = document.getElementById("tDetails").value.trim();
  let date = document.getElementById("tDate").value;
  let time = document.getElementById("tTime").value;
  let priority = document.getElementById("tPriority").value;
  
  if (!name || !details || !date || !time || !priority) return alert("Fill all fields!");
  
  let task = { name, details, date, time, priority, done: false };
  if (editIdx === -1) tasks.push(task);
  else { task.done = tasks[editIdx].done; tasks[editIdx] = task; editIdx = -1; }
  
  save(); render();
  document.getElementById("taskModal").classList.remove("active");
}

function render() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("done").textContent = tasks.filter(t => t.done).length;
  document.getElementById("pending").textContent = tasks.filter(t => !t.done).length;
  
  let list = document.getElementById("taskList");
  if (!tasks.length) { list.innerHTML = '<li class="empty">No tasks yet!</li>'; return; }
  
  list.innerHTML = tasks.map((t, i) => `
    <li class="task-item ${t.done ? 'done' : ''}">
      <div>
        <div class="task-name">${t.name}</div>
        <div class="task-details">${t.details}</div>
        <div class="task-meta"><span class="priority-${t.priority.toLowerCase()}">${t.priority}</span> | ${t.date} ${t.time}</div>
      </div>
      <div class="action-btns">
        <button onclick="toggle(${i})">${t.done ? '↩' : '✓'}</button>
        <button onclick="edit(${i})">✎</button>
        <button class="del" onclick="del(${i})">x</button>
      </div>
    </li>
  `).join("");
}

function toggle(i) { tasks[i].done = !tasks[i].done; save(); render(); }
function del(i) { if(confirm("Delete?")) { tasks.splice(i, 1); save(); render(); } }
function edit(i) {
  editIdx = i;
  let t = tasks[i];
  document.getElementById("taskTitle").textContent = "Edit Task";
  document.getElementById("taskBtn").textContent = "Update";
  document.getElementById("tName").value = t.name;
  document.getElementById("tDetails").value = t.details;
  document.getElementById("tDate").value = t.date;
  document.getElementById("tTime").value = t.time;
  document.getElementById("tPriority").value = t.priority;
  document.getElementById("taskModal").classList.add("active");
}

// ========== SEARCH ==========
function searchTasks() {
  let q = document.getElementById("search").value.toLowerCase();
  let filtered = tasks.filter(t => t.name.toLowerCase().includes(q) || t.details.toLowerCase().includes(q));
  
  let list = document.getElementById("taskList");
  if (!filtered.length) { list.innerHTML = '<li class="empty">No matches</li>'; return; }
  
  list.innerHTML = filtered.map(t => {
    let i = tasks.indexOf(t);
    return `
      <li class="task-item ${t.done ? 'done' : ''}">
        <div>
          <div class="task-name">${t.name}</div>
          <div class="task-details">${t.details}</div>
          <div class="task-meta"><span class="priority-${t.priority.toLowerCase()}">${t.priority}</span> | ${t.date} ${t.time}</div>
        </div>
        <div class="action-btns">
          <button onclick="toggle(${i})">${t.done ? '↩' : '✓'}</button>
          <button onclick="edit(${i})">✎</button>
          <button class="del" onclick="del(${i})">x</button>
        </div>
      </li>
    `;
  }).join("");
}

// ========== SORTING ==========
// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

function merge(L, R) {
  let result = [];
  while (L.length && R.length)
    result.push(L[0].name.toLowerCase() < R[0].name.toLowerCase() ? L.shift() : R.shift());
  return [...result, ...L, ...R];
}

function mergeSortTasks() { tasks = mergeSort([...tasks]); save(); render(); }

// Greedy Sort
function greedySort() {
  let p = { High: 3, Medium: 2, Low: 1 };
  tasks.sort((a, b) => (p[b.priority] - p[a.priority]) || new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));
  save(); render();
}

// ========== LCS GAME ==========
function toggleGame() {
  document.getElementById("gameBox").classList.toggle("show");
}

function findLCS() {
  let s1 = document.getElementById("w1").value.trim().toLowerCase();
  let s2 = document.getElementById("w2").value.trim().toLowerCase();
  if (!s1 || !s2) return alert("Enter both words!");
  
  let m = s1.length, n = s2.length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  // Fill DP table
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = s1[i-1] === s2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  
  // Backtrack
  let lcs = "", i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i-1] === s2[j-1]) { lcs = s1[i-1] + lcs; i--; j--; }
    else if (dp[i-1][j] > dp[i][j-1]) i--;
    else j--;
  }
  
  document.getElementById("lcsOut").textContent = lcs ? '"' + lcs + '"' : "No match";
  document.getElementById("lcsLen").textContent = lcs ? "Length: " + lcs.length : "";
  document.getElementById("result").style.display = "block";
}

// ========== ALGORITHM MODAL ==========
function openAlgo(type) {
  let a = algos[type];
  document.getElementById("algoTitle").textContent = a.title;
  
  let rows = a.time.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td>${r[2] ? `<td>${r[2]}</td>` : ''}</tr>`).join("");
  
  document.getElementById("algoContent").innerHTML = `
    <h4 style="color:#666;margin-bottom:8px">Code</h4>
    <div class="code-box">${a.code}</div>
    
    <h4 style="color:#666;margin:15px 0 8px">Time Complexity</h4>
    <table class="table">
      <tr><th>Case</th><th>Complexity</th>${a.time[0][2] ? '<th>Note</th>' : ''}</tr>
      ${rows}
    </table>
    
    <h4 style="color:#666;margin:15px 0 8px">Space Complexity</h4>
    <p style="background:#f8f9fa;padding:10px;border-radius:8px">${a.space}</p>
    
    <div class="visual">
      <h4>How It Works</h4>
      <p>${a.visual}</p>
    </div>
  `;
  
  document.getElementById("algoModal").classList.add("active");
}
