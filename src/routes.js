import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./routes/Dashboard'),
  loading: Loading,
});

const Events = Loadable({
  loader: () => import('./routes/Events'),
  loading: Loading,
});

const MoCs = Loadable({
  loader: () => import('./routes/MoCs'),
  loading: Loading,
});

const Researchers = Loadable({
  loader: () => import('./routes/Researchers'),
  loading: Loading,
});

const Resources = Loadable({
  loader: () => import('./routes/Resources'),
  loading: Loading,
});

const Requests = Loadable({
  loader: () => import('./routes/Requests'),
  loading: Loading,
});

const Downloads = Loadable({
  loader: () => import('./routes/Downloads'),
  loading: Loading,
});

const Subscribers = Loadable({
  loader: () => import('./routes/Subscribers'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/events', name: 'Events', component: Events },
  { path: '/mocs', name: 'MoCs', component: MoCs },
  { path: '/researchers', name: 'Researchers', component: Researchers },
  { path: '/resources', name: 'Resources', component: Resources },
  { path: '/manage-access', name: 'Manage Data Access', component: Requests },
  { path: '/downloads', name: 'Downloads', component: Downloads },
  { path: '/subscribers', name: 'Subscribers', component: Subscribers },

  // { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
