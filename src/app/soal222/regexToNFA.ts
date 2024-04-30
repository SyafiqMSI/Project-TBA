// regexToENFA.ts

enum Type {
    SYMBOL = 1,
    CONCAT = 2,
    UNION = 3,
    KLEENE = 4
}

class ExpressionTree {
    _type: number;
    value: string | null;
    left: ExpressionTree | null;
    right: ExpressionTree | null;

    constructor(_type: number, value: string | null = null, left: ExpressionTree | null = null, right: ExpressionTree | null = null) {
        this._type = _type;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

const precedence: { [key: string]: number } = { '+': 1, '.': 2, '*': 3 };

function postfix(regexp: string): string {
    const output: string[] = [];
    const stack: string[] = [];

    const input = regexp.split('').reduce((acc, cur, index, array) => {
        acc.push(cur);
        if (cur.match(/[a-zA-Z0-9]/) || cur === '*' || cur === ')') {
            if (index + 1 < array.length && (array[index + 1].match(/[a-zA-Z0-9]/) || array[index + 1] === '(')) {
                acc.push('.');
            }
        }
        return acc;
    }, [] as string[]).join('');

    for (const token of input) {
        if (token.match(/[a-zA-Z0-9]/)) {
            output.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop()!);
            }
            stack.pop();
        } else {
            while (stack.length && precedence[token] <= precedence[stack[stack.length - 1]]) {
                output.push(stack.pop()!);
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop()!);
    }

    return output.join('');
}

function constructTree(postfix: string): ExpressionTree {
    const stack: ExpressionTree[] = [];

    for (const char of postfix) {
        if (char.match(/[a-zA-Z0-9]/)) {
            stack.push(new ExpressionTree(Type.SYMBOL, char));
        } else {
            if (char === '*') {
                const node = new ExpressionTree(Type.KLEENE);
                node.left = stack.pop()!;
                stack.push(node);
            } else {
                const right = stack.pop()!;
                const left = stack.pop()!;
                if (char === '.') {
                    stack.push(new ExpressionTree(Type.CONCAT, null, left, right));
                } else if (char === '+') {
                    stack.push(new ExpressionTree(Type.UNION, null, left, right));
                }
            }
        }
    }

    if (stack.length !== 1) throw new Error("Invalid postfix expression");
    return stack[0];
}

class FiniteAutomataState {
    id: number; // This will be used to give each state a unique identifier.
    next_state: { [key: string]: FiniteAutomataState[] };

    constructor() {
        this.id = FiniteAutomataState.id++;
        this.next_state = {};
    }

    static id = 0; // Static counter to assign unique IDs
}

function evalRegex(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    console.log(`Evaluating: Type = ${et._type}, Value = ${et.value}`);
    switch (et._type) {
        case Type.SYMBOL:
            return evalRegexSymbol(et);
        case Type.CONCAT:
            const concatResult = evalRegexConcat(et);
            console.log(`Concat result: Start = ${concatResult[0].id}, End = ${concatResult[1].id}`);
            return concatResult;
        case Type.UNION:
            const unionResult = evalRegexUnion(et);
            console.log(`Union result: Start = ${unionResult[0].id}, End = ${unionResult[1].id}`);
            return unionResult;
        case Type.KLEENE:
            const kleeneResult = evalRegexKleene(et);
            console.log(`Kleene result: Start = ${kleeneResult[0].id}, End = ${kleeneResult[1].id}`);
            return kleeneResult;
        default:
            throw new Error("Invalid expression tree type");
    }
}

function evalRegexSymbol(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();

    start_state.next_state[et.value!] = [end_state];
    return [start_state, end_state];
}

function evalRegexUnion(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const startState = new FiniteAutomataState();
    const endState = new FiniteAutomataState();
    const [leftStart, leftEnd] = evalRegex(et.left!);
    const [rightStart, rightEnd] = evalRegex(et.right!);

    startState.next_state['epsilon'] = [leftStart, rightStart];  // Links to both left and right NFA starts
    leftEnd.next_state['epsilon'] = leftEnd.next_state['epsilon'] || [];
    leftEnd.next_state['epsilon'].push(endState);               // Link both NFA ends to the new end state
    rightEnd.next_state['epsilon'] = rightEnd.next_state['epsilon'] || [];
    rightEnd.next_state['epsilon'].push(endState);

    return [startState, endState];
}

function evalRegexConcat(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const [leftStart, leftEnd] = evalRegex(et.left!);
    const [rightStart, rightEnd] = evalRegex(et.right!);

    leftEnd.next_state['epsilon'] = leftEnd.next_state['epsilon'] || [];
    leftEnd.next_state['epsilon'].push(rightStart);             // Directly link left NFA end to right NFA start

    return [leftStart, rightEnd];
}

function evalRegexKleene(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const startState = new FiniteAutomataState();
    const endState = new FiniteAutomataState();
    const [subStart, subEnd] = evalRegex(et.left!);

    startState.next_state['epsilon'] = [subStart, endState];    // Skip or proceed into NFA
    subEnd.next_state['epsilon'] = subEnd.next_state['epsilon'] || [];
    subEnd.next_state['epsilon'].push(subStart, endState);      // Loop back or finish

    return [startState, endState];
}

function printStateTransitions(
    state: FiniteAutomataState,
    statesDone: Set<FiniteAutomataState>,
    stateMapping: Map<FiniteAutomataState, string>,
    finalStates: Set<FiniteAutomataState>
): void {
    if (statesDone.has(state)) return;
    statesDone.add(state);

    if (!stateMapping.has(state)) {
        stateMapping.set(state, `q${state.id}`);
    }
    const stateLabel = stateMapping.get(state)! + (finalStates.has(state) ? '*' : '');

    let transitionsOutput: string[]= [];
    for (const symbol in state.next_state) {
        const transitions = state.next_state[symbol];
        const nextStateLabels = transitions.map(nextState => {
            if (!stateMapping.has(nextState)) {
                stateMapping.set(nextState, `q${nextState.id}`);
            }
            return stateMapping.get(nextState)! + (finalStates.has(nextState) ? '*' : '');
        }).sort();

        transitionsOutput.push(`${symbol}\t\t\t\t${nextStateLabels.join(", ")}`);
    }

    // Check for any transitions to print, or print a placeholder for no transitions
    if (transitionsOutput.length > 0) {
        console.log(`${stateLabel}\t\t\t${transitionsOutput.join("\n\t\t\t\t")}`);
    } else {
        console.log(`\*${stateLabel}\t\t\t-\t\t\t\t-`);
    }

    // Recursive call to next states, handling each transition array properly
    Object.entries(state.next_state).forEach(([symbol, transitions]) => {
        transitions.forEach(nextState => {
            printStateTransitions(nextState, statesDone, stateMapping, finalStates);
        });
    });
}

function printTransitionTable(finiteAutomata: [FiniteAutomataState, FiniteAutomataState]): void {
    console.log("State\t\tSymbol\t\tNext state");
    const [startState, finalState] = finiteAutomata;
    const stateMapping = new Map<FiniteAutomataState, string>();
    const statesDone = new Set<FiniteAutomataState>();

    // Collect all final states
    const finalStates: FiniteAutomataState[] = [];
    const collectFinalStates = (state: FiniteAutomataState) => {
        if (state === finalState) {
            finalStates.push(state);
            return;
        }
        for (const transitions of Object.values(state.next_state)) {
            for (const nextState of transitions) {
                collectFinalStates(nextState);
            }
        }
    };
    collectFinalStates(finalState);

    printStateTransitions(startState, statesDone, stateMapping,new Set([finalState]));
}

export { postfix, constructTree, evalRegex, printTransitionTable, FiniteAutomataState, ExpressionTree };


// State		Symbol		Next state
// q0			epsilon				q1, q2
// q2			epsilon				q4, q6
// q4			a				q5
// q5			epsilon				q3
// q3			epsilon				q1, q2
// q1			epsilon				q8
// q8			a				q9
// q9			epsilon				q10
// q10			b				q11
// q11			epsilon				q12
// q12			b				q13
// *q13			-				-
// q6			b				q7
// q7			epsilon				q3


// State           Symbol          Next state
// q0              epsilon         q1, q2
// q1              epsilon         q3, q4
// q3              a                      q5
// q5              epsilon         q6
// q6              epsilon         q1, q2
// q2              epsilon         q7
// q7              a                      q8
// q8              epsilon         q9
// q9              b                     q10
// q10             epsilon         q11
// q11             b                      q12*
// q12*            -                      -
// q4              b                     q13
// q13             epsilon         q6