import re

class Automaton:
    def __init__(self):
        self.states = set()
        self.start_state = None
        self.accept_states = set()
        self.transitions = {}

    def set_states(self, states):
        self.states = states

    def set_start_state(self, start):
        self.start_state = start

    def set_accept_states(self, accepts):
        self.accept_states = accepts

    def add_transition(self, from_state, input_char, to_state):
        if (from_state, input_char) in self.transitions:
            if isinstance(self.transitions[(from_state, input_char)], set):
                self.transitions[(from_state, input_char)].add(to_state)
            else:
                self.transitions[(from_state, input_char)] = {self.transitions[(from_state, input_char)], to_state}
        else:
            self.transitions[(from_state, input_char)] = to_state if isinstance(self, DFA) else {to_state}

    def transition(self, from_state, input_char, to_state):
        if input_char == '':
            input_char = 'ε'  # Menggunakan 'ε' untuk merepresentasikan transisi epsilon
        return f"Transition: ({from_state}, '{input_char}') -> {to_state}"
    
    def evaluate(self, input_string):
        pass  # Akan diimplementasikan di subclasses


class DFA(Automaton):
    def evaluate(self, input_string):
        current_state = self.start_state
        for char in input_string:
            if (current_state, char) in self.transitions:
                current_state = self.transitions[(current_state, char)]
            else:
                return "Rejected"
        return "Accepted" if current_state in self.accept_states else "Rejected"


class NFA(Automaton):
    def evaluate(self, input_string):
        current_states = {self.start_state}
        for char in input_string:
            next_states = set()
            for state in current_states:
                if (state, char) in self.transitions:
                    next_states.update(self.transitions[(state, char)])
            current_states = next_states
        return "Accepted" if any(state in self.accept_states for state in current_states) else "Rejected"


class ENFA(NFA):
    def evaluate(self, input_string):
        current_states = self.epsilon_closure({self.start_state})
        for char in input_string:
            next_states = set()
            for state in current_states:
                next_states.update(self.transitions.get((state, char), set()))
            current_states = self.epsilon_closure(next_states)
        return "Accepted" if any(state in self.accept_states for state in current_states) else "Rejected"

    def epsilon_closure(self, states):
        closure = set(states)
        stack = list(states)
        while stack:
            state = stack.pop()
            epsilon_transitions = self.transitions.get((state, ''), set())
            for next_state in epsilon_transitions:
                if next_state not in closure:
                    closure.add(next_state)
                    stack.append(next_state)
        return closure


class Regex(Automaton):
    def __init__(self, pattern):
        self.pattern = re.compile(pattern)

    def evaluate(self, input_string):
        return "Accepted" if self.pattern.match(input_string) else "Rejected"


def main():
    while True:
        automaton_type = input("Choose automaton type (DFA/NFA/ENFA/Regex, or 'exit' to quit): ").strip().upper()
        if automaton_type == "EXIT":
            print("Exiting program.")
            break
        elif automaton_type not in ["DFA", "NFA", "ENFA", "REGEX"]:
            print("Invalid automaton type. Please choose from DFA, NFA, ENFA, or Regex.")
            continue

        if automaton_type == "REGEX":
            pattern = input("Enter regex pattern: ")
            automaton = Regex(pattern)
            test_string = input("Enter a string to test: ")
            result = automaton.evaluate(test_string)
            print("Result:", result)
            print("Details of the process:")
            print("The regex pattern is:", pattern)
            print("The test string is:", test_string)
            match_result = "matches" if result == "Accepted" else "does not match"
            print(f"The regex {match_result} the entire test string.")
        else:
            automaton = globals()[automaton_type]()  # Membuat objek automaton berdasarkan pilihan pengguna

            states = set(input("Enter states (comma-separated): ").split(','))
            start_state = input("Enter start state: ")
            accept_states = set(input("Enter accept states (comma-separated): ").split(','))

            automaton.set_states(states)
            automaton.set_start_state(start_state)
            automaton.set_accept_states(accept_states)

            while True:
                from_state = input("Enter from state (or type 'done' to finish): ")
                if from_state == 'done':
                    break
                input_char = input("Enter input character: ")
                to_state = input("Enter to state: ")
                automaton.add_transition(from_state, input_char, to_state)

            test_string = input("Enter a string to test: ")
            result = automaton.evaluate(test_string)
            print("Result:", result)

            option = input("Enter 'details' to see the detailed process, or 'exit' to quit: ").strip().lower()
            if option == "details":
                print("Details of the process:")
                print("States:", automaton.states)
                print("Start state:", automaton.start_state)
                print("Accept states:", automaton.accept_states)
                print("Transitions:")
                for transition, to_state in automaton.transitions.items():
                    print(f"From state {transition[0]} on input {transition[1]} to state {to_state}")
            elif option == "exit":
                print("Exiting program.")
                break
            else:
                print("Invalid option. Exiting program.")
                break


if __name__ == "__main__":
    main()
