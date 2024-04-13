class NFASimulator:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states
    
    def epsilon_closure(self, states):
        closure = set(states)
        stack = list(states)
        while stack:
            state = stack.pop()
            if ('', state) in self.transitions:
                for next_state in self.transitions[('', state)]:
                    if next_state not in closure:
                        closure.add(next_state)
                        stack.append(next_state)
        return closure
    
    def move(self, states, symbol):
        result = set()
        for state in states:
            if (symbol, state) in self.transitions:
                result.update(self.transitions[(symbol, state)])
        return result
    
    def nfa_to_dfa(self):
        dfa_states = []
        dfa_transitions = {}
        dfa_start_state = tuple(self.epsilon_closure({self.start_state}))
        dfa_accept_states = []
        stack = [dfa_start_state]
        while stack:
            current_states = stack.pop()
            dfa_states.append(current_states)
            for symbol in self.alphabet:
                next_states = self.epsilon_closure(self.move(current_states, symbol))
                dfa_transitions[(tuple(current_states), symbol)] = tuple(next_states)  # Perubahan di sini
                if next_states not in dfa_states:
                    stack.append(next_states)
            if any(state in self.accept_states for state in current_states):
                dfa_accept_states.append(current_states)
        return dfa_states, self.alphabet, dfa_transitions, dfa_start_state, dfa_accept_states

# Contoh penggunaan
nfa_states = {'q0', 'q1', 'q2'}
nfa_alphabet = {'0', '1'}
nfa_transitions = {('0', 'q0'): {'q1'}, ('1', 'q1'): {'q2'}, ('', 'q0'): {'q1', 'q2'}}
nfa_start_state = 'q0'
nfa_accept_states = {'q2'}

nfa_simulator = NFASimulator(nfa_states, nfa_alphabet, nfa_transitions, nfa_start_state, nfa_accept_states)
dfa_states, dfa_alphabet, dfa_transitions, dfa_start_state, dfa_accept_states = nfa_simulator.nfa_to_dfa()

print("DFA States:", dfa_states)
print("DFA Alphabet:", dfa_alphabet)
print("DFA Transitions:", dfa_transitions)
print("DFA Start State:", dfa_start_state)
print("DFA Accept States:", dfa_accept_states)
