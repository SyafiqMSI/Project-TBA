import readline from 'readline';

class Type {
    public static SYMBOL: number = 1;
    public static CONCAT: number = 2;
    public static UNION: number = 3;
    public static KLEENE: number = 4;
}

class ExpressionTree {
    public _type: number;
    public value: string | null;
    public left: ExpressionTree | null;
    public right: ExpressionTree | null;

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


function inorder(et: ExpressionTree | null): void {
    if (!et) return;

    if (et._type === Type.SYMBOL) {
        console.log(et.value);
    } else if (et._type === Type.CONCAT) {
        inorder(et.left);
        console.log(".");
        inorder(et.right);
    } else if (et._type === Type.UNION) {
        inorder(et.left);
        console.log("+");
        inorder(et.right);
    } else if (et._type === Type.KLEENE) {
        inorder(et.left);
        console.log("*");
    }
}



function higherPrecedence(a: string, b: string): boolean {
    const p: string[] = ["+", ".", "*"];
    return p.indexOf(a) > p.indexOf(b);
}

function postfix(regexp: string): string {
    // Adding dot "." between consecutive symbols
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
    public next_state: { [key: string]: FiniteAutomataState[] };

    constructor() {
        this.next_state = {};
    }
}

function evalRegex(et: any): [FiniteAutomataState, FiniteAutomataState] {
    if (et._type === Type.SYMBOL) {
        return evalRegexSymbol(et);
    } else if (et._type === Type.CONCAT) {
        return evalRegexConcat(et);
    } else if (et._type === Type.UNION) {
        return evalRegexUnion(et);
    } else if (et._type === Type.KLEENE) {
        return evalRegexKleene(et);
    } else {
        throw new Error("Invalid ExpressionTree type");
    }

    function evalRegexSymbol(et: any): [FiniteAutomataState, FiniteAutomataState] {
        const start_state = new FiniteAutomataState();
        const end_state = new FiniteAutomataState();
        
        start_state.next_state[et.value] = [end_state];
        return [start_state, end_state];
    }

    function evalRegexConcat(et: any): [FiniteAutomataState, FiniteAutomataState] {
        const left_nfa = evalRegex(et.left);
        const right_nfa = evalRegex(et.right);

        left_nfa[1].next_state['ε'] = [right_nfa[0]];
        return [left_nfa[0], right_nfa[1]];
    }

    function evalRegexUnion(et: any): [FiniteAutomataState, FiniteAutomataState] {
        const start_state = new FiniteAutomataState();
        const end_state = new FiniteAutomataState();

        const up_nfa = evalRegex(et.left);
        const down_nfa = evalRegex(et.right);

        start_state.next_state['ε'] = [up_nfa[0], down_nfa[0]];
        up_nfa[1].next_state['ε'] = [end_state];
        down_nfa[1].next_state['ε'] = [end_state];

        return [start_state, end_state];
    }

    function evalRegexKleene(et: any): [FiniteAutomataState, FiniteAutomataState] {
        const start_state = new FiniteAutomataState();
        const end_state = new FiniteAutomataState();

        const sub_nfa = evalRegex(et.left);

        start_state.next_state['ε'] = [sub_nfa[0], end_state];
        sub_nfa[1].next_state['ε'] = [sub_nfa[0], end_state];

        return [start_state, end_state];
    }

}

function printStateTransitions(state: FiniteAutomataState, states_done: FiniteAutomataState[], symbol_table: { [key: string]: number }): string {
    let output = "";
    if (states_done.includes(state)) {
        return output;
    }

    states_done.push(state);

    for (const symbol in state.next_state) {
        let line_output = "q" + + symbol_table[state.toString()] + "\t\t\t" + symbol + "\t\t\t\t\t\t\t\t";
        for (const ns of state.next_state[symbol]) {
            if (!(ns.toString() in symbol_table)) {
                symbol_table[ns.toString()] = Object.keys(symbol_table).length;
            }
            line_output += "q" + symbol_table[ns.toString()] + " ";
        }

        output += line_output + "\n";

        for (const ns of state.next_state[symbol]) {
            output += printStateTransitions(ns, states_done, symbol_table);
        }
    }
    return output;
}

function printTransitionTable(finite_automata: [FiniteAutomataState, FiniteAutomataState]): string {
    let output = "State\t\tSymbol\t\t\tNext state\n";
    const symbol_table: { [key: string]: number } = {};
    const states_done: FiniteAutomataState[] = [];
    symbol_table[finite_automata[0].toString()] = Object.keys(symbol_table).length;
    output += printStateTransitions(finite_automata[0], states_done, symbol_table);
    return output;
}


// Example      
export {  postfix, constructTree, evalRegex, printTransitionTable, FiniteAutomataState, ExpressionTree };
