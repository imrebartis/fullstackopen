import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import { Patient, EntryType, EntryWithoutId, HealthCheckEntry } from '../types';
import { usePatient } from '../hooks/usePatient';
import { useDiagnosis } from '../hooks/useDiagnosis';
import Loading from './Loading';
import Error from './Error';
import GenderIcon from './Icons/GenderIcon';
import EntryList from './Entry/EntryList';
import HealthCheckEntryForm from './HealthCheckEntryForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patient, loading: patientLoading, error: patientError, addEntry } = usePatient(id);
  const { diagnoses, loading: diagnosesLoading, error: diagnosesError } = useDiagnosis();
  const [showEntryForm, setShowEntryForm] = useState(false);

  if (patientLoading || diagnosesLoading) return <Loading />;
  if (patientError) return <Error error={patientError} />;
  if (diagnosesError) {
    toast.error(diagnosesError);
    return <Error error={diagnosesError} />;
  }
  if (!patient) return <Error error='Unexpected error: Patient data is missing' />;

  const handleAddEntry = async (values: Omit<HealthCheckEntry, 'id' | 'type'>) => {
    const newEntry: EntryWithoutId = {
      ...values,
      type: EntryType.HealthCheck
    };
    try {
      await addEntry(newEntry);
      toast.success('Entry successfully created');
      setShowEntryForm(false);
    } catch (error) {
      toast.error('Failed to create entry');
    }
  };

  return (
    <Box>
      <Typography variant='h5' component='h2' gutterBottom sx={{ fontWeight: 'bold' }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <PatientInfo patient={patient} />
      {!showEntryForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowEntryForm(true)}
          sx={{ mt: 2 }}
        >
          Add new entry
        </Button>
      )}
      {showEntryForm && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Add new HealthCheck entry</Typography>
          <HealthCheckEntryForm
            onSubmit={handleAddEntry}
            onCancel={() => setShowEntryForm(false)}
            diagnoses={diagnoses || []}
          />
        </Box>
      )}
      <EntryList entries={patient.entries} />
      <ToastContainer position="top-right" autoClose={5000} />
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