interface State {
    name: string;
    transitions: { [symbol: string]: string[] };
}

class Automaton {
    states: State[];
    startState: string;
    acceptStates: Set<string>;

    constructor(states: State[], startState: string, acceptStates: string[]) {
        this.states = states;
        this.startState = startState;
        this.acceptStates = new Set(acceptStates);
    }

    isAccepted(input: string): boolean {
        let currentState = this.startState;

        for (const symbol of input) {
            const transitions = this.states.find(state => state.name === currentState)?.transitions[symbol];
            if (!transitions) return false;
            currentState = transitions[0];
        }

        return this.acceptStates.has(currentState);
    }
}

// Example DFA
const dfaStates: State[] = [
    { name: 'q0', transitions: { '0': ['q0'], '1': ['q1'] } },
    { name: 'q1', transitions: { '0': ['q2'], '1': ['q1'] } },
    { name: 'q2', transitions: { '0': ['q2'], '1': ['q1'] } }
];

const DFa = new Automaton(dfaStates, 'q0', ['q2']);

// Example NFA
const nfaStates: State[] = [
    { name: 'q0', transitions: { '0': ['q0', 'q1'], '1': ['q0'] } },
    { name: 'q1', transitions: { '0': [], '1': ['q2'] } },
    { name: 'q2', transitions: { '0': [], '1': ['q1'] } }
];

const nfa = new Automaton(nfaStates, 'q0', ['q1']);

// Example ε-NFA
const enfaStates: State[] = [
    { name: 'q0', transitions: { '0': ['q1'], '1': ['q0'], 'ε': ['q2'] } },
    { name: 'q1', transitions: { '0': [], '1': ['q2'], 'ε': [] } },
    { name: 'q2', transitions: { '0': [], '1': [], 'ε': ['q0'] } }
];

const enfa = new Automaton(enfaStates, 'q0', ['q2']);

const regex = /^(a|b)*abb$/;

function testAutomaton(automaton: Automaton, input: string): void {
    console.log(`Testing ${input}: ${automaton.isAccepted(input) ? 'Accepted' : 'Rejected'}`);
}

function testRegex(regex: RegExp, input: string): void {
    console.log(`Testing ${input}: ${regex.test(input) ? 'Accepted' : 'Rejected'}`);
}

// Test the DFAs
console.log("Testing DFAs:");
testAutomaton(DFa, '110');
testAutomaton(DFa, '101');
testAutomaton(DFa, '111');

// Test the NFAs
console.log("\nTesting NFAs:");
testAutomaton(nfa, '110');
testAutomaton(nfa, '101');
testAutomaton(nfa, '111');

// Test the ε-NFAs
console.log("\nTesting ε-NFAs:");
testAutomaton(enfa, '110');
testAutomaton(enfa, '101');
testAutomaton(enfa, '111');

// Test the regular expression
console.log("\nTesting regular expression:");
testRegex(regex, 'ababb');
testRegex(regex, 'aababb');
testRegex(regex, 'abab');