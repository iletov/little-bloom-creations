// import React, { useEffect, useRef, useState } from 'react';
// import { ErrorMessage } from '../checkout-forms/ErrorMessage';
// import { Input } from '@/components/ui/input';
// import { Country } from '../checkout-forms/CheckoutForm';
// import { Button } from '@/components/ui/button';

// interface CountryDropdownProps {
//   form: any;
//   countries: Array<Country>;
//   searchTerm: string;
//   setSearchTerm: (searchTerm: string) => void;
//   onSelect: (item: Country) => void;
//   // showDropdown: boolean;
//   // setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const CountryDropdown = ({
//   form,
//   countries,
//   searchTerm,
//   setSearchTerm,
//   onSelect,
//   // showDropdown,
//   // setShowDropdown,
// }: CountryDropdownProps) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [filteredCountries, setFilteredCountries] = useState<Array<Country>>(
//     [],
//   );
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Filter items based on search term
//   useEffect(() => {
//     if (!searchTerm || searchTerm.length < 2) {
//       setFilteredCountries([]);
//       return;
//     }

//     const normalizedSearchTerm = searchTerm.toLowerCase().trim();
//     const filtered = countries.filter(
//       country =>
//         country.name.toLowerCase().includes(normalizedSearchTerm) ||
//         country.nameEn.toLowerCase().includes(normalizedSearchTerm),
//     );

//     setFilteredCountries(filtered);
//   }, [searchTerm, countries]);

//   const handleClear = () => {
//     setSearchTerm('');
//     form.setValue('country', '', { shouldValidate: true });
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <Input
//         {...form.register('country')}
//         placeholder="Country"
//         className="input_styles "
//         value={searchTerm ? searchTerm : form.getValues('country')}
//         onChange={e => {
//           setSearchTerm(e.target.value);
//           form.setValue('country', e.target.value, { shouldValidate: true });
//           setShowDropdown(true);
//         }}
//         onFocus={() => setShowDropdown(true)}
//       />
//       {form.formState.errors.country && (
//         <ErrorMessage message={form.formState.errors.country.message} />
//       )}
//       {searchTerm || form.getValues('country') ? (
//         <Button
//           onClick={() => handleClear()}
//           className="absolute bg-slate-400 right-2 top-1/2 -translate-y-1/2 w-3.5 p-0 h-3.5 text-center rounded-full overflow-hidden">
//           <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.5rem]">
//             x
//           </span>
//         </Button>
//       ) : null}

//       {showDropdown && filteredCountries.length > 0 && (
//         <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 overflow-auto rounded-md">
//           {filteredCountries.map(country => (
//             <div
//               key={country.nameEn}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => {
//                 onSelect(country);
//                 setShowDropdown(false);
//               }}>
//               {country.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
