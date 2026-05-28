/* script.js */

const landingPage =
document.getElementById("landingPage");

const authContainer =
document.getElementById("authContainer");

const dashboard =
document.getElementById("dashboard");

const formTitle =
document.getElementById("formTitle");

const authBtn =
document.getElementById("authBtn");

const toggleText =
document.getElementById("toggleText");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

/* SHOW LOGIN */

function showLogin(){

  landingPage.style.display = "none";
  authContainer.style.display = "flex";

  formTitle.innerText = "Login";

  authBtn.innerText = "Login";

  authBtn.setAttribute("onclick","login()");

  toggleText.innerHTML =
  `Don't have account?
   <span onclick="showSignup()">Signup</span>`;
}

/* SHOW SIGNUP */

function showSignup(){

  landingPage.style.display = "none";
  authContainer.style.display = "flex";

  formTitle.innerText = "Signup";

  authBtn.innerText = "Signup";

  authBtn.setAttribute("onclick","signup()");

  toggleText.innerHTML =
  `Already have account?
   <span onclick="showLogin()">Login</span>`;
}

/* SIGNUP */

function signup(){

  const username =
  document.getElementById("username").value.trim();

  const password =
  document.getElementById("password").value.trim();

  if(username === "" || password === ""){

    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("user", username);

  localStorage.setItem("pass", password);

  alert("Signup Successful");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  showLogin();
}

/* LOGIN */

function login(){

  const username =
  document.getElementById("username").value.trim();

  const password =
  document.getElementById("password").value.trim();

  const savedUser =
  localStorage.getItem("user");

  const savedPass =
  localStorage.getItem("pass");

  if(username === savedUser &&
     password === savedPass){

      authContainer.style.display = "none";

      dashboard.style.display = "block";

      loadTransactions();

  }else{

    alert("Invalid Credentials");
  }
}

/* LOGOUT */

function logout(){

  dashboard.style.display = "none";

  landingPage.style.display = "block";
}

/* ADD TRANSACTION */

function addTransaction(){

  const title =
  document.getElementById("title").value;

  const amount =
  document.getElementById("amount").value;

  const type =
  document.getElementById("type").value;

  if(title === "" || amount === ""){

    alert("Please fill all fields");
    return;
  }

  const transaction = {

    id:Date.now(),

    title,

    amount:Number(amount),

    type
  };

  transactions.push(transaction);

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  loadTransactions();

  document.getElementById("title").value = "";

  document.getElementById("amount").value = "";
}

/* LOAD TRANSACTIONS */

function loadTransactions(){

  const transactionList =
  document.getElementById("transactionList");

  transactionList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t)=>{

    if(t.type === "income"){

      income += t.amount;

    }else{

      expense += t.amount;
    }

    const div =
    document.createElement("div");

    div.classList.add("transaction");

    div.innerHTML = `

      <div>
        <h4>${t.title}</h4>
        <p>₹${t.amount}</p>
      </div>

      <button onclick="deleteTransaction(${t.id})">
        Delete
      </button>
    `;

    transactionList.appendChild(div);

  });

  document.getElementById("incomeDisplay")
  .innerText = `₹${income}`;

  document.getElementById("expenseDisplay")
  .innerText = `₹${expense}`;

  document.getElementById("balanceDisplay")
  .innerText = `₹${income - expense}`;

  updateChart(income,expense);
}

/* DELETE */

function deleteTransaction(id){

  transactions =
  transactions.filter((t)=> t.id !== id);

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  loadTransactions();
}

/* CHART */

let chart;

function updateChart(income,expense){

  const ctx =
  document.getElementById("expenseChart");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(ctx,{

    type:"doughnut",

    data:{

      labels:["Income","Expense"],

      datasets:[{

        data:[income,expense],

        backgroundColor:[
          "#22c55e",
          "#ef4444"
        ]

      }]
    }
  });
}

/* WEEKLY REPORT */

function showWeeklyReport(){

  let income = 0;
  let expense = 0;

  transactions.forEach((t)=>{

    if(t.type === "income"){

      income += t.amount;

    }else{

      expense += t.amount;
    }

  });

  alert(
`Weekly Report

Income: ₹${income}

Expense: ₹${expense}

Balance: ₹${income-expense}`
  );
}

/* MONTHLY REPORT */

function showMonthlyReport(){

  let income = 0;
  let expense = 0;

  transactions.forEach((t)=>{

    if(t.type === "income"){

      income += t.amount;

    }else{

      expense += t.amount;
    }

  });

  alert(
`Monthly Report

Income: ₹${income}

Expense: ₹${expense}

Balance: ₹${income-expense}`
  );
}

/* PDF DOWNLOAD */

async function downloadPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.text(
    "Expense Tracker Report",
    20,
    20
  );

  let y = 40;

  transactions.forEach((t)=>{

    doc.text(
      `${t.title} - ₹${t.amount} - ${t.type}`,
      20,
      y
    );

    y += 10;
  });

  doc.save("expense-report.pdf");
}