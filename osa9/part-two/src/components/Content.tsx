import Part from './Part';
import { CoursePart } from '../types';

interface ContentProps {
  courseParts: CoursePart[]
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} {...part} />
      ))}
    </div>
  );
};

export default Content;
