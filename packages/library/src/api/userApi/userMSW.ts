import { rest } from 'msw'

import { User } from '.'

const getUserMSW = rest.get<User>(
  'https://knowhere.mcu/api/users/:id',
  async (req, res, ctx) =>
    // TODO: add multiple users
    res(
      ctx.status(200),
      ctx.json({
        id: '1',
        firstName: 'Johny',
        lastName: 'Silverhand',
        email: 'johny.silverhand@nightcity.com'
      })
    )
)

export const userHandlers = [getUserMSW]
