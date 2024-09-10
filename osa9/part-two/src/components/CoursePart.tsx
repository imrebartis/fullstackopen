import { CoursePartProps } from '../types';

const CoursePart = ({ name, exerciseCount }: CoursePartProps) => {
  return (
    <p>
      {name} {exerciseCount}
    </p>
  );
};

export default CoursePart;
