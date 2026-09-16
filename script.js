/* =========================================================
   POLYCALC - POLYNOMIAL ARITHMETIC SYSTEM
   C++ OOP + SINGLY LINKED LIST VISUALIZATION
========================================================= */


/* =========================
   GLOBAL STATE
========================= */

let calculationCount = 27;
let calculationHistory = [];

let currentPolynomialA = [];
let currentPolynomialB = [];


/* =========================
   DOM HELPERS
========================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================
   POLYNOMIAL PARSER
========================= */

function parsePolynomial(expression) {

    if (!expression || expression.trim() === '') {
        return [];
    }

    expression = expression
        .replace(/\s+/g, '')
        .replace(/−/g, '-');

    if (expression[0] !== '-' && expression[0] !== '+') {
        expression = '+' + expression;
    }

    const terms = [];
    const termPattern = /([+-])([^+-]+)/g;

    let match;

    while ((match = termPattern.exec(expression)) !== null) {

        const sign = match[1] === '-' ? -1 : 1;
        const term = match[2];

        let coefficient;
        let exponent;

        if (term.includes('x')) {

            const coefficientPart = term.split('x')[0];

            if (coefficientPart === '' || coefficientPart === '1') {
                coefficient = 1;
            } else {
                coefficient = Number(coefficientPart);
            }

            coefficient *= sign;

            if (term.includes('^')) {
                exponent = Number(term.split('^')[1]);
            } else {
                exponent = 1;
            }

        } else {

            coefficient = sign * Number(term);
            exponent = 0;
        }

        if (!isNaN(coefficient) && !isNaN(exponent)) {

            terms.push({
                coefficient,
                exponent
            });
        }
    }

    return mergeLikeTerms(terms);
}


/* =========================
   LINKED LIST LOGIC
========================= */

function mergeLikeTerms(terms) {

    const map = {};

    terms.forEach(term => {

        if (!map[term.exponent]) {
            map[term.exponent] = 0;
        }

        map[term.exponent] += term.coefficient;
    });

    return Object.keys(map)
        .map(exp => ({
            coefficient: map[exp],
            exponent: Number(exp)
        }))
        .filter(term => term.coefficient !== 0)
        .sort((a, b) => b.exponent - a.exponent);
}


/* =========================
   FORMAT POLYNOMIAL
========================= */

function formatPolynomial(terms) {

    if (!terms || terms.length === 0) {
        return '0';
    }

    let result = '';

    terms.forEach((term, index) => {

        const coefficient = term.coefficient;
        const exponent = term.exponent;
        const absCoefficient = Math.abs(coefficient);

        let termText = '';

        if (exponent === 0) {

            termText = absCoefficient.toString();

        } else if (exponent === 1) {

            termText =
                absCoefficient === 1
                    ? 'x'
                    : `${absCoefficient}x`;

        } else {

            termText =
                absCoefficient === 1
                    ? `x^${exponent}`
                    : `${absCoefficient}x^${exponent}`;
        }

        if (index === 0) {

            result += coefficient < 0
                ? `-${termText}`
                : termText;

        } else {

            result += coefficient < 0
                ? ` - ${termText}`
                : ` + ${termText}`;
        }
    });

    return result;
}


/* =========================
   INPUT UPDATE
========================= */

function updateVisualizer() {

    currentPolynomialA =
        parsePolynomial(getElement('polyA').value);

    currentPolynomialB =
        parsePolynomial(getElement('polyB').value);

    updateLinkedList(currentPolynomialA);

    updateStatistics(currentPolynomialA);

    updateHeroGraph(
        currentPolynomialA,
        currentPolynomialB
    );

    const heroText =
        getElement('heroPolynomialText');

    if (heroText) {

        heroText.textContent =
            `A: ${formatPolynomial(currentPolynomialA)}  |  B: ${formatPolynomial(currentPolynomialB)}`;
    }
}


/* =========================
   LINKED LIST VISUALIZER
========================= */

