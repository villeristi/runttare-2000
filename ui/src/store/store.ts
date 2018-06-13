import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import { users } from '../components/Users/store';
import { UsersState } from '../components/Users/types';
import { runts, RunttaState } from '../components/Home/store';

import { isProduction } from '../util/helpers';

Vue.use(Vuex);

export interface RootState {
  users: UsersState;
  runts: RunttaState;
  isFetching: boolean;
}

const state: object = {
  isFetching: false,
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    users,
    runts,
  },
  strict: !isProduction,
});
