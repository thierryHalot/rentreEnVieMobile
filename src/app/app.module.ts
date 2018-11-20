import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RestProvider } from '../providers/rest/rest';
import {ConnexionPage} from "../pages/connexion/connexion";
import {InscriptionPage} from "../pages/inscription/inscription";
import {MdpOublierPage} from "../pages/mdp-oublier/mdp-oublier";




@NgModule({
  declarations: [
    MyApp,
    HomePage,
      ConnexionPage,
      InscriptionPage,
      MdpOublierPage,
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
      MdpOublierPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,

  ]
})
export class AppModule {}