function updateLinkedList(terms) {

    const linkedList = getElement('linkedList');
    const nodeCount = getElement('nodeCount');

    if (!linkedList) return;

    linkedList.innerHTML = '';

    if (terms.length === 0) {

        linkedList.innerHTML = `
            <span class="empty-state">
                Enter a polynomial to visualize nodes
            </span>
        `;

        if (nodeCount) {
            nodeCount.textContent = '0 NODES';
        }

        return;
    }

    terms.forEach((term, index) => {

        const node = document.createElement('div');

        node.className = 'node';

        node.innerHTML = `
            <strong>${term.coefficient}</strong>
            <small>COEFFICIENT</small>
            <b>x^${term.exponent}</b>
            <small>EXPONENT</small>
        `;

        linkedList.appendChild(node);

        if (index < terms.length - 1) {

            const arrow = document.createElement('span');

            arrow.className = 'arrow';
            arrow.textContent = '→';

            linkedList.appendChild(arrow);
        }
    });

    const nullNode = document.createElement('span');

    nullNode.className = 'null-node';
    nullNode.textContent = '→ NULL';

    linkedList.appendChild(nullNode);

    if (nodeCount) {

        nodeCount.textContent =
            `${terms.length} NODE${terms.length === 1 ? '' : 'S'}`;
    }
}


/* =========================
   STATISTICS
========================= */

function updateStatistics(terms) {

    const degreeStat = getElement('degreeStat');
    const termsStat = getElement('termsStat');
    const headStat = getElement('headStat');
    const totalNodesStat = getElement('totalNodesStat');

    if (terms.length === 0) {

        if (degreeStat) degreeStat.textContent = '0';
        if (termsStat) termsStat.textContent = '0';
        if (headStat) headStat.textContent = 'NULL';
        if (totalNodesStat) totalNodesStat.textContent = '0';

        return;
    }

    if (degreeStat) {
        degreeStat.textContent = terms[0].exponent;
    }

    if (termsStat) {
        termsStat.textContent = terms.length;
    }

    if (headStat) {

        headStat.textContent =
            `${terms[0].coefficient}x^${terms[0].exponent}`;
    }

    if (totalNodesStat) {
        totalNodesStat.textContent = terms.length;
    }
}


/* =========================
   POLYNOMIAL OPERATIONS
========================= */

function addPolynomials(a, b) {

    return mergeLikeTerms([
        ...a,
        ...b
    ]);
}


function subtractPolynomials(a, b) {

    const negativeB = b.map(term => ({

        coefficient: -term.coefficient,
        exponent: term.exponent

    }));

    return mergeLikeTerms([
        ...a,
        ...negativeB
    ]);
}


function multiplyPolynomials(a, b) {

    const result = [];

    a.forEach(first => {

        b.forEach(second => {

            result.push({

                coefficient:
                    first.coefficient *
                    second.coefficient,

                exponent:
                    first.exponent +
                    second.exponent
            });
        });
    });

    return mergeLikeTerms(result);
}


function derivativePolynomial(terms) {

    return terms

        .filter(term => term.exponent !== 0)

        .map(term => ({

            coefficient:
                term.coefficient *
                term.exponent,

            exponent:
                term.exponent - 1
        }));
}


/* =========================
   CALCULATOR
========================= */

function calculate(operation) {

    const a =
        parsePolynomial(getElement('polyA').value);

    const b =
        parsePolynomial(getElement('polyB').value);

    currentPolynomialA = a;
    currentPolynomialB = b;

    let result = [];
    let title = '';

    if (operation === 'add') {

        result = addPolynomials(a, b);
        title = 'Polynomial Addition';

    } else if (operation === 'subtract') {

        result = subtractPolynomials(a, b);
        title = 'Polynomial Subtraction';

    } else if (operation === 'multiply') {

        result = multiplyPolynomials(a, b);
        title = 'Polynomial Multiplication';

    } else if (operation === 'derivative') {

        result = derivativePolynomial(a);
        title = 'Polynomial Derivative';
    }

    const resultElement =
        getElement('result');

    const titleElement =
        getElement('resultTitle');

    if (resultElement) {

        resultElement.textContent =
            formatPolynomial(result);

        resultElement.classList.remove('animate');

        void resultElement.offsetWidth;

        resultElement.classList.add('animate');
    }

    if (titleElement) {

        titleElement.textContent =
            title;
    }

    addToHistory(
        title,
        formatPolynomial(result)
    );

    updateCalculationCount();

    updateHeroGraph(
        currentPolynomialA,
        currentPolynomialB
    );
}


/* =========================
   SIMPLIFY
========================= */

function simplifyPolynomial() {

    const input =
        getElement('polyA');

    const terms =
        parsePolynomial(input.value);

    input.value =
        formatPolynomial(terms);

    updateVisualizer();

    showTemporaryResult(
        'Polynomial Simplified',
        formatPolynomial(terms)
    );
}


/* =========================
   INTEGRATION
========================= */

