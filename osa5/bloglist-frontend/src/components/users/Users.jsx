import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../services/users'
import User from './User'
import Loading from '../Loading'
import Error from '../Error'

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
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      )}
      {isLoading && <Loading />}
      {isError && (
        <Error message="Fetching the users failed. Please try again later." />
      )}
    </div>
  )
}

export default Users
