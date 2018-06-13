import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, Getter, namespace } from 'vuex-class';

const UsersGetter = namespace('users', Getter);
const UsersAction = namespace('users', Action);

@Component
export default class Users extends Vue {

  @UsersGetter('all') users;
  @UsersAction('fetchAllUsers') fetchUsers;

  animation: string = 'flipInX';
  animationDelay: number = 25; // in ms

  /**
   * Lifecycle hooks
   */
  mounted() {
    if (!this.users.length) {
      this.fetchUsers();
    }
  }

  /**
   * Methods for transitions
   */
  handleBeforeEnter(el) {
    el.style.opacity = 0;
    el.classList.add('animated');
  }

  handleEnter(el) {
    const delay = el.dataset.index * this.animationDelay;
    setTimeout(() => {
      el.style.opacity = 1;
      el.classList.add(this.animation);
    }, delay);
  }

  render() {
    return (
      <div>
        <h1 class="mb-4 text-center"><i class="fa fa-address-card"></i> Hall of Shame</h1>
        <transition-group
          tag="div"
          class="list-group"
          onBeforeEnter={this.handleBeforeEnter}
          onEnter={this.handleEnter}>

          {this.users.map((post, index) => (
            <li key={post.id}
                class="list-group-item"
                data-index={index}>
              <strong>{index + 1} x&nbsp;</strong> <i class="fa fa-beer"/> &nbsp;: {post.title}
            </li>
          ))}

        </transition-group>
      </div>
    );
  }
}
