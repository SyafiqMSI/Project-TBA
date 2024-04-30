'use client'

import React, { useState } from 'react';
import { Bsoal2 } from '@/components/Bread';
import { NavigationMenuDemo } from '@/components/Nav';

export default function Soal2() {
    
    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo/>
            </header>
            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal2 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        REGEX to E-NFA
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Menerima input berupa regular expression dan dapat mengenerate e-NFA yang berhubungan.
                    </p>
                </div>
                    
            </div>
        </main>
    );
}
