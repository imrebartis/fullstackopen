import { CoursePart } from '../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const additionalContent = (part: CoursePart) => {
  switch (part.kind) {
    case "group":
      return <p>Project exercises: {part.groupProjectCount}</p>;
    case "background":
      return <p>Background material: {part.backgroundMaterial}</p>;
    case "special":
      return <p>Required skills: {part.requirements.join(", ")}</p>;
    case "basic":
      return null;
    default:
      return assertNever(part);
  }
};

const Part = (part: CoursePart) => {
  return (
    <div>
      <p><b>{part.name} {part.exerciseCount}</b></p>
      {'description' in part && <p><i>Description: {part.description}</i></p>}
      {additionalContent(part)}
      <br />
    </div>
  );
};

export default Part;
