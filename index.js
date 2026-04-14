const form = document.querySelector(".add");
const income = document.querySelector(".income-list");
const expense = document.querySelector(".expense-list");
const expenseStat = document.querySelector("#expense");
const incomeStat = document.querySelector("#income");
const balanceStat = document.querySelector("#balance");
const records = document.querySelector(".records");

let transactions =
  localStorage.getItem("transactions") == null
    ? []
    : JSON.parse(localStorage.getItem("transactions"));

function addTransactions(sources, amounts) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: sources,
    amount: Number(amounts),
    time: `${time.toLocaleTimeString()}, ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  showBudget(transaction.id, sources, amounts, transaction.time);
}

function transactionTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete">X</i>
            </li>`;
}

function showTransaction(id, source, amount, time) {
  if (amount > 0) {
    income.innerHTML += transactionTemplate(id, source, amount, time);
  } else {
    expense.innerHTML += transactionTemplate(id, source, amount, time);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.source.value == "" || form.amount.value == "")
    return alert("Please input a value");
  addTransactions(form.source.value.trim(), form.amount.value);
  form.reset();
  UpdateStat();
});

income.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTask(Number(e.target.parentElement.dataset.id));
    UpdateStat();
  }
});

expense.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTask(Number(e.target.parentElement.dataset.id));
  }
  UpdateStat();
});

function deleteTask(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getTransactions() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      income.innerHTML += transactionTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time,
      );
    } else {
      expense.innerHTML += transactionTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time,
      );
    }
  });
  UpdateStat();
}

function UpdateStat() {
  let income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);
  incomeStat.textContent = income;

  let expense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  expenseStat.textContent = expense;

  balance = income - expense;
  balanceStat.textContent = balance;
}

getTransactions();

function showBudget(id, source, amount, time) {
  if (amount > 0) {
    income.innerHTML += template(id, source, amount, time);
  } else {
    expense.innerHTML += template(id, source, amount, time);
  }
}

function template(id, source, amount, time) {
  return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete">X</i>
            </li>`;
}
