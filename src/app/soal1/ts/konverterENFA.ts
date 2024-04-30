import {
  E_NFA2DFADataProps,
  ENFADataProps,
  ENFAInputProps,
} from "./type";
import { nfaConverterRepository } from "./konverterNFA";

const generateE_NFAData = (input: ENFAInputProps): ENFADataProps => {
  const states = input.states.toLowerCase().split(",");
  const alphabets = input.alphabets.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");

  const transitionsTable: { [key: string]: { [key: string]: string[] } } = {};
  const epsilonTransitions: { [key: string]: string[] } = {};

  states.forEach(state => {
    transitionsTable[state] = {};
    alphabets.forEach(alphabet => {
      transitionsTable[state][alphabet] = [];
    });
    epsilonTransitions[state] = []; // Initialize all with empty array
  });

  
  for (const [state, trans] of Object.entries(input.transitions)) {
    const segments = trans.toLowerCase().split(':');
    segments.forEach((seg, index) => {
      if (seg) transitionsTable[state][alphabets[index]] = seg.split(',');
    });
  }

  for (const [state, eps] of Object.entries(input.epsilons)) {
    if (eps) epsilonTransitions[state.toLowerCase()] = eps.toLowerCase().split(',');
  }

  return { states, alphabets, startState, finalStates, transitions: transitionsTable, epsilonTransitions };
};

const computeEpsilonClosure = (state: string, epsilonTransitions: { [key: string]: string[] }): string[] => {
  let closure = new Set([state]);
  let stack = [state];
  while (stack.length > 0) {
    const current = stack.pop()!;
    epsilonTransitions[current]?.forEach(next => {
      if (!closure.has(next)) {
        closure.add(next);
        stack.push(next);
      }
    });
  }
  return Array.from(closure);
};

const initializeDFAStates = (startState: string, epsilonTransitions: { [key: string]: string[] }): string[] => {
  const initialClosure = computeEpsilonClosure(startState, epsilonTransitions);
  return initialClosure.sort();
};


const generateFinalStatesWithClosure = (data: ENFADataProps): string[] => {
  const newFinalStates: string[] = [...data.finalStates];
  const tableClosures: {
    [key: string]: string[];
  } = {};

  // initialize empty table closure
  for (const transition of Object.entries(data.transitions)) {
    const currentState = transition[0];
    const epsilonStates = data.epsilonTransitions[currentState];

    if (epsilonStates && epsilonStates.length > 0) {
      tableClosures[currentState] = [];
    }
  }

  for (const transition of Object.entries(data.transitions)) {
    const currentState = transition[0];
    const epsilonStates = data.epsilonTransitions[currentState];

    // console.log({ currentState, epsilonStates });

    if (epsilonStates && epsilonStates.length > 0) {
      console.log("closure", { currentState, epsilonStates });

      const closures: string[] = [];

      let currentEpsilonStates = [currentState, ...epsilonStates];
      while (currentEpsilonStates.length > 0) {
        const currentEpsilonState = currentEpsilonStates[0];
        // const a = data.transitions[currentEpsilonState].epsilon;
        const a = data.epsilonTransitions[currentEpsilonState];

        if (a && currentEpsilonState !== currentState) {
          currentEpsilonStates.push(...a);
        }
        closures.push(currentEpsilonStates.splice(0, 1)[0]);
      }

      if (closures.includes(currentState)) {
        newFinalStates.push(currentState);
      }

      console.log("closure", { currentState, closures });
      tableClosures[currentState].push(...closures);
      tableClosures[currentState].sort();
    }
  }

  console.log("closure", { closureTables: tableClosures });

  return newFinalStates;
};

const generateNewTransitions = (data: ENFADataProps) => {
  const newTransitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  for (const transition of Object.entries(data.transitions)) {
    const key = transition[0];
    const value = transition[1];
    const currentEpsilonTransitions = data.epsilonTransitions[key];

    if (currentEpsilonTransitions && currentEpsilonTransitions.length > 0) {
      for (const epsilon of currentEpsilonTransitions) {
        const innerNewTransitions: {
          [key: string]: string[];
        } = {};

        for (const alphabet of data.alphabets) {
          if (!innerNewTransitions[alphabet]) {
            innerNewTransitions[alphabet] = [];
          }

          // Menambahkan transisi yang ada pada key utama
          if (data.transitions[key] && data.transitions[key][alphabet]) {
            innerNewTransitions[alphabet].push(...data.transitions[key][alphabet]);
          }

          // Menambahkan transisi yang ada pada epsilon jika ada
          if (data.transitions[epsilon] && data.transitions[epsilon][alphabet]) {
            innerNewTransitions[alphabet].push(...data.transitions[epsilon][alphabet]);
          }
        }

        newTransitions[key] = innerNewTransitions;
      }
    } else {
      newTransitions[key] = value;
    }
  }

  console.log({
    transitions: data.transitions,
    newTransitions,
  });

  return newTransitions;
};


const generateDFA = (input: ENFAInputProps): E_NFA2DFADataProps => {
  const data = generateE_NFAData(input);
  data.startState = initializeDFAStates(data.startState, data.epsilonTransitions).join(',');

  const newFinalStates = generateFinalStatesWithClosure(data);
  const newTransitions = generateNewTransitions(data);

  const nfaData = {
    ...data,
    finalStates: newFinalStates,
    transitions: newTransitions,
  };

  const dfaResult = nfaConverterRepository.generateDFAUsingData(nfaData);
  return {
    eNfaData: data,
    dfaData: dfaResult.dfaData,
    dfaTable: dfaResult.dfaTable,
    dfaFinalStates: dfaResult.dfaFinalStates,
  };
};

export const eNFAConverterRepository = {
  generateDFA,
};
