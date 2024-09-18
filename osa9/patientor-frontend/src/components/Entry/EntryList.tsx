import { Typography } from '@mui/material';
import { Entry } from '../../types';
import EntryDetails from './EntryDetails';

const EntryList: React.FC<{ entries: Entry[] }> = ({ entries }) => (
  <>
    <Typography
      variant='h6'
      component='h3'
      sx={{ fontWeight: 'bold' }}
      gutterBottom
    >
      Entries
    </Typography>
    {entries.length === 0 ? (
      <Typography variant='body1'>No entries available</Typography>
    ) : (
      entries.map((entry) => <EntryDetails key={entry.id} entry={entry} />)
    )}
  </>
);

export default EntryList;
