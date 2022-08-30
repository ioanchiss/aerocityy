import { Routes } from '@angular/router';

import { ProjectsPage } from './pages/projects/projects.component'
import { InvestPage } from './pages/invest/invest.component'
import { AboutPage } from './pages/about/about.component';

export const appRoutes: Routes = [
    { path: '', component: ProjectsPage },
    { path: 'invest', component: InvestPage },
    { path: 'about', component: AboutPage },
];