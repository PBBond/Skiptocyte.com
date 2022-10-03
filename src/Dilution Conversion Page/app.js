let value = document.querySelector(".value");
//let numerator = document.querySelector(".numerator");
//let denominator = document.querySelector(".denominator");
//let result = document.querySelector(".result-box");

//code I copied from the internet that doesn't allow you to enter anything except for integers and decimals into the wbc inputs
// function inputValidator() {
//     $("[type=tel]").on("change", function (e) {
//         console.log("this function");
//         $(e.target).val(
//             $(e.target)
//                 .val()
//                 .replace(/[^\d\.]/g, "")
//         );
//     });
//     $("[type=tel]").on("keypress", function (e) {
//         keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
//         return keys.indexOf(e.key) > -1;
//     });
// }
function validate(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
}
document.addEventListener("input", function (e) {
    if (e.target.classList[0] == "textarea") return;
    e.target.value = validate(e.target.value);
    calcResult(e);
    if (e.target.classList[0] == "denominator" || e.target.classList[0] == "numerator") {
        let target = e.target;
        if (target.value.length > 4) {
            target.style.fontSize = "1.5rem";
        } else {
            target.style.fontSize = "2rem";
        }
    }
});

//calculates results from inputs, either of 3 inputs can be used
function calcResult(e) {
    let index;
    let realValue;
    let numerator;
    let denominator;
    allValues = document.querySelectorAll(".value");
    if (e.target.parentNode.classList[0] == "df-container") {
        let containers = document.getElementsByClassName("df-container");
        index = Array.prototype.indexOf.call(containers, e.target.parentNode);
    } else {
        index = Array.prototype.indexOf.call(allValues, e.target);
    }
    //if value field is empty make it 0
    realValue = allValues[index].value;
    if (!realValue) {
        realValue = 0;
    }
    numerator = document.getElementsByClassName("numerator")[index].value;
    denominator = document.getElementsByClassName("denominator")[index].value;

    //if numerator or denominator field is empty give it a 1
    if (!numerator) {
        numerator = 1;
    }
    if (!denominator) {
        denominator = 1;
    }

    ratio = numerator / denominator;
    let actualResult = realValue / ratio;

    let resultField = document.querySelectorAll(".result-box")[index];
    if (isNaN(actualResult)) {
        result.innerText = "Bruh...";
    } else {
        function intsAfterDec(num) {
            num = num.toString();
            if (num.includes(".")) {
                var s = num.split(".");
                let ints = s[1].length;
                return ints;
            } else {
                return 0;
            }
        }
        //adds commas every three numbers
        function numberWithCommas(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return str.join(".");
        }
        //final result is calcd with the same number after decimal as the value input
        let finalResult = realValue / ratio;
        resultField.innerText = numberWithCommas(finalResult.toFixed(intsAfterDec(realValue)));
    }
}

document.addEventListener("click", function (e) {
    if (e.target.classList[0] === "numerator" || e.target.classList[0] === "denominator") {
        //when then num or denom is clicked it selects it
        e.target.select();
    }
    if (e.target.classList[0] === "clear") {
        //erase button clears the value and sets it back in focus
        e.target.parentNode.childNodes[1].value = "";
        e.target.parentNode.childNodes[1].select();
        e.target.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].innerText = 0;
    }
    if (e.target.classList[1] === "fa-times") {
        closeNote();
    }
    if (e.target.classList[0] === "note") {
        addNote(e);
    }
    if (e.target.classList[0] === "add-dc-btn") {
        addNewRow();
    }
});

window.onload = function () {
    value.focus();
    //inputValidator();
};

function addNote(e) {
    let index = Array.prototype.indexOf.call(document.getElementsByClassName("note"), e.target);
    let textArea = document.getElementsByClassName("textarea")[index];
    let noteIcon = document.getElementsByClassName("fa-sticky-note")[index];
    let closeButton = document.getElementsByClassName("fa-times-circle")[index];

    if (!e.target.classList.contains("open")) {
        var tl = gsap.timeline({ defaults: { duration: 0.2, ease: "power2" } });

        tl.to(e.target, { backgroundColor: "#2f80ed", duration: 0.2 })
            .to(textArea, { width: 200, padding: 5, ease: "power2", duration: 0.1 }, "-=0.2")
            .to(noteIcon, { opacity: 0 })
            .to(closeButton, { opacity: 1 }, "-=0.2");
        setTimeout(() => {
            textArea.setAttribute("placeholder", "Note");
            textArea.focus();
        }, 300);

        e.target.classList.add("open");
    } else {
        var tl2 = gsap.timeline({ defaults: { duration: 0.2, ease: "power2" } });

        textArea.setAttribute("placeholder", "");
        textArea.value = "";

        tl2.to(e.target, { backgroundColor: "#e5e5e5", duration: 0.2 })
            .to(textArea, { width: 0, padding: 0, ease: "power2.inOut", duration: 0.1 }, "-=0.2")
            .to(noteIcon, { opacity: 1 })
            .to(closeButton, { opacity: 0 }, "-=0.3");

        e.target.classList.remove("open");
    }
}

function addNewRow() {
    //inputValidator();
    let newRow = document.createElement("div");
    newRow.classList.add("dc-row");
    newRow.innerHTML = `
    <div class="dc-box">
        <div class="value-container">
            <h3 class="value-text">Value</h3>
            <div class="value-pill">
                <input type="tel" class="value">
                <span class="clear tooltip">
                    <i class="fas fa-eraser"></i>
                <span class="tooltiptext">Clear</span>
                </span>
            </div>
        </div>
        <div class="dilution-factor-container">
            <h3 class="dilution-text">Dilution</h3>
            <div class="df-container">
                <input type="tel" class="numerator" value="1">
                <span class="colon">:</span>
                <input type="tel" class="denominator" value="1">
            </div>
        </div>
        <div class="result-container">
            <h3 class="result-text">Result</h3>
            <span class="result-box">0</span>
        </div>
    </div>
    <textarea spellcheck="false" class="textarea"></textarea>
    <div class="note">
        <i class="far fa-sticky-note"></i>
        <i class="far fa-times-circle"></i>
        
    </div>`;

    document.querySelector(".container").append(newRow);
}
