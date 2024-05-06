import { HomeView, AboutView, ContactView } from "../pages";
import { helpData } from "../data/help-data";

export const routes = [
  { 
    path: '/', 
    pathName: 'Home', 
    component: HomeView,
    help: helpData.HomeView,
  },
  { 
    path: '/about', 
    pathName: 'About', 
    component: AboutView,
    help: helpData.AboutView,
  },
  { 
    path: '/contact', 
    pathName: 'Contact', 
    component: ContactView,
    help: helpData.ContactView,
  }
];