function integratePolynomial() {

    const terms =
        parsePolynomial(
            getElement('polyA').value
        );

    const result =
        terms.map(term => ({

            coefficient:
                term.coefficient /
                (term.exponent + 1),

            exponent:
                term.exponent + 1
        }));

    const formatted =
        formatPolynomial(result) + ' + C';

    showTemporaryResult(
        'Polynomial Integration',
        formatted
    );
}


/* =========================
   DIVISION
========================= */

function dividePolynomial() {

    const a =
        parsePolynomial(
            getElement('polyA').value
        );

    const b =
        parsePolynomial(
            getElement('polyB').value
        );

    if (a.length === 0 || b.length === 0) {

        showTemporaryResult(
            'Polynomial Division',
            'Enter both polynomials'
        );

        return;
    }

    const quotientCoefficient =
        a[0].coefficient /
        b[0].coefficient;

    const quotientExponent =
        a[0].exponent -
        b[0].exponent;

    const result = [{

        coefficient: quotientCoefficient,
        exponent: quotientExponent

    }];

    showTemporaryResult(
        'Polynomial Division',
        formatPolynomial(result)
    );
}


/* =========================
   COMPARE
========================= */

function comparePolynomials() {

    const a =
        formatPolynomial(
            parsePolynomial(
                getElement('polyA').value
            )
        );

    const b =
        formatPolynomial(
            parsePolynomial(
                getElement('polyB').value
            )
        );

    const result =
        a === b
            ? 'Polynomials are Equivalent'
            : 'Polynomials are Different';

    showTemporaryResult(
        'Polynomial Comparison',
        result
    );
}


/* =========================
   TEMPORARY RESULT
========================= */

function showTemporaryResult(title, result) {

    const titleElement =
        getElement('resultTitle');

    const resultElement =
        getElement('result');

    if (titleElement) {

        titleElement.textContent =
            title;
    }

    if (resultElement) {

        resultElement.textContent =
            result;

        resultElement.classList.remove('animate');

        void resultElement.offsetWidth;

        resultElement.classList.add('animate');
    }

    updateCalculationCount();
}


/* =========================
   EVALUATE
========================= */

function evaluatePolynomial() {

    const terms =
        parsePolynomial(
            getElement('polyA').value
        );

    const x =
        Number(
            getElement('evalValue').value
        );

    if (terms.length === 0 || isNaN(x)) {

        getElement('evaluationResult').textContent =
            'Enter valid values';

        return;
    }

    let result = 0;

    terms.forEach(term => {

        result +=
            term.coefficient *
            Math.pow(x, term.exponent);
    });

    getElement('evaluationResult').textContent =
        `P(${x}) = ${result}`;
}


/* =========================================================
   DUAL POLYNOMIAL GRAPH ENGINE
========================================================= */

function updateHeroGraph(termsA, termsB) {

    const canvas =
        getElement('heroGraphCanvas');

    if (!canvas) return;

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawGraphGrid(
        ctx,
        width,
        height
    );

    const allValues = [];

    if (termsA && termsA.length > 0) {

        allValues.push(
            ...getGraphValues(termsA)
        );
    }

    if (termsB && termsB.length > 0) {

        allValues.push(
            ...getGraphValues(termsB)
        );
    }

    const maxValue =
        Math.max(
            ...allValues.map(value => Math.abs(value)),
            1
        );

    if (termsA && termsA.length > 0) {

        drawPolynomialGraph(
            ctx,
            termsA,
            width,
            height,
            maxValue,
            '#19d9ff'
        );
    }

    if (termsB && termsB.length > 0) {

        drawPolynomialGraph(
            ctx,
            termsB,
            width,
            height,
            maxValue,
            '#a56bff'
        );
    }

    ctx.shadowBlur = 0;
}


/* =========================
   GRAPH VALUE ENGINE
========================= */

function getGraphValues(terms) {

    const values = [];

    for (
        let x = -5;
        x <= 5;
        x += 0.1
    ) {

        let y = 0;

        terms.forEach(term => {

            y +=
                term.coefficient *
                Math.pow(x, term.exponent);
        });

        if (isFinite(y)) {

            values.push(y);
        }
    }

    return values;
}


/* =========================
   GRAPH GRID
========================= */

