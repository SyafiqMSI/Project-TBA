def get_input():
    # Read DFA from the user
    num_states = int(input("Masukkan jumlah state: "))
    num_symbols = int(input("Masukkan jumlah simbol: "))
    
    # Read DFA transitions
    transitions = {}
    for i in range(num_states):
        state = input("Masukkan nama state: ")
        transitions[state] = {}
        for j in range(num_symbols):
            input_string = input(f"Transisi dari {state} dengan simbol {chr(97 + j)}: ")
            if ':' in input_string:
                symbol, next_state = input_string.split(':')
            else:
                print("Input tidak valid. Harap masukkan simbol dan state yang dipisahkan oleh ':'")
                return None, None
            transitions[state][symbol] = next_state
    
    # Read final states
    final_states = input("Masukkan state akhir dipisahkan spasi: ").split()
    
    return transitions, final_states


def minimize_dfa(transitions, final_states):
    equivalent = {}
    non_final_states = [state for state in transitions.keys() if state not in final_states]
    
    # Membuat tabel ekivalensi
    for i, state in enumerate(transitions.keys()):
        for j in range(i + 1, len(transitions.keys())):
            other_state = list(transitions.keys())[j]
            if state in final_states and other_state in final_states:
                equivalent[(state, other_state)] = False
            elif state not in final_states and other_state not in final_states:
                equivalent[(state, other_state)] = False
            else:
                equivalent[(state, other_state)] = True
    
    # Melakukan iterasi sampai tidak ada perubahan pada tabel ekivalensi
    while True:
        new_equivalent = equivalent.copy()
        for state in transitions.keys():
            for symbol in transitions[state].keys():
                next_state = transitions[state][symbol]
                for other_state in transitions.keys():
                    if state != other_state and equivalent.get((next_state, transitions[other_state].get(symbol))):
                        equivalent[(state, other_state)] = True
                        new_equivalent[(state, other_state)] = True
        if new_equivalent == equivalent:
            break
        equivalent = new_equivalent
    
    # Mengelompokkan state yang setara
    groups = {}
    for state in transitions.keys():
        group = None
        for other_state in groups.keys():
            if (state, other_state) in equivalent:  # memastikan bahwa setiap akses ke dictionary equivalent dilakukan pada pasangan state yang benar-benar ada dalam equivalent
                if equivalent[(state, other_state)]:
                    group = other_state
                    break
        if group is None:
            groups[state] = state
        else:
            groups[state] = group

    
    # Membangun DFA minimal
    minimal_transitions = {}
    for state in transitions.keys():
        minimal_transitions[groups[state]] = {symbol: groups[next_state] for symbol, next_state in transitions[state].items()}
    
    minimal_final_states = list(set(groups[state] for state in final_states))
    
    return minimal_transitions, minimal_final_states

def test_dfa(transitions, final_states):
    current_state = list(transitions.keys())[0]
    while True:
        print("State saat ini:", current_state)
        symbol = input("Masukkan simbol (tekan 'q' untuk keluar): ")
        if symbol == 'q':
            break
        if symbol not in transitions[current_state]:
            print("Transisi tidak valid!")
            continue
        current_state = transitions[current_state][symbol]
    if current_state in final_states:
        print("DFA menerima string tersebut.")
    else:
        print("DFA menolak string tersebut.")

# Main program
def main():
    transitions, final_states = get_input()
    if transitions is None or final_states is None:
        print("Input tidak valid.")
        return
    minimal_transitions, minimal_final_states = minimize_dfa(transitions, final_states)
    
    print("\nDFA setelah minimasi:")
    print("Transisi:", minimal_transitions)
    print("State akhir:", minimal_final_states)
    
    # Melakukan pengujian
    print("\nUji DFA:")
    test_dfa(minimal_transitions, minimal_final_states)

if __name__ == "__main__":
    main()
