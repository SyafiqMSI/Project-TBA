interface Transitions {
    [key: string]: string;
}

export interface DFA {
    states: string[];
    alphabets: string[];
    startState: string;
    finalStates: string[];
    transitions: Transitions;
}

export function areEquivalent(dfa1: DFA, dfa2: DFA): boolean {
    if (
        dfa1.states.length !== dfa2.states.length ||
        dfa1.finalStates.length !== dfa2.finalStates.length
    ) {
        return false;
    }

    // Sort final states to compare them
    const sortedFinalStates1 = dfa1.finalStates.sort().join(',');
    const sortedFinalStates2 = dfa2.finalStates.sort().join(',');
    if (sortedFinalStates1 !== sortedFinalStates2) {
        return false;
    }

    const distinguishTable: { [key: string]: { [key: string]: boolean } } = {};
    for (const state1 of dfa1.states) {
        distinguishTable[state1] = {};
        for (const state2 of dfa2.states) {
            // Initialize distinguishTable
            distinguishTable[state1][state2] = !(dfa1.finalStates.includes(state1) === dfa2.finalStates.includes(state2));
        }
    }

    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < dfa1.states.length; i++) {
            for (let j = 0; j < dfa2.states.length; j++) { // Fixing the loop
                for (const symbol of dfa1.alphabets) {
                    const nextState1 = dfa1.transitions[dfa1.states[i] + ':' + symbol];
                    const nextState2 = dfa2.transitions[dfa2.states[j] + ':' + symbol]; // Fixing the nextState2
                    if (distinguishTable[nextState1][nextState2]) {
                        if (!distinguishTable[dfa1.states[i]][dfa2.states[j]]) {
                            distinguishTable[dfa1.states[i]][dfa2.states[j]] = true;
                            changed = true;
                        }
                    }
                }
            }
        }
    }

    const startState1 = dfa1.startState;
    const startState2 = dfa2.startState;
    if (distinguishTable[startState1][startState2]) {
        return false;
    }

    for (let i = 0; i < dfa1.states.length; i++) {
        for (let j = 0; j < dfa2.states.length; j++) {
            if (!distinguishTable[dfa1.states[i]][dfa2.states[j]]) { // Fixing the loop
                return false;
            }
        }
    }

    return true;
}
