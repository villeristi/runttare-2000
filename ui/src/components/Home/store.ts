import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '../../store/store';

export interface RunttaState {
  isRunting: boolean;
}

type RuntsGetter = GetterTree<RunttaState, RootState>;

// Dummy simulation
const sleep = (timeout = 2000) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(true), timeout);
});

const state: RunttaState = {
  isRunting: false,
};

const getters: RuntsGetter = {
  isRunting: ({ isRunting }, getters, rootState) => isRunting,
};

const mutations: MutationTree<RunttaState> = {
  setRunting(state, isRunting) {
    state.isRunting = isRunting;
  },
};

const actions: ActionTree<RunttaState, RootState> = {
  async createRuntta({ commit, dispatch, rootState }) {
    commit('setRunting', true);
    // Call api =>
    sleep(4000).then(() => commit('setRunting', false));
  },
};

export const runts: Module<RunttaState, RootState> = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};
