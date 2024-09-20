import { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  SelectChangeEvent,
  Chip,
  Grid
} from '@mui/material';
import { HealthCheckRating, Diagnosis } from '../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HealthCheckEntryFormProps {
  onSubmit: (entry: HealthCheckEntryFormValues) => void
  onCancel: () => void
  diagnoses: Diagnosis[]
}

interface HealthCheckEntryFormValues {
  description: string
  date: string
  specialist: string
  healthCheckRating: HealthCheckRating
  diagnosisCodes: string[]
}

const HealthCheckEntryForm: React.FC<HealthCheckEntryFormProps> = ({
  onSubmit,
  onCancel,
  diagnoses
}) => {
  const [values, setValues] = useState<HealthCheckEntryFormValues>({
    description: '',
    date: '',
    specialist: '',
    healthCheckRating: HealthCheckRating.Healthy,
    diagnosisCodes: []
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<HealthCheckRating | string[]>
  ) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    if (!values.description.trim()) {
      toast.error('Description is required');
      isValid = false;
    }
    if (!values.date) {
      toast.error('Date is required');
      isValid = false;
    }
    if (!values.specialist.trim()) {
      toast.error('Specialist is required');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingBottom: '64px' }}>
      <TextField
        fullWidth
        label='Description'
        name='description'
        value={values.description}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        type='date'
        label='Date'
        name='date'
        value={values.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label='Specialist'
        name='specialist'
        value={values.specialist}
        onChange={handleChange}
      />
      <FormControl fullWidth>
        <InputLabel>Health Check Rating</InputLabel>
        <Select
          name='healthCheckRating'
          value={values.healthCheckRating}
          onChange={
            handleChange as (
              event: SelectChangeEvent<HealthCheckRating>
            ) => void
          }
        >
          <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
          <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
          <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
          <MenuItem value={HealthCheckRating.CriticalRisk}>
            Critical Risk
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          name='diagnosisCodes'
          value={values.diagnosisCodes}
          onChange={
            handleChange as (event: SelectChangeEvent<string[]>) => void
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid sx={{ marginTop: '12px' }}>
        <Grid item>
          <Button
            color='error'
            variant='contained'
            sx={{ float: 'left', marginLeft: '12px' }}
            type='button'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            sx={{
              float: 'right',
              marginRight: '12px'
            }}
            type='submit'
            variant='outlined'
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default HealthCheckEntryForm;
