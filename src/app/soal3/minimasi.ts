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


function unreachableStates(dfa: DFA): string[] {
    const reachable = new Set<string>([dfa.startState]);
    const stack = [dfa.startState];
    console.log("Starting unreachable state check from: ", dfa.startState);

    while (stack.length) {
        const state = stack.pop()!;
        dfa.alphabet.forEach(symbol => {
            const transitionKey = `${state},${symbol}`;
            const nextState = dfa.transitionFunction[transitionKey];
            if (nextState && !reachable.has(nextState)) {
                reachable.add(nextState);
                stack.push(nextState);
                console.log(`State ${nextState} reached from ${state} on symbol ${symbol}`);
            }
        });
    }

    const unreachableStates = dfa.states.filter(state => !reachable.has(state));
    console.log("Unreachable States: ", unreachableStates);
    return unreachableStates;
}


export function minimizeDFA(dfa: DFA): DFA {
    let partitions = new Map<string, Set<string>>();
    dfa.states.forEach(state => {
        let key = dfa.finalStates.includes(state) ? 'final' : 'non-final';
        if (!partitions.has(key)) {
            partitions.set(key, new Set());
        }
        partitions.get(key)!.add(state);
    });

    let changed = true;
    while (changed) {
        changed = false;
        let newPartitions = new Map<string, Set<string>>();

        partitions.forEach((group, key) => {
            group.forEach(state => {
                let signature = dfa.alphabet.map(symbol => {
                    let targetState = dfa.transitionFunction[`${state},${symbol}`];
                    let targetKey = Array.from(partitions.entries()).find(([_, states]) => states.has(targetState))?.[0];
                    return symbol + targetKey;
                }).join(',');
                let newKey = `${key}:${signature}`;
                if (!newPartitions.has(newKey)) {
                    newPartitions.set(newKey, new Set());
                }
                newPartitions.get(newKey)!.add(state);
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