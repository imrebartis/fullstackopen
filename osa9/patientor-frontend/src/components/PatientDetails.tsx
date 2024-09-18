import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { Patient } from '../types';
import { usePatient } from '../hooks/usePatient';
import Loading from './Loading';
import Error from './Error';
import GenderIcon from './Entry/GenderIcon';
import EntryList from './Entry/EntryList';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patient, loading, error } = usePatient(id);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!patient)
    return <Error error='Unexpected error: Patient data is missing' />;

  return (
    <Box>
      <Typography
        variant='h5'
        component='h2'
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <PatientInfo patient={patient} />
      <EntryList entries={patient.entries} />
    </Box>
  );
};

const PatientInfo: React.FC<{ patient: Patient }> = memo(({ patient }) => (
  <>
    <Typography variant='body1' gutterBottom>
      ssn: {patient.ssn}
    </Typography>
    <Typography variant='body1' gutterBottom>
      Occupation: {patient.occupation}
    </Typography>
  </>
));

export default PatientDetails;
