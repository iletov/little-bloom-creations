import { cn } from '@/lib/utils';
import React, { JSX } from 'react';

type HighlightedProps = {
  text: string;
  word?: string;
  color?: string;
  className?: string;
  tag?: string;
};

/**
 * Highlights a given word in a heading.
 * @param {{text: string, word: string, color?: string}} props
 * @returns {JSX.Element}
 */
/**
 * @example
 * const Heading = () => (
 *   <HighlightedHeading text={data?.title} word="Tab" color="var(--pink-5)" tag="h2" />
 * );
 */
const HighlightedHeading = ({
  text,
  word,
  color,
  tag,
  className,
}: HighlightedProps) => {
  const Tag = tag as keyof JSX.IntrinsicElements;

  const basicClass =
    'text-[4.8rem] font-semibold text-green-dark leading-[1.2]';

  if (!word || !text.includes(word)) {
    return <Tag className={cn(basicClass, className)}>{text}</Tag>;
  }

  const parts = text.split(word);
  const highlightedText = (
    <>
      {parts[0]}
      <span style={{ color: color }}>{word}</span>
      {parts[1]}
    </>
  );

  return <Tag className={cn(basicClass, className)}>{highlightedText}</Tag>;
};

export default HighlightedHeading;
