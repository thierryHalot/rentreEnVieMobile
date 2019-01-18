import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Geolocation} from "@ionic-native/geolocation";
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RestProvider } from '../providers/rest/rest';
import {ConnexionPage} from "../pages/connexion/connexion";
import {InscriptionPage} from "../pages/inscription/inscription";
import {MdpOublierPage} from "../pages/mdp-oublier/mdp-oublier";
import {AccueilPage} from "../pages/accueil/accueil";
import {PreferencePage} from "../pages/preference/preference";
import {MessagePage} from "../pages/message/message";
import {MessageriePage} from "../pages/messagerie/messagerie";
import {ProfilMembresPage} from "../pages/profil-membres/profil-membres";
import {BlacklistPage} from "../pages/blacklist/blacklist";
import {StatutPage} from "../pages/statut/statut";
import {NewsPage} from "../pages/news/news";
import {ProfilPage} from "../pages/profil/profil";
import {ContactPage} from "../pages/contact/contact";
import {AproposPage} from "../pages/apropos/apropos";




@NgModule({
  declarations: [
    MyApp,
    HomePage,
      ConnexionPage,
      InscriptionPage,
      MdpOublierPage,
      AccueilPage,
      PreferencePage,
      MessagePage,
      MessageriePage,
      BlacklistPage,
      ProfilMembresPage,
      StatutPage,
      NewsPage,
      ProfilPage,
      ContactPage,
      AproposPage,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      ConnexionPage,
      InscriptionPage,
      MdpOublierPage,
      AccueilPage,
      PreferencePage,
      MessagePage,
      MessageriePage,
      BlacklistPage,
      ProfilMembresPage,
      StatutPage,
      NewsPage,
      ProfilPage,
      ContactPage,
      AproposPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
      Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,

  ]
})
export class AppModule {}
