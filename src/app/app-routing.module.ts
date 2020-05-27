import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'add-announce', loadChildren: './pages/add-announce/add-announce.module#AddAnnouncePageModule' },
  { path: 'edit-announce', loadChildren: './pages/edit-announce/edit-announce.module#EditAnnouncePageModule' },
  { path: 'virtual-office', loadChildren: './pages/virtual-office/virtual-office.module#VirtualOfficePageModule' },
  { path: 'contact', loadChildren: './pages/contact/contact.module#ContactPageModule' },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'buy-point', loadChildren: './pages/buy-point/buy-point.module#BuyPointPageModule' },
  { path: 'sell-point', loadChildren: './pages/sell-point/sell-point.module#SellPointPageModule' },
  { path: 'qr', loadChildren: './pages/qr/qr.module#QrPageModule' },
  { path: 'details/:id', loadChildren: './pages/details/details.module#DetailsPageModule' },
  { path: 'bd', loadChildren: './pages/bd/bd.module#BdPageModule' },
 // { path: 'masqr', loadChildren: './masqr/masqr.module#MasqrPageModule' },
  { path: 'mas-sell-point', loadChildren: './pages/mas-sell-point/mas-sell-point.module#MasSellPointPageModule' },
  { path: 'signin', loadChildren: './pages/signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'restore-account', loadChildren: './pages/restore-account/restore-account.module#RestoreAccountPageModule' },
  { path: 'lector-qr', loadChildren: './pages/lector-qr/lector-qr.module#LectorQrPageModule' },
  { path: 'lector', loadChildren: './pages/lector/lector.module#LectorPageModule' },
  { path: 'buypoint', loadChildren: './pages/buypoint/buypoint.module#BuypointPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
