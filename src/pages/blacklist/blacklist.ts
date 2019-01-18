import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";


/**
 * Generated class for the BlacklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blacklist',
  templateUrl: 'blacklist.html',
})
export class BlacklistPage {

    userBlacklist : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restProvider : RestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlacklistPage');

  }

  ionViewDidEnter(){
      this.getBlacklistCurrentUser();
  }

  getBlacklistCurrentUser(){

        this.restProvider.getBlacklistCurrentUser().then(data => {

            //je stocke les imformations récupérer dans ma propriété resultatRecherche
            //console.log(data);

            this.userBlacklist = data;
            //console.log(this.userBlacklist);

        });
    }

    deleteBlacklist(idBlacklist : number) {


        this.restProvider.deleteBlacklist(idBlacklist).subscribe(data => {
            console.log(data);
        }, err => {
            console.log(err);
        });


        //permet de rafraichir la page
        this.navCtrl.setRoot(this.navCtrl.getActive().component);

    }
}
