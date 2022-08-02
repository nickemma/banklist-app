const account1 = {
  owner: 'Techie Emma',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Nicholas Emmanuel chimaobi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Oyinlade Ojesimani',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Said lassri',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayData = (movements, sort = false) => {
  containerMovements.innerHTML = '';
  const items = sort ? movements.slice().sort((a, b) => a - b) : movements;
  items.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const showUI = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
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

const updateUI = (rate) => {
  // display the data
  displayData(rate.movements);
  // display the balance
  displayBalance(rate);
  // display the income
  displayIncome(rate);
};

// event handler for login
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (accts) => accts.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }
  // clear the input value
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();

  // update ui
  updateUI(currentAccount);
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    // update ui
    updateUI(currentAccount);
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((acc) => acc >= amount * 1.2)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const indexClose = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(indexClose, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayData(currentAccount.movements, !sorted);
  sorted = !sorted;
});
