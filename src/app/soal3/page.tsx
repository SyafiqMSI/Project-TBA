'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { DropdownMenuDemo } from '@/components/Drop';
import { Bsoal3 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import "./style.css";

import { Button } from '@/components/ui/button';

interface Transitions {
    [key: string]: string;
}

export default function Soal1() {
    const [states, setStates] = useState<string>("q0,q1,q2");
    const [alphabets, setAlphabets] = useState<string>("0,1");
    const [startState, setStartState] = useState<string>("q0");
    const [final, setFinalState] = useState<string>("q2");
    const [jenisFA, setjenisFA] = useState<string>("nfa");
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

    };


    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo />
            </header>

            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal3 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        DFA Minimization
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Menerima input berupa sebuah DFA kemudian membuat jadi minimal, dimana user dapat memasukkan input berupa string untuk mengetes DFA tesebut, baik sebelum maupun sesudah dalam bentuk minimal
                    </p>
                </div>

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
                <div className="mt-8 px-1 py-5">
                <Button onClick={onClickButtonGenerate}>Minimize</Button>
                </div>


            </div>
        </main>
    );
}
