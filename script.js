/* =====================================================
   MOORE MACHINE SIMULATOR
   ===================================================== */


/* ================= MACHINE DEFINITION =================

   States:
   q0, q1, q2

   Input alphabet:
   {0, 1}

   Output:
   q0 -> 0
   q1 -> 0
   q2 -> 1

   Transition function:

   q0:
      0 -> q0
      1 -> q1

   q1:
      0 -> q0
      1 -> q2

   q2:
      0 -> q0
      1 -> q2

========================================================= */


const transitionFunction = {

    q0: {
        0: "q0",
        1: "q1"
    },

    q1: {
        0: "q0",
        1: "q2"
    },

    q2: {
        0: "q0",
        1: "q2"
    }

};


const outputFunction = {

    q0: "0",

    q1: "0",

    q2: "1"

};


/* ================= SIMULATION VARIABLES ================= */

let inputString = "";

let currentState = "q0";

let currentPosition = 0;

let outputSequence = [];

let stateSequence = ["q0"];

let transitionHistory = [];

let simulationStarted = false;


/* ================= DOM ELEMENTS ================= */

const inputElement =
    document.getElementById("inputString");

const startButton =
    document.getElementById("startBtn");

const nextButton =
    document.getElementById("nextBtn");

const runButton =
    document.getElementById("runBtn");

const resetButton =
    document.getElementById("resetBtn");

const errorMessage =
    document.getElementById("errorMessage");

const currentStateElement =
    document.getElementById("currentState");

const currentInputElement =
    document.getElementById("currentInput");

const currentOutputElement =
    document.getElementById("currentOutput");

const stepCountElement =
    document.getElementById("stepCount");

const totalStepsElement =
    document.getElementById("totalSteps");

const statusTextElement =
    document.getElementById("statusText");

const latestTitleElement =
    document.getElementById("latestTitle");

const latestMessageElement =
    document.getElementById("latestMessage");

const resultInputElement =
    document.getElementById("resultInput");

const stateSequenceElement =
    document.getElementById("stateSequence");

const outputSequenceElement =
    document.getElementById("outputSequence");

const historyBody =
    document.getElementById("historyBody");

const transitionCountElement =
    document.getElementById("transitionCount");


/* ================= START SIMULATION ================= */

function startSimulation() {

    const value =
        inputElement.value.trim();


    /* Validate input */

    if (value === "") {

        showError(
            "Please enter a binary input string."
        );

        return;
    }


    if (!/^[01]+$/.test(value)) {

        showError(
            "Invalid input. Only 0 and 1 are allowed."
        );

        return;
    }


    /* Clear error */

    errorMessage.textContent = "";


    /* Save input */

    inputString = value;


    /* Reset simulation */

    currentState = "q0";

    currentPosition = 0;

    simulationStarted = true;


    /*
       IMPORTANT:

       Moore Machine produces the output
       of the INITIAL state before reading
       the first input.
    */

    outputSequence = [
        outputFunction[currentState]
    ];

    stateSequence = ["q0"];

    transitionHistory = [];


    /* Update interface */

    resultInputElement.textContent =
        inputString;

    totalStepsElement.textContent =
        inputString.length;

    stepCountElement.textContent = "0";

    currentStateElement.textContent =
        currentState;

    currentInputElement.textContent =
        "—";

    currentOutputElement.textContent =
        outputFunction[currentState];


    stateSequenceElement.textContent =
        stateSequence.join(" → ");

    outputSequenceElement.textContent =
        outputSequence.join("");


    statusTextElement.textContent =
        "Running";


    latestTitleElement.textContent =
        "Simulation started";


    latestMessageElement.textContent =
        `Initial state is q0 and its Moore output is λ(q0) = 0. ` +
        `Press Next Step to process the first input symbol.`;


    clearHistory();

    updateStateDiagram();

    highlightTableRow(currentState);

}


/* ================= NEXT STEP ================= */

