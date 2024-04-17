import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  
  export function DropdownMenuDemo() {
    return (
      <div className="mx-auto max-w-[768px] py-3 mt-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gray-100 px-4 py-2 rounded-md cursor-pointer focus:outline-none">
              Pilih Jenis Finite Automata
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none">
                Epsilon NFA
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none">
                NFA
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  