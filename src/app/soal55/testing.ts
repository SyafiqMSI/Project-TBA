// Definisikan tipe untuk transisi
type Transitions = {
    [key: string]: string; // Key adalah string yang mewakili state dan value adalah string transisi
};

// Interface untuk Finite Automaton
interface FA {
    regex: string;
    states: string[];
    alphabets: string[];
    startState: string;
    finalState: string;
    transitions: Transitions;
    epsilons?: { [key: string]: string };
}

// Fungsi untuk mengecek string terhadap FA
export const checkStringAgainstFA = (fa: FA, inputString: string): boolean => {
    const { startState, finalState, transitions, epsilons } = fa;

    // Fungsi bantuan untuk mengurai transisi dan transisi epsilon
    const parseTransitions = (transString: string) => {
        return transString.split(',').reduce((acc, curr) => {
            const [key, value] = curr.split(':');
            acc[key] = value ? value.split(',') : [];
            return acc;
        }, {} as { [input: string]: string[] });
    };

    // Inisialisasi state saat ini dengan state awal, mempertimbangkan transisi epsilon
    let currentStates = new Set<string>();
    const addEpsilonStates = (state: string) => {
        currentStates.add(state);
        const epsTransitions = epsilons && epsilons[state] ? epsilons[state].split(',') : [];
        epsTransitions.forEach(epsState => {
            if (!currentStates.has(epsState)) {
                addEpsilonStates(epsState);
            }
        });
    };
    addEpsilonStates(startState);

    // Proses setiap karakter dalam string
    for (let char of inputString) {
        const nextStates = new Set<string>();
        currentStates.forEach(state => {
            const stateTransitions = parseTransitions(transitions[state] || "");
            if (stateTransitions[char]) {
                stateTransitions[char].forEach(nextState => {
                    addEpsilonStates(nextState);
                    nextStates.add(nextState);
                });
            }
        });
        currentStates = nextStates;
    }

    // Periksa jika salah satu state saat ini adalah state akhir
    return Array.from(currentStates).some(state => state === finalState);
};
