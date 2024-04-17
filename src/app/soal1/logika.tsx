export class NFA {
    states: string[];
    alphabet: string[];
    transitions: { [key: string]: string[] };
    start_state: string;
    accept_states: string[];

    constructor(states: string[], alphabet: string[], transitions: { [key: string]: string[] }, start_state: string, accept_states: string[]) {
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
        this.start_state = start_state;
        this.accept_states = accept_states;
    }

    convert_to_dfa(): DFA {
        let dfa_states: string[][] = [];
        let dfa_alphabet: string[] = this.alphabet;
        let dfa_transitions: { [key: string]: string[] } = {};
        let dfa_start_state: string[] = [this.start_state];
        let dfa_accept_states: string[][] = [];

        let unprocessed_states: string[][] = [dfa_start_state];
        let processed_states: string[][] = [];

        while (unprocessed_states.length > 0) {
            let current_state = unprocessed_states.shift();
            if (current_state) {
                processed_states.push(current_state);
                dfa_states.push(current_state);

                for (let symbol of dfa_alphabet) {
                    let next_state: string[] = [];
                    if (current_state) {
                        for (let state of current_state) {
                            next_state.push(...(this.transitions[state + ',' + symbol] || []));
                        }
                    }
                    next_state = Array.from(new Set(next_state)).sort();

                    if (!processed_states.some(state => JSON.stringify(state) === JSON.stringify(next_state))) {
                        unprocessed_states.push(next_state);
                    }

                    dfa_transitions[JSON.stringify([current_state, symbol])] = next_state;

                    if (!dfa_states.some(state => JSON.stringify(state) === JSON.stringify(next_state))) {
                        dfa_states.push(next_state);
                    }
                }
            }
        }

        // Remove unreachable states
        let reachable_states = new Set();
        for (let state of Object.values(dfa_transitions)) {
            if (Array.isArray(state)) {
                state.forEach(s => reachable_states.add(s));
            }
        }
        dfa_states = dfa_states.filter(state => state[0] in reachable_states);

        // Find accept states
        for (let state of dfa_states) {
            for (let accept_state of this.accept_states) {
                if (state.includes(accept_state)) {
                    dfa_accept_states.push(state);
                    break;
                }
            }
        }

        return new DFA(dfa_states, dfa_alphabet, dfa_transitions, dfa_start_state, dfa_accept_states);
    }
}

export class DFA {
    states: string[][];
    alphabet: string[];
    transitions: { [key: string]: string[] };
    start_state: string[];
    accept_states: string[][];

    constructor(states: string[][], alphabet: string[], transitions: { [key: string]: string[] }, start_state: string[], accept_states: string[][]) {
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
        this.start_state = start_state;
        this.accept_states = accept_states;
    }

    display_dfa_states() {
        console.log("DFA States:", this.states);
    }

    display_dfa_alphabet() {
        console.log("DFA Alphabet:", this.alphabet);
    }

    display_dfa_transitions() {
        console.log("DFA Transitions:");
        for (let [transition, next_state] of Object.entries(this.transitions)) {
            console.log(`${JSON.parse(transition)[0]} --(${JSON.parse(transition)[1]})--> ${next_state}`);
        }
    }

    display_dfa_start_state() {
        console.log("DFA Start State:", this.start_state);
    }

    display_dfa_accept_states() {
        console.log("DFA Accepting States:", this.accept_states);
    }
}