function drawGraphGrid(ctx, width, height) {

    ctx.strokeStyle =
        'rgba(138, 234, 255, 0.08)';

    ctx.lineWidth = 1;

    const gridSize = 32;

    for (
        let x = 0;
        x <= width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, height);

        ctx.stroke();
    }

    for (
        let y = 0;
        y <= height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(width, y);

        ctx.stroke();
    }

    ctx.strokeStyle =
        'rgba(138, 234, 255, 0.25)';

    ctx.lineWidth = 1.2;

    ctx.beginPath();

    ctx.moveTo(
        width / 2,
        0
    );

    ctx.lineTo(
        width / 2,
        height
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        0,
        height / 2
    );

    ctx.lineTo(
        width,
        height / 2
    );

    ctx.stroke();
}


/* =========================
   POLYNOMIAL GRAPH
========================= */

function drawPolynomialGraph(
    ctx,
    terms,
    width,
    height,
    maxValue,
    graphColor
) {

    ctx.beginPath();

    ctx.strokeStyle =
        graphColor;

    ctx.lineWidth = 3;

    ctx.shadowColor =
        graphColor;

    ctx.shadowBlur = 12;

    let started = false;

    for (
        let px = 0;
        px <= width;
        px++
    ) {

        const x =
            (px - width / 2) /
            (width / 10);

        let y = 0;

        terms.forEach(term => {

            y +=
                term.coefficient *
                Math.pow(x, term.exponent);
        });

        const py =
            height / 2 -
            (y / maxValue) *
            (height * 0.42);

        if (!isFinite(py)) {

            started = false;

            continue;
        }

        if (!started) {

            ctx.moveTo(px, py);

            started = true;

        } else {

            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
}


/* =========================
   EXAMPLES
========================= */

function setExample(id, value) {

    const input =
        getElement(id);

    if (!input) return;

    input.value = value;

    updateVisualizer();
}


/* =========================
   HISTORY
========================= */

function addToHistory(title, result) {

    calculationHistory.unshift({

        title,
        result,

        time:
            new Date().toLocaleTimeString(
                [],
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )
    });

    renderHistory();
}


function renderHistory() {

    const historyElement =
        getElement('history');

    if (!historyElement) return;

    historyElement.innerHTML = '';

    calculationHistory
        .slice(0, 5)
        .forEach((item, index) => {

            const historyItem =
                document.createElement('div');

            historyItem.className =
                'history-item';

            historyItem.innerHTML = `

                <strong>${index + 1}</strong>

                <span>
                    ${item.title}
                </span>

                <b>
                    ${item.result}
                </b>

                <small>
                    ${item.time}
                </small>

            `;

            historyElement.appendChild(
                historyItem
            );
        });
}


function clearHistory() {

    calculationHistory = [];

    renderHistory();
}


/* =========================
   CALCULATION COUNTER
========================= */

function updateCalculationCount() {

    calculationCount++;

    const counter =
        getElement('calculationCount');

    if (counter) {

        counter.textContent =
            calculationCount;
    }
}


/* =========================
   EXPORT
========================= */

function exportResult() {

    const result =
        getElement('result').textContent;

    const blob =
        new Blob(
            [result],
            {
                type: 'text/plain'
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement('a');

    link.href = url;

    link.download =
        'polynomial-result.txt';

    link.click();

    URL.revokeObjectURL(url);
}


/* =========================
   GRAPH BUTTON
========================= */

function showGraph() {

    const graph =
        getElement('heroGraphCanvas');

    if (graph) {

        graph.scrollIntoView({

            behavior: 'smooth',

            block: 'center'
        });
    }

    updateHeroGraph(

        parsePolynomial(
            getElement('polyA').value
        ),

        parsePolynomial(
            getElement('polyB').value
        )
    );
}


/* =========================
   THEME
========================= */

const themeBtn =
    getElement('themeBtn');

if (themeBtn) {

    themeBtn.addEventListener(
        'click',
        () => {

            document.body.classList.toggle(
                'light-mode'
            );
        }
    );
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const defaultA =
            parsePolynomial(
                '3x^2 + 2x + 1'
            );

        const defaultB =
            parsePolynomial(
                'x^3 - 4x + 2'
            );

        currentPolynomialA =
            defaultA;

        currentPolynomialB =
            defaultB;

        updateLinkedList(
            defaultA
        );

        updateStatistics(
            defaultA
        );

        updateHeroGraph(
            defaultA,
            defaultB
        );

        const heroText =
            getElement(
                'heroPolynomialText'
            );

        if (heroText) {

            heroText.textContent =
                `A: ${formatPolynomial(defaultA)} | B: ${formatPolynomial(defaultB)}`;
        }
    }
);