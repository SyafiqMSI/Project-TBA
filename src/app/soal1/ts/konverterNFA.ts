import {
  DFADataProps,
  NFA2DFADataProps,
  NFADataProps,
  NFAInputProps,
} from "./type";

type DFATableProps = {
  [key: string]: {
    [key: string]: string[];
  };
};

const generateNFAData = (input: NFAInputProps): NFADataProps => {
  const states = input.states.split(",");
  const alphabets = input.alphabets.split(",");
  const startState = input.startState;
  const finalStates = input.finalStates.split(",");
  const transitions: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  for (const [key, value] of Object.entries(input.transitions)) {
    const lowercaseKey = key.toLowerCase();
    const lowercaseValue = typeof value === 'string' ? value.toLowerCase() : "";  // Tambahkan pemeriksaan tipe

    // Lanjutkan pemrosesan dengan lowercaseValue
    // Misal, memecah value dengan ':' dan ',' jika lowercaseValue bukan string kosong
    const innerTransitions: { [key: string]: string[] } = {};
    if (lowercaseValue) {
      const statesByAlphabet = lowercaseValue.split(":");
      for (let a = 0; a < alphabets.length; a++) {
        const alphabet = alphabets[a];
        if (statesByAlphabet[a] && statesByAlphabet[a].length > 0) {
          innerTransitions[alphabet] = statesByAlphabet[a].split(",");
        }
      }
    }

    transitions[lowercaseKey] = innerTransitions;
  }

  return {
    states,
    alphabets,
    startState,
    finalStates,
    transitions,
  };
};


const generateDFATable = (data: NFADataProps): DFATableProps => {
  const table: DFATableProps = {};
  const newStates: string[] = [data.startState];

  while (newStates.length > 0) {
    const currentState = newStates.shift()!;
    const innerTable: {
      [key: string]: string[];
    } = {};

    const currentStates = currentState.split(",");
    for (const state of currentStates) {
      const destinations = data.transitions[state] || {};
      for (const [alphabet, nextStates] of Object.entries(destinations)) {
        const destinationState = nextStates.join();
        if (!innerTable[alphabet]) {
          innerTable[alphabet] = [];
        }
        innerTable[alphabet].push(...nextStates.filter(ns => !innerTable[alphabet].includes(ns)));
        innerTable[alphabet].sort();
        
        const newState = innerTable[alphabet].join();
        if (!newStates.includes(newState) && !Object.keys(table).includes(newState)) {
          newStates.push(newState);
        }
      }
    }
    table[currentState] = innerTable;
  }

  return table;
};

const generateDFAFilteredTableData = (
  data: NFADataProps,
  table: DFATableProps
): {
  table: DFATableProps;
  finalStates: string[];
} => {
  const visitedStates: string[] = [];
  const finalStates: string[] = [];

  for (const [state, transitions] of Object.entries(table)) {
    visitedStates.push(state);
    if (data.finalStates.some(fs => state.includes(fs)) && !finalStates.includes(state)) {
      finalStates.push(state);
    }
  }

  return {
    table,
    finalStates,
  };
};

const generateDFAData = (
  data: NFADataProps,
  dfaTable: DFATableProps,
  dfaFinalStates: string[]
): DFADataProps => {
  const transitions: {
    [key: string]: {
      [key: string]: string;
    };
  } = {};

  for (const [state, transition] of Object.entries(dfaTable)) {
    transitions[state] = {};
    for (const [alphabet, nextStates] of Object.entries(transition)) {
      transitions[state][alphabet] = nextStates.join();
    }
  }

  return {
    states: Object.keys(dfaTable),
    startState: data.startState,
    finalStates: dfaFinalStates,
    alphabets: data.alphabets,
    transitions,
  };
};

const generateDFA = (input: NFAInputProps): NFA2DFADataProps => {
  const nfaData = generateNFAData(input);
  const dfaTable = generateDFATable(nfaData);
  const filteredData = generateDFAFilteredTableData(nfaData, dfaTable);
  const dfaData = generateDFAData(nfaData, filteredData.table, filteredData.finalStates);

  return {
    nfaData,
    dfaUnfilteredTable: dfaTable,
    dfaData,
    dfaTable: filteredData.table,
    dfaFinalStates: filteredData.finalStates,
  };
};

const generateDFAUsingData = (data: NFADataProps): NFA2DFADataProps => {
  const dfaTable = generateDFATable(data);
  const filteredData = generateDFAFilteredTableData(data, dfaTable);
  const dfaData = generateDFAData(data, filteredData.table, filteredData.finalStates);

  return {
    nfaData: data,
    dfaUnfilteredTable: dfaTable,
    dfaData,
    dfaTable: filteredData.table,
    dfaFinalStates: filteredData.finalStates,
  };
};

// Tambahkan ke nfaConverterRepository
export const nfaConverterRepository = {
  generateDFA,
  generateDFAUsingData,
};