function nextStep() {

    if (!simulationStarted) {

        showError(
            "Please enter an input and click Start Simulation first."
        );

        return;
    }


    /* Check whether input is finished */

    if (currentPosition >= inputString.length) {

        statusTextElement.textContent =
            "Completed";

        latestTitleElement.textContent =
            "Simulation completed";

        latestMessageElement.textContent =
            `All ${inputString.length} input symbols have been processed.`;

        return;
    }


    /* Get current input */

    const inputSymbol =
        inputString[currentPosition];


    /* Save old state */

    const oldState =
        currentState;


    /* Find next state */

    const nextState =
        transitionFunction[
            currentState
        ][inputSymbol];


    /* Move to next state */

    currentState =
        nextState;


    /* Moore output depends on NEW current state */

    const output =
        outputFunction[currentState];


    /* Save output */

    outputSequence.push(output);


    /* Save state */

    stateSequence.push(currentState);


    /* Create transition record */

    const transition = {

        step:
            currentPosition + 1,

        currentState:
            oldState,

        input:
            inputSymbol,

        nextState:
            currentState,

        output:
            output

    };


    transitionHistory.push(transition);


    /* Move position */

    currentPosition++;


    /* Update interface */

    currentStateElement.textContent =
        currentState;

    currentInputElement.textContent =
        inputSymbol;

    currentOutputElement.textContent =
        output;

    stepCountElement.textContent =
        currentPosition;


    stateSequenceElement.textContent =
        stateSequence.join(" → ");

    outputSequenceElement.textContent =
        outputSequence.join("");


    /* Latest transition */

    latestTitleElement.textContent =
        `${oldState} -- ${inputSymbol} --> ${currentState}`;

    latestMessageElement.textContent =
        `δ(${oldState}, ${inputSymbol}) = ${currentState}. ` +
        `The output of the new state is ` +
        `λ(${currentState}) = ${output}.`;


    /* Status */

    if (
        currentPosition >= inputString.length
    ) {

        statusTextElement.textContent =
            "Completed";

    } else {

        statusTextElement.textContent =
            "Running";

    }


    /* Update everything */

    updateStateDiagram();

    highlightTableRow(currentState);

    updateHistory();


}


/* ================= RUN ALL ================= */

function runAll() {

    if (!simulationStarted) {

        showError(
            "Please start the simulation first."
        );

        return;
    }


    while (
        currentPosition < inputString.length
    ) {

        nextStep();

    }

}


/* ================= RESET ================= */

function resetSimulation() {

    inputString = "";

    currentState = "q0";

    currentPosition = 0;

    outputSequence = [];

    stateSequence = ["q0"];

    transitionHistory = [];

    simulationStarted = false;


    inputElement.value = "";

    errorMessage.textContent = "";


    currentStateElement.textContent =
        "q0";

    currentInputElement.textContent =
        "—";

    currentOutputElement.textContent =
        "—";

    stepCountElement.textContent =
        "0";

    totalStepsElement.textContent =
        "0";

    statusTextElement.textContent =
        "Ready";


    latestTitleElement.textContent =
        "Awaiting first step";

    latestMessageElement.textContent =
        "Start the simulation, then advance one symbol at a time to inspect δ and λ.";


    resultInputElement.textContent =
        "—";

    stateSequenceElement.textContent =
        "—";

    outputSequenceElement.textContent =
        "—";


    clearHistory();

    updateStateDiagram();

    highlightTableRow("q0");

}


/* ================= UPDATE STATE DIAGRAM ================= */

function updateStateDiagram() {

    const states = [
        "q0",
        "q1",
        "q2"
    ];


    states.forEach(function(state) {

        const node =
            document.querySelector(
                `#${state}Node .state-circle`
            );

        const text =
            document.querySelector(
                `#${state}Node .state-name`
            );


        if (state === currentState) {

            node.classList.add("active");

            text.style.fill = "white";

        } else {

            node.classList.remove("active");

            text.style.fill = "#1e294e";

        }

    });

}


/* ================= HIGHLIGHT TABLE ================= */

function highlightTableRow(state) {

    const rows = [
        "q0",
        "q1",
        "q2"
    ];


    rows.forEach(function(rowState) {

        const row =
            document.getElementById(
                `row-${rowState}`
            );


        if (rowState === state) {

            row.classList.add(
                "selected-row"
            );

        } else {

            row.classList.remove(
                "selected-row"
            );

        }

    });

}


/* ================= UPDATE HISTORY ================= */

function updateHistory() {

    historyBody.innerHTML = "";


    transitionHistory.forEach(
        function(item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.step}
                </td>

                <td>
                    ${item.currentState}
                </td>

                <td>
                    <strong>
                        ${item.input}
                    </strong>
                </td>

                <td>
                    ${item.nextState}
                </td>

                <td>
                    <span class="output-badge light">
                        ${item.output}
                    </span>
                </td>

            `;


            historyBody.appendChild(row);

        }
    );


    if (
        transitionHistory.length === 0
    ) {

        clearHistory();

    }


    transitionCountElement.textContent =
        `${transitionHistory.length} ` +
        `transition${transitionHistory.length === 1 ? "" : "s"} recorded`;

}


/* ================= CLEAR HISTORY ================= */

function clearHistory() {

    historyBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty"
            >
                No transitions yet.
                Your execution trace will appear here.
            </td>

        </tr>

    `;


    transitionCountElement.textContent =
        "0 transitions recorded";

}


/* ================= ERROR ================= */

function showError(message) {

    errorMessage.textContent =
        message;

}


/* ================= BUTTON EVENTS ================= */

startButton.addEventListener(
    "click",
    startSimulation
);

nextButton.addEventListener(
    "click",
    nextStep
);

runButton.addEventListener(
    "click",
    runAll
);

resetButton.addEventListener(
    "click",
    resetSimulation
);


/* ================= ENTER KEY ================= */

inputElement.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startSimulation();

        }

    }
);


/* ================= INITIAL STATE ================= */

updateStateDiagram();

highlightTableRow("q0");