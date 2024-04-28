export interface DFA {
    states: string[];
    alphabets: string[];
    startState: string;
    finalStates: string[];
    transitions: { [key: string]: string };
}


function areEquivalent(dfa1: DFA, dfa2: DFA): boolean {
    const visited: { [key: string]: boolean } = {};
    const queue: { state1: string; state2: string }[] = [{ state1: dfa1.startState, state2: dfa2.startState }];

    while (queue.length > 0) {
        const { state1, state2 } = queue.shift()!;
        const key = `${state1},${state2}`;
        if (visited[key]) continue;
        visited[key] = true;

        const isFinal1 = dfa1.finalStates.includes(state1);
        const isFinal2 = dfa2.finalStates.includes(state2);

        if (isFinal1 !== isFinal2) return false;

        for (const alphabet of dfa1.alphabets) {
            const nextState1 = dfa1.transitions[state1] && dfa1.transitions[state1].split(':')[dfa1.alphabets.indexOf(alphabet)];
            const nextState2 = dfa2.transitions[state2] && dfa2.transitions[state2].split(':')[dfa2.alphabets.indexOf(alphabet)];
            if (nextState1 && nextState2) {
                const nextKey = `${nextState1},${nextState2}`;
                if (!visited[nextKey]) {
                    queue.push({ state1: nextState1, state2: nextState2 });
                }
            } else if ((nextState1 && !nextState2) || (!nextState1 && nextState2)) {
                return false;
            }
        }
    }

    return true;
}

export { areEquivalent };
