"use strict";

const api = new Api('http://localhost:5000/tasks');

shoppingLista.produkt.addEventListener('keyup', (e) => verifiedField(e.target));
shoppingLista.produkt.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.antal.addEventListener('input', (e) => verifiedField(e.target));
shoppingLista.antal.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.pris.addEventListener('input', (e) => verifiedField(e.target));
shoppingLista.pris.addEventListener('blur', (e) => verifiedField(e.target));

shoppingLista.addEventListener('submit', onSubmit);

const shoppingListaItems = document.getElementById('valdaVaror');

let produktVerified = true;
let antalVerified = true;
let prisVerified = true;

function verifiedField(field) {
    const { name, value } = field;
  
    let validationMessage = '';
    switch (name) {
      case 'produkt': {
        if (value.length < 2) {
          produktVerified = false;
          validationMessage = "Fältet 'Produkt' måste innehålla minst 2 tecken.";
        } else if (value.length > 100) {
          produktVerified = false;
          validationMessage =
            "Fältet 'Produkt' får inte innehålla mer än 100 tecken.";
        } else {
          produktVerified = true;
        }
        break;
      }
      case 'antal': {
        if (value.length > 500) {
          antalVerified = false;
          validationMessage =
            "Fältet 'Antal' får inte innehålla mer än 500 tecken.";
        } else {
          antalVerified = true;
        }
        break;
      }
      case 'pris': {

        if (value.length === 0) {
   
          prisVerified = false;
          validationMessage = "Fältet 'Pris' är obligatorisk.";
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
  
  /* För att visa så har vi då funktionen renderList som alltså hämtar api:t där uppgifterna sparas och konverterar dom till html. 
  Om uppgiften och längden på uppgiften är större än 0 kommer då listan att loopas och sedan med hjälp av insertAdjecentHTML läggas in *beforeEnd’ som är… 
  och sedan kallar man på renderTask som skapar upp denna uppgift i HTML och läggs till på sidan. */
  function renderList() {
    console.log('rendering');
  
    api.getAll().then((tasks) => {
      shoppingListaItems.innerHTML = '';
  
      if (tasks && tasks.length > 0) {
        tasks.forEach((task) => {
          shoppingListaItems.insertAdjacentHTML('beforeend', renderTask(task));
        });
      }
    });
  }

  /* Denhär funktionen gör så att listan visas dynamiskt. Denhär funktionen kallas sedan i andra funktioner så som renderList */
  /* Man genererar HTML dynamiskt genom att skriva HTML-koden i javascript. Det man gör är att man skapar upp en funktion som man skriver HTML-koden i en template string 
  som man lägger i en variabel som man sedan returnerar. Denhär funktionen kallar man sedan på i andra funktioner beroende på vad man vill ska hända. Till exempel lägga till en ny uppgift 
  eller ta bort en uppgift. */
  function renderTask({ id, produkt, antal, pris }) {
  
    let html = `
      <li class="select-none mt-2 py-2 border-b border-amber-300 bg-white/80 px-2 rounded-lg">
        <div class="">
          <h3 class="flex-1 text-xl font-bold text-cyan-900 uppercase">${produkt}</h3>
          <p class="text-xs italic">Antal: ${antal}</p>
          <p class="">${pris} kr</p>
          <button onclick="deleteTask(${id})" class="bg-cyan-700 text-xs text-white px-3 py-1 rounded-md">Ta bort</button>
        </div>`;

    return html;
  }

  /* Funktionen deleteTask hämtar api:t och raderar uppgift med hjälp av id för att sedan hämta resultatet och kallar på funktionen renderList som sedan skriver ut den nya listan. */
  function deleteTask(id) {
    api.remove(id).then((result) => {
      renderList();
    });
  }
  
  renderList();
  