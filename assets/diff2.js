// drag and drop muuri code

const grid = new Muuri(".grid", {
  dragEnabled: true,
  dragAxis: "y",
  dragPlaceholder: {
    enabled: true,
    createElement(item) {
      const placeholder = document.createElement("div");
      return placeholder;
    },
  },
  dragRelease: {
    duration: 150,
  },
  dragStartPredicate: function (item, event) {
    // Prevent first item from being dragged.
    if (event.target.nodeName === "INPUT") {
      return false;
    }
    // For other items use the default drag start predicate.
    return Muuri.ItemDrag.defaultStartPredicate(item, event);
  },
});

//dropbdown button from presets
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  $("#myDropdown").slideToggle(250);
  document.querySelector(".dropbtn").classList.toggle("active");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (
    !(
      event.target.matches(".dropbtn") ||
      event.target.nodeName === "I" ||
      event.target.matches(".add-new-preset") ||
      event.target.classList.contains("dd-trash-btn") ||
      event.target.classList.contains("save-btn") ||
      event.target.classList.contains("dd-edit-btn") ||
      event.target.classList.contains("edit-preset")
    )
  ) {
    $("#myDropdown").slideUp(250);
    document.querySelector(".dropbtn").classList.remove("active");
  }
};

// when user clicks on one of the preset options, it's displayed on the button on top
let presetOption = document.getElementsByClassName("dropdown-link");
document.addEventListener("click", function (e) {
  if (e.target.classList[0] === "dropdown-link" && e.target.children[0].nodeName == "INPUT") {
    //nothing happens, dropdown closes
  } else if (e.target.classList[0] === "dropdown-link") {
    if (e.target.nodeName != "I" && !e.target.classList.contains("dd-trash-btn")) {
      let preset = document.getElementById("dropbtn-text");
      let input = document.getElementsByClassName("edit-preset");
      //TODO
      //basically if the user types something into the input and clicks on
      //the area outside of the input, it will take the value inside of input,
      //otherwise it will take the value of the text if no input is present
      presetID = e.target.children[0].dataset.id;
      preset.innerText = e.target.children[0].innerText;
      preset.setAttribute("data-id", presetID);

      for (item of newPresetList) {
        if (item.id === parseInt(presetID)) {
          maxWbcCountDenominator.innerText = item.maxWBC;
          document.querySelector(".max-wbc-input").value = item.maxWBC;
        }
      }
    }
    displayPresets();
  }
});

//everything else
const mainTable = document.querySelector(".grid");
const gridItem = document.getElementsByClassName("item");
const ignoreCheckboxes = document.getElementsByClassName("ignore-checkbox");
const cellInput = document.getElementsByClassName("cell-td");
const keyInput = document.getElementsByClassName("key-td");
const counttd = document.getElementsByClassName("count-td");
const relativetd = document.getElementsByClassName("relative-td");
const absolutetd = document.getElementsByClassName("absolute-td");
const currentCount = document.getElementById("current-count");
const maxWbcCountDenominator = document.getElementById("max-count");
const wbcInput = document.getElementsByClassName("wbc-count-input");
const minusBtn = document.getElementById("minus-btn");
const plusBtn = document.getElementById("plus-btn");
const numpadKey = document.getElementsByClassName("numpad-key");
const numpadCell = document.getElementsByClassName("numpad-cell");
const presetInput = document.getElementById("preset-input");

const unitSelect = document.getElementById("unit-select");
const keytd = document.getElementsByClassName("key-td");
const presetSelect = document.getElementById("preset-select");

/* addButton.addEventListener('click', createInputs);
// loop the delete buttons and delete when clicked */

document.addEventListener(
  "click",
  function (e) {
    //console.log(e.target.type);
    if (e.target.classList[0] === "add-tr-btn") {
      createTr();
    }
    if (e.target.classList[0] === "boxclose") {
      deleteTr(e);
    }
    if (e.target.classList[0] === "clear-tr-btn") {
      clearTr();
    }
    if (e.target.id === "clear-table-btn") {
      clearTableNums();
    }
    if (e.target.id === "plus-btn" || e.target.id === "minus-btn") {
      addRemovePlusMinusClass(e);
    }
    if (e.target.id === "bt") {
      updateInvisWbc();
      //I have to hide it using muuri grid because otherwise display:none doesn't work
      //it leaves an empty space
      let r = grid.getItems(document.querySelectorAll(".exclude"));
      grid.hide(r, { instant: true, layout: "instant" });
      //afterwords print, and the add the excluded items back in
      setTimeout(() => {
        window.print();
        grid.show(r, { instant: true });
      }, 10);
    }
    if (e.target.classList[0] === "save-btn") {
      createPreset();
    }
    if (e.target.classList[0] === "dd-trash-btn") {
      //remove preset from allpresets array
      deletePresetFromList(e);
      //remove preset in DOM
      deletePresetRow(e);
      //update local storage
      saveToLocal();
    }
    if (e.target.classList[0] === "dd-edit-btn") {
      editPresetName(e);
    }
    if (e.target.classList[0] === "update-preset-btn") {
      updatePreset(e);
      saveToLocal();
      checkMark();
    }
    if (e.target.classList[0] === "ignore-checkbox") {
      updateCurrentCount();
      updateRelative();
      absoluteCounter();
      e.target.blur();
      e.target.parentElement.parentElement.parentElement.classList.toggle("exclude");
    }
  },
  false
);

//this updates the dom when a grid item is moved
grid.on("dragEnd", function (item, event) {
  //this happens as long as its not the "closebox" or input that's being clicked
  if (event.target.nodeName !== "INPUT" && event.target.nodeName !== "A") {
    grid.synchronize();
  }
});

document.addEventListener("input", function (e) {
  if (e.target.classList[0] === "key-td") {
    if (!dupCheck(e, keyInput)) {
      updateNumPad();
    }
  }
  if (e.target.classList[0] === "max-wbc-input") {
    updateMaxWbc(e);
  }
  if (e.target.classList[0] === "cell-td") {
    updateNumPad();
  }
});

document.addEventListener("DOMContentLoaded", (e) => {
  let retrieved = JSON.parse(localStorage.getItem("presetList"));
  if (retrieved === null || retrieved.length == 0) {
    displayDefaultPresets();
  } else {
    retrievePresets();
  }
  updateNumPad();
});

//functions
function createTr(key = "", cell = "", checked = "") {
  //create tr
  const tableRow = document.createElement("div");
  tableRow.classList.add("item");
  if (checked) {
    tableRow.classList.add("exclude");
  }
  //fill it with the html of a tr
  tableRow.innerHTML = `<div class="item-content">
            <span><input type="checkbox" class="ignore-checkbox" ${checked ? "checked" : ""}></span>
            <span><input maxlength="1" type="text" placeholder="#" value ="${key}" class="key-td"></span>
            <span class="cell"><input type="text" placeholder="Enter Cell" maxlength="20" value = "${cell}" class="cell-td"></span>
            <span class="count-td"></span>
            <span class="relative-td"></span>
            <span class="absolute-td"></span>
            <a class="boxclose" id="boxclose"></a>
        </div>`;
  //Muuri grid add at the bottom
  grid.add(tableRow, { index: -1 });
}

function deleteTr(e) {
  grid.remove(grid.getItems(e.target.parentElement.parentElement), {
    removeElements: true,
  });
  updateCurrentCount();
  updateRelative();
  absoluteCounter();
  updateNumPad();
}

function clearTr() {
  for (i = 0; i < gridItem.length; i++) grid.remove(grid.getItems(), { removeElements: true });
}

function dupCheck(e, input) {
  //first, remove the duplicate class if it's there
  e.target.classList.remove("duplicate");
  //only run check if the user actually entered something, ignore blank value
  if (e.target.value) {
    tempArray = [];
    // loop through and check for duplicate key inputs
    for (i = 0; i < input.length; i++) {
      if (tempArray.indexOf(input[i].value) === -1) {
        //only add the value to the tempArray if it's not blank
        if (input[i].value) {
          tempArray.push(input[i].value);
        }
      } else {
        // give the input a duplicate class
        e.target.classList.add("duplicate");
        setTimeout(() => {
          e.target.value = "";
          e.target.classList.remove("duplicate");
        }, 500);
        return true;
      }
    }
  }
  return false;
}

//when the user changes the max WBC in the settintgs, it updates the counter box
function updateMaxWbc(e) {
  //if user clears the max wbc, the max count is infinity
  if (!e.target.value) {
    $("#max-count").html("&infin;");
  } else {
    //removes leading zeros
    tempMaxWbc = e.target.value.replace(/^0+/, "");
    //if it's not blank (after removing leading zeors)
    if (tempMaxWbc) {
      $("#max-count").html(tempMaxWbc);
    } else {
      //make it just 0
      $("#max-count").html(0);
    }
  }
}

//code I copied from the internet that doesn't allow you to enter anything except for integers and decimals into the wbc inputs
$("[type=tel]").on("change", function (e) {
  $(e.target).val(
    $(e.target)
      .val()
      .replace(/[^\d\.]/g, "")
  );
});
$("[type=tel]").on("keypress", function (e) {
  keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  return keys.indexOf(event.key) > -1;
});

//this code prevents periods and other stuff in max wbc input
document.querySelector(".max-wbc-input").addEventListener("keydown", enterNumbers);

function enterNumbers(event) {
  if (
    event.code == "ArrowLeft" ||
    event.code == "ArrowRight" ||
    event.code == "ArrowUp" ||
    event.code == "ArrowDown" ||
    event.code == "Delete" ||
    event.code == "Backspace"
  ) {
    return;
  } else if (event.key.search(/\d/) == -1) {
    event.preventDefault();
  }
}

// clears out the numbers of the current counts
function clearTableNums() {
  for (i = 0; i < counttd.length; i++) {
    counttd[i].textContent = "";
    relativetd[i].textContent = "";
    absolutetd[i].textContent = "";
  }
  currentCount.innerText = 0;
}

// updates the current count with each additional added count
function updateCurrentCount() {
  let num = 0;
  for (i = 0; i < counttd.length; i++) {
    if (!ignoreCheckboxes[i].checked) {
      num += Number(counttd[i].innerText);
    }
  }
  currentCount.innerHTML = num;
}

//add count
function addCounter(i) {
  countNum = counttd[i].innerHTML;
  counttd[i].innerHTML = parseInt(countNum) + 1;

  updateCurrentCount();
}

//subtract count
function subtractCounter(i) {
  // count down, if statement prevents it from going below 0
  if (Number(counttd[i].innerText) !== 0) {
    countNum = counttd[i].innerHTML;
    counttd[i].innerHTML = parseInt(countNum) - 1;
  }

  updateCurrentCount();
}

function updateRelative() {
  for (i = 0; i < counttd.length; i++) {
    //if checkbox is checked to ignore, don't update the relative
    if (ignoreCheckboxes[i].checked) {
      relativetd[i].textContent = "";
      continue;
    }
    let relative = (parseInt(counttd[i].innerHTML) / parseInt(currentCount.innerHTML)) * 100;
    if (relative) {
      relativetd[i].innerHTML = `${relative.toFixed(1)}%`;
    } else {
      relativetd[i].textContent = "";
    }
  }
}
// updates absolute values
function absoluteCounter(e) {
  // counts how many values are after the decimal of the WBC input, if no decimanl then 1 is the default
  function intsAfterDec(num) {
    if (wbcInput[0].value.includes(".")) {
      var s = num.split(".");
      let ints = s[1].length;
      return ints;
    } else {
      return 1;
    }
  }
  // loops and throws in the relative values based on the WBC count
  for (i = 0; i < absolutetd.length; i++) {
    if (ignoreCheckboxes[i].checked) {
      absolutetd[i].textContent = "";
      continue;
    }
    let relative = parseInt(relativetd[i].innerText) / 100;
    let absolute = wbcInput[0].value * relative;
    // override and display 0.0 if it's NaN, otherwise display absolute
    if (absolute) {
      absolutetd[i].textContent = absolute.toFixed(intsAfterDec(wbcInput[0].value));
    } else {
      absolutetd[i].textContent = "";
    }
  }
}

// key binding counter big ass function
window.addEventListener("keydown", function (e) {
  // fires when user is not clicked inside of an input
  if (e.target.nodeName.toLowerCase() !== "input") {
    for (i = 0; i < counttd.length; i++) {
      if (e.key === keytd[i].value) {
        //flash animation by adding class flash
        for (j = 0; j < keytd.length; j++) {
          [].forEach.call(numpadKey, function (key) {
            if (e.key == key.innerText) {
              key.parentElement.parentElement.classList.add("flash");
            }
            setTimeout(() => {
              key.parentElement.parentElement.classList.remove("flash");
            }, 100);
          });
        }
        if (minusBtn.classList.contains("plus-minus-active")) {
          subtractCounter(i);
          updateRelative();
          absoluteCounter(e);
        }
        //add, if the cell is empty add a 0
        else {
          let numerator = Number(currentCount.innerText);
          let denominator = Number(maxWbcCountDenominator.innerText);
          let ding = document.getElementById("ding-sound");
          if (isNaN(denominator) || numerator < denominator) {
            if (!counttd[i].innerHTML) {
              counttd[i].innerHTML = "0";
            }
            addCounter(i), updateRelative(), absoluteCounter(e);
            if (Number(currentCount.innerText) >= Number(maxWbcCountDenominator.innerText)) {
              ding.play();
            }
          } else {
            ding.play();
          }
        }
      }
    }
  } else {
    wbcInput[0].addEventListener("input", absoluteCounter);
  }
});

//add plus minus active class
function addRemovePlusMinusClass(e) {
  if (!e.target.classList.contains("plus-minus-active")) {
    plusBtn.classList.remove("plus-minus-active");
    minusBtn.classList.remove("plus-minus-active");

    e.target.classList.add("plus-minus-active");
  }
}

//numpad updating stuff
function updateNumPad() {
  //first probably clear the numpads
  for (i = 0; i < numpadKey.length; i++) {
    numpadCell[i].innerText = "";
  }
  //then cycle over and update
  for (i = 0; i < keyInput.length; i++) {
    [].forEach.call(numpadKey, function (key) {
      if (keyInput[i].value == key.innerText) {
        key.parentElement.children[1].innerText = cellInput[i].value;
      }
    });
  }
}
//I don't remember what this does, I think it updates a field for wbc for printing
//i think this can be shorter with inner html and string literals
let formHeader = document.getElementsByClassName("print-form-header");
function updateInvisWbc() {
  if (wbcInput[0].value !== "") {
    if (formHeader[0].children.length <= 1) {
      let invisDiv = document.createElement("div");
      invisDiv.setAttribute("class", "invis-wbc");
      formHeader[0].appendChild(invisDiv);

      let contSpan = document.createElement("span");
      contSpan.classList.add("cont-span");
      invisDiv.appendChild(contSpan);

      let content = `<span>WBC: </span><span id='invis-white-count'>${wbcInput[0].value} </span><span>x</span><span id='invis-units'>${unitSelect.value}</span>`;
      contSpan.innerHTML = content;
    } else {
      invisNum = document.getElementById("invis-white-count");
      invisUnits = document.getElementById("invis-units");

      invisNum.innerText = wbcInput[0].value;
      invisUnits.innerText = unitSelect.value;
    }
  } else if (formHeader[0].children.length > 1) {
    formHeader[0].children[1].remove();
  }
}
//create the dropdown link
function createPreset() {
  if (validateInput(presetInput.value)) {
    //save preset to the list
    let id = savePresetToList();
    saveToLocal();

    createPresetDropdowns(id, presetInput.value);
    let preset = document.getElementById("dropbtn-text");
    preset.innerText = presetInput.value;
    preset.setAttribute("data-id", id);
    //create
    presetInput.value = "";
  } else {
    //TODO: put this in its own function
    presetInput.classList.add("flash-empty");
    setTimeout(() => {
      presetInput.classList.remove("flash-empty");
    }, 1000);
  }
}

