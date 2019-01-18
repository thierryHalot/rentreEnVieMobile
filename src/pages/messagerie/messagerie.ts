import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {MessagePage} from "../message/message";
import {HttpErrorResponse} from "@angular/common/http/src/response";

/**
 * Generated class for the MessageriePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messagerie',
  templateUrl: 'messagerie.html',
})
export class MessageriePage {

  tabHeaderMessage : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restProvider :RestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageriePage');
  }
    ionViewDidEnter(){

    this.getAllHeaderMsgUser();
    }
//cette methode permet de récupérér toutes les entete de message de l'utilisateur courant dont la valeur de is_del est egale a 0

    getAllHeaderMsgUser(){


        this.restProvider.getAllHeaderMsgUser().then(data => {

            console.log(data);

            this.tabHeaderMessage = data;

        });

    }


    //cette methode permet de rediriger l'utilisateur courant sur la page de conversation correspondant a son recepteur
    redirectPageMsg(idRecepteur : number){

      this.restProvider.setIdRecepteur(idRecepteur);
      this.navCtrl.push(MessagePage);
    }

    putHeaderMsgUser(idRecepteur : number){



        let data : any = "is_del=1";

        this.restProvider.putHeaderMsgUser(data,idRecepteur).subscribe(res => {
            //permet de rafraichir la page
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
            //this.restProvider.customPopUp("yathaaa ", 'mise ajour reussi header msg complet ;-)', "Ok", null);
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });


    }
}
