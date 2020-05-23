import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'accordeon', loadChildren: './accordeon/accordeon.module#AccordeonPageModule' },
  { path: 'add-announce', loadChildren: './add-announce/add-announce.module#AddAnnouncePageModule' },
  { path: 'edit-announce', loadChildren: './edit-announce/edit-announce.module#EditAnnouncePageModule' },
  { path: 'virtual-office', loadChildren: './virtual-office/virtual-office.module#VirtualOfficePageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'help', loadChildren: './help/help.module#HelpPageModule' },
  { path: 'buy-point', loadChildren: './buy-point/buy-point.module#BuyPointPageModule' },
  { path: 'sell-point', loadChildren: './sell-point/sell-point.module#SellPointPageModule' },
  { path: 'qr', loadChildren: './qr/qr.module#QrPageModule' },
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'bd', loadChildren: './bd/bd.module#BdPageModule' },
 // { path: 'masqr', loadChildren: './masqr/masqr.module#MasqrPageModule' },
  { path: 'mas-sell-point', loadChildren: './mas-sell-point/mas-sell-point.module#MasSellPointPageModule' },
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'restore-account', loadChildren: './restore-account/restore-account.module#RestoreAccountPageModule' },
  { path: 'lector-qr', loadChildren: './lector-qr/lector-qr.module#LectorQrPageModule' },
  { path: 'lector', loadChildren: './lector/lector.module#LectorPageModule' },
  { path: 'buypoint', loadChildren: './buypoint/buypoint.module#BuypointPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'view', loadChildren: './view/view.module#ViewPageModule' },
  { path: 'editar-anuncios', loadChildren: './editar-anuncios/editar-anuncios.module#EditarAnunciosPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
