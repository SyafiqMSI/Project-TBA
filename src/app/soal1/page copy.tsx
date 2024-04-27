'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { DropdownMenuDemo } from '@/components/Drop';
import { Bsoal1 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import { eNFAConverterRepository } from "./ts/konverterENFA";
import { nfaConverterRepository } from "./ts/konverterNFA";
import ComponentTableNFA from "./tabelNFA";
import "./style.css";

import {
  NFA2DFADataProps,
  E_NFA2DFADataProps
} from './ts/type';
import { Button } from '@/components/ui/button';

interface Transitions {
  [key: string]: string;
}

interface Input_Automata {
  type: string;
  states: string[];
  alphabet: string[];
  transitions: { [key: string]: Transitions };
  start_state: string;
  accepting_states: string[];
  strings: string;
}

export default function Soal1() {
  const [states, setStates] = useState<string>("q0,q1,q2");
  const [alphabets, setAlphabets] = useState<string>("0,1");
  const [startState, setStartState] = useState<string>("q0");
  const [final, setFinalState] = useState<string>("q2");
  const [jenisFA, setjenisFA] = useState<string>("nfa");
  const [svgResponse1, setSvgResponse1] = useState<string>('');
  const [svgResponse2, setSvgResponse2] = useState<string>('');
  const [transitions, setTransitions] = useState<Transitions>({
    q0: "q0,q1:q0",
    q1: ":q2",
    q2: ":",
  });
  const [epsilons, setEpsilons] = useState<{ [key: string]: string; }>({
    q0: "q1",
    q1: "q3",
    q2: "q4",
    q3: "",
    q4: "",
  });

  const [automata, setAutomata] = useState<Input_Automata>({
    type: "NFA",
    states: [],
    alphabet: [],
    transitions: {},
    start_state: "",
    accepting_states: [],
    strings: ""
  });

  const [nfa2dfaData, setNfa2dfaData] = useState<NFA2DFADataProps>();
  const [eNfa2dfaData, setENfa2dfaData] = useState<E_NFA2DFADataProps>();

  const handleChange = async () => {
    try {
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automata)
      };
      const res = await fetch('http://localhost:5000/draw_diagram', requestOptions);
      const data = await res.json();
      setSvgResponse1(data.svgResult);
      console.log(automata)
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
    setjenisFA(event.target.value);
  };

  const handleTransitionChange = (state: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTransitions({
      ...transitions,
      [state]: value,
    });
  };

  const onClickButtonGenerate = () => {
    if (jenisFA === "nfa") {
      const result = nfaConverterRepository.generateDFA({
        states,
        alphabets,
        startState,
        finalStates: final,
        transitions,
      });

      setNfa2dfaData(result);
    } else {
      const result = eNFAConverterRepository.generateDFA({
        states,
        alphabets,
        startState: startState,
        finalStates: final,
        transitions,
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


      <div id='head' className="mt-6 px-9 space-y-4">
        <Bsoal1 />
        <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.2em' }}>
          NFA e-NFA to DFA
        </h1>
        <p style={{ fontSize: '0.92em' }}>
          Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya menjadi DFA yang berkaitan
        </p>
      </div>
      <div id='container' className="mx-left px-9 max-w-[950px] py-1 mt-1">

        <div className="flex ">
          <div className="mx-left px-1 max-w-[540px] py-1" style={{ marginRight: '20px' }}>
            <div className="mt-1 space-y-2">
              <div className="mt-5 space-y-2">
                <Label htmlFor="states" className="states">States</Label>
                <Input
                  type="text"
                  placeholder="q0,q1,..."
                  defaultValue={states}
                  onChange={handleStateChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alphabets" className="alphabets">Alphabets</Label>
                <Input
                  type="text"
                  placeholder="0,1,..."
                  defaultValue={alphabets}
                  onChange={handleAlphabetsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startState" className="startState" >Start State</Label>
                <Input
                  type="text"
                  placeholder="q0/q1/..."
                  value={startState}
                  onChange={handleStartChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalStates" >Final States</Label>
                <Input
                  type="text"
                  placeholder="q0/q1/..."
                  value={final}
                  onChange={handleFinalChange}
                />
              </div>
              <div className="mt-1 space-y-2">
                <Label htmlFor="automataType" className="jenisFA">Jenis Finite Automata</Label>
                <Select defaultValue={jenisFA} onValueChange={(v) => setjenisFA(v)}>
                  <DropdownMenuDemo />
                </Select>
              </div>
              <div className="mt-8 px-1 py-5">
                <Button onClick={onClickButtonGenerate}>Convert to DFA</Button>
              </div>
            </div>
          </div>

          <div className="mx-left max-w-[470px] py-2" style={{ marginLeft: '10px' }}>
            <div className="mt-4 space-y-2 ">
              {Object.entries(transitions).map(([state, value], index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={state} className="Transitions" >Transitions {state} untuk {alphabets}</Label>
                  <Input
                    type="text"
                    name={state}
                    value={value}
                    onChange={(e) => handleTransitionChange(state, e)}
                  />
                </div>
              ))}
            </div>

          </div>
          <div className="mx-left max-w-[300px]" style={{ marginLeft: '60px' }}>
            {jenisFA === "nfa" && nfa2dfaData && (
              <ComponentTableNFA {...nfa2dfaData} />
            )}

          </div>
        </div>

      </div>
    </main>
  );
}