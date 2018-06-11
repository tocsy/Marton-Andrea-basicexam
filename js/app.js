function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  console.log(userDatas);
  sortSpaceshipsByCostInCredits(userDatas);
  createHtmlElements(userDatas);

  var searchbuttonElement = document.querySelector('#search-button');
  searchbuttonElement.addEventListener('click', function () {
    searchCharacter(userDatas);
  }, false);

  statistic(userDatas);
}

getData('/json/spaceships.json', successAjax);


// A kapott adatokat rendezd ár(cost_in_creadits) szerint növekvő sorrendbe.
function sortSpaceshipsByCostInCredits(spaceships) {
  spaceships = spaceships.sort(function (lho, rho) {
    var result;

    if (lho.cost_in_credits > rho.cost_in_credits) {
      result = 1;
    } else if (lho.cost_in_credits == rho.cost_in_credits) {
      result = 0;
    } else if (lho.cost_in_credits < rho.cost_in_credits) {
      result = -1;
    }
    return result;
  });
};


// Töröld az összes olyan adatot, ahol a consumables értéke NULL. Fontos, hogy ne csak undefined-ra állítsd a tömbelemet!!!
// function deleteNullConsumables(spaceships) {

//   for (var i = 0; i < spaceships.length; i++) {



// Az összes NULL értéket (minden objektum minden tulajdonságánál) módosítsd "unknown"-ra



// A shapceship-list class-ű divbe jelenítsd meg az így kapott hajók adatait, beleérve a képét is.
function createHtmlElements(spaceships) {
  var spaceshipListDivElement = document.querySelector(".shapceship-list");

  for (var i = 0; i < spaceships.length; i++) {

    var cardDivElement = document.createElement('div');
    cardDivElement.classList.add("card");
    spaceshipListDivElement.appendChild(cardDivElement);

    var cardDivElementImage = document.createElement("img");
    cardDivElementImage.classList.add("image-spaceship");
    cardDivElement.appendChild(cardDivElementImage);
    cardDivElementImage.src = "img/" + spaceships[i].image;
    cardDivElementImage.alt = spaceships[i].model;

    var cardDivElementName = document.createElement("div");
    cardDivElementName.classList.add("model-spaceship");
    cardDivElement.appendChild(cardDivElementName);
    cardDivElementName.innerText = spaceships[i].model;

    var cardDivElementDetails = document.createElement("div");
    cardDivElementDetails.classList.add("model-spaceship");
    cardDivElement.appendChild(cardDivElementName);

    var s = '';
    for (var member in spaceships[i]) {
      s += member + ': ' + spaceships[i][member] + '<br/>';
    }
    cardDivElementDetails.innerText = s;




    // var cardDivElementConsumables = document.createElement("div");
    // cardDivElementConsumables.classList.add("consumables-spaceship");
    // cardDivElement.appendChild(cardDivElementConsumables);
    // cardDivElementConsumables.innerText = spaceships[i].consumables;

    // var cardDivElementDenomination = document.createElement("div");
    // cardDivElementDenomination.classList.add("denomination-spaceship");
    // cardDivElement.appendChild(cardDivElementConsumables);
    // cardDivElementDenomination.innerText = spaceships[i].denomination;


    // var cardDivElementCargoCapacity = document.createElement("div");
    // cardDivElementCargoCapacity.classList.add("cargo_capacity-spaceship");
    // cardDivElement.appendChild(cardDivElementCargoCapacity);
    // cardDivElementCargoCapacity.innerText = spaceships[i].cargo_capacity;


  }
};


// Készítened kell egy statisztikát, mely a shapceship-list class-ű div aljára a következő adatokat fogja beleírni:
// -Egy fős (crew = 1) legénységgel rendelkező hajók darabszáma.
// -A legnagyobb cargo_capacity-vel rendelkező hajó neve (model)
// -Az összes hajó utasainak (passengers) összesített száma
// -A leghosszabb(lengthiness) hajó képe
function statistic(spaceships) {
  var spaceshipListDivElement = document.querySelector(".shapceship-list");

  var darab = 0;
  for (var i = 0; i < spaceships.length; i++) {
    if (spaceships[i].crew == 1) {
      darab++;
    }

  }


  var StatisticDivElement = document.createElement('div');
  spaceshipListDivElement.appendChild(StatisticDivElement);
  StatisticDivElement.innerText = s;


};



// A jobb oldalon található keresősáv segítségével legyen lehetőség a hajókra rákeresni model szerint.
// * A keresés kattintásra induljon
// * A keresés nem case sensitive
// * Nem csak teljes egyezést vizsgálunk, tehát ha a keresett szöveg szerepel a hajó nevében már az is találat
// * Ha több találatunk is lenne, nem foglalkozunk velük, az első találat eredményét (tehát az első megfelelő névvel rendelkező hajó adatait) adjuk vissza.
// * Az adott hajó adatait a one-spaceship class-ű div-be kell megjeleníteni rendezett formában, képpel együtt.

function updateDetailsPanelBySpaceship(spaceships) {
  var detailsDivElement = document.querySelector(".one-spaceship");
  // while (detailsDivElement.firstChild) {
  //   detailsDivElement.removeChild(detailsDivElement.firstChild);
  // }

  var detailsDivElementImage = document.createElement('img');
  detailsDivElement.appendChild(detailsDivElementImage);
  detailsDivElementImage.src = "img/" + spaceships[i].image;
  detailsDivElementImage.alt = spaceships[i].model;

  var detailsDivElementName = document.createElement('div');
  detailsDivElement.appendChild(detailsDivElementName);
  detailsDivElementName.classList.add("spaceshipName")
  detailsDivElementName.innerText = spaceships[i].model;

  // var detailsDivElementBio = document.createElement('div');
  // detailsDivElement.appendChild(detailsDivElementBio);
  // detailsDivElementBio.classList.add("characterDetials")
  // detailsDivElementBio.innerText = spaceships.bio;

};

function searchCharacter(spaceships) {
  var searchTextBox = document.querySelector("#search-text")
  var filter = searchTextBox.value;

  // if (filter == '') {
  //   return;
  // };

  var filtered;

  for (var i = 0; i < spaceships.length; i++) {
    if (spaceships[i].model.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
      filtered = (spaceships[i]);
      break;
    }
  }
  if (filtered) {
    updateDetailsPanelBySpaceship(filtered)
  } else {
    var detailsDivElement = document.querySelector(".one-spaceship");
    detailsDivElement.innerText = "Character not found";
  }
};