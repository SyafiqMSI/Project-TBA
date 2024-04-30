export interface DFA {
    states: string[];
    alphabet: string[];
    transitionFunction: { [key: string]: string };
    startState: string;
    finalStates: string[];
}
function initializeDistinguishability(dfa: DFA): Set<string> {
    let distinguishablePairs = new Set<string>();
    
    // Mark directly distinguishable states (final vs. non-final)
    for (let i = 0; i < dfa.states.length; i++) {
        for (let j = i + 1; j < dfa.states.length; j++) {
            const state1 = dfa.states[i];
            const state2 = dfa.states[j];
            if (dfa.finalStates.includes(state1) !== dfa.finalStates.includes(state2)) {
                distinguishablePairs.add(`${state1},${state2}`);
                distinguishablePairs.add(`${state2},${state1}`);
            }
        }
    }

    return distinguishablePairs;
}

function refineDistinguishability(dfa: DFA, distinguishablePairs: Set<string>): boolean {
    let updated = false;
    dfa.states.forEach(state1 => {
        dfa.states.forEach(state2 => {
            if (!distinguishablePairs.has(`${state1},${state2}`)) {
                let distinguishable = false
                for (const symbol of dfa.alphabet) {
                    const nextState1 = dfa.transitionFunction[`${state1},${symbol}`];
                    const nextState2 = dfa.transitionFunction[`${state2},${symbol}`];
                    if (distinguishablePairs.has(`${nextState1},${nextState2}`)) {
                        distinguishable = true;
                        break;
                    }
                }
                if (distinguishable) {
                    distinguishablePairs.add(`${state1},${state2}`);
                    distinguishablePairs.add(`${state2},${state1}`);
                    updated = true;
                }
            }
        });
    });
    return updated;
}
// Util to mark pairs as distinguishable
function markDistinguishable(table: Set<string>, state1: string, state2: string) {
    table.add(`${state1},${state2}`);
    table.add(`${state2},${state1}`);
}

function isDistinguishable(table: Set<string>, state1: string, state2: string): boolean {
    return table.has(`${state1},${state2}`);
}

export function fillTable(dfa: DFA): Set<string> {
    const table = new Set<string>();

    // Initial marking based on final/non-final states
    dfa.states.forEach((state1, i) => {
        for (let j = i + 1; j < dfa.states.length; j++) {
            const state2 = dfa.states[j];
            if (dfa.finalStates.includes(state1) !== dfa.finalStates.includes(state2)) {
                markDistinguishable(table, state1, state2);
            }
            return table
        }
    });

    // Refine marks based on transitions
    let changed = true;
    while (changed) {
        changed = false;
        dfa.states.forEach((state1) => {
            dfa.states.forEach((state2) => {
                if (!isDistinguishable(table, state1, state2)) {
                    dfa.alphabet.some(symbol => {
                        const nextState1 = dfa.transitionFunction[`${state1},${symbol}`];
                        const nextState2 = dfa.transitionFunction[`${state2},${symbol}`];
                        if (isDistinguishable(table, nextState1, nextState2)) {
                            markDistinguishable(table, state1, state2);
                            changed = true;
                        }
                    });
                }
            });
        });
    }

    return table;
}

function mergeStates(dfa: DFA, distinguishablePairs: Set<string>): DFA {
    const stateMapping = new Map<string, string>();
    const newStateList = new Map<string, string[]>();

    dfa.states.forEach(state => {
        if (!stateMapping.has(state)) {
            let found = false;
            newStateList.forEach((mergedStates, newState) => {
                if (mergedStates.includes(state) || mergedStates.some(s => !distinguishablePairs.has(`${s},${state}`))) {
                    stateMapping.set(state, newState);
                    mergedStates.push(state);
                    found = true;
                }
            });
            if (!found) {
                const newState = `q${newStateList.size}`;
                newStateList.set(newState, [state]);
                stateMapping.set(state, newState);
            }
        }
    });

    const newStates = Array.from(newStateList.keys());
    const newTransitions: { [key: string]: string } = {};
    const newFinalStates: string[] = newStates.filter(state => newStateList.get(state)!.some(s => dfa.finalStates.includes(s)));

    newStates.forEach(newState => {
        dfa.alphabet.forEach(symbol => {
            const representative = newStateList.get(newState)![0];
            const targetState = dfa.transitionFunction[`${representative},${symbol}`];
            newTransitions[`${newState},${symbol}`] = stateMapping.get(targetState)!;
        });
    });

    return {
        states: newStates,
        alphabet: dfa.alphabet,
        transitionFunction: newTransitions,
        startState: stateMapping.get(dfa.startState)!,
        finalStates: newFinalStates
    };
}

export function minimizeDFA(dfa: DFA): DFA {
    let distinguishablePairs = initializeDistinguishability(dfa);
    while (refineDistinguishability(dfa, distinguishablePairs));
    return mergeStates(dfa, distinguishablePairs);
}



export function simulateDFA(dfa: DFA, inputString: string): boolean {
    let currentState = dfa.startState;

    for (const symbol of inputString) {
        const transitionKey = `${currentState},${symbol}`;
        if (!dfa.transitionFunction.hasOwnProperty(transitionKey)) {
            return false; 
        }
        currentState = dfa.transitionFunction[transitionKey];
    }

    return dfa.finalStates.includes(currentState);
}