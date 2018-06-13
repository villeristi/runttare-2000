import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { postsResource } from '../../util/resources';
import { UsersState } from './types';
import { RootState } from '../../store/store';

type UsersGetter = GetterTree<UsersState, RootState>;

// Initial state for users
const state: UsersState = {
  all: [],
};

const getters: UsersGetter = {
  all: ({ all }, getters, rootState) => all,
};

const mutations: MutationTree<UsersState> = {
  setUsers(state, users) {
    state.all = users;
  },
};

const actions: ActionTree<UsersState, RootState> = {
  async fetchAllUsers({ commit, dispatch, rootState }) {
    const { data } = await postsResource.get('/');
    commit('setUsers', data);
  },
  async createUser({ commit, dispatch, rootState }, userData) {
    const { data } = await postsResource.post('/', userData);
  },

};

export const users: Module<UsersState, RootState> = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};
