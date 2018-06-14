import BaseRoute from '../../common/classes/BaseRoute';

import { User } from '../../common/util/db';

export default class UserList extends BaseRoute {

  method = 'GET';
  endpoint = '/users';

  async respond(req, res, next): Promise<any> {
    try {
      const users = await User.all({ attributes: ['username', 'runttares'] });
      return res.json(users);
    } catch (e) {
      return next(e);
    }
  }
}
