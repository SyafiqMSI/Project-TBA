class NFA:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states

    def convert_to_dfa(self):
        dfa_states = []
        dfa_alphabet = self.alphabet
        dfa_transitions = {}
        dfa_start_state = tuple([self.start_state])
        dfa_accept_states = []

        unprocessed_states = [dfa_start_state]
        processed_states = []

        while unprocessed_states:
            current_state = unprocessed_states.pop(0)
            processed_states.append(current_state)
            dfa_states.append(current_state)

            for symbol in dfa_alphabet:
                next_state = []
                for state in current_state:
                    next_state.extend(self.transitions.get((state, symbol), []))
                next_state = tuple(sorted(set(next_state)))

                if next_state not in processed_states:
                    unprocessed_states.append(next_state)

                dfa_transitions[current_state, symbol] = next_state

                if next_state not in dfa_states:
                    dfa_states.append(next_state)
        
        reachable_states = set()
        for state in dfa_transitions.values():
            reachable_states.update(state)
        dfa_states = [state for state in dfa_states if state[0] in reachable_states]

        for state in dfa_states:
            for accept_state in self.accept_states:
                if accept_state in state:
                    dfa_accept_states.append(state)
                    break

        return DFA(dfa_states, dfa_alphabet, dfa_transitions, dfa_start_state, dfa_accept_states)


class DFA:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states

    def display_dfa_states(self):
        print("DFA States:", self.states)

    def display_dfa_alphabet(self):
        print("DFA Alphabet:", self.alphabet)

    def display_dfa_transitions(self):
        print("DFA Transitions:")
        for transition, next_state in self.transitions.items():
            print(f"{transition[0]} --({transition[1]})--> {next_state}")

    def display_dfa_start_state(self):
        print("DFA Start State:", self.start_state)

    def display_dfa_accept_states(self):
        print("DFA Accepting States:", self.accept_states)


def main():
    nfa_states = {'q0', 'q1', 'q2'}
    nfa_alphabet = {'0', '1'}
    nfa_transitions = {
        ('q0', '0'): ['q0', 'q1'],
        ('q0', '1'): ['q0'],
        ('q1', '0'): [],
        ('q1', '1'): ['q2'],
        ('q2', '0'): [],
        ('q2', '1'): []
    }
    nfa_start_state = 'q0'
    nfa_accept_states = {'q2'}

    nfa = NFA(nfa_states, nfa_alphabet, nfa_transitions, nfa_start_state, nfa_accept_states)
    dfa = nfa.convert_to_dfa()

    print("Menu:")
    print("1. Contoh NFA")
    print("2. Contoh e-NFA")
    print("3. Konversi NFA")
    print("4. Konversi e-NFA")
    choice = input("Input: ")

    if choice == '1':
        dfa.display_dfa_states()
        dfa.display_dfa_alphabet()
        dfa.display_dfa_transitions()
        dfa.display_dfa_start_state()
        dfa.display_dfa_accept_states()
    elif choice == '2':
        
        pass
    else:
        print("Pilihan tidak valid.")


if __name__ == "__main__":
    main()
