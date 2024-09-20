import { memo } from 'react';
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon
} from '@mui/icons-material';
import { Gender } from '../../types';

const genderIcons: Record<Gender, React.ReactElement> = {
  [Gender.Male]: <MaleIcon aria-label='Male' />,
  [Gender.Female]: <FemaleIcon aria-label='Female' />,
  [Gender.Other]: <TransgenderIcon aria-label='Other' />
};

const GenderIcon: React.FC<{ gender: Gender }> = memo(({ gender }) => (
  <span role='img' aria-label={`Gender: ${gender}`}>
    {genderIcons[gender]}
  </span>
));

export default GenderIcon;
