// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const selectedId = urlParams.get('id');

const userRef = ref(db, `user/${selectedId}`);

onValue(userRef, function(snapshot) {
  const userData = snapshot.val();

 
  const detailNameEl = document.getElementById('detail-name');
  const detailPhoneEl = document.getElementById('detail-phone');
  const detailLocationEl = document.getElementById('detail-Address');

  detailNameEl.textContent = userData.username;
  if (userData.phone === "") {
      detailPhoneEl.textContent = ""
  } else {
  detailPhoneEl.textContent = "Phone:" + " " + userData.phone;
  } 

  if (userData.Address === "") {
    detailLocationEl.textContent = ""
  } else {
    detailLocationEl.textContent = "Address:" + " " + userData.Address;
  }


  
});


const editDetailsBtn = document.getElementById('edit-btn');
const detailNameEl = document.getElementById('detail-name');
const detailPhoneEl = document.getElementById('detail-phone');
const detailLocationEl = document.getElementById('detail-Address');

editDetailsBtn.addEventListener("click", function() {
  if (detailNameEl.contentEditable === "true" && detailPhoneEl.contentEditable === "true" && detailLocationEl.contentEditable === "true") {
    detailNameEl.contentEditable = "false";
    detailPhoneEl.contentEditable = "false";
    detailLocationEl.contentEditable = "false";
    detailNameEl.classList.remove('editable');
    detailPhoneEl.classList.remove('editable');
    detailLocationEl.classList.remove('editable');
    editDetailsBtn.textContent = "Edit Details";
  
  } else {
    editDetailsBtn.textContent = "Confirm";
    detailNameEl.contentEditable = "true";
    detailPhoneEl.contentEditable = "true";
    detailLocationEl.contentEditable = "true";
    detailNameEl.classList.add('editable');
    detailPhoneEl.classList.add('editable');
    detailLocationEl.classList.add('editable');
  }
});

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    saveData();
  }
}

function saveData() {
  if (
    detailNameEl.contentEditable === "true" &&
    detailPhoneEl.contentEditable === "true" &&
    detailLocationEl.contentEditable === "true"
  ) {
    const updatedData = {
      username: detailNameEl.textContent.trim(),
      phone: detailPhoneEl.textContent.trim(),
      Address: detailLocationEl.textContent.trim()
    };

    set(userRef, updatedData)
      .then(() => {
        console.log("Data updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });

    detailNameEl.contentEditable = "false";
    detailPhoneEl.contentEditable = "false";
    detailLocationEl.contentEditable = "false";
    editDetailsBtn.textContent = "Edit Details";
  }
}

detailNameEl.addEventListener('keypress', handleKeyPress);
detailPhoneEl.addEventListener('keypress', handleKeyPress);
detailLocationEl.addEventListener('keypress', handleKeyPress);



//Table

const tableEl = document.querySelector('.members-list');
const addBtn = document.getElementById('add-btn')
const modalContainer = document.querySelector('.modal-add')
const closeBtn = document.getElementById('close-btn')
const formEl = document.getElementById('addForm')

const memberRef = ref(db, `members`);


addBtn.addEventListener("click", function() {
  modalContainer.style.display = "block"
  formEl.addEventListener("submit", addUser);
})

closeBtn.addEventListener("click", function() {
  modalContainer.style.display = "none"
})

const addUser = function(e) {
  e.preventDefault()

  const nameInput = document.getElementById('name').value;
  const phoneInput = document.getElementById('phone').value;
  const addressInput = document.getElementById('Address').value;

  const newMemberRef = push(ref(db, 'members'))

  set(newMemberRef, {
    leader_id: selectedId,
    username: nameInput,
    phone: phoneInput,
    address: addressInput
  }) 

  //createTableRow(nameInput, addressInput, phoneInput)

  modalContainer.style.display = "none"

  formEl.reset()
}


function createTableRow(id, name, address, phone) {
  const tr = document.createElement('tr');

  const td1 = document.createElement('td');
  td1.textContent = name;

  const td2 = document.createElement('td');
  td2.textContent = phone;

  const td3 = document.createElement('td');
  td3.textContent = address;

  const tdButtons = document.createElement('td');
  tdButtons.classList.add('Buttons-row')
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteRow');
  deleteButton.innerHTML = 'Delete';

deleteButton.addEventListener("click", function(){


 if (confirm("Are you sure you want to delete this record?") == true) {
  tr.remove()

  const memberRefID = ref(db, `members/${id}`);

  set(memberRefID, null)
 } else return

 
})
  const editButton = document.createElement('button');
  editButton.classList.add('editRow');
  editButton.textContent = 'Edit';

  editButton.addEventListener("click", function() {
    editTableRow(id, name, address, phone)
  })

  tdButtons.appendChild(deleteButton);
  tdButtons.appendChild(editButton);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(tdButtons);

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
  
    const memberRef = ref(db, `members/${id}`); // Use the user ID for updating
   
    set(memberRef, {
      leader_id: selectedId,
      username: updatedName,
      phone: updatedPhone,
      address: updatedAddress,
    });
    formEl.reset()
    modalContainer.style.display = 'none';
  };

  formEl.removeEventListener('submit', addUser);
  formEl.addEventListener('submit', editHandler);
}

onValue(memberRef, function(snapshot) {
  const tableRows = Array.from(tableEl.getElementsByTagName('tr'));
  tableRows.forEach((row, index) => {
    if (index !== 0) { // Skip the first row (table header)
      row.remove();
    }
  });


  snapshot.forEach((childSnapshot) => {
    const membersData = childSnapshot.val()
    const id = childSnapshot.key;
    const name = membersData.username
    const address = membersData.address
    const phone = membersData.phone

    if (selectedId == membersData.leader_id) {
      createTableRow(id, name, address, phone);
    }

    formEl.removeEventListener("submit", addUser)
  });
  
})