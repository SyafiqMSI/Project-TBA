'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { SelectFA5 } from '@/components/Drop5';
import { Bsoal5 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import { checkStringAgainstFA } from './testing';
import "./style.css";

import { Button } from '@/components/ui/button';

interface Transitions {
    [key: string]: string;
}

export default function Soal5() {
    const [regex, setRegex] = useState<string>("0+1*");
    const [states, setStates] = useState<string>("q0,q1,q2");
    const [alphabets, setAlphabets] = useState<string>("0,1");
    const [startState, setStartState] = useState<string>("q0");
    const [final, setFinalState] = useState<string>("q2");
    const [jenisFA5, setjenisFA] = useState<string>("nfa");
    const [string, setString] = useState<string>("0111");
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

    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRegex = event.target.value;
        setRegex(newRegex);
    };

    const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setString(event.target.value);
    };

    const handleTransitionChange = (state: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTransitions({
            ...transitions,
            [state]: value,
        });
    };

    const onClickButtonGenerate = () => {
        const fa = {
            regex: regex, // Assume regex is the regular expression for the FA
            states: states.split(','),
            alphabets: alphabets.split(','),
            startState: startState,
            finalState: final,
            transitions: transitions,
            epsilons: epsilons, // Only necessary if the FA type is E-NFA
        };
    
        if (jenisFA5 === "nfa" || jenisFA5 === "e-nfa") {
            const result = checkStringAgainstFA(fa, string);
            console.log(`Result for ${jenisFA5.toUpperCase()}: ${result}`);
        } else if (jenisFA5 === "dfa") {
            // Implementing DFA logic
            let currentState = startState;
            let valid = true;
            for (let char of string) {
                const stateTransitions = transitions[currentState] ? transitions[currentState].split(",") : [];
                let nextState = null;
                for (let trans of stateTransitions) {
                    const [condition, resultState] = trans.split(":");
                    if (condition === char) {
                        if (nextState) {
                            console.log("Non-deterministic transition found in DFA");
                            valid = false;
                            break;
                        }
                        nextState = resultState;
                    }
                }
                if (!nextState || !valid) {
                    valid = false;
                    break;
                }
                currentState = nextState;
            }
            const result = valid && currentState === final;
            console.log(`Result for DFA: ${result}`);
        } else if (jenisFA5 === "regex") {
            // Implementing Regex-based FA logic
            const regexPattern = new RegExp(`^${fa.regex}$`);
            const result = regexPattern.test(string);
            console.log(`Result for Regex: ${result}`);
        }
    };


    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo />
            </header>

            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal5 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        Tester
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Mengetes DFA, NFA, e-NFA ataupun reguler expression dengan memasukkan input berupa string untuk mengetahui apakah string tersebut di accept atau di reject
                    </p>
                </div>
                {jenisFA5 === "nfa" && (
                    <>
                        <div>
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
                    </>
                )}

                {jenisFA5 === "dfa" && (
                    <>
                        <div>
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
                    </>
                )}

                {jenisFA5 === "regex" && (
                    <>
                        <div>
                            <div className="mt-5 space-y-2">
                                <Label htmlFor="regex" className="regex">REGEX</Label>
                                <Input
                                    type="text"
                                    placeholder="1*"
                                    defaultValue={regex}
                                    onChange={handleStateChange}
                                />
                            </div>
                        </div>
                    </>
                )}

                {jenisFA5 === "e-nfa" && (
                    <>
                        <div>
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
                            <div>
                                <p className="text-lg font-semibold pt-4">Epsilon</p>
                            </div>
                            <div className="gap-2">
                                {states.split(",").map((item, index) => (
                                    <div className="space-y-1" key={"input-epsilon-" + index}>
                                        <Label>Masukkan epsilon ({item})</Label>
                                        <Input
                                            placeholder="0,1,..."
                                            value={epsilons[item]}
                                            onChange={(e) =>
                                                setEpsilons({
                                                    ...epsilons,
                                                    [item]: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-1 space-y-2">
                <Label htmlFor="finalStates" className='String'>String</Label>
                <Input
                    type="text"
                    placeholder="01"
                    value={string}
                    onChange={handleStringChange}
                />
                </div>

                <div className="mt-1 space-y-2">
                    <Label htmlFor="automataType" className="jenisFA">Jenis Finite Automata</Label>
                    <Select defaultValue={jenisFA5} onValueChange={(v) => setjenisFA(v)}>
                        <SelectFA5 />
                    </Select>
                </div>
                
                <div className="mt-8 px-1 py-5">
                    <Button onClick={onClickButtonGenerate}>Test</Button>
                </div>
            </div>
        </main>
    );
}
