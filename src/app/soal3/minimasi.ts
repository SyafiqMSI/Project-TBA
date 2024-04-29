export interface DFA {
    states: string[];
    alphabet: string[];
    transitionFunction: { [key: string]: string }; 
    startState: string;
    finalStates: string[];
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

function removeUnreachableStates(dfa: DFA): DFA {
    const unreachable = unreachableStates(dfa);
    console.log("Removing these unreachable states: ", unreachable);
    const newStates = dfa.states.filter(state => !unreachable.includes(state));
    const newFinalStates = dfa.finalStates.filter(state => !unreachable.includes(state));
    const newTransitions = Object.fromEntries(
        Object.entries(dfa.transitionFunction).filter(([key, _]) => !unreachable.includes(key.split(',')[0]))
    );

    console.log("New DFA States: ", newStates);
    console.log("New DFA Transitions: ", newTransitions);
    return {
        ...dfa,
        states: newStates,
        finalStates: newFinalStates,
        transitionFunction: newTransitions
    };
}


export function minimizeDFA(dfa: DFA): DFA {
    console.log("Minimizing DFA...");
    return removeUnreachableStates(dfa);
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

