"use client";

import React, { useState } from "react";
import { Bintro } from "@/components/Bread";
import { NavigationMenuDemo } from "@/components/Nav";

export default function Soal2() {
  return (
    <main>
      <header className="py-5 px-5">
        <NavigationMenuDemo />
      </header>
      <div className="mx-auto px-4 max-w-[1650px] py-3 mt-1">
        <Bintro/>
        <div className="mt-8 space-y-4">
          <h1 className="font-bold text-3xl mt-4" style={{ fontSize: "2.3em" }}>
            KELOMPOK 3
          </h1>
          <p style={{ fontSize: "1.0em" }}>
            Anggota Kelompok:<br></br>
            1. Karren Gabriella Khoirunnisa (L0122084)<br></br>
            2. Mochamad Faisal Akbar        (L0122094)<br></br>
            3. Muhammad Abdan Rafi’i        (L0122101)<br></br>
            4. Muhammad Faqih Khawarizmi    (L0122108)<br></br>
            5. Muhammad Syafiq Ibrahim      (L0122116)<br></br>
          </p>

          <p style={{ fontSize: "1.0em" }}>
            Soal:<br></br>
            1. Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya menjadi DFA yang berkaitan.<br></br>
            2. Menerima input berupa regular expression dan dapat mengenerate e-NFA yang berhubungan.<br></br>
            3. Menerima input berupa sebuah DFA kemudian membuat jadi minimal, dimana user dapat memasukkan input berupa string untuk mengetes DFA tesebut, baik sebelum maupun sesudah dalam bentuk minimal.<br></br>
            4. Menerima input berupa dua buah DFA, kemudian menunjukkan keduanya ekuivalen atau tidak.<br></br>
            5. Mengetes DFA, NFA, e-NFA ataupun reguler expression dengan memasukkan input berupa string untuk mengetahui apakah string tersebut di accept atau di reject.<br></br>
          </p>
        </div>
      </div>
    </main>
  );
}
