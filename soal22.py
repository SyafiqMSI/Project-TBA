class Type:
    SYMBOL = 1
    CONCAT = 2
    UNION  = 3
    KLEENE = 4

class ExpressionTree:
    def __init__(self, _type, value=None):
        self._type = _type
        self.value = value
        self.left = None
        self.right = None

def constructTree(regexp):
    stack = []
    for c in regexp:
        if c.isalpha():
            stack.append(ExpressionTree(Type.SYMBOL, c))
        elif c == ".":
            z = ExpressionTree(Type.CONCAT)
            z.right = stack.pop()
            z.left = stack.pop()
            stack.append(z)
        else:
            if c == "+":
                z = ExpressionTree(Type.UNION)
                z.right = stack.pop()
                z.left = stack.pop()
            elif c == "*":
                z = ExpressionTree(Type.KLEENE)
                z.left = stack.pop()
            stack.append(z)

    return stack[0]

def inorder(et):
    if et._type == Type.SYMBOL:
        print(et.value)
    elif et._type == Type.CONCAT:
        inorder(et.left)
        print(".")
        inorder(et.right)
    elif et._type == Type.UNION:
        inorder(et.left)
        print("+")
        inorder(et.right)
    elif et._type == Type.KLEENE:
        inorder(et.left)
        print("*")

def higherPrecedence(a, b):
    p = ["+", ".", "*"]
    return p.index(a) > p.index(b)

def postfix(regexp):
    temp = []
    for i in range(len(regexp)):
        if i != 0\
            and (regexp[i-1].isalpha() or regexp[i-1] == ")" or regexp[i-1] == "*")\
            and (regexp[i].isalpha() or regexp[i] == "("):
            temp.append(".")
        temp.append(regexp[i])
    regexp = temp
    
    stack = []
    output = ""

    for c in regexp:
        if c.isalpha():
            output = output + c
            continue

        if c == ")":
            while len(stack) != 0 and stack[-1] != "(":
                output = output + stack.pop()
            stack.pop()
        elif c == "(":
            stack.append(c)
        elif c == "*":
            output = output + c
        elif len(stack) == 0 or stack[-1] == "(" or higherPrecedence(c, stack[-1]):
            stack.append(c)
        else:
            while len(stack) != 0 and stack[-1] != "(" and not higherPrecedence(c, stack[-1]):
                output = output + stack.pop()
            stack.append(c)

    while len(stack) != 0:
        output = output + stack.pop()

    return output

class FiniteAutomataState:
    def __init__(self):
        self.next_state = {}

def evalRegex(et):
    if et._type == Type.SYMBOL:
        return evalRegexSymbol(et)
    elif et._type == Type.CONCAT:
        return evalRegexConcat(et)
    elif et._type == Type.UNION:
        return evalRegexUnion(et)
    elif et._type == Type.KLEENE:
        return evalRegexKleene(et)

def evalRegexSymbol(et):
    start_state = FiniteAutomataState()
    end_state   = FiniteAutomataState()
    
    start_state.next_state[et.value] = [end_state]
    return start_state, end_state

def evalRegexConcat(et):
    left_nfa  = evalRegex(et.left)
    right_nfa = evalRegex(et.right)

    left_nfa[1].next_state['epsilon'] = [right_nfa[0]]
    return left_nfa[0], right_nfa[1]

def evalRegexUnion(et):
    start_state = FiniteAutomataState()
    end_state   = FiniteAutomataState()

    up_nfa   = evalRegex(et.left)
    down_nfa = evalRegex(et.right)

    start_state.next_state['epsilon'] = [up_nfa[0], down_nfa[0]]
    up_nfa[1].next_state['epsilon'] = [end_state]
    down_nfa[1].next_state['epsilon'] = [end_state]

    return start_state, end_state

def evalRegexKleene(et):
    start_state = FiniteAutomataState()
    end_state   = FiniteAutomataState()

    sub_nfa = evalRegex(et.left)

    start_state.next_state['epsilon'] = [sub_nfa[0], end_state]
    sub_nfa[1].next_state['epsilon'] = [sub_nfa[0], end_state]

    return start_state, end_state

def printStateTransitions(state, states_done, symbol_table, final_states):
    if state in states_done:
        return

    states_done.append(state)

    state_label = "q" + str(symbol_table[state])
    if state in final_states:
        state_label += "*"
    print(state_label, end="\t\t")
    
    transitions = {}

    for symbol in list(state.next_state):
        next_states = state.next_state[symbol]
        next_state_labels = []
        for ns in next_states:
            if ns not in symbol_table:
                symbol_table[ns] = len(symbol_table)
            next_state_label = "q" + str(symbol_table[ns])
            if ns in final_states:
                next_state_label += "*"
            next_state_labels.append(next_state_label)

        transition_key = symbol + "\t\t" + ", ".join(next_state_labels)
        transitions[transition_key] = True
    
    for transition_key in transitions:
        print(transition_key)

    if not state.next_state:
        print("-\t\t-")

    for ns in state.next_state.values():
        for next_state in ns:
            printStateTransitions(next_state, states_done, symbol_table, final_states)

def printTransitionTable(finite_automata):
    start_state, final_state = finite_automata[0], finite_automata[1]
    final_states = {final_state}
    print("State\t\tSymbol\t\tNext state")
    printStateTransitions(start_state, [], {start_state: 0}, final_states)

def generate_transition_table():
    regexp = input("Enter regex: ")
    pr = postfix(regexp)
    et = constructTree(pr)
    fa = evalRegex(et)
    printTransitionTable(fa)

generate_transition_table()
