import { memo } from 'react';
import { EntryType } from '../../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import { assertNever } from '../../utils';

const EntryIcon: React.FC<{ type: EntryType }> = ({ type }) => {
  switch (type) {
    case EntryType.HealthCheck:
      return <MedicalServicesIcon />;
    case EntryType.Hospital:
      return <LocalHospitalIcon />;
    case EntryType.OccupationalHealthcare:
      return <WorkIcon />;
    default:
      return assertNever(type);
  }
};

const MemoizedEntryIcon = memo(EntryIcon);
export default MemoizedEntryIcon;
