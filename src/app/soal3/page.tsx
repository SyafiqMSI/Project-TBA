"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from "@/components/Nav";
import { Bsoal3 } from "@/components/Bread";
import { minimizeDFA, simulateDFA, DFA } from "./minimasi";
import TableDFA from "./tableDFA";
import TableDFAMinimasi from "./tableDFAminimasi";
import "./style.css";

import { Button } from "@/components/ui/button";

interface Transitions {
  [key: string]: string;
}

export default function Soal3() {
  const [showTables, setShowTables] = useState(false);
  const [states, setStates] = useState<string>("q0,q1,q2,q3,q4,q5,q6,q7");
  const [alphabets, setAlphabets] = useState<string>("0,1");
  const [startState, setStartState] = useState<string>("q0");
  const [final, setFinalState] = useState<string>("q4");
  const [string, setString] = useState<string>("0111");
  const [transitions, setTransitions] = useState<Transitions>({
    "q0,0": "q2",
    "q0,1": "q3",
    "q1,0": "q7",
    "q1,1": "q3",
    "q2,0": "q5",
    "q2,1": "q4",
    "q3,0": "q4",
    "q3,1": "q5",
    "q4,0": "q0",
    "q4,1": "q4",
    "q5,0": "q5",
    "q5,1": "q1",
    "q6,0": "q4",
    "q6,1": "q5",
    "q7,0": "q5",
    "q7,1": "q4",
  });

  const [minimizedStates, setMinimizedStates] = useState(states);
  const [minimizedTransitions, setMinimizedTransitions] = useState(transitions);
  const [minimizedFinalStates, setMinimizedFinalStates] = useState(final);

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStates = event.target.value;
    setStates(newStates);
    const stateArray = newStates.split(",");
    const alphabetArray = alphabets.split(",");

    const newTransitions: Transitions = {};
    stateArray.forEach((state) => {
      alphabetArray.forEach((alphabet) => {
        const key = `${state},${alphabet}`;
        newTransitions[key] = transitions[key] || "";
      });
    });
    setTransitions(newTransitions);
  };

  const handleAlphabetsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAlphabets = event.target.value;
    setAlphabets(newAlphabets);
    const stateArray = states.split(",");
    const alphabetArray = newAlphabets.split(",");

    const newTransitions: Transitions = {};
    stateArray.forEach((state) => {
      alphabetArray.forEach((alphabet) => {
        const key = `${state},${alphabet}`;
        newTransitions[key] = transitions[key] || "";
      });
    });
    setTransitions(newTransitions);
  };

  const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartState(event.target.value);
  };

  const handleFinalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinalState(event.target.value);
  };

  const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setString(event.target.value);
  };

  const handleTransitionChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setTransitions({
      ...transitions,
      [key]: value,
    });
  };

  const onClickButtonGenerate = () => {
    setShowTables(true);

    const statesArray = states.split(",");
    const finalStatesArray = final.split(",");
    const alphabetArray = alphabets.split(",");

    const dfa: DFA = {
      states: statesArray,
      alphabet: alphabetArray,
      transitionFunction: transitions,
      startState,
      finalStates: finalStatesArray,
    };

    const minimizedDFA = minimizeDFA(dfa);

    console.log("Testing original DFA:");
    const originalResult = simulateDFA(dfa, string);
    console.log(originalResult);

    console.log("Testing minimized DFA:");
    const minimizedResult = simulateDFA(minimizedDFA, string);
    console.log(minimizedResult);
    if (originalResult && minimizedResult) {
      alert("String di [Accept] oleh DFA awal dan DFA minimized");
    } else {
      alert("String di [Reject] oleh DFA awal dan DFA minimized");
    }
    setMinimizedStates(minimizedDFA.states.join(","));
    setMinimizedTransitions(minimizedDFA.transitionFunction);
    setMinimizedFinalStates(minimizedDFA.finalStates.join(","));

  };

  return (
    <main>
      <header className="py-5 px-5">
        <NavigationMenuDemo />
      </header>

      <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
        <Bsoal3 />
        <div className="mt-8 space-y-4">
          <h1 className="font-bold text-3xl mt-4" style={{ fontSize: "2.3em" }}>
            DFA Minimization
          </h1>
          <p style={{ fontSize: "1.0em" }}>
            Menerima input berupa sebuah DFA kemudian membuat jadi minimal,
            dimana user dapat memasukkan input berupa string untuk mengetes DFA
            tesebut, baik sebelum maupun sesudah dalam bentuk minimal
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="states" className="states">
            States
          </Label>
          <Input
            type="text"
            placeholder="q0,q1,..."
            defaultValue={states}
            onChange={handleStateChange}
          />
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="alphabets" className="alphabets">
            Alphabets
          </Label>
          <Input
            type="text"
            placeholder="0,1,..."
            defaultValue={alphabets}
            onChange={handleAlphabetsChange}
          />
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="startState" className="startState">
            Start State
          </Label>
          <Input
            type="text"
            placeholder="q0/q1/..."
            value={startState}
            onChange={handleStartChange}
          />
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="finalStates">Final States</Label>
          <Input
            type="text"
            placeholder="q0/q1/..."
            value={final}
            onChange={handleFinalChange}
          />
        </div>
        <div className="mt-3 space-y-2">
          {states.split(",").map((state) =>
            alphabets.split(",").map((input) => (
              <div key={`${state},${input}`} className="space-y-2">
                <Label htmlFor={`${state},${input}`} className="mt-5 space-y-2">
                  {" "}
                  Transition from {state} on input {input}
                </Label>
                <Input
                  type="text"
                  name={`${state},${input}`}
                  value={transitions[`${state},${input}`] || ""}
                  onChange={(e) =>
                    handleTransitionChange(`${state},${input}`, e)
                  }
                />
              </div>
            ))
          )}
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="finalStates">String</Label>
          <Input
            type="text"
            placeholder="01"
            value={string}
            onChange={handleStringChange}
          />
        </div>
        <div className="mt-8 px-1 py-5">
          <Button onClick={onClickButtonGenerate}>Minimize</Button>
        </div>

        {showTables && (
          <div className="mx-left max-w-[300px]" style={{ marginLeft: "30px" }}>
            <TableDFA
              states={states.split(",")}
              alphabets={alphabets.split(",")}
              startState={startState}
              finalStates={final.split(",")}
              transitions={transitions}
            />
            <br />
            <TableDFAMinimasi
              states={minimizedStates.split(",")}
              alphabets={alphabets.split(",")}
              startState={startState}
              finalStates={minimizedFinalStates.split(",")}
              transitions={minimizedTransitions}
            />
          </div>
        )}
      </div>
    </main>
  );
}