function createPresetDropdowns(id, name) {
  let newOption = document.createElement("div");
  newOption.setAttribute("class", "dropdown-link");
  // when new option is created, fill the innerHTML with spans and take the input value to be the inner Text
  newOption.innerHTML = `<span class="dd-option" data-id="${id}">${name}</span>
        <span class="edit-trash-btns">
            <span class="dd-edit-btn tooltip"><i class="fas fa-edit"></i><span class="tooltiptext">Edit Preset Name</span></span>
            <span class="dd-trash-btn tooltip"><i class="fas fa-trash-alt"></i><span class="tooltiptext">Delete Preset</span></span>
        </span>`;

  $(newOption).insertBefore($(".dropdown-item"));
}
//remove the visual dropdown item
function deletePresetRow(e) {
  e.target.parentElement.parentElement.remove();
}

//when entering new preset name if user hits enter
window.addEventListener("keydown", function (e) {
  if (e.target.classList[0] === "add-new-preset") {
    if (e.key === "Enter") {
      createPreset();
    }
  }
});

function editPresetName(e) {
  //save and store the text value from the option
  let textSpan = e.target.parentElement.parentElement;
  let newPlaceholder = textSpan.children[0].innerText;
  let presetID = parseInt(textSpan.children[0].dataset.id);
  //not sure about this conditional
  if (textSpan.children[0].nodeName === "SPAN") {
    //create new input
    let newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("class", "edit-preset");
    newInput.setAttribute("placeholder", "New Preset Name");
    newInput.setAttribute("value", newPlaceholder);
    newInput.setAttribute("maxlength", 25);
    //remove text span and add in the input and select the contents
    textSpan.children[0].remove();
    textSpan.prepend(newInput);
    newInput.select();
    //change the edit button to save button
    textSpan.children[1].children[0].innerHTML = `<i class="fas fa-save"></i><span class="tooltiptext">Save Preset Name</span>`;
    textSpan.children[0].addEventListener("keydown", function (e) {
      //if user hits enter take the value and throw it into the span
      if (e.key === "Enter") {
        updatePresetDropdownAndList();
      }
    });
  } else {
    updatePresetDropdownAndList();
  }

  function updatePresetDropdownAndList() {
    let newValue = textSpan.children[0].value;
    if (validateInput(newValue)) {
      let newSpan = document.createElement("span");
      newSpan.setAttribute("class", "dd-option");
      newSpan.innerText = `${newValue}`;
      textSpan.children[0].remove();
      textSpan.prepend(newSpan);
      //edit the preset name in allpresets array
      for (item of newPresetList) {
        if (item.id === presetID) {
          item.name = newValue;
        }
      }
      //chnange save button to edit button
      textSpan.children[1].children[0].innerHTML = `<i class="fas fa-edit"></i><span class="tooltiptext">Edit Preset Name</span>`;
      //edit the text on the preset dropdown button if its the one that was edited
      if (preset.innerText === newPlaceholder) {
        let preset = document.getElementById("dropbtn-text");
        preset.innerText = newValue;
      }
      saveToLocal();
    } else {
      textSpan.children[0].classList.add("flash-empty");
      setTimeout(() => {
        textSpan.children[0].classList.remove("flash-empty");
      }, 1000);
    }
  }
}

function validateInput(input) {
  copy = input.slice();
  if (copy.replace(/\s+/g, "").length == 0) {
    return false;
  }
  return true;
}
//new preset list, to replace AllPresets
let newPresetList = [];
//preset structure
let pr = {
  id: Date.now(),
  maxWBC: 100,
  name: "Five Part",
  keyCells: [
    [5, "Neutrophil", ""],
    [4, "Monocyte", ""],
    [6, "Lymphocyte", ""],
    [1, "Eosinophil", ""],
    [5, "Basophil", ""],
  ],
};

