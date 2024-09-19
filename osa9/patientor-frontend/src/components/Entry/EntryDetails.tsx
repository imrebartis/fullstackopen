import { memo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Entry, EntryType, HealthCheckRating } from '../../types';
import DiagnosisList from './DiagnosisList';

const BaseEntryContent: React.FC<{ entry: Entry }> = ({ entry }) => (
  <Box>
    <Box display='inline'>
      <Typography variant='body1' display='inline'>
        {entry.date}
      </Typography>
      <Typography
        variant='body1'
        display='inline'
        sx={{ marginLeft: '4px', fontStyle: 'italic' }}
      >
        {entry.description}
      </Typography>
    </Box>
    {entry.diagnosisCodes && <DiagnosisList codes={entry.diagnosisCodes} />}
  </Box>
);

const EntryDetails: React.FC<{ entry: Entry }> = memo(({ entry }) => {
  const renderEntryDetails = () => {
    switch (entry.type) {
      case EntryType.HealthCheck:
        return (
          <Typography variant='body2'>
            <Typography
              component='span'
              variant='body2'
              sx={{ fontWeight: 'bold' }}
            >
              Health Check Rating:&nbsp;
            </Typography>
            {HealthCheckRating[entry.healthCheckRating]}
          </Typography>
        );
      case EntryType.Hospital:
        return (
          <>
            <Typography variant='body2'>
              <Typography
                component='span'
                variant='body2'
                sx={{ fontWeight: 'bold' }}
              >
                Discharge Date:&nbsp;
              </Typography>
              {entry.discharge.date}
            </Typography>
            <Typography variant='body2'>
              <Typography
                component='span'
                variant='body2'
                sx={{ fontWeight: 'bold' }}
              >
                Discharge Criteria:&nbsp;
              </Typography>
              {entry.discharge.criteria}
            </Typography>
          </>
        );
      case EntryType.OccupationalHealthcare:
        return (
          <>
            <Typography variant='body2'>
              <Typography
                component='span'
                variant='body2'
                sx={{ fontWeight: 'bold' }}
              >
                Employer:&nbsp;
              </Typography>
              {entry.employerName}
            </Typography>
            {entry.sickLeave && (
              <Box>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                  Sick Leave:
                </Typography>
                <Typography variant='body2'>
                  Start Date:&nbsp; {entry.sickLeave.startDate}
                </Typography>
                <Typography variant='body2'>
                  End Date:&nbsp; {entry.sickLeave.endDate}
                </Typography>
              </Box>
            )}
          </>
        );
    }
  };

  return (
    <Card variant='outlined' sx={{ marginBottom: 2 }}>
      <CardContent>
        <BaseEntryContent entry={entry} />
        {renderEntryDetails()}
      </CardContent>
    </Card>
  );
});

export default EntryDetails;
