import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {ConnexionPage} from "../connexion/connexion";
import {InscriptionPage} from "../inscription/inscription";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    users: any;

  constructor(public navCtrl: NavController, private restProvider: RestProvider) {

      this.getUsers();
  }

    getUsers() {
        this.restProvider.getUsers()
            .then(data => {
                this.users = data;
                console.log(this.users);
            })
        //mettre le nom de la class dedans
    }

    redirectConnexionPage() {
        this.navCtrl.push(ConnexionPage)
    }



    redirectInscriptionPage(){

      this.navCtrl.push(InscriptionPage)
    }
}