let allPresets = [];
let presetNames = [];
let keyVals = [];
let cellVals = [];

allPresets.push(presetNames);
allPresets.push(keyVals);
allPresets.push(cellVals);

let preset = document.getElementById("dropbtn-text");

//this is done when a new preset is created
function savePresetToList() {
  //take all the input values and throw them into an object
  let tempPreset = {
    id: Math.ceil(Math.random() * 1000000000000),
    maxWBC: parseInt(maxWbcCountDenominator.innerText),
    name: presetInput.value,
  };
  //loop through and get the key and cell pairs
  let keyCellsTemp = [];
  for (i = 0; i < keyInput.length; i++) {
    //let toIgnore = keyInput[i].parentElement.previousSibling.previousSibling.childNodes[0].checked; // see if checkmark to ignore is checked
    let temp = [
      keyInput[i].value,
      cellInput[i].value,
      ignoreCheckboxes[i].checked ? "ignore" : "", //if ignore is checked add the word ignore, else blank
    ];
    keyCellsTemp.push(temp);
  }
  //add key cell pairs to object
  tempPreset.keyCells = keyCellsTemp;
  //add object to list
  newPresetList.push(tempPreset);
  return tempPreset.id;
}

//updates the preset list with new key cell pairs and max wbc
function updatePreset(e) {
  let toDelete = document.querySelectorAll(".dropdown-link");
  let presetText = document.getElementById("dropbtn-text").innerText;
  if (toDelete.length === 0) {
    presetInput.value = presetText;
    createPreset();
  }
  let presetID = parseInt(document.getElementById("dropbtn-text").dataset.id);
  for (let item of newPresetList) {
    //find the preset using the preset ID
    if (item.id === presetID) {
      //gather all new key - cell pairs, replace the keyCell val
      let keyCellsTemp = [];
      for (i = 0; i < keyInput.length; i++) {
        let temp = [keyInput[i].value, cellInput[i].value, ignoreCheckboxes[i].checked ? "ignore" : ""];
        keyCellsTemp.push(temp);
      }
      //add key cell pairs to object
      item.keyCells = keyCellsTemp;
      item.maxWBC = parseInt(maxWbcCountDenominator.innerText);
    }
  }
}

//removes preset from preset list array
function deletePresetFromList(e) {
  let presetID = parseInt(e.target.parentElement.parentElement.children[0].dataset.id);
  for (let item of newPresetList) {
    if (item.id === presetID) {
      let index = newPresetList.indexOf(item);
      newPresetList.splice(index, 1);
      break;
    }
  }
}

//functio to create and display table rows from selected preset
function displayPresets() {
  let presetID = parseInt(document.getElementById("dropbtn-text").dataset.id);
  clearTr();
  for (let preset of newPresetList) {
    if (preset.id === presetID) {
      for (let row of preset.keyCells) {
        if (row.length == 2) {
          createTr(row[0], row[1]); // if the local storage had only key and cell originally
        } else {
          createTr(row[0], row[1], row[2]);
        }
      }
    }
  }
  updateNumPad();
}

function saveToLocal() {
  serialized = JSON.stringify(newPresetList);
  localStorage.setItem("presetList", serialized);
}

function retrievePresets() {
  let toDelete = document.querySelectorAll(".dropdown-link");
  // get the presets saved to local storage
  let parsed;
  if (localStorage.getItem("presetList") !== null) {
    parsed = JSON.parse(localStorage.getItem("presetList"));

    let preset = document.getElementById("dropbtn-text");
    preset.innerText = parsed[0].name;
    preset.setAttribute("data-id", parsed[0].id);
    newPresetList = parsed;
    //displayPresets();
  }

  for (option of toDelete) {
    option.remove();
  }

  for (i = 0; i < newPresetList.length; i++) {
    createPresetDropdowns(parsed[i].id, parsed[i].name);
  }

  let preset = document.getElementById("dropbtn-text");
  preset.innerText = parsed[0].name;
  maxWbcCountDenominator.innerText = newPresetList[0].maxWBC;
  document.querySelector(".max-wbc-input").value = newPresetList[0].maxWBC;
  displayPresets();
  //
}

