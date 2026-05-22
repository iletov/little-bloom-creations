import React from 'react';

type Props = {
  handleEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleGoogle: () => void;
  message: string;
};

const AuthForm = (props: Props) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={props.handleEmail}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            type="email"
            required
            value={props.email}
            onChange={e => props.setEmail(e.target.value)}
            className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-[1.6rem]"
            placeholder="Email address"
          />
        </div>
        <div>
          <input
            type="password"
            required
            value={props.password}
            onChange={e => props.setPassword(e.target.value)}
            className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-[1.6rem]"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={props.loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-[1.6rem] font-medium rounded-md text-white bg-indigo-600 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150">
          {props.loading ? 'Signing in...' : 'Sign in with Email'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-[1.6rem]">
          <span className="px-2 bg-gray-50 text-gray-500">Or</span>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={props.handleGoogle}
          disabled={props.loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-[1.6rem] font-medium rounded-md text-white bg-red-600 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150">
          {props.loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>

      {props.message && (
        <div className="text-center text-sm text-red-600">{props.message}</div>
      )}
    </form>
  );
};

export default AuthForm;
