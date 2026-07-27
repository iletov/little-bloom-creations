export type AcrylicColor = {
  name: string;
  hex: string;
  class: string;
};

export const ACRYLIC_COLORS: AcrylicColor[] = [
  { name: 'Бял', hex: '#FFFFFF', class: 'bg-white border-gray-200' },
  {
    name: 'Бебешко Розово',
    hex: '#FADADD',
    class: 'bg-[#FADADD] border-[#FADADD]',
  },
  {
    name: 'Бебешко Синьо',
    hex: '#89CFF0',
    class: 'bg-[#89CFF0] border-[#89CFF0]',
  },
  {
    name: 'Ментово Зелено',
    hex: '#98FF98',
    class: 'bg-[#98FF98] border-[#98FF98]',
  },
  {
    name: 'Лимонено Жълто',
    hex: '#FFF44F',
    class: 'bg-[#FFF44F] border-[#FFF44F]',
  },
  { name: 'Люляк', hex: '#C8A2C8', class: 'bg-[#C8A2C8] border-[#C8A2C8]' },
  {
    name: 'Праскова',
    hex: '#FFE5B4',
    class: 'bg-[#FFE5B4] border-[#FFE5B4]',
  },
  {
    name: 'Светло Сив',
    hex: '#D3D3D3',
    class: 'bg-[#D3D3D3] border-[#D3D3D3]',
  },
  { name: 'Черен', hex: '#000000', class: 'bg-black border-black' },
];

export const getAcrylicColorHex = (colorName: string): string | null => {
  const normalizedColorName = colorName.trim();

  return (
    ACRYLIC_COLORS.find((color) => color.name === normalizedColorName)?.hex ??
    null
  );
};
