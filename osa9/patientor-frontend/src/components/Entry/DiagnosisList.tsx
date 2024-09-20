import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { useDiagnosis } from '../../hooks/useDiagnosis';
import Loading from '../Loading';
import Error from '../Error';

const DiagnosisList: React.FC<{ codes: string[] }> = ({ codes }) => {
  const { diagnoses, loading, error } = useDiagnosis();

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!diagnoses)
    return <Error error='Unexpected error: Diagnoses data is missing' />;

  return (
    <Box>
      <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
        Diagnosis Codes:
      </Typography>
      <List style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
      {codes.length === 0 ? (
        <Typography variant='body2'>Diagnosis codes missing</Typography>
      ) : (
        <List style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          {codes.map((code) => {
            const diagnosis = diagnoses.find((d) => d.code === code);
            return (
              <ListItem key={code} style={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <Typography variant='body2' display='inline'>
                      {diagnosis?.code || 'Unknown diagnosis'}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
      </List>
    </Box>
  );
};

export default DiagnosisList;
