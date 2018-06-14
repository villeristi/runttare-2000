import httpStatus from 'http-status';

import BaseRoute from '../../common/classes/BaseRoute';
import APIException from '../../common/exceptions/ApiException';
import { User } from '../../common/util/db';

export default class UserList extends BaseRoute {

  method = 'POST';
  endpoint = '/users';

  async respond(req, res, next): Promise<any> {
    const { username } = req.body;

    if (!username) {
      throw new APIException('Username cannot be blank!', httpStatus.BAD_REQUEST);
    }

    try {
      // await User.sync();
      const usr = await User.create({ username, runttares: 0 });
      return res.json({ msg: username });
    } catch (err) {
      return next(err);
    }
  }
}
