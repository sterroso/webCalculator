// Botón 'eval' (=)
const evalButton = document.querySelector('#button-eval');

evalButton.addEventListener('click', evalButtonClicked);

// Botones de dígitos numéricos (0, 1, 2, ..., 9)
let digitButtons = document.querySelectorAll('.digit');

digitButtons.forEach(function(digit) {
    digit.addEventListener('click', digitButtonClicked);
});

// Botones de operandos (+, -, *, /)
let operandButtons = document.querySelectorAll('.operand');

operandButtons.forEach(function(operand) {
    operand.addEventListener('click', operandButtonClicked);
});

/* 
 * Controla que no se utilicen dos veces seguidas un operando.
 * Verdadero por default ya que no se puede comenzar una expresión 
 * con un operando.
**/
let operandUsed = true;

// Botón de punto decimal ('.')
let decimalPointButton = document.querySelector('#button-decimal');

decimalPointButton.addEventListener('click', decimalPointButtonClicked);

/* 
 * Controla que no se utilice dos veces seguidas el punto decimal.
 * Es falso por default ya que se puede comenzar una expresión 
 * con un punto decimal (0.)
**/
let decimalPointUsed = false;

// Botón de retroceso (<--)
let backspaceButton = document.querySelector('#button-backspace');

backspaceButton.addEventListener('click', backspaceButtonClicked);

// Botón para 'limpiar todo' (AC)
let clearAllButton = document.querySelector('#button-clear-all');

clearAllButton.addEventListener('click', clearAllButtonClicked);

// Mantissa
let mantissa = document.querySelector('.mantissa');

// Array de dígitos para identificar caracteres.
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Array de operandos para separar partes de la mantissa.
const operands = ['+', '-', '*', '/'];

function digitButtonClicked(event) {
    number = event.target.innerText;

    if (mantissa.innerText === '0') {
        mantissa.innerText = number;
    } else {
        mantissa.innerText += number;
    }

    // Después de utilizar un dígito ya se puede volver a usar
    // un operando.
    operandUsed = false;
}

function operandButtonClicked(event) {
    if (!operandUsed) {
        operandCharacter = event.target.innerText;
        mantissaText = mantissa.innerText;
        mantissaLastChar = mantissaText[mantissaText.length - 1];

        if (mantissaLastChar === '.') { // Si termina en punto decimal...
            // Coloca un 0 (cero) al final y después el operando.
            mantissa.innerText += `0${operandCharacter}`;
        } else {
            // En otro caso sólo coloca el operando.
            mantissa.innerText += `${operandCharacter}`;
        }
        
        // Evitar que se utilice nuevamente un operando.
        operandUsed = true;

        // Despues de haber escrito un operando ya se puede volver a 
        // utilizar el punto decimal nuevamente.
        decimalPointUsed = false;
    }
}

function decimalPointButtonClicked(event) {
    if(!decimalPointUsed) {
        mantissaText = mantissa.innerText;
        mantissaLastChar = mantissaText[mantissaText.length - 1];
    
        if (mantissaText.length === 0 || digits.indexOf(mantissaLastChar) === -1) {
            mantissa.innerText += '0.';
        } else {
            mantissa.innerText += '.';
        }

        // Evitar que se vuelva a usar el punto decimal.
        decimalPointUsed = true;

        // Después de utilizar un punto decimal ya se puede volver
        // a usar un operando.
        operandUsed = false;
    }
}

function clearAllButtonClicked(event) {
    mantissa.innerText = '0';

    decimalPointUsed = false;

    operandUsed = true;
}

function evalButtonClicked(event) {
    mantissa.innerText = eval(mantissa.innerText);

    // Establecer el uso de punto decimal según el resultado:
    decimalPointUsed = (mantissa.innerText.indexOf('.') > -1);

    operandUsed = false;
}

function backspaceButtonClicked(event) {
    if(mantissa.innerText.length > 1) {
        mantissa.innerText = mantissa.innerText.slice(0, -1);

        indexLastOperand = -1;

        operands.forEach(function(value, index) {
            indexLastOperand = indexLastOperand < mantissa.innerText.lastIndexOf(value) ? mantissa.innerText.lastIndexOf(value) : indexLastOperand;
        });

        if (indexLastOperand === -1) { // No hay ningún operando en la mantissa.
            operandUsed = false;

            decimalPointUsed = (mantissa.innerText.indexOf('.') > -1);
        } else {
            /* 
             * Si mantissa.innerText es "3.14159267+",
             * indexLastOperand es 10, y
             * mantissa.innerText.length es 11
            **/
            operandUsed = (indexLastOperand === mantissa.innerText.length - 1);

            /*
             * Si mantissa.innerText es "3.14159267*123."
             * mantissa.innerText.lastIndexOf('.') es 14, y
             * indexLastOperand es 10, por lo tanto:
             * indexLastOperand < mantissa.innerText.lastIndexOf('.')
            **/
           decimalPointUsed = (indexLastOperand < mantissa.innerText.lastIndexOf('.'));
        }
    } else {
        mantissa.innerText = '0';

        operandUsed = true;

        decimalPointUsed = false;
    }
}