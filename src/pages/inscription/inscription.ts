import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {AlertController} from "ionic-angular/components/alert/alert-controller";
/**
 * Generated class for the InscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html',
})
export class InscriptionPage {

//correspond au donnée de mon formulaire d'inscription
    user : any = {
        nom : '',
        prenom: '',
        pseudo:'',
        age:'',
        sexe:'',
        tel: '',
        adresse:'',
        mail:'',
        mdp:'',
        confMdp:'',
        fumeur:'',
        musiqueFavoris:'',
        clubFavoris:'',
        condUtil:''
    };

    message : string;
    checkStatus :boolean;






  constructor(public navCtrl: NavController, public navParams: NavParams,public restPro : RestProvider,private formBuilder : FormBuilder, private alerte : AlertController) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionPage');
  }

    showInfoCompInsc(){

    this.checkStatus = true;



    }

    showInfoPersoInscr(){

    this.checkStatus = false;
    }

    testRecup(){

      console.log(this.user);


    }

    testAlert(){

      let alert = this.alerte.create({
          title: 'Inscription reussi',
          subTitle: this.message,
          buttons: ['ok']
      });
        alert.present();
    }



    //cette fonction permet de sauvegarder les imformations de l'utilisateur en bdd,
    // effectue une requete de type post sur l'api et envoi les donné au format x-www-form-urlencoded
    saveUser() {

        console.log(this.user);
        // if (this.user.fumeur){
        //
        //     this.user.fumeur = '1';
        //
        // }else{
        //
        //     this.user.fumeur = '0';
        //
        // }
        let data : any = "nom="+this.user.nom+
            "&&prenom="+this.user.prenom+
            "&&pseudo="+this.user.pseudo+
            "&&age="+this.user.age+
            "&&sexe="+this.user.sexe+
            "&&tel="+this.user.tel+
            "&&adresse="+this.user.adresse+
            "&&mail="+this.user.mail+
            "&&mdp="+this.user.mdp+
            "&&fumeur="+this.user.fumeur+
            "&&musiqueFavoris="+this.user.musiqueFavoris+
            "&&clubFavoris="+this.user.clubFavoris+
            "&&isDel=false";
        console.log(data);

        this.restPro.saveUser(data).subscribe(res => {
                        console.log(res);
                     }, (err : HttpErrorResponse) => {
                         console.log(err.error);
                         console.log(err.name);
                         console.log(err.message);
                         console.log(err.status);
                     });
    }
}

