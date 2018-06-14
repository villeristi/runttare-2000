import { Response } from 'express';

import BaseRoute from '../../common/classes/BaseRoute';

// Dummy simulation
const sleep = (timeout = 2000) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(true), timeout);
});

export default class Runtta extends BaseRoute {

  method = 'POST';
  endpoint = '/';

  async respond(req, res, next): Promise<object> {
    return sleep().then(() => {
      return res.json({ msg: 'Hallo from runttare!' });
    });
  }
}
