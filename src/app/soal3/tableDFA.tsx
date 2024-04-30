import React from "react";
import { ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableDFAProps {
  states: string[];
  alphabets: string[];
  startState: string;
  finalStates: string[];
  transitions: { [key: string]: string };
}

const TableDFA: React.FC<TableDFAProps> = ({
  states,
  alphabets,
  startState,
  finalStates,
  transitions,
}) => {
  return (
    <div>
      <h2>DFA Awal</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>States</TableHead>
            {alphabets.map((alphabet, index) => (
              <TableHead key={"table-head-" + alphabet + index}>
                {alphabet}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.map((state, index) => (
            <TableRow key={index}>
              <TableCell>
                {startState === state && (
                  <ArrowRight className="inline w-4 h-4 mr-2" />
                )}
                {finalStates.includes(state) ? "*" : ""}
                {state}
              </TableCell>
              {alphabets.map((alphabet, idx) => (
                <TableCell key={idx}>
                  {transitions[`${state},${alphabet}`]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDFA;