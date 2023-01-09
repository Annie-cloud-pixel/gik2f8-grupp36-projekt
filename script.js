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
const shoppingListaItems = document.getElementById('valdaVaror');

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
          /* Om det inte är två tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, 
          validationMessage sätts till ett lämpligt meddelande som förklarar vad som är fel.  */
          produktVerified = false;
          validationMessage = "Fältet 'Produkt' måste innehålla minst 2 tecken.";
        } else if (value.length > 100) {
          /* Validering görs också för att kontrollera att texten i fältet inte har fler än 100 tecken. */
          produktVerified = false;
          validationMessage =
            "Fältet 'Produkt' får inte innehålla mer än 100 tecken.";
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
    /* Standardbeteendet hos ett formulär är att göra så att webbsidan laddas om när submit-eventet triggas. I denna applikation vill vi fortsätta att köra JavaScript-kod för att behandla formulärets innehåll och om webbsidan skulle ladda om i detta skede skulle det inte gå.   */
  
    /* Då kan man använda eventets metod preventDefault för att förhindra eventets standardbeteende, 
    där submit-eventets standardbeteende är att ladda om webbsidan.  */
    e.preventDefault();
    /* Ytterligare en koll görs om alla fält är godkända, ifall man varken skrivit i eller lämnat något fält. */
    if (produktVerified && antalVerified && prisVerified) {
      /* Log för att se om man kommit förbi valideringen */
      console.log('Submit');
  
      /* Anrop till funktion som har hand om att skicka uppgift till api:et */
      saveTask();
    }
  }
  
  /* Funktion för att ta hand om formulärets data och skicka det till api-klassen. */
  function saveTask() {
    /* Ett objekt vid namn task byggs ihop med hjälp av formulärets innehåll */
    /* Eftersom vi kan komma åt fältet via dess namn - todoForm - och alla formulärets fält med dess namn - t.ex. title - kan vi använda detta för att sätta värden hos ett objekt. Alla input-fält har sitt innehåll lagrat i en egenskap vid namn value (som också används i validateField-funktionen, men där har egenskapen value "destrukturerats" till en egen variabel. ) */
    const task = {
      produkt: shoppingLista.produkt.value,
      antal: shoppingLista.antal.value,
      pris: shoppingLista.pris.value,
      completed: false
    };
    /* Ett objekt finns nu som har egenskaper motsvarande hur vi vill att uppgiften ska sparas ner på servern, med tillhörande värden från formulärets fält. */
  
    /* Api-objektet, d.v.s. det vi instansierade utifrån vår egen klass genom att skriva const api = new Api("http://localhost:5000/tasks); en bit upp i koden.*/
  
    /* Vår Api-klass har en create-metod. Vi skapade alltså en metod som kallas create i Api.js som ansvarar för att skicka POST-förfrågningar till vårt eget backend. Denna kommer vi nu åt genom att anropa den hos api-objektet.  */
  
    /* Create är asynkron och returnerar därför ett promise. När hela serverkommunikationen och create-metoden själv har körts färdigt, kommer then() att anropa. Till then skickas den funktion som ska hantera det som kommer tillbaka från backend via vår egen api-klass.  
    
    Callbackfunktionen som används i then() är en anonym arrow-function som tar emot innehållet i det promise som create returnerar och lagrar det i variabeln task. 
    */
  
    api.create(task).then((task) => {
      /* Task kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet "task".  */
      if (task) {
        /* När en kontroll har gjorts om task ens finns - dvs. att det som kom tillbaka från servern faktiskt var ett objekt kan vi anropa renderList(), som ansvarar för att uppdatera vår todo-lista. renderList kommer alltså att köras först när vi vet att det gått bra att spara ner den nya uppgiften.  */
        renderList();
      }
    });
  }
  
  /* En funktion som ansvarar för att skriva ut todo-listan i ett ul-element. */
  function renderList() {
    /* Logg som visar att vi hamnat i render-funktionen */
    console.log('rendering');
  
    /* Anrop till getAll hos vårt api-objekt. Metoden skapades i Api.js och har hand om READ-förfrågningar mot vårt backend. */
    api.getAll().then((tasks) => {
      /* När vi fått svaret från den asynkrona funktionen getAll, körs denna anonyma arrow-funktion som skickats till then() */
  
      /* Här används todoListElement, en variabel som skapades högt upp i denna fil med koden const todoListElement = document.getElementById('todoList');
       */
  
      /* Först sätts dess HTML-innehåll till en tom sträng. Det betyder att alla befintliga element och all befintlig text inuti 
      todoListElement tas bort. Det kan nämligen finnas list-element däri när denna kod körs, men de tas här bort för att hela 
      listan ska uppdateras i sin helhet. */
      shoppingListaItems.innerHTML = '';
  
      /* De hämtade uppgifterna från servern via api:et getAll-funktion får heta tasks, eftersom callbackfunktionen som skickades till then() har en parameter som är döpt så. Det är tasks-parametern som är innehållet i promiset. */
  
      /* Koll om det finns någonting i tasks och om det är en array med längd större än 0 */
      if (tasks && tasks.length > 0) {
        /* Om tasks är en lista som har längd större än 0 loopas den igenom med forEach. forEach tar, likt then, en callbackfunktion. Callbackfunktionen tar emot namnet på varje enskilt element i arrayen, som i detta fall är ett objekt innehållande en uppgift.  */
        tasks.forEach((task) => {
          /* Om vi bryter ned nedanstående rad får vi något i stil med:
          1. todoListElement: ul där alla uppgifter ska finnas
          2. insertAdjacentHTML: DOM-metod som gör att HTML kan läggas till inuti ett element på en given position
          3. "beforeend": positionen där man vill lägga HTML-koden, i detta fall i slutet av todoListElement, alltså längst ned i listan. 
          4. renderTask(task) - funktion som returnerar HTML. 
          5. task (objekt som representerar en uppgift som finns i arrayen) skickas in till renderTask, för att renderTask ska kunna skapa HTML utifrån egenskaper hos uppgifts-objektet. 
          */
  
          /* Denna kod körs alltså en gång per element i arrayen tasks, dvs. en  gång för varje uppgiftsobjekt i listan. */
          shoppingListaItems.insertAdjacentHTML('beforeend', renderTask(task));
        });
      }
    });
  }
  
  /* renderTask är en funktion som returnerar HTML baserat på egenskaper i ett uppgiftsobjekt. 
  Endast en uppgift åt gången kommer att skickas in här, eftersom den anropas inuti en forEach-loop, där uppgifterna loopas igenom i tur och ordning.  */
  
  /* Destructuring används för att endast plocka ut vissa egenskaper hos uppgifts-objektet. Det hade kunnat stå function renderTask(task) {...} här - för det är en hel task som skickas in - men då hade man behövt skriva task.id, task.title osv. på alla ställen där man ville använda dem. Ett trick är alltså att "bryta ut" dessa egenskaper direkt i funktionsdeklarationen istället. Så en hel task skickas in när funktionen anropas uppe i todoListElement.insertAdjacentHTML("beforeend", renderTask(task)), men endast vissa egenskaper ur det task-objektet tas emot här i funktionsdeklarationen. */
  function renderTask({ id, produkt, antal, pris }) {
    /* Baserat på inskickade egenskaper hos task-objektet skapas HTML-kod med styling med hjälp av tailwind-klasser. Detta görs inuti en templatestring  (inom`` för att man ska kunna använda variabler inuti. Dessa skrivs inom ${}) */
  
    /*
    Det som skrivs inom `` är vanlig HTML, men det kan vara lite svårt att se att det är så. Om man enklare vill se hur denna kod fungerar kan man klistra in det i ett HTML-dokument, för då får man färgkodning och annat som kan underlätta. Om man gör det kommer dock ${...} inte innehålla texten i variabeln utan bara skrivas ut som det är. Men det är lättare att felsöka just HTML-koden på det sättet i alla fall. 
    */
  
    /* Lite kort om vad HTML-koden innehåller. Det mesta är bara struktur och Tailwind-styling enligt eget tycke och smak. Värd att nämna extra är dock knappen, <button>-elementet, en bit ned. Där finns ett onclick-attribut som kopplar en eventlyssnare till klickeventet. Eventlyssnaren här heter onDelete och den får med sig egenskapen id, som vi fått med oss från task-objektet. Notera här att det går bra att sätta parenteser och skicka in id på detta viset här, men man fick inte sätta parenteser på eventlyssnare när de kopplades med addEventListener (som för formulärfälten högre upp i koden). En stor del av föreläsning 3 rörande funktioner och event förklarar varför man inte får sätta parenteser på callbackfunktioner i JavaScriptkod. 
    
    När eventlyssnaren kopplas till knappen här nedanför, görs det däremot i HTML-kod och inte JavaScript. Man sätter ett HTML-attribut och refererar till eventlyssnarfunktionen istället. Då fungerar det annorlunda och parenteser är tillåtna. */
    let html = `
      <li class="select-none mt-2 py-2 border-b border-amber-300 bg-white/80 px-2 rounded-lg">
        <div class="">
          <h3 class="flex-1 text-xl font-bold text-cyan-900 uppercase">${produkt}</h3>
          <p class="text-xs italic">Antal: ${antal}</p>
          <p class="">${pris} kr</p>
          <button onclick="deleteTask(${id})" class="bg-cyan-700 text-xs text-white px-3 py-1 rounded-md">Ta bort</button>
        </div>`;
  
    /* Här har templatesträngen avslutats tillfälligt för att jag bara vill skriva ut kommande del av koden om description faktiskt finns */
  /*
    antal &&

      (html += `
        <p class="ml-8 mt-2 text-xs italic">Antal: ${antal}</p>
    `);
  
    html += `
      </li>`; */

    /***********************Labb 2 ***********************/
    /* I ovanstående template-sträng skulle det vara lämpligt att sätta en checkbox, eller ett annat element som någon kan klicka på för att markera en uppgift som färdig. Det elementet bör, likt knappen för delete, också lyssna efter ett event (om du använder en checkbox, kolla på exempelvis w3schools vilket element som triggas hos en checkbox när dess värde förändras.). Skapa en eventlyssnare till det event du finner lämpligt. Funktionen behöver nog ta emot ett id, så den vet vilken uppgift som ska markeras som färdig. Det skulle kunna vara ett checkbox-element som har attributet on[event]="updateTask(id)". */
    /***********************Labb 2 ***********************/
  
    /* html-variabeln returneras ur funktionen och kommer att vara den som sätts som andra argument i todoListElement.insertAdjacentHTML("beforeend", renderTask(task)) */
    return html;
  }
  
  /* Funktion för att ta bort uppgift. Denna funktion är kopplad som eventlyssnare i HTML-koden som genereras i renderTask */
  function deleteTask(id) {
    /* Det id som skickas med till deleteTask är taget från respektive uppgift. Eftersom renderTask körs en gång för varje uppgift, och varje gång innehåller en unik egenskap och dess uppgifter, kommer också ett unikt id vara kopplat till respektive uppgift i HTML-listan. Det är det id:t som skickas in hit till deleteTasks. */
  
    /* Api-klassen har en metod, remove, som sköter DELETE-anrop mot vårt egna backend */
    api.remove(id).then((result) => {
      /* När REMOVE-förfrågan är skickad till backend via vår Api-klass och ett svar från servern har kommit, kan vi på nytt anropa renderList för att uppdatera listan. Detta är alltså samma förfarande som när man skapat en ny uppgift - när servern är färdig uppdateras listan så att aktuell information visas. */
  
      renderList();
      /* Notera att parametern result används aldrig i denna funktion. Vi skickar inte tillbaka någon data från servern vid DELETE-förfrågningar, men denna funktion körs när hela anropet är färdigt så det är fortfarande ett bra ställe att rendera om listan, eftersom vi här i callbackfunktionen till then() vet att den asynkrona funktionen remove har körts färdigt. */
    });
  }
  
  /***********************Labb 2 ***********************/
  /* Här skulle det vara lämpligt att skriva den funktion som angivits som eventlyssnare för när någon markerar en uppgift som färdig. Jag pratar alltså om den eventlyssnare som angavs i templatesträngen i renderTask. Det kan t.ex. heta updateTask. 
    
  Funktionen bör ta emot ett id som skickas från <li>-elementet.
  */
  
  /* Inuti funktionen kan ett objekt skickas till api-metoden update. Objektet ska som minst innehålla id på den uppgift som ska förändras, samt egenskapen completed som true eller false, beroende på om uppgiften markerades som färdig eller ofärdig i gränssnittet. 
  
  Det finns några sätt att utforma det som ska skickas till api.update-metoden. 
  
  Alternativ 1: objektet består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
  Alternativ 2: objektet består bara av förändringarna och id på den uppgift som ska förändras. Exempel: {id: 1, completed: true/false } 
  
  Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
  */
  
  /* Anropet till api.update ska följas av then(). then() behöver, som bör vara bekant vid det här laget, en callbackfunktion som ska hantera det som kommer tillbaka från servern via vår api-klass. Inuti den funktionen bör listan med uppgifter renderas på nytt, så att den nyligen gjorda förändringen syns. */
  
  /***********************Labb 2 ***********************/
  
  /* Slutligen. renderList anropas också direkt, så att listan visas när man först kommer in på webbsidan.  */
  renderList();
  