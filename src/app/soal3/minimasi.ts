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

    while (stack.length) {
        const state = stack.pop()!;
        dfa.alphabet.forEach(symbol => {
            const nextState = dfa.transitionFunction[`${state},${symbol}`];
            if (nextState && !reachable.has(nextState)) {
                reachable.add(nextState);
                stack.push(nextState);
            }
        });
    }

    return dfa.states.filter(state => !reachable.has(state));
}

function removeUnreachableStates(dfa: DFA): DFA {
    const unreachable = unreachableStates(dfa);
    const newStates = dfa.states.filter(state => !unreachable.includes(state));
    const newFinalStates = dfa.finalStates.filter(state => !unreachable.includes(state));
    const newTransitions = Object.fromEntries(
        Object.entries(dfa.transitionFunction).filter(([key, value]) =>
            !unreachable.includes(key.split(',')[0]) && !unreachable.includes(value))
    );

    return {
        ...dfa,
        states: newStates,
        finalStates: newFinalStates,
        transitionFunction: newTransitions
    };
}


export function minimizeDFA(dfa: DFA): DFA {
    const unreachable = unreachableStates(dfa);
    const newStates = dfa.states.filter(state => !unreachable.includes(state));
    const newFinalStates = dfa.finalStates.filter(state => !unreachable.includes(state));
    const newTransitions: { [key: string]: string } = {};

    for (const key in dfa.transitionFunction) {
        const [state] = key.split(',');
        if (!unreachable.includes(state)) {
            newTransitions[key] = dfa.transitionFunction[key];
        }
    }

    return {
        ...dfa,
        states: newStates,
        finalStates: newFinalStates,
        transitionFunction: newTransitions
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

