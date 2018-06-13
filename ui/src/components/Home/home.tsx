import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, Getter, namespace } from 'vuex-class';

// import { getStorageItem, removeStorageItem, setStorageItem } from '../../util/storage';

const RuntsGetter = namespace('runts', Getter);
const RuntsAction = namespace('runts', Action);

@Component
export default class Home extends Vue {

  @RuntsGetter('isRunting') isRunting;
  @RuntsAction('createRuntta') createRunt;

  add() {
    // setStorageItem('name', 'asdasd');
    // return this.$forceUpdate();
  }

  remove() {
    // removeStorageItem('name');
    // return this.$forceUpdate();
  }

  render() {
    // const currentRunttare = getStorageItem('name');
    const btnText = this.isRunting ? 'Runting...' : 'RUNTTA!';

    return (
      <div class="text-center">
        <button disabled={this.isRunting} class="runtta__btn" onClick={this.createRunt} className="btn">
          {btnText}
        </button>
      </div>
    );
  }
}
