import { Response } from 'express';

import BaseRoute from '../../common/classes/BaseRoute';

export default class UserList extends BaseRoute {

  method = 'GET';
  endpoint = '/users';

  respond(req, res, next): Response {
    return res.json({ msg: 'User-list' });
  }
}
