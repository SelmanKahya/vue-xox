import Vue from 'vue';
import Router from 'vue-router';
import TicTacToe from '@/components/TicTacToe';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game',
      component: TicTacToe,
    },
  ],
});