function displayDefaultPresets() {
  let p1 = {
    id: Math.ceil(Math.random() * 1000000000000),
    maxWBC: 100,
    name: "Five Part",
    keyCells: [
      [5, "Neutrophil", ""],
      [4, "Monocyte", ""],
      [6, "Lymphocyte", ""],
      [1, "Eosinophil", ""],
      [2, "Basophil", ""],
    ],
  };

  let p2 = {
    id: Math.ceil(Math.random() * 1000000000000),
    maxWBC: 100,
    name: "Peripheral Blood",
    keyCells: [
      [5, "Neutrophil", ""],
      [4, "Monocyte", ""],
      [6, "Lymphocyte", ""],
      [1, "Eosinophil", ""],
      [2, "Basophil", ""],
      [3, "Band", ""],
      [7, "Metamyelocyte", ""],
      [8, "Promyelocyte", ""],
      [9, "Myelocyte", ""],
      [0, "Blast", ""],
      ["+", "Other", ""],
    ],
  };

  let p3 = {
    id: Math.ceil(Math.random() * 1000000000000),
    maxWBC: 100,
    name: "Body Fluid",
    keyCells: [
      [5, "Neutrophil", ""],
      [4, "Monocyte", ""],
      [6, "Lymphocyte", ""],
      [3, "Eosinophil", ""],
      [1, "Basophil", ""],
      [2, "Macrophage", ""],
      ["+", "Other", ""],
      ["0", "Lining Cell", ""],
    ],
  };

  let p4 = {
    id: Math.ceil(Math.random() * 1000000000000),
    maxWBC: 100,
    name: "Bone Marrow",
    keyCells: [
      [0, "Blast", ""],
      [9, "Promyelocyte", ""],
      [7, "Myelocyte", ""],
      [8, "Metamyelocyte", ""],
      [3, "Band", ""],
      [5, "Seg", ""],
      [4, "Monocyte", ""],
      ["*", "Eos Myelo", ""],
      [1, "Eosinophil", ""],
      [2, "Basophil", ""],
      [6, "Lymphocyte", ""],
      ["/", "Plasma cell", ""],
      ["+", "Mast Cell", ""],
      [".", "Pronormo", ""],
      ["a", "Baso Normo", ""],
      ["b", "Poly Normo", ""],
      ["c", "Ortho Normo", ""],
    ],
  };

  newPresetList.push(p1);
  newPresetList.push(p2);
  newPresetList.push(p3);
  newPresetList.push(p4);

  let dropbdownText = document.getElementById("dropbtn-text");
  dropbdownText.setAttribute("data-id", newPresetList[0].id);

  for (i = 0; i < 4; i++) {
    createPresetDropdowns(newPresetList[i].id, newPresetList[i].name);
  }

  let preset = document.getElementById("dropbtn-text");
  preset.innerText = newPresetList[0].name;
  maxWbcCountDenominator.innerText = newPresetList[0].maxWBC;
  displayPresets();
}
//checkmark pops up instead of the save icon after updating presets
function checkMark() {
  let updateBtn = document.getElementsByClassName("update-preset-btn");
  updateBtn[0].innerHTML =
    "<div class='check-cont'><svg class='checkmark' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><circle class='checkmark__circle' cx='26' cy='26' r='25' fill='none'/><path class='checkmark__check' fill='none' d='M14.1 27.2l7.1 7.2 16.7-16.8'/></svg></div><span>Update Preset</span>";

  setTimeout(function () {
    updateBtn[0].innerHTML = '<i class="fas fa-save"></i><span>Update Preset</span>';
  }, 2500);
}

//nav dropdown in responsive
$(".navTrigger").click(function () {
  $(this).toggleClass("active");
  console.log("Clicked menu");

  $(".main-list-container").slideToggle(300);
  // $(".main-list-container").toggleClass("visible");
});
