import { Router, routes } from '@/js/Router';
import { ElementOrganizer } from '@/js/utils/ElementOrganizer.js';
import { AppController } from '@/js/controllers/AppController';

const router = new Router(routes);

const settings = {
  router,
  config: {
    theme: 'dark',
  }
};

const elements = new ElementOrganizer(document.querySelectorAll('[data-component]'));
// console.log(elements);
const app = new AppController(elements, settings);