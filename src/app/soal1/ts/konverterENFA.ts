import {
  E_NFA2DFADataProps,
  ENFADataProps,
  ENFAInputProps,
  NFAInputProps,
} from "./type";
import { nfaConverterRepository } from "./konverterNFA";

type TransitionTable = {
  [key: string]: {
    [key: string]: string[];
  };
};

const generateE_NFAData = (input: ENFAInputProps): ENFADataProps => {
  const states = input.states.toLowerCase().split(",");
  const alphabets = input.alphabets.toLowerCase().split(",");
  const startState = input.startState.toLowerCase();
  const finalStates = input.finalStates.toLowerCase().split(",");

  const transitions: TransitionTable = {};
  states.forEach(state => {
    transitions[state] = {};
    alphabets.forEach(alphabet => {
      transitions[state][alphabet] = [];
    });
  });

  Object.entries(input.transitions).forEach(([key, value]) => {
    const splitValues = value.toLowerCase().split(':');
    alphabets.forEach((alphabet, index) => {
      transitions[key][alphabet] = splitValues[index] ? splitValues[index].split(',') : [];
    });
  });

  const epsilonTransitions: { [key: string]: string[] } = {};
  for (const [key, value] of Object.entries(input.epsilons)) {
    epsilonTransitions[key] = value.toLowerCase().split(",");
  }

  return {
    states,
    alphabets,
    startState,
    finalStates,
    transitions,
    epsilonTransitions,
  };
};

const generateClosure = (state: string, epsilonTransitions: { [key: string]: string[] }): string[] => {
  const stack: string[] = [state];
  const closure = new Set<string>();
  closure.add(state);

  while (stack.length > 0) {
    const currentState = stack.pop()!;
    (epsilonTransitions[currentState] || []).forEach((nextState: string) => {
      if (!closure.has(nextState)) {
        closure.add(nextState);
        stack.push(nextState);
      }
    });
  }

  return Array.from(closure);
};

const convertENFAToNFAInput = (enfaData: ENFADataProps): NFAInputProps => {
  const { states, alphabets, epsilonTransitions, transitions } = enfaData;
  let nfaTransitions: { [key: string]: string } = {};

  states.forEach(state => {
    alphabets.forEach(alpha => {
      const closureArray = generateClosure(state, epsilonTransitions);
      let transitionStates = new Set<string>();
      closureArray.forEach(closureState => {
        transitions[closureState][alpha].forEach(transState => {
          generateClosure(transState, epsilonTransitions).forEach(closureTransState => {
            transitionStates.add(closureTransState);
          });
        });
      });
      nfaTransitions[state + ":" + alpha] = Array.from(transitionStates).join(',');
    });
  });

  const nfaFinalStates = states.filter(state => 
    generateClosure(state, epsilonTransitions).some(closureState => enfaData.finalStates.includes(closureState))
  ).join(',');

  return {
    states: states.join(','),
    alphabets: alphabets.join(','),
    startState: enfaData.startState,
    finalStates: nfaFinalStates,
    transitions: nfaTransitions,
  };
};

const generateDFA = (input: ENFAInputProps): E_NFA2DFADataProps => {
  const enfaData = generateE_NFAData(input);
  const nfaInput = convertENFAToNFAInput(enfaData);
  const dfaResult = nfaConverterRepository.generateDFA(nfaInput);

  return {
    eNfaData: enfaData,
    dfaData: dfaResult.dfaData,
    dfaTable: dfaResult.dfaTable,
    dfaFinalStates: dfaResult.dfaFinalStates,
  };
};

export const eNFAConverterRepository = {
  generateDFA,
};
