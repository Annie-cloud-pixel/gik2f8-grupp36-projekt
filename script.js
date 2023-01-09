"use strict";

const api = new Api('http://localhost:5000/tasks');

/* För att den ska känna av knapptryckningarna som görs i input-fälten */
shoppingLista.produkt.addEventListener('keyup', (e) => verifiedField(e.target));
shoppingLista.produkt.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.antal.addEventListener('input', (e) => verifiedField(e.target));
shoppingLista.antal.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.pris.addEventListener('input', (e) => verifiedField(e.target));
shoppingLista.pris.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.addEventListener('submit', onSubmit);

/* Hämta list-elementet från HTML-koden, i denna kommer alltså varje enskild produkt att placeras. */
const shoppingListaItems = document.querySelector("#shoppingLista");

let produktVerified = true;
let antalVerified = true;
let prisVerified = true;



/* funktion som tar emot inputen */
function verifiedField(field) {
    const { name, value } = field;
  
    /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
    let validationMessage = '';
    /* En switchsats används för att kolla name, som kommer att vara title om någon skrivit i eller lämnat titlefältet, annars
     description eller date.   */
    switch (name) {
      /* Så de olika fallen - case - beror på vilket name-attribut som finns på det elementet som skickades till validateField - 
      alltså vilket fält som någon skrev i eller lämnade. */
  
      /* Fallet om någon skrev i eller lämnade fältet med name "title" */
      case 'produkt': {
        /* Då görs en enkel validering på om värdet i title-fältet är kortare än 2 */
        if (value.length < 2) {
          /* Om det inte är två tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, validationMessage sätts till ett lämpligt meddelande som förklarar vad som är fel.  */
          produktVerified = false;
          validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
        } else if (value.length > 100) {
          /* Validering görs också för att kontrollera att texten i fältet inte har fler än 100 tecken. */
          produktVerified = false;
          validationMessage =
            "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
        } else {
          /* Om ingen av dessa if-satser körs betyder det att fältet är korrekt ifyllt. */
          produktVerified = true;
        }
        break;
      }
      case 'antal': {
        if (value.length > 500) {
          antalVerified = false;
          validationMessage =
            "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
        } else {
          antalVerified = true;
        }
        break;
      }
      case 'pris': {

        if (value.length === 0) {
   
          prisVerified = false;
          validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
        } else {
          prisVerified = true;
        }
        break;
      }
    }
    field.previousElementSibling.innerText = validationMessage;
    field.previousElementSibling.classList.remove('hidden');
  }

function onSubmit(e) {

    e.preventDefault();
    if (produktVerified && antalVerified && prisVerified) {
      console.log('Submit');
  
      saveTask();
    }
  }  
  
  function saveTask() {
    const task = {
      produkt: shoppingLista.produkt.value,
      antal: shoppingLista.antal.value,
      pris: shoppingLista.pris.value,
      completed: false
    };

    api.create(task).then((task) => {
      if (task) {
        renderList();
      }
    });
  }
  
  function renderList() {
    api.getAll().then((tasks) => {
      tasks.sort((a, b) => {
        const taskA = new Task(a.produkt);
        const taskB = new Task(b.produkt);
  
        if (taskA < taskB) return -1;
        if (taskA > taskB) return 1;
        return 0;
      });
      todoListElement.innerHTML = "";
      tasks.forEach((task) => {
        if (tasks && tasks.length > 0) {
          todoListElement.insertAdjacentHTML(
            "beforeend",
            renderTask(task, tasks)
          );
  
          const checkboxes = document.querySelectorAll(".checkbox");
          checkboxes.forEach(editTasks);
        }
      });
    });
  }
  
  
  function renderTask({ id, title, description, dueDate, completed }, tasks) {
    console.log(tasks);
    
      let html = `
      <li  class="select-none mt-2 py-2 border-b border-purple-300">
        <div class="flex items-center">
          <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">`;
      if (completed) {
        html += `<s>`;
      }
    
      html += ` ${title}`;
      if (completed) {
        html += `</s>`;
      }
      html += `
       </h3>
          <div>
          
            <span>${dueDate}</span>
            <input type="checkbox" id="${id}" class="checkbox inline-block m-2 bg-white"
            ${completed ? "checked" : ""} 
          />
            <button onclick="deleteTask(${id})" onclick="deleteTask(${id})" class="inline-block bg-purple-500 text-xs text-purple-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
          </div>
        </div>`;
      description &&
        (html += `
        <p class="ml-8 mt-2 text-xs italic">${description}</p>
    `);
      html += `
      </li>`;
    
      return html;
    }
    
    function editTasks(checkbox) {
      checkbox.addEventListener("change", (e) => {
        if (checkbox.checked) {
          const completed = {
            completed: true,
          };
          api.patch(checkbox.id, completed).then((result) => {
            console.log(result);
            renderList();
          });
        } else {
          const completed = {
            completed: false,
          };
          api.patch(checkbox.id, completed).then((result) => {
            console.log(result);
            renderList();
          });
        }
      });
    }
    
    function deleteTask(id) {
      api.remove(id).then((result) => {
        renderList();
      });
    }
    
    renderList();