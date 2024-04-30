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

function evalRegexSymbol(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();

    start_state.next_state[et.value!] = [end_state];
    return [start_state, end_state];
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

function evalRegexConcat(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const [leftStart, leftEnd] = evalRegex(et.left!);
    const [rightStart, rightEnd] = evalRegex(et.right!);

    // Connect the end of the first NFA to the start of the second NFA directly without an epsilon if needed
    leftEnd.next_state['eps'] = [rightStart];

    return [leftStart, rightEnd];
}

function evalRegexUnion(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();
    const [leftStart, leftEnd] = evalRegex(et.left!);
    const [rightStart, rightEnd] = evalRegex(et.right!);

    // Ensure the start state has epsilon transitions to both NFA starts
    start_state.next_state['eps'] = [leftStart, rightStart];

    // Ensure both NFA ends have transitions to the new end state
    leftEnd.next_state['eps'] = leftEnd.next_state['eps'] || [];
    leftEnd.next_state['eps'].push(end_state);
    rightEnd.next_state['eps'] = rightEnd.next_state['eps'] || [];
    rightEnd.next_state['eps'].push(end_state);

    return [start_state, end_state];
}

function evalRegexKleene(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();
    const sub_nfa = evalRegex(et.left!);

    // Start state should have an epsilon transition to the sub-automata start and directly to the end state
    start_state.next_state['eps'] = [sub_nfa[0], end_state];

    // Sub-automata end should loop back to its start and also to the end state
    sub_nfa[1].next_state['eps'] = sub_nfa[1].next_state['eps'] || [];
    sub_nfa[1].next_state['eps'].push(sub_nfa[0], end_state);

    return [start_state, end_state];
}

function printTransitionTable(finiteAutomata: [FiniteAutomataState, FiniteAutomataState]): string {
    let table = "State\t\tSymbol\t\tNext state\n";
    const [startState, finalState] = finiteAutomata;
    const stateMapping = new Map<FiniteAutomataState, string>();
    const statesDone = new Set<FiniteAutomataState>();

    function printStateTransitions(
        state: FiniteAutomataState,
        stateMapping: Map<FiniteAutomataState, string>
    ): string {
        let transitionsOutput: string[] = [];
        for (const symbol in state.next_state) {
            const transitions = state.next_state[symbol];
            const nextStateLabels = transitions.map(nextState => {
                if (!stateMapping.has(nextState)) {
                    stateMapping.set(nextState, `q${nextState.id}`);
                }
                return stateMapping.get(nextState)!;
            }).sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));

            transitionsOutput.push(`${symbol}\t\t\t\t${nextStateLabels.join(", ")}`);
        }

        // Check for any transitions to print, or print a placeholder for no transitions
        if (transitionsOutput.length > 0) {
            return `${stateMapping.get(state)}\t\t\t${transitionsOutput.join(", ")}\n`;
        } else {
            return `*${stateMapping.get(state)}\t\t\t-\t\t\t\t-\n`;
        }
    }

    function traverseStates(state: FiniteAutomataState) {
        if (statesDone.has(state)) return;
        statesDone.add(state);

        if (!stateMapping.has(state)) {
            stateMapping.set(state, `q${state.id}`);
        }
        table += printStateTransitions(state, stateMapping);

        for (const symbol in state.next_state) {
            state.next_state[symbol].forEach(nextState => {
                traverseStates(nextState);
            });
        }
    }

    traverseStates(startState);
    return table;
}



export { postfix, constructTree, evalRegex, printTransitionTable, FiniteAutomataState, ExpressionTree };
