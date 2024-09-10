import CoursePart from './CoursePart';
import { CoursePartProps } from '../types';

interface ContentProps {
  courseParts: CoursePartProps[]
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <CoursePart
          key={index}
          name={part.name}
          exerciseCount={part.exerciseCount}
        />
      ))}
    </div>
  );
};

export default Content;
