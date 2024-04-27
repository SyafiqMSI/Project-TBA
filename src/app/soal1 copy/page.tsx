'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { DropdownMenuDemo } from '@/components/Drop';
import { Bsoal1 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import { eNFAConverterRepository } from "./E_NFAConverter";
import { nfaConverterRepository } from "./NFAConverter";
import ComponentTableNFA from "./tabel";

import { 
  NFA2DFADataProps,
  E_NFA2DFADataProps
 } from './type';
import { Button } from '@/components/ui/button';

interface Transitions {
  [key: string]: string;
}

export default function Soal1() {
  const [states, setStates] = useState<string>("q0,q1,q2");
  const [alphabets, setAlphabets] = useState<string>("0,1");
  const [start, setStartState] = useState<string>("q0");
  const [final, setFinalState] = useState<string>("q2");
  const [faType, setFaType] = useState<string>("nfa");
  const [transitions, setTransitions] = useState<Transitions>({
    q0: "q0,q1:q0",
    q1: ":q2",
    q2: ":",
  });
  const [epsilons, setEpsilons] = useState<{[key: string]: string;}>({
    q0: "q1",
    q1: "q3",
    q2: "q4",
    q3: "",
    q4: "",
  });
  const [nfa2dfaData, setNfa2dfaData] = useState<NFA2DFADataProps >();
  const [eNfa2dfaData, setENfa2dfaData] = useState<E_NFA2DFADataProps >();

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStates = event.target.value;
    setStates(newStates);
    const stateArray = newStates.split(',');
    const newTransitions: Transitions = {};
    stateArray.forEach(state => {
      newTransitions[state] = transitions[state] || '';
    });
    setTransitions(newTransitions);
  };
 
  const handleAlphabetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlphabets(event.target.value);
  };

  const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartState(event.target.value);
  };
  
  const handleFinalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinalState(event.target.value);
  };

  const handleAutomataTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFaType(event.target.value);
  };

  const handleTransitionChange = (state: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTransitions({
      ...transitions,
      [state]: value,
    });
  };

  const onClickButtonGenerate = () => {
    if (faType === "nfa") {
      const result = nfaConverterRepository.generateDFA({
        states: states.toLowerCase(),
        alphabets: alphabets.toLowerCase(),
        startState: start.toLowerCase(),
        finalStates: final.toLowerCase(),
        transitions: transitions,
      });

      setNfa2dfaData(result);
    } else {
      const result = eNFAConverterRepository.generateDFA({
        states: states.toLowerCase(),
        alphabets: alphabets.toLowerCase(),
        startState: start.toLowerCase(),
        finalStates: final.toLowerCase(),
        transitions: transitions,
        epsilons,
      });

      console.log({ result });

      setENfa2dfaData(result);
    }
  };
  return (
    <main>
      <header className="py-5 px-5">
        <NavigationMenuDemo />
      </header>

      <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
        <Bsoal1 />
        <div className="mt-8 space-y-4">
          <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
            NFA e-NFA to DFA
          </h1>
          <p style={{ fontSize: '1.0em' }}>
            Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya menjadi DFA yang berkaitan
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="states">States</Label>
          <Input
            type="text"
            placeholder="q0,q1,..."
            defaultValue={states}
            onChange={handleStateChange}
          />
        </div>

        <div className="mt-1 space-y-2">
          <div className="space-y-2">
            <Label htmlFor="alphabets">Alphabets</Label>
            <Input
              type="text"
              placeholder="0,1,..."
              defaultValue={alphabets}
              onChange={handleAlphabetsChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startState">Start State</Label>
            <Input
              type="text"
              placeholder="q0/q1/..."
              value={start}
              onChange={handleStartChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="finalStates">Final States</Label>
            <Input
              type="text"
              placeholder="q0/q1/..."
              value={final}
              onChange={handleFinalChange}
            />
          </div>
          <div className="mt-1 space-y-2">
            <Label htmlFor="automataType">Jenis Finite Automata</Label>
            <Select defaultValue={faType} onValueChange={(v) => setFaType(v)}>
              <DropdownMenuDemo/>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold pt-4">Transitions</p>
          <p>Pisahkan setiap input menggunakan tanda (,) dan setiap alphabets dengan tanda (:)</p>
          <p>Contoh Transitions: q0,q1:q0 </p>
        </div>

        <div className="mt-5 space-y-2">
          {Object.entries(transitions).map(([state, value], index) => (
            <div key={index}>
              <Label htmlFor={state}>Transitions {state} untuk {alphabets}</Label>
              <Input
                type="text"
                name={state}
                value={value}
                onChange={(e) => handleTransitionChange(state, e)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={onClickButtonGenerate}>Convert to DFA</Button>
        </div>

        {faType === "nfa" && nfa2dfaData && (
          <ComponentTableNFA {...nfa2dfaData} />
        )}
        
        

      </div>
      
    </main>
  );
}
