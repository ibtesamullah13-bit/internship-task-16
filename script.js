const display = document.getElementById("display");
const message = document.getElementById("message");

let currentInput = "0";
let previousInput = null;
let operator = null;
let waitingForNumber = false;
let hasError = false;

function updateDisplay() {
    display.value = currentInput;
}

function clearMessage() {
    message.textContent = "";
}

function clearAll() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    waitingForNumber = false;
    hasError = false;
    clearMessage();
    updateDisplay();
}

function inputNumber(number) {
    clearMessage();

    if (hasError) clearAll();

    if (waitingForNumber) {
        currentInput = number;
        waitingForNumber = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput === "-0") {
        currentInput = "-" + number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}
function inputDecimal() {
    clearMessage();

    if (hasError) clearAll();

    if (waitingForNumber) {
        currentInput = "0.";
        waitingForNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}
function chooseOperator(nextOperator) {
    clearMessage();

    if (hasError) clearAll();

    if (operator && !waitingForNumber) {
        calculate();
        if (hasError) return;
    }

    previousInput = Number(currentInput);
    operator = nextOperator;
    waitingForNumber = true;
}
function calculate() {
    if (operator === null || previousInput === null) return;

    const secondInput = Number(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = previousInput + secondInput;
            break;
        case "-":
            result = previousInput - secondInput;
            break;
        case "*":
            result = previousInput * secondInput;
            break;
        case "/":
            if (secondInput === 0) {
                currentInput = "Error";
                message.textContent = "Cannot divide by zero!";
                hasError = true;
                previousInput = null;
                operator = null;
                waitingForNumber = false;
                updateDisplay();
                return;
            }
            result = previousInput / secondInput;
            break;
    }

    if (!Number.isFinite(result)) {
        currentInput = "Error";
        message.textContent = "Result is too large!";
        hasError = true;
    } else {
        result = Number(result.toPrecision(10));
        currentInput = String(result);
    }

    previousInput = null;
    operator = null;
    waitingForNumber = true;
    updateDisplay();
}
function backspace() {
    clearMessage();

    if (hasError) {
        clearAll();
        return;
    }

    if (waitingForNumber) return;

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";

    if (currentInput === "-") currentInput = "0";

    updateDisplay();
}

function changeSign() {
    clearMessage();

    if (hasError) clearAll();

    if (currentInput !== "0") {
        currentInput = currentInput.startsWith("-")
            ? currentInput.slice(1)
            : "-" + currentInput;
    }

    updateDisplay();
}

document.querySelector(".buttons").addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearAll();
                break;
            case "clear-entry":
                if (hasError) {
                    clearAll();
                } else {
                    currentInput = "0";
                    clearMessage();
                    updateDisplay();
                }
                break;
            case "backspace":
                backspace();
                break;
            case "decimal":
                inputDecimal();
                break;
            case "sign":
                changeSign();
                break;
            case "equals":
                clearMessage();
                calculate();
                break;
        }
    }
});
