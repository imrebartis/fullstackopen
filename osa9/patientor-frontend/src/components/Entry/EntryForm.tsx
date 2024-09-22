import { memo, useCallback, useMemo, useState } from 'react';
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
  Grid,
  Typography
} from '@mui/material';
import {
  HealthCheckRating,
  Diagnosis,
  EntryType,
  EntryWithoutId
} from '../../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EntryFormProps {
  onSubmit: (entry: EntryWithoutId) => void
  onCancel: () => void
  diagnoses: Diagnosis[]
}

type EntryFormValues = {
  description: string
  date: string
  specialist: string
  healthCheckRating: HealthCheckRating
  diagnosisCodes: string[]
  dischargeDate: string
  dischargeCriteria: string
  employerName: string
  sickLeaveStartDate: string
  sickLeaveEndDate: string
};

const initialValues: EntryFormValues = {
  description: '',
  date: '',
  specialist: '',
  healthCheckRating: HealthCheckRating.Healthy,
  diagnosisCodes: [],
  dischargeDate: '',
  dischargeCriteria: '',
  employerName: '',
  sickLeaveStartDate: '',
  sickLeaveEndDate: ''
};

const EntryForm: React.FC<EntryFormProps> = ({
  onSubmit,
  onCancel,
  diagnoses
}) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [values, setValues] = useState<EntryFormValues>(initialValues);

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<EntryType>) => {
      setEntryType(event.target.value as EntryType);
    },
    []
  );

  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<HealthCheckRating | string[]>
    ) => {
      const { name, value } = event.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    },
    []
  );

  const validateDates = (
    startDate?: string,
    endDate?: string
  ): string | null => {
    if (startDate && !endDate) {
      return 'Sick leave end date missing';
    }
    if (!startDate && endDate) {
      return 'Sick leave start date missing';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return 'End date cannot be before start date';
    }
    return null;
  };

  const validateForm = useMemo(
    () => (): boolean => {
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
      if (
        entryType === EntryType.Hospital &&
        (!values.dischargeDate || !values.dischargeCriteria.trim())
      ) {
        toast.error(
          'Discharge date and criteria are required for hospital entries'
        );
        isValid = false;
      }
      if (entryType === EntryType.OccupationalHealthcare) {
        if (!values.employerName.trim()) {
          toast.error(
            'Employer name is required for occupational healthcare entries'
          );
          isValid = false;
        }
        if (values.sickLeaveStartDate || values.sickLeaveEndDate) {
          const dateValidationError = validateDates(
            values.sickLeaveStartDate,
            values.sickLeaveEndDate
          );
          if (dateValidationError) {
            toast.error(dateValidationError);
            isValid = false;
          }
        }
      }

      return isValid;
    },
    [
      entryType,
      values.date,
      values.description,
      values.dischargeCriteria,
      values.dischargeDate,
      values.employerName,
      values.sickLeaveEndDate,
      values.sickLeaveStartDate,
      values.specialist
    ]
  );

  const handleHealthCheckRatingChange = useCallback(
    (event: SelectChangeEvent<HealthCheckRating>) => {
      setValues((prev) => ({
        ...prev,
        healthCheckRating: Number(event.target.value)
      }));
    },
    []
  );

  const handleDiagnosisCodesChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      setValues((prev) => ({
        ...prev,
        diagnosisCodes: event.target.value as string[]
      }));
    },
    []
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    const baseEntry = {
      description: values.description,
      date: values.date,
      specialist: values.specialist,
      diagnosisCodes: values.diagnosisCodes
    };

    let entry: EntryWithoutId;
    switch (entryType) {
      case EntryType.HealthCheck:
        entry = {
          ...baseEntry,
          type: EntryType.HealthCheck,
          healthCheckRating: values.healthCheckRating
        };
        break;
      case EntryType.Hospital:
        entry = {
          ...baseEntry,
          type: EntryType.Hospital,
          discharge: {
            date: values.dischargeDate,
            criteria: values.dischargeCriteria
          }
        };
        break;
      case EntryType.OccupationalHealthcare:
        entry = {
          ...baseEntry,
          type: EntryType.OccupationalHealthcare,
          employerName: values.employerName,
          sickLeave:
            values.sickLeaveStartDate && values.sickLeaveEndDate
              ? {
                  startDate: values.sickLeaveStartDate,
                  endDate: values.sickLeaveEndDate
                }
              : undefined
        };
        break;
      default:
        throw new Error(`Unknown entry type: ${entryType}`);
    }

    onSubmit(entry);
  };

  const diagnosisMenuItems = useMemo(
    () =>
      diagnoses?.map((diagnosis) => (
        <MenuItem key={diagnosis.code} value={diagnosis.code}>
          <Typography variant='body2'>{diagnosis.code}</Typography>
        </MenuItem>
      )),
    [diagnoses]
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin='normal'>
        <InputLabel>Entry Type *</InputLabel>
        <Select value={entryType} onChange={handleTypeChange}>
          <MenuItem value={EntryType.HealthCheck}>Health Check</MenuItem>
          <MenuItem value={EntryType.Hospital}>Hospital</MenuItem>
          <MenuItem value={EntryType.OccupationalHealthcare}>
            Occupational Healthcare
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin='normal'
        label='Description *'
        name='description'
        value={values.description}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin='normal'
        type='date'
        label='Date *'
        name='date'
        value={values.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        margin='normal'
        label='Specialist *'
        name='specialist'
        value={values.specialist}
        onChange={handleChange}
      />

      {entryType === EntryType.HealthCheck && (
        <FormControl fullWidth margin='normal'>
          <InputLabel>Health Check Rating</InputLabel>
          <Select
            name='healthCheckRating'
            value={values.healthCheckRating}
            onChange={handleHealthCheckRatingChange}
          >
            {Object.entries(HealthCheckRating)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {key}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}

      {entryType === EntryType.Hospital && (
        <>
          <TextField
            fullWidth
            margin='normal'
            type='date'
            label='Discharge Date *'
            name='dischargeDate'
            value={values.dischargeDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Discharge Criteria *'
            name='dischargeCriteria'
            value={values.dischargeCriteria}
            onChange={handleChange}
          />
        </>
      )}

      {entryType === EntryType.OccupationalHealthcare && (
        <TextField
          fullWidth
          margin='normal'
          label='Employer Name *'
          name='employerName'
          value={values.employerName}
          onChange={handleChange}
        />
      )}

      <FormControl fullWidth margin='normal'>
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          name='diagnosisCodes'
          value={values.diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {diagnosisMenuItems}
        </Select>
      </FormControl>

      {entryType === EntryType.OccupationalHealthcare && (
        <>
          <InputLabel>Sick Leave</InputLabel>
          <TextField
            fullWidth
            margin='normal'
            type='date'
            label='Start Date'
            name='sickLeaveStartDate'
            value={values.sickLeaveStartDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin='normal'
            type='date'
            label='End Date'
            name='sickLeaveEndDate'
            value={values.sickLeaveEndDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      <Grid container justifyContent='space-between' sx={{ mt: 2 }}>
        <Button color='error' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' variant='outlined'>
          Add
        </Button>
      </Grid>
    </form>
  );
};

const MemoizedEntryForm = memo(EntryForm);
export default MemoizedEntryForm;
