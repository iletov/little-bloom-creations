type IconProps = {
  className?: string;
};

export const ShoppingCartIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
};

export const LoginIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
    />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

export const QuotesIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      {' '}
      <path
        opacity="0.5"
        d="M8.09027 11.63H3.40027C3.48027 6.95997 4.40026 6.18996 7.27026 4.48996C7.60026 4.28996 7.71025 3.86996 7.51025 3.52996C7.31025 3.19996 6.89023 3.08997 6.55023 3.28997C3.17023 5.28997 1.99023 6.50995 1.99023 12.33V17.72C1.99023 19.43 3.38026 20.81 5.08026 20.81H8.08026C9.84026 20.81 11.1702 19.48 11.1702 17.72V14.72C11.1802 12.96 9.85027 11.63 8.09027 11.63Z"
        fill="var(--green-5)"></path>{' '}
      <path
        opacity="0.2"
        d="M18.9105 11.63H14.2205C14.3005 6.95997 15.2206 6.18996 18.0906 4.48996C18.4206 4.28996 18.5306 3.86996 18.3306 3.52996C18.1306 3.19996 17.7105 3.08997 17.3705 3.28997C13.9905 5.28997 12.8105 6.50995 12.8105 12.33V17.72C12.8105 19.43 14.2006 20.81 15.9006 20.81H18.9006C20.6606 20.81 21.9905 19.48 21.9905 17.72V14.72C22.0005 12.96 20.6705 11.63 18.9105 11.63Z"
        fill="var(--green-5)"></path>{' '}
    </g>
  </svg>
);
export const QuotesIcon2 = ({ className }: IconProps) => (
  <svg
    fill="none"
    viewBox="0 -5 34 34"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
        // opacity="0.3"
        d="m31.2 0h-7.2l-4.8 9.6v14.4h14.4v-14.4h-7.2zm-19.2 0h-7.2l-4.8 9.6v14.4h14.4v-14.4h-7.2z"
        fill="var(--green-5)"></path>
    </g>
  </svg>
);
