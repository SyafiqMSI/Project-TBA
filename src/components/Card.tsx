import * as React from "react"
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardWithForm() {
    const cardStyle = {
        width: '100%', 
        maxWidth: '350px', 
        height: '200px', 
        marginRight: '20px',
        marginTop: '20px',
    };

    return (
      <div className="Soal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="top-cards" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Link href="/soal1">
            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle>NFA e-NFA to DFA</CardTitle>
                <span style={{ margin: '5px' }}></span>
                <CardDescription className="">Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya menjadi DFA yang berkaitan</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/soal2">
            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle>Regular Expression</CardTitle>
                <span style={{ margin: '5px' }}></span>
                <CardDescription className=""> Menerima input berupa regular expression dan dapat mengenerate e-NFA yang berhubungan. </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/soal3">
            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle>Minimalism</CardTitle>
                <span style={{ margin: '5px' }}></span>
                <CardDescription className="">Menerima input berupa sebuah DFA kemudian membuat jadi minimal, dimana user dapat memasukkan input berupa string untuk mengetes DFA tesebut, baik sebelum maupun sesudah dalam bentuk minimal</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        
        <div className="bottom-cards" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/soal4">
            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle>Equivalensi</CardTitle>
                <span style={{ margin: '5px' }}></span>
                <CardDescription className="">Menerima input berupa dua buah DFA, kemudian menunjukkan keduanya equivalen atau tidak</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/soal5">
            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle>Testing</CardTitle>
                <span style={{ margin: '5px' }}></span>
                <CardDescription className="">Mengetes DFA, NFA, e-NFA ataupun reguler expression dengan memasukkan input berupa string untuk mengetahui apakah string tersebut di accept atau di reject</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    )
}
