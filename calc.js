container = document.getElementById("container");
display = document.querySelector(".display");
current_num = '0';
prev_num = '';
cur_operator = '';
waiting_for_second_operand = false;
let just_calculated = false;

buttons = [['C', '±', '÷', ''],
['7', '8', '9', '×'],
['4', '5', '6', '-'],
['1', '2', '3', '+'],
['0', '.', '=', '']];

for (i = 0; i < buttons.length; i++) {
    for (j = 0; j < buttons[i].length; j++) {
        if (buttons[i][j] === '') continue;
        const button = document.createElement('button');
        button.textContent = buttons[i][j];
        button.dataset.value = buttons[i][j];
        button.classList.add("button");
        if (buttons[i][j] === '0' || buttons[i][j] === 'C') {
            button.style.gridColumn = 'span 2';
        }

        button.addEventListener('click', (e) => {
            const buttonValue = e.target.dataset.value;
            handleButtonClick(buttonValue);
        });
        container.appendChild(button);
    }
}

function updateDisplay() {
    let displayText = current_num;
    const num = parseFloat(displayText);

    if (!isNaN(num)) {
        if (Math.abs(num) >= 10000000 || (Math.abs(num) < 0.000001 && num !== 0)) {
            displayText = num.toExponential(6);
        } else if (displayText.length > 12) {
            displayText = num.toPrecision(10).replace(/\.?0+$/, '');
        }
    }

    display.textContent = displayText;
}

function handleButtonClick(value) {
    console.log("PRESSED:", value);
    switch (value) {
        case 'C':
            clear_screen();
            break;
        case '.':
            decimal();
            break;
        case '=':
            calculate();
            break;
        case '÷':
        case '×':
        case '-':
        case '+':
            handleOperator(value);
            break;
        case '±':
            toggleSign();
            break;
        default:
            addNumber(value);
    }
}
function calculate() {
    if (!prev_num || !cur_operator || waiting_for_second_operand) { return; }
    console.log("Calculating:", prev_num, cur_operator, current_num);

    let result;
    prev = Number(prev_num);
    cur = Number(current_num);

    switch (cur_operator) {
        case '÷':
            if (current_num == 0) { alert("Cannot divide by 0"); return; }
            result = prev / cur;
            break;
        case '×':
            result = prev * cur;
            break;
        case '-':
            result = prev - cur;
            break;
        case '+':
            result = prev + cur;
            break;
        default:
            return;
    }
    current_num = String(result);
    cur_operator = '';
    prev_num = '';
    waiting_for_second_operand = false;
    just_calculated = true;
    updateDisplay();
    console.log("RESULT:", current_num);
}
function handleOperator(op) {
    console.log("handleOperator called with:", op);
    console.log("State before:", { prev_num, current_num, cur_operator, waiting_for_second_operand, just_calculated });

    if (just_calculated) {
        prev_num = current_num;
        cur_operator = op;
        just_calculated = false;
        waiting_for_second_operand = true;
        return;
    }

    if (!waiting_for_second_operand && prev_num && cur_operator) {
        calculate();
        prev_num = current_num;
        cur_operator = op;
        waiting_for_second_operand = true;
    } else {
        prev_num = current_num;
        cur_operator = op;
        waiting_for_second_operand = true;
    }

    console.log("State after:", { prev_num, current_num, cur_operator, waiting_for_second_operand });
}
function addNumber(num) {
    console.log("PREV:", prev_num, "CUR:", current_num, "OP:", cur_operator, "WAITING:", waiting_for_second_operand);

    if (waiting_for_second_operand) {
        current_num = num;
        waiting_for_second_operand = false;
    } else {
        if (current_num == '0' || just_calculated) {
            just_calculated = false;
            current_num = num;
        } else {
            current_num += num;
        }
    }
    updateDisplay();
}
function toggleSign() {
    if (current_num !== "0") {
        if (current_num[0] == "-") {
            current_num = current_num.slice(1);
        } else { current_num = "-" + current_num; }
    }
    updateDisplay();
}
function clear_screen() {
    current_num = '0';
    prev_num = '';
    cur_operator = '';
    waiting_for_second_operand = false;
    just_calculated = false;
    updateDisplay();
}
function decimal() {
    if (waiting_for_second_operand) {
        current_num = '0.';
        waiting_for_second_operand = false;
    }
    else if (current_num.indexOf('.') === -1) {
        current_num += ".";
    }
    updateDisplay();
}

updateDisplay();