const account1 = {
  owner: 'Techie Emma',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-11-18T21:23:11.178Z',
    '2021-11-16T21:23:11.178Z',
    '2021-11-12T21:23:11.178Z',
    '2021-11-15T21:23:11.178Z',
    '2021-05-20T21:23:11.178Z',
    '2021-11-22T21:23:11.178Z',
    '2021-10-18T21:23:11.178Z',
    '2021-09-15T21:23:11.178Z',
  ],
};

const account2 = {
  owner: 'Nicholas Emmanuel chimaobi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
    '2021-11-18T21:23:11.178Z',
  ],
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatDate = (date) => {
  const calcDate = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDate(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDay()}`.padStart(2, 0);
  const month = `${date.getMonth()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
// getting the list of users and transactions section
const displayData = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const items = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  items.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);

    const showUI = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
  i + 1
} ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${move.toFixed(2)}€</div>
        </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', showUI);
  });
};

const displayBalance = (rate) => {
  rate.balance = rate.movements.reduce((acc, bal) => acc + bal, 0);
  labelBalance.textContent = `${rate.balance.toFixed(2)} €`;
};

// getting the income section
const displayIncome = (rate) => {
  const incomes = rate.movements
    .filter((item) => item > 0)
    .reduce((acc, bal) => acc + bal);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outIncome = rate.movements
    .filter((item) => item < 0)
    .reduce((acc, bal) => acc + bal, 0);
  labelSumOut.textContent = `${Math.abs(outIncome).toFixed(2)}€`;

  const interest = rate.movements
    .filter((item) => item > 0)
    .map((deposit) => (deposit * rate.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// getting the username for login
const createNames = (acct) => {
  acct.forEach((accts) => {
    accts.username = accts.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createNames(accounts);

// displaying to the UI section
const updateUI = (rate) => {
  // display the data
  displayData(rate);
  // display the balance
  displayBalance(rate);
  // display the income
  displayIncome(rate);
};

let time = 360;
const startTimer = () => {
  const ticker = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    // log out once the time is over
    if (time === 0) {
      // eslint-disable-next-line no-use-before-define
      clearInterval(timer);
      labelWelcome.textContent = 'log in to get started';
      containerApp.style.opacity = 0;
    }
    // decreased the tim by 1
    time -= 1;
  };
  ticker();
  // eslint-disable-next-line no-undef
  const timer = setInterval(ticker, 1000);
  return timer;
};
// event handler for login
let currentAccount;
let timer;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (accts) => accts.username === inputLoginUsername.value,
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }
  // create current date and time when logged in
  // const now = new Date();
  // const day = `${now.getDay()}`.padStart(2, 0);
  // const month = `${now.getMonth()}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };
  const locale = navigator.languages;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
  // clear the input value
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
  // checking if too account are logged in
  if (timer) clearInterval(timer);
  timer = startTimer();
  // update ui
  updateUI(currentAccount);
});

// transfer money section
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value,
  );
  if (
    amount > 0
    && receiver
    && currentAccount.balance >= amount
    && receiver?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    // add the current date for transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    // update ui
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startTimer();
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

// loan section
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0
    && currentAccount.movements.some((acc) => acc >= amount * 1.2)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      // add the current date for transfer
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startTimer();
    }, 5000);
  }
  inputLoanAmount.value = '';
});

// close account section
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin
  ) {
    const indexClose = accounts.findIndex(
      (acc) => acc.username === currentAccount.username,
    );
    accounts.splice(indexClose, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

// sort the transactions section
let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayData(currentAccount.movements, !sorted);
  sorted = !sorted;
});
