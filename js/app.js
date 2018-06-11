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
  deleteNullConsumables(userDatas);
  console.log(userDatas);
  createHtmlElements(userDatas);


  statistic(userDatas);

  var searchbuttonElement = document.querySelector('#search-button');
  searchbuttonElement.addEventListener('click', function () {
    searchSpaceship(userDatas);
  }, false);

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
function deleteNullConsumables(spaceships) {

  for (var i = spaceships.length - 1; i >= 0; i--) {
    if (spaceships[i].consumables == null) {
      spaceships.splice(i, 1);
    }
  }
  return spaceships;
}


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
    cardDivElement.appendChild(cardDivElementDetails);

    var s = '';
    for (var member in spaceships[i]) {
      s += member + ': ' + spaceships[i][member] + '<br/>';
    }
    cardDivElementDetails.innerHTML = s;


  }
};


// Készítened kell egy statisztikát, mely a shapceship-list class-ű div aljára a következő adatokat fogja beleírni:
// -Egy fős (crew = 1) legénységgel rendelkező hajók darabszáma.
// -A legnagyobb cargo_capacity-vel rendelkező hajó neve (model)
// -Az összes hajó utasainak (passengers) összesített száma
// -A leghosszabb(lengthiness) hajó képe
function statistic(spaceships) {
  var spaceshipListDivElement = document.querySelector(".shapceship-list");

  var StatisticDivHeader = document.createElement('h1');
  spaceshipListDivElement.appendChild(StatisticDivHeader);
  StatisticDivHeader.innerText = "Statistic:"

  var darab = 0;
  for (var i = 0; i < spaceships.length; i++) {
    if (spaceships[i].crew == 1) {
      darab++;
    }
  }

  var max = spaceships[0];
  for (var i = 1; i < spaceships.length; i++) {
    if (spaceships[i].cargo_capacity > max) {
      max = spaceships[i];
    }
  };

  var allPassangers = 0;
  for (var i = 0; i < spaceships.length; i++) {
    if (spaceships[i].passengers !== null)
      allPassangers += parseInt(spaceships[i].passengers);
  }

  var StatisticDivElement = document.createElement('div');
  spaceshipListDivElement.appendChild(StatisticDivElement);
  StatisticDivElement.innerHTML = "Egy fős legénységgel rendelkező hajók darabszáma: " + darab + "<br>" + "A legnagyobb cargo_capacity-vel rendelkező hajó neve: " + max.model + "<br>" + "Az összes hajó utasainak összesített száma: " + allPassangers + " fő" + "<br>" + "A leghosszabb hajó képe: ";

  var maxLengthiness = spaceships[0];
  for (var i = 1; i < spaceships.length; i++) {
    if (spaceships[i].lengthiness !== null) {
      if (parseInt(spaceships[i].lengthiness) > parseInt(maxLengthiness.lengthiness)) {
        maxLengthiness = spaceships[i]
      }
    }
  };

  var StatisticDivElementImage = document.createElement('img');
  spaceshipListDivElement.appendChild(StatisticDivElementImage);
  StatisticDivElementImage.src = "img/" + maxLengthiness.image;
  StatisticDivElementImage.alt = maxLengthiness.model;

};



// A jobb oldalon található keresősáv segítségével legyen lehetőség a hajókra rákeresni model szerint.
// * A keresés kattintásra induljon
// * A keresés nem case sensitive
// * Nem csak teljes egyezést vizsgálunk, tehát ha a keresett szöveg szerepel a hajó nevében már az is találat
// * Ha több találatunk is lenne, nem foglalkozunk velük, az első találat eredményét (tehát az első megfelelő névvel rendelkező hajó adatait) adjuk vissza.
// * Az adott hajó adatait a one-spaceship class-ű div-be kell megjeleníteni rendezett formában, képpel együtt.

function updateDetailsPanelBySpaceship(spaceship) {
  var detailsDivElement = document.querySelector(".one-spaceship");
  while (detailsDivElement.firstChild) {
    detailsDivElement.removeChild(detailsDivElement.firstChild);
  }

  var detailsDivElementImage = document.createElement('img');
  detailsDivElement.appendChild(detailsDivElementImage);
  detailsDivElementImage.src = "img/" + spaceship.image;
  detailsDivElementImage.alt = spaceship.model;

  var detailsDivElementName = document.createElement('div');
  detailsDivElement.appendChild(detailsDivElementName);
  detailsDivElementName.innerText = spaceship.model;

  // var detailsDivElementDetails = document.createElement("div");
  // detailsDivElement.appendChild(detailsDivElementDetails);

  // var s = '';
  // for (var member in spaceships[i]) {
  //   s += member + ': ' + spaceships[i][member] + '<br/>';
  // }
  // detailsDivElementDetails.innerHTML = s;

};

function searchSpaceship(spaceships) {
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
    detailsDivElement.innerText = "Spaceship not found";
  }
};