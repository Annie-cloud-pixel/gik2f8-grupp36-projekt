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

const api = new Api('http://localhost:5000/tasks');

/* funktion som tar emot inputen */
function verifiedField(field) {
    const { name, value } = field;
  
    /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
    let = validationMessage = '';
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
    console.log('rendering');
  
    api.getAll().then((tasks) => {

      todoListElement.innerHTML = '';  
      if (tasks && tasks.length > 0) {
        tasks.forEach((task) => {
        
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        });
      }
    });
  }
  
  
  function renderTask({ id, title, description, dueDate }) {
    let html = `
      <li class="select-none mt-2 py-2 border-b border-indigo-300">
        <div class="flex items-center">
          <input type="checkbox" onclick="changeDesign()">
          <h3 class="mb-3 flex-1 text-xl font-bold text-cyan-700 uppercase">${title}</h3>
          <div>
            <span>${dueDate}</span>
            <button onclick="deleteTask(${id})" class="inline-block bg-yellow-400 text-xs border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
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
  
  function deleteTask(id) {
    api.remove(id).then((result) => {
      renderList();
    });
  }