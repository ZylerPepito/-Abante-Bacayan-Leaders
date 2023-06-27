// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuMzl8o-6sYZSLW01DC6NN8Gc6EyGRRkI",
  authDomain: "leaders-table.firebaseapp.com",
  databaseURL: "https://leaders-table-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "leaders-table",
  storageBucket: "leaders-table.appspot.com",
  messagingSenderId: "732972111020",
  appId: "1:732972111020:web:b16447e0bb0b317053fb09"
};

var editHandler;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Modal
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalContainer = document.querySelector('.modal-add');
const tableEl = document.getElementById('table-list');

// Form
const form = document.getElementById('addForm');

const saveHandler = function(e) {
  e.preventDefault();

  const nameInput = document.getElementById('name').value;
  const phoneInput = document.getElementById('phone').value;
  const addressInput = document.getElementById('Address').value;

  const newUserRef = push(ref(db, 'user')); // Generate a unique ID for the user

  set(newUserRef, {
    username: nameInput,
    phone: phoneInput,
    Address: addressInput,
  });

  form.reset();
  modalContainer.style.display = 'none';
}


addBtn.addEventListener("click", function() {
  
  modalContainer.style.display = "block";
  
  form.removeEventListener('submit', editHandler);
  form.addEventListener('submit', saveHandler);

});

closeBtn.addEventListener("click", function() {
  modalContainer.style.display = "none";
});

window.addEventListener('click', function(e) {
  if (e.target === modalContainer) {
    modalContainer.style.display = 'none';
  }
});


function createTableRow(id, name, address, phone) {
  const tr = document.createElement('tr');

  const td1 = document.createElement('td');
  td1.textContent = name;

  td1.addEventListener('click', function() {
    window.location.href = `detail.html?id=${encodeURIComponent(id)}`;
  });

  td1.classList.add('name-hover');

  const td2 = document.createElement('td');
  td2.textContent = address;

  const td3 = document.createElement('td');
  td3.textContent = phone;

  const td5 = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteRow');
  deleteButton.innerHTML = 'Delete';

  const td6 = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.classList.add('editRow');
  editButton.textContent = 'Edit';

  editButton.addEventListener('click', function() {
    editTableRow(id, td1.textContent, td2.textContent, td3.textContent);
  });

  //const checkButton = document.createElement('input');
  // checkButton.setAttribute('type', 'checkbox');

  
  deleteButton.addEventListener('click', function() {
    if (confirm("Are you sure you want to delete this record?") == true) {
      tr.remove();
    const userRef = ref(db, `user/${id}`);
    set(userRef, null);
     } else return
    
    
  });

  td5.classList.add('buttons-row');

  td5.appendChild(deleteButton);
  td5.appendChild(editButton);
  //td5.appendChild(checkButton);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td5);
  tableEl.appendChild(tr);
}

function editTableRow(id, name, address, phone) {
  document.getElementById('name').value = name;
  document.getElementById('Address').value = address;
  document.getElementById('phone').value = phone;

  modalContainer.style.display = 'block';

  var editHandler = function(e) {
    e.preventDefault();
  
    const updatedName = document.getElementById('name').value;
    const updatedAddress = document.getElementById('Address').value;
    const updatedPhone = document.getElementById('phone').value;
  
    const userRef = ref(db, `user/${id}`); // Use the user ID for updating
   
    set(userRef, {
      username: updatedName,
      phone: updatedPhone,
      Address: updatedAddress,
    });
    
    modalContainer.style.display = 'none';
  };

  form.removeEventListener('submit', saveHandler);
  form.addEventListener('submit', editHandler);
}

const userRef = ref(db, 'user');

onValue(userRef, function(snapshot) {
  const tableRows = Array.from(tableEl.getElementsByTagName('tr'));
  tableRows.forEach((row, index) => {
    if (index !== 0) { // Skip the first row (table header)
      row.remove();
    }
  });

  snapshot.forEach((childSnapshot) => {
    const id = childSnapshot.key;
    const userData = childSnapshot.val();
    const name = userData.username;
    const address = userData.Address;
    const phone = userData.phone;
    createTableRow(id, name, address, phone);
  });
});