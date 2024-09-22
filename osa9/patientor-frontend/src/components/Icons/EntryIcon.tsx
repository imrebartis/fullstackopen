import { memo } from 'react';
import { EntryType } from '../../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import { assertNever } from '../../utils';

interface EntryIconProps {
  type: EntryType
}

const EntryIcon: React.FC<EntryIconProps> = memo(({ type }) => {
  switch (type) {
    case EntryType.Hospital:
      return <LocalHospitalIcon />;
    case EntryType.HealthCheck:
      return <MedicalServicesIcon />;
    case EntryType.OccupationalHealthcare:
      return <WorkIcon />;
    default:
      return assertNever(type);
  }
});

export default EntryIcon;
