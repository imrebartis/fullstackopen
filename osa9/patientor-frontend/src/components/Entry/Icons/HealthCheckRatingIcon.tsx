import { memo } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HealthCheckRating } from '../../../types';

const HealthCheckRatingIcon: React.FC<{ rating: HealthCheckRating }> = ({
  rating
}) => {
  const colorMap = {
    [HealthCheckRating.Healthy]: 'green',
    [HealthCheckRating.LowRisk]: 'yellow',
    [HealthCheckRating.HighRisk]: 'orange',
    [HealthCheckRating.CriticalRisk]: 'red'
  };

  return <FavoriteIcon style={{ color: colorMap[rating] }} />;
};

const MemoizedHealthCheckRatingIcon = memo(HealthCheckRatingIcon);
export default MemoizedHealthCheckRatingIcon;
