import Heading from './Heading';
import Content from './Content';
import Total from './Total';

const Courses = ({ courses }) => (
  <div>
    {courses.map((course, index) => (
      <div key={index}>
        <Heading course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    ))}
  </div>
);

export default Courses;
