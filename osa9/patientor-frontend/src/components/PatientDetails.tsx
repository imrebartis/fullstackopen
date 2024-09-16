import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon
} from '@mui/icons-material';
import { Patient, Gender } from '../types';
import patientService from '../services/patients';
import Loading from './Loading';
import Error from './Error';

const genderIcons: Record<Gender, React.ReactElement> = {
  [Gender.Male]: <MaleIcon />,
  [Gender.Female]: <FemaleIcon />,
  [Gender.Other]: <TransgenderIcon />
};

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setError('Patient ID is missing');
        setLoading(false);
        return;
      }

      try {
        const patientData = await patientService.getPatient(id);
        if (patientData) {
          setPatient(patientData);
        } else {
          setError('Patient not found');
        }
      } catch (e) {
        setError('Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const GenderIcon = useMemo(() => {
    if (patient && patient.gender in genderIcons) {
      return genderIcons[patient.gender];
    }
    return null;
  }, [patient]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!patient) return <Error error='Unexpected error: Patient data is missing' />;

  return (
    <Box>
      <Typography variant='h5' component='h2' gutterBottom sx={{ fontWeight: 'bold' }}>
        {patient.name} {GenderIcon}
      </Typography>
      <Typography variant='body1' gutterBottom>
        ssn: {patient.ssn}
      </Typography>
      <Typography variant='body1' gutterBottom>
        occupation: {patient.occupation}
      </Typography>
    </Box>
  );
};

export default PatientDetails;
