import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {ConnexionPage} from "../pages/connexion/connexion";
import {ViewChild} from "@angular/core";
import {Nav} from "ionic-angular";
import {AccueilPage} from "../pages/accueil/accueil";
import {PreferencePage} from "../pages/preference/preference";
import {MessageriePage} from "../pages/messagerie/messagerie";
import {BlacklistPage} from "../pages/blacklist/blacklist";
import {StatutPage} from "../pages/statut/statut";
import {NewsPage} from "../pages/news/news";
import {ContactPage} from "../pages/contact/contact";
import {ProfilPage} from "../pages/profil/profil";
import {AproposPage} from "../pages/apropos/apropos";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;

  activePage : true;

  pages : Array<{titre : string, component: any, actif: boolean}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
      this.pages = [
          {titre: 'Accueil', component : AccueilPage, actif:false},
          {titre: 'Preference', component : PreferencePage,actif:false},
          {titre: 'Profil', component : ProfilPage,actif:false},
          {titre: 'Statut', component : StatutPage,actif:false},
          {titre: 'Messagerie', component : MessageriePage,actif:false},
          {titre: 'Blacklist', component : BlacklistPage,actif:false},
          {titre: 'News', component : NewsPage,actif:false},
          {titre: 'Contact', component : ContactPage,actif:false},
          {titre: 'Apropos', component : AproposPage,actif:false},
          {titre: 'Deconnexion', component : ConnexionPage,actif:false}
      ];

      //this.activePage = this.pages.actif;
  }

  openPage(page){

    this.nav.setRoot(page.component);
    this.activePage = page;
    //console.log(page[1]);
  }

  checkActive(page){

    return page == this.activePage;
  }
}

