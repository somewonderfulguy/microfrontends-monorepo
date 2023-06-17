import { useGetUser } from '@api/userApi'

const UserCard = () => {
  const { data } = useGetUser('1')
  return (
    <div>
      {data && JSON.stringify(data, undefined, 2)}
      <p>User Card</p>
    </div>
  )
}

export default UserCard
