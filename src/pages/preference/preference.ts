import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {AccueilPage} from "../accueil/accueil";

/**
 * Generated class for the PreferencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preference',
  templateUrl: 'preference.html',
})
export class PreferencePage {

  formPreference : FormGroup;

  checkifPrefExist : boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuider : FormBuilder, private restProvider : RestProvider) {

      this.formPreference = this.formBuider.group({

          sexe :['', Validators.compose([Validators.required])],
          age:['', Validators.compose([Validators.required])],
          fumeur:['', Validators.compose([Validators.required])],
          perimetre:['', Validators.compose([Validators.required])],
          musiqueFavoris:['', Validators.compose([Validators.required])],
          clubFavoris:['', Validators.compose([Validators.required])],
          statut:['', Validators.compose([Validators.required])]

      });
      //préremplisage du formulaire avec la valeur 'indiferent';
      this.formPreference.get('sexe').setValue('indifferent');
      this.formPreference.get('age').setValue('indifferent');
      this.formPreference.get('fumeur').setValue('indifferent');
      this.formPreference.get('perimetre').setValue('indifferent');
      this.formPreference.get('musiqueFavoris').setValue('indifferent');
      this.formPreference.get('clubFavoris').setValue('indifferent');
      this.formPreference.get('statut').setValue('indifferent');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferencePage');
    this.verifIfPreferenceExist();
  }

  //cette methode permet de faire une requete de type post pour inserer de nouvelle preference
  postPreferenceUser(){

      let data : any ="sexe="+this.formPreference.get('sexe').value+
          "&&trancheAge="+this.formPreference.get('age').value+
          "&&fumeur="+this.formPreference.get('fumeur').value+
          "&&musiqueFavoris="+this.formPreference.get('musiqueFavoris').value+
          "&&clubFavoris="+this.formPreference.get('clubFavoris').value+
          "&&statut="+this.formPreference.get('statut').value+
          "&&perimetre="+this.formPreference.get('perimetre').value;;

      console.log(data);

      console.log(this.restProvider.currentUserId);

      this.restProvider.postPreferenceUser(data).subscribe(res => {
          //si tous c'est bien passer je redirige l'uttilisateur vers la page d'accueil
          this.redirectAccueil();

      }, (err : HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
      })

  }
//cette methode interroge le serveur pour savoir si l'utilisateur a deja crée des preference
    verifIfPreferenceExist(){

        this.restProvider.verifIfPreferenceExist()
            .then(data => {

                this.checkifPrefExist = data['verifPref'];
                console.log(data['verifPref']);
            })


    }

//cette methode permet de mettre a jour les preferences
    putPreferenceUser(){

        let data : any ="sexe="+this.formPreference.get('sexe').value+
            "&&trancheAge="+this.formPreference.get('age').value+
            "&&fumeur="+this.formPreference.get('fumeur').value+
            "&&musiqueFavoris="+this.formPreference.get('musiqueFavoris').value+
            "&&clubFavoris="+this.formPreference.get('clubFavoris').value+
            "&&statut="+this.formPreference.get('statut').value+
            "&&perimetre="+this.formPreference.get('perimetre').value;

        this.restProvider.putPreferenceUser(data).subscribe(res => {
            console.log(res);

            //si tous c'est bien passer je redirige l'uttilisateur vers la page d'accueil
           this.redirectAccueil();
        }, (err : HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        })


    }


    //cette methode permet de réaliser une insertion ou une mise a jour des préférence suivant si l'utilisateur a deja des preference ou nom
    submitPreference(){


      switch (this.checkifPrefExist){

      //dans le cas ou l'uttilisateur a deja des preference je fait une requete de type put
          case true:
              this.putPreferenceUser();
              break;
      //dans le cas ou l'uttilisateur n'a pas de préference, je fait une insertion
          case false:
              this.postPreferenceUser();
              break;
       //dans tous les autre cas, une erreur est survenue, j'envoi donc un messge pour prévenir l'utilisateur
          default:
              this.restProvider.customPopUp("Erreur","Oups, il semblerais qu'une erreur est survenue veuillez réessayer ultérieurement","OK",null )
      }
    }

    //cette methode redirige l'uttilisateur vers la page d'accueil
    redirectAccueil(){

        this.navCtrl.push(AccueilPage);
    }






}
