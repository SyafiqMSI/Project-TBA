class Type {
    static SYMBOL = 1;
    static CONCAT = 2;
    static UNION = 3;
    static KLEENE = 4;
}

class ExpressionTree {
    _type: number;
    value: string | null;
    left: ExpressionTree | null;
    right: ExpressionTree | null;

    constructor(_type: number, value: string | null = null) {
        this._type = _type;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function constructTree(regexp: string): ExpressionTree {
    const stack: ExpressionTree[] = [];
    for (const c of regexp) {
        let z: ExpressionTree | null = null;
        if (c.match(/[a-zA-Z]/)) {
            stack.push(new ExpressionTree(Type.SYMBOL, c));
        } else {
            if (c === "+") {
                z = new ExpressionTree(Type.UNION);
                z.right = stack.pop()!;
                z.left = stack.pop()!;
            } else if (c === ".") {
                z = new ExpressionTree(Type.CONCAT);
                z.right = stack.pop()!;
                z.left = stack.pop()!;
            } else if (c === "*") {
                z = new ExpressionTree(Type.KLEENE);
                z.left = stack.pop()!;
            }
            if (z !== null) {
                stack.push(z);
            } else {
                throw new Error("Invalid regular expression");
            }
        }
    }
    if (stack.length !== 1) {
        throw new Error("Invalid regular expression");
    }
    return stack[0];
}


function inorder(et: ExpressionTree): void {
    if (et._type === Type.SYMBOL) {
        console.log(et.value);
    } else if (et._type === Type.CONCAT) {
        inorder(et.left!);
        console.log(".");
        inorder(et.right!);
    } else if (et._type === Type.UNION) {
        inorder(et.left!);
        console.log("+");
        inorder(et.right!);
    } else if (et._type === Type.KLEENE) {
        inorder(et.left!);
        console.log("*");
    }
}

function higherPrecedence(a: string, b: string): boolean {
    const p = ["+", ".", "*"];
    return p.indexOf(a) > p.indexOf(b);
}

function postfix(regexp: string): string {
    const temp: string[] = [];
    for (let i = 0; i < regexp.length; i++) {
        if (i !== 0 &&
            (regexp[i - 1].match(/[a-zA-Z]/) || regexp[i - 1] === ")" || regexp[i - 1] === "*") &&
            (regexp[i].match(/[a-zA-Z]/) || regexp[i] === "(")) {
            temp.push(".");
        }
        temp.push(regexp[i]);
    }
    regexp = temp.join('');

    const stack: string[] = [];
    let output = "";

    for (const c of regexp) {
        if (c.match(/[a-zA-Z]/)) {
            output += c;
            continue;
        }

        if (c === ")") {
            while (stack.length !== 0 && stack[stack.length - 1] !== "(") {
                output += stack.pop()!;
            }
            stack.pop();
        } else if (c === "(") {
            stack.push(c);
        } else if (c === "*") {
            output += c;
        } else if (stack.length === 0 || stack[stack.length - 1] === "(" || higherPrecedence(c, stack[stack.length - 1])) {
            stack.push(c);
        } else {
            while (stack.length !== 0 && stack[stack.length - 1] !== "(" && !higherPrecedence(c, stack[stack.length - 1])) {
                output += stack.pop()!;
            }
            stack.push(c);
        }
    }

    while (stack.length !== 0) {
        output += stack.pop()!;
    }

    return output;
}

class FiniteAutomataState {
    next_state: { [key: string]: FiniteAutomataState[] };

    constructor() {
        this.next_state = {};
    }
}

function evalRegex(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    if (et._type === Type.SYMBOL) {
        return evalRegexSymbol(et);
    } else if (et._type === Type.CONCAT) {
        return evalRegexConcat(et);
    } else if (et._type === Type.UNION) {
        return evalRegexUnion(et);
    } else if (et._type === Type.KLEENE) {
        return evalRegexKleene(et);
    }
    throw new Error("Invalid expression tree type");
}

function evalRegexSymbol(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();

    start_state.next_state[et.value!] = [end_state];
    return [start_state, end_state];
}

function evalRegexConcat(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const left_nfa = evalRegex(et.left!);
    const right_nfa = evalRegex(et.right!);

    left_nfa[1].next_state['epsilon'] = [right_nfa[0]];
    return [left_nfa[0], right_nfa[1]];
}

function evalRegexUnion(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();

    const up_nfa = evalRegex(et.left!);
    const down_nfa = evalRegex(et.right!);

    start_state.next_state['epsilon'] = [up_nfa[0], down_nfa[0]];
    up_nfa[1].next_state['epsilon'] = [end_state];
    down_nfa[1].next_state['epsilon'] = [end_state];

    return [start_state, end_state];
}

function evalRegexKleene(et: ExpressionTree): [FiniteAutomataState, FiniteAutomataState] {
    const start_state = new FiniteAutomataState();
    const end_state = new FiniteAutomataState();

    const sub_nfa = evalRegex(et.left!);

    start_state.next_state['epsilon'] = [sub_nfa[0], end_state];
    sub_nfa[1].next_state['epsilon'] = [sub_nfa[0], end_state];

    return [start_state, end_state];
}

function printStateTransitions(state: FiniteAutomataState, states_done: FiniteAutomataState[], symbol_table: { [key: string]: number }, final_states: Set<FiniteAutomataState>): void {
    if (states_done.includes(state)) {
        return;
    }

    states_done.push(state);

    let state_label = "q" + symbol_table[state.toString()];
    if (final_states.has(state)) {
        state_label += "*";
    }
    console.log(state_label + "\t\t");

    const transitions: { [key: string]: boolean } = {};

    for (const symbol in state.next_state) {
        const next_states = state.next_state[symbol];
        const next_state_labels: string[] = [];
        for (const ns of next_states) {
            if (!(ns.toString() in symbol_table)) {
                symbol_table[ns.toString()] = Object.keys(symbol_table).length;
            }
            let next_state_label = "q" + symbol_table[ns.toString()];
            if (final_states.has(ns)) {
                next_state_label += "*";
            }
            next_state_labels.push(next_state_label);
        }

        const transition_key = symbol + "\t\t" + next_state_labels.join(", ");
        transitions[transition_key] = true;
    }

    for (const transition_key in transitions) {
        console.log(transition_key);
    }

    if (Object.keys(state.next_state).length === 0) {
        console.log("-\t\t-");
    }

    for (const ns of Object.values(state.next_state)) {
        for (const next_state of ns) {
            printStateTransitions(next_state, states_done, symbol_table, final_states);
        }
    }
}

function printTransitionTable(finite_automata: [FiniteAutomataState, FiniteAutomataState]): void {
    console.log("State\t\tSymbol\t\tNext state");
    const start_state = finite_automata[0];
    const final_state = finite_automata[1];
    const final_states = new Set([final_state]);
    printStateTransitions(start_state, [], { [start_state.toString()]: 0 }, final_states);
}


export { postfix, constructTree, evalRegex, printTransitionTable, FiniteAutomataState, ExpressionTree };
