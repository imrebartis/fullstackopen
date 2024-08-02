import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../services/users'
import User from './User'
import Loading from '../Loading'
import Error from '../Error'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const Users = () => {
  const { data: users, isLoading, isError } = useUsers()

  return (
    <div>
      <h2>Users</h2>
      {!isLoading && !isError && (
        <TableContainer
          component={Paper}
          sx={{
            width: {
              xs: '90vw',
              sm: '80vw',
              md: '70vw',
              lg: '60vw',
              xl: '50vw'
            },
            margin: '0 auto'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>user name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>blogs created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ borderBottom: '1px solid #ccc' }}>
                  <User user={user} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isLoading && <Loading />}
      {isError && (
        <Error message="Fetching the users failed. Please try again later." />
      )}
    </div>
  )
}

export default Users
