import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React from 'react';

interface SizeContainerProps {
  isOpen: boolean;
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSize: string;
  handleSizeSelect: (size: string) => void;
  product: any;
}

const SizeContainer = ({
  isOpen,
  setisOpen,
  selectedSize,
  handleSizeSelect,
  product,
}: SizeContainerProps) => {
  return (
    <Popover open={isOpen} onOpenChange={setisOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between bg-foreground/80 hover:bg-foreground/70"
          onClick={() => setisOpen(!isOpen)}>
          {selectedSize ? (
            <span className="font-medium">{selectedSize}</span>
          ) : (
            <span className="text-zinc-700">Rазмери</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="w-full min-w-[146px] p-0  rounded-lg ">
        <Command>
          <CommandGroup className=" bg-neutral-200/90">
            {product?.sizes?.map((size: any) => (
              <CommandItem
                key={size}
                className="text-black"
                onSelect={() => handleSizeSelect(size)}>
                {size}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SizeContainer;
