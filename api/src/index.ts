import bodyparser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgaLogger from 'morgan';

import { debugMiddleware } from './common/util/debug';

import App from './app';

import IndexRoute from './modules/index/Index';
import RunttaRoute from './modules/runtta/Runtta';
import UserList from './modules/users/UserList';
import UserCreate from './modules/users/UserCreate';

const isDev = process.env.NODE_ENV === 'development';

const app = new App();

app
  .use([
    compression(),
    cors(),
    bodyparser.json(),
    bodyparser.urlencoded({
      extended: true,
    }),
    helmet(),
  ])
  .use(morgaLogger('dev'), isDev)
  .use(debugMiddleware())
  .route([
    IndexRoute,
    RunttaRoute,
    UserList,
    UserCreate,
  ])
  .serve();
