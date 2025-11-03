'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

type Props = {
  data?: any;
};

const Todo = ({ data }: Props) => {
  const [newTodo, setNewTodo] = useState<string>('');

  const { user, signOut } = useAuth();

  console.log('AUTH', user);

  const supabase = createClient();

  /**
   * Fetches all todos from the "Testing" table, ordered by created_at in ascending order.
   * Throws an error if the query fails.
   * Returns an array of todos, or an empty array if no todos are found.
   */
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('Testing')
      .select()
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  };

  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000,
  });

  const addTodo = async () => {
    const { error } = await supabase
      .from('Testing')
      .insert({ name: newTodo, isComplete: false })
      .select()
      .single();

    if (error) {
      console.log(error);
    } else {
      setNewTodo('');
      refetch();
    }
  };

  const toggleTodo = async (id: number, isComplete: boolean) => {
    const { error } = await supabase
      .from('Testing')
      .update({ isComplete: !isComplete })
      .eq('id', id);

    if (error) {
      console.log(error);
    } else {
      refetch();
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from('Testing').delete().eq('id', id);

    if (error) {
      console.log(error);
    } else {
      refetch();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="mt-10 text-[1.6rem]">
      {user ? (
        <div>
          <Button onClick={signOut} className=" space-x-6">
            <span>Sign Out</span>
            <Image
              src={user?.user_metadata?.avatar_url}
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
          </Button>
          <p>{user?.user_metadata.full_name}</p>
        </div>
      ) : (
        <Link href={'/login'}>
          <Button>Sign In</Button>
        </Link>
      )}
      <div className="max-w-[600px] mx-auto grid gap-4">
        TODO
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="border max-w-[300px] p-2"
        />
        <button className="bg-green-1 max-w-[100px]" onClick={addTodo}>
          Create
        </button>
        <ul className="space-y-2">
          {todos?.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={() => toggleTodo(todo.id, todo.isComplete)}
                />
                <span
                  className={
                    todo.isComplete ? 'line-through text-gray-500' : ''
                  }>
                  {todo.name}
                </span>
              </div>
              {user ? (
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 text-[1.6rem]">
                  Delete
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
