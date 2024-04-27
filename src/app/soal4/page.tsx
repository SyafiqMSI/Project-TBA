'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { Bsoal4 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import "./style.css";
import { areEquivalent, DFA } from './ekuivalensi';

import { Button } from '@/components/ui/button';

interface Transitions {
    [key: string]: string;
}

export default function Soal4() {
    const [states1, setStates1] = useState<string>("q0,q1,q2");
    const [states2, setStates2] = useState<string>("q3,q4,q5,q6");
    const [alphabets1, setAlphabets1] = useState<string>("0,1");
    const [alphabets2, setAlphabets2] = useState<string>("0,1");
    const [startState1, setStartState1] = useState<string>("q0");
    const [startState2, setStartState2] = useState<string>("q3");
    const [final1, setFinalState1] = useState<string>("q0");
    const [final2, setFinalState2] = useState<string>("q3");
    const [transitions1, setTransitions1] = useState<Transitions>({
        q0: "q0:q1",
        q1: "q2:q0",
        q2: "q1:q2",
    });
    const [transitions2, setTransitions2] = useState<Transitions>({
        q3: "q3:q4",
        q4: "q5:q3",
        q5: "q6:q5",
        q6: "q5:q3",
    });

    const handleStateChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStates = event.target.value;
        setStates1(newStates);
        const stateArray = newStates.split(',');
        const newTransitions: Transitions = {};
        stateArray.forEach(state => {
            newTransitions[state] = transitions1[state] || '';
        });
        setTransitions1(newTransitions);
    };

    const handleAlphabetsChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlphabets1(event.target.value);
    };

    const handleStartChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartState1(event.target.value);
    };

    const handleFinalChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFinalState1(event.target.value);
    };

    const handleTransitionChange1 = (state: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTransitions1({
            ...transitions1,
            [state]: value,
        });
    };


    const handleStateChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStates = event.target.value;
        setStates2(newStates);
        const stateArray = newStates.split(',');
        const newTransitions: Transitions = {};
        stateArray.forEach(state => {
            newTransitions[state] = transitions2[state] || '';
        });
        setTransitions2(newTransitions);
    };

    const handleAlphabetsChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlphabets2(event.target.value);
    };

    const handleStartChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartState2(event.target.value);
    };

    const handleFinalChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFinalState2(event.target.value);
    };

    const handleTransitionChange2 = (state: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTransitions2({
            ...transitions2,
            [state]: value,
        });
    };

    const onClickButtonGenerate = () => {
        const dfa1: DFA = {
            states: states1.split(','),
            alphabets: alphabets1.split(','),
            startState: startState1,
            finalStates: final1.split(','),
            transitions: transitions1,
        };
    
        const dfa2: DFA = {
            states: states2.split(','),
            alphabets: alphabets2.split(','),
            startState: startState2,
            finalStates: final2.split(','),
            transitions: transitions2,
        };

        console.log("DFA 1:", dfa1);
        console.log("DFA 2:", dfa2);
    
        const equivalent = areEquivalent(dfa1, dfa2);
        alert(`Are the DFAs equivalent? ${equivalent ? 'Yes' : 'No'}`);
    };


    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo />
            </header>

            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal4 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        DFA Equivalence
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Menerima input berupa dua buah DFA, kemudian menunjukkan keduanya equivalen atau tidak
                    </p>
                </div>

                <h1 className="font-bold text-2xl mt-4" style={{ fontSize: '1.5em' }}>
                    DFA 1
                </h1>
                <div className="mt-5 space-y-2">
                    <Label htmlFor="states1" className="states1">States</Label>
                    <Input
                        type="text"
                        placeholder="q0,q1,..."
                        defaultValue={states1}
                        onChange={handleStateChange1}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alphabets1" className="alphabets1">Alphabets</Label>
                    <Input
                        type="text"
                        placeholder="0,1,..."
                        defaultValue={alphabets1}
                        onChange={handleAlphabetsChange1}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startState1" className="startState1" >Start State</Label>
                    <Input
                        type="text"
                        placeholder="q0/q1/..."
                        value={startState1}
                        onChange={handleStartChange1}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="finalStates" >Final States</Label>
                    <Input
                        type="text"
                        placeholder="q0/q1/..."
                        value={final1}
                        onChange={handleFinalChange1}
                    />
                </div>
                <div className="mt-4 space-y-2 ">
                    {Object.entries(transitions1).map(([state, value], index) => (
                        <div key={index} className="space-y-2">
                            <Label htmlFor={state} className="Transitions" >Transitions {state} untuk {alphabets1}</Label>
                            <Input
                                type="text"
                                name={state}
                                value={value}
                                onChange={(e) => handleTransitionChange1(state, e)}
                            />
                        </div>
                    ))
                    }
                </div>

                <div className="mt-10 space-y-2">
                    <h1 className="font-bold text-2xl mt-4" style={{ fontSize: '1.5em' }}>
                        DFA 2
                    </h1>

                    <div className="mt-5 space-y-2">
                        <Label htmlFor="states1" className="states1">States</Label>
                        <Input
                            type="text"
                            placeholder="q0,q1,..."
                            defaultValue={states2}
                            onChange={handleStateChange2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alphabets1" className="alphabets1">Alphabets</Label>
                        <Input
                            type="text"
                            placeholder="0,1,..."
                            defaultValue={alphabets2}
                            onChange={handleAlphabetsChange2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="startState1" className="startState1" >Start State</Label>
                        <Input
                            type="text"
                            placeholder="q0/q1/..."
                            value={startState2}
                            onChange={handleStartChange2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="finalStates" >Final States</Label>
                        <Input
                            type="text"
                            placeholder="q0/q1/..."
                            value={final2}
                            onChange={handleFinalChange2}
                        />
                    </div>
                    <div className="mt-4 space-y-2 ">
                        {Object.entries(transitions2).map(([state, value], index) => (
                            <div key={index} className="space-y-2">
                                <Label htmlFor={state} className="Transitions" >Transitions {state} untuk {alphabets2}</Label>
                                <Input
                                    type="text"
                                    name={state}
                                    value={value}
                                    onChange={(e) => handleTransitionChange2(state, e)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 px-1 py-5">
                        <Button onClick={onClickButtonGenerate}>Cek Ekuivalen</Button>
                    </div>

                </div>
            </div>

        </main>
    );
}
