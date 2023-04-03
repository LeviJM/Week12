
const url = new URL('https://640c79cba3e07380e8f57a5a.mockapi.io/Items')
const form = document.getElementById('myForm')
const nameForm = document.getElementById('nameForm')
const tableBody = document.getElementById('tableBody')
const editDiv = document.getElementsByClassName('editDiv')
const editName = document.getElementsByClassName('editName')[0]
const editPrice = document.getElementsByClassName('editPrice')[0]
const editAmount = document.getElementsByClassName('editAmount')[0]
const nameEdit = document.getElementById('nameEdit');
editDiv[0].style.display = 'none';
editName.style.display = 'none';
editPrice.style.display = 'none';
editAmount.style.display = 'none';

function makeList() {
  fetch(url, {
    method: 'GET',
    headers: {'content-type':'application/json'},
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Unable to fetch items from server");
    }
  }).then(items => {
    tableBody.innerHTML = "";

    ///inserts a new row for each item in the API
    items.forEach(item => {
      let newRow = `
        <tr class="itemRow" id="${item.id}">
          <td class="td1">${item.name}</td>
          <td class="td2">$${item.price}</td>
          <td class="td3">${item.amount}</td>
          <td>
            <button type="button" class="btn btn-warning">Edit</button>
            <button type="button" class="btn btn-danger" data-id="${item.id}">Delete</button>
          </td>
        </tr>
      `
      tableBody.insertAdjacentHTML("beforeend", newRow)
    });
    /////Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-id');
        fetch(`${url}/${id}`, {
          method: 'DELETE',
          headers: {'content-type':'application/json'},
        }).then(res => {
          if (res.ok) {
            const rowToDelete = document.getElementById(id);
            rowToDelete.remove();
          }
        });
      });
    });
    ////edit buttons
    const editButtons = document.querySelectorAll('.btn-warning');
    const currentEdit = document.getElementById('currentEdit')
    console.log(currentEdit)
    editButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const itemRow = event.target.parentElement.parentElement;
        ////creates edit selection popup
        currentEdit.textContent = `${itemRow.getElementsByClassName('td1')[0].textContent}`
        editDiv[0].style.display = 'block' ;
        ////name button
        const nameBt = document.getElementsByClassName('nameBt')[0];
        console.log(nameBt)
        nameBt.addEventListener('click', (event) => {
          event.preventDefault();
          editName.style.display = 'block';
          console.log(itemRow)
          nameEdit.placeholder = `${currentEdit.textContent}`
          
        })
        /////
        nameForm.addEventListener('submit', event => {
          event.preventDefault();
          console.log(itemRow.id)
          const editNameInput = document.getElementById('nameEdit');
      
          let newName = {
            name: editNameInput.value,
          }
          fetch(`https://640c79cba3e07380e8f57a5a.mockapi.io/Items/${itemRow.id}`, {
            method: 'PUT', // or PATCH
            headers: {'content-type':'application/json'},
            body: JSON.stringify(newName)
        })
        })
  });
});
  });
};

function addItem() {
  form.addEventListener("submit", event => {
    event.preventDefault();
  
    const nameInput = document.getElementById("nameInput");
    const priceInput = document.getElementById("priceInput");
    const amountInput = document.getElementById("amountInput");
  
    let newTask = {
      name: nameInput.value,
      price: priceInput.value,
      amount: amountInput.value
      }
  
    fetch(url , {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify(newTask)
  }).then(res => {
    if (res.ok) {
        return res.json();
    }
  }).then(() => {
    makeList();
  });
  });
};


makeList();

addItem();








