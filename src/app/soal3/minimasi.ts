export interface DFA {
    states: string[];
    alphabet: string[];
    transitionFunction: { [key: string]: string };
    startState: string;
    finalStates: string[];
}

function initializePartitions(dfa: DFA): Set<string>[] {
    // Separate states into final and non-final as initial partitions
    const finalStates = new Set(dfa.finalStates);
    const partitions: Set<string>[] = [new Set(), new Set()];

    dfa.states.forEach(state => {
        if (finalStates.has(state)) {
            partitions[0].add(state); // Final states partition
        } else {
            partitions[1].add(state); // Non-final states partition
        }
    });

    return partitions.filter(partition => partition.size > 0);
}


function refineDistinguishability(dfa: DFA, distinguishablePairs: Set<string>): boolean {
    let updated = false;
    dfa.states.forEach(state1 => {
        dfa.states.forEach(state2 => {
            if (!distinguishablePairs.has(`${state1},${state2}`)) {
                for (const symbol of dfa.alphabet) {
                    const nextState1 = dfa.transitionFunction[`${state1},${symbol}`];
                    const nextState2 = dfa.transitionFunction[`${state2},${symbol}`];
                    if (distinguishablePairs.has(`${nextState1},${nextState2}`)) {
                        distinguishablePairs.add(`${state1},${state2}`);
                        distinguishablePairs.add(`${state2},${state1}`);
                        updated = true;
                        break;
                    }
                }
            }
        });
    }

    const unreachableStates = dfa.states.filter(state => !reachable.has(state));
    console.log("Unreachable States: ", unreachableStates);
    return unreachableStates;
}

function fillTable(dfa: DFA): Set<string> {
    const table = new Set<string>();

    // Initial marking based on final/non-final states
    dfa.states.forEach((state1, i) => {
        for (let j = i + 1; j < dfa.states.length; j++) {
            const state2 = dfa.states[j];
            if (dfa.finalStates.includes(state1) !== dfa.finalStates.includes(state2)) {
                markDistinguishable(table, state1, state2);
            }
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
                            return true;
                        }
                        return false;
                    });
                }
            });
        });

        if (newPartitions.size !== partitions.size) {
            changed = true;
            partitions = newPartitions;
        }
    }

    let newStateMapping = new Map<string, string>();
    let newStates: string[] = [];
    let index = 0;
    partitions.forEach((states, _) => {
        let newState = `q${index++}`;
        newStates.push(newState);
        states.forEach(state => {
            newStateMapping.set(state, newState);
        });
    });

    let newTransitions: { [key: string]: string } = {};
    let newFinalStates: string[] = [];
    newStates.forEach(state => {
        dfa.alphabet.forEach(symbol => {
            let originalState = Array.from(newStateMapping.keys()).find(s => newStateMapping.get(s) === state)!;
            let nextState = dfa.transitionFunction[`${originalState},${symbol}`];
            newTransitions[`${state},${symbol}`] = newStateMapping.get(nextState)!;
        });
        if (dfa.finalStates.some(fs => newStateMapping.get(fs) === state)) {
            newFinalStates.push(state);
        }
    });

    return {
        states: newStates,
        alphabet: dfa.alphabet,
        transitionFunction: newTransitions,
        startState: newStateMapping.get(dfa.startState)!,
        finalStates: newFinalStates
    };
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