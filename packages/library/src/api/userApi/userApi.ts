import { useQuery, UseQueryOptions } from 'react-query'

import { request } from '../request'
import { User } from './userTypes'

const getUser = (id: string) =>
  request<User>(`https://knowhere.mcu/api/users/${id}`)

const getUserQueryKey = (id: string) => ['user', id]

export const useGetUser = (id = '', options: UseQueryOptions<User> = {}) =>
  useQuery<User>(getUserQueryKey(id), () => getUser(id), {
    ...options,
    enabled: !!id && (options.enabled ?? true)
  })
