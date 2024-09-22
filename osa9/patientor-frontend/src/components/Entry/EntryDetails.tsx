import { memo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Entry, EntryType } from '../../types';
import HealthCheckRatingIcon from '../Icons/HealthCheckRatingIcon';
import DiagnosisList from './DiagnosisList';
import EntryIcon from '../Icons/EntryIcon';
import { assertNever } from '../../utils';

const BaseEntryContent: React.FC<{ entry: Entry }> = ({ entry }) => (
  <Box>
    <Box display='flex' alignItems='center'>
      <Typography variant='body1'>{entry.date}</Typography>
      <Box ml={1}>
        <EntryIcon type={entry.type} />
      </Box>
      {entry.type === EntryType.OccupationalHealthcare && (
        <Typography
          variant='body1'
          sx={{ marginLeft: '4px', fontWeight: 'bold' }}
        >
          {entry.employerName}
        </Typography>
      )}
    </Box>
    <Typography variant='body1' sx={{ marginTop: '4px', fontStyle: 'italic' }}>
      {entry.description}
    </Typography>
    {entry.diagnosisCodes && <DiagnosisList codes={entry.diagnosisCodes} />}
  </Box>
);

const EntryDetails: React.FC<{ entry: Entry }> = memo(({ entry }) => {
  const renderEntryDetails = () => {
    switch (entry.type) {
      case EntryType.HealthCheck:
        return <HealthCheckRatingIcon rating={entry.healthCheckRating} />;
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
          entry.sickLeave && (
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
          )
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <Card variant='outlined' sx={{ marginBottom: 2 }}>
      <CardContent>
        <BaseEntryContent entry={entry} />
        {renderEntryDetails()}
        <Typography variant='body2'>diagnose by {entry.specialist}</Typography>
      </CardContent>
    </Card>
  );
});

export default EntryDetails;
