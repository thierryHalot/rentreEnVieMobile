import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MdpOublierPage} from "../mdp-oublier/mdp-oublier";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {AccueilPage} from "../accueil/accueil";

/**
 * Generated class for the ConnexionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connexion',
  templateUrl: 'connexion.html',
})
export class ConnexionPage {

  formCo : FormGroup;



    validation_messages = {

        'pseudo': [
            { type: 'required', message: 'Pour vous connecter veuillez rentrer votre pseudo' },
            { type: 'pattern', message: "Votre pseudo ne peut pas comporter d'espace, ni de caractère spéciaux" },
            { type: 'minlength', message: "Votre pseudo doit au moins comporter 6 charatères" },
            { type: 'maxlength', message: "Votre pseudo ne peut pas dépasser 25 caractères" }
        ],
        'mdp': [
            { type: 'required', message: 'Pour vous connecter veuillez renseigner votre mot de passe' },
            { type: 'minlength', message: "Votre mot de passe doit au moins comporter 6 charatères" },
            { type: 'maxlength', message: "Votre mot de passe ne peut pas dépasser 25 caractères" }
        ]
    };

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider : RestProvider, private formBuider : FormBuilder) {

    this.formCo = this.formBuider.group({

      pseudo :['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9]+'), Validators.minLength(6),Validators.maxLength(25)])],
      mdp:['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(25)])]

    });




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnexionPage');
  }


  //cette methode permet de rediriger l'utilisateur vers la page de mot de passe oublier
  redirectMdpOublier() {
        this.navCtrl.push(MdpOublierPage);
    }




  //cette fonction permet de requeter sur l'api afin de savoir si le mot de passe et le pseudo renseigné correspond en base de donné



    verifConUser(){



      if(this.formCo.valid) {
    let data: any = "pseudo=" + this.formCo.get("pseudo").value + "&&mdp=" + this.formCo.get("mdp").value;

        this.restProvider.verifConUser(data).subscribe(res => {
        console.log(res);

        if (res) {
            //je recupere l'id de l'utilisateur courant
            this.restProvider.setCurrentId(res['id']);

            if (res['isDel']) {

                this.restProvider.customPopUp("Compte bloqué", "Désolé, votre compte à été bloquer par l'administrateur du site", 'Ok', null);

            } else {

                this.redirectAccueil();

            }

        }
            }, (err: HttpErrorResponse) => {
        console.log(err.error);
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
        })

      }
      else{

          this.restProvider.customPopUp("Information Incorrecte", "Pour vous connecter, veuillez remplir correctement les champs", 'Ok', null);


      }
    }


    checkInfoConnexion(){


        let data : any = "pseudo="+this.formCo.get("pseudo").value+"&&mdp="+this.formCo.get("mdp").value;


        this.restProvider.checkInfoConnexion(data).subscribe(res   => {
            console.log(res);
            if (res) {

                //si le mail et le mdp son egale a false alors j'affiche un message
                if (!res.body['validMdp'] && !res.body['validPseudo']) {

                    console.log("mail et mdp deja incorrecte");

                    this.restProvider.customPopUp("Oups <br>Pseudo et Mdp incorrecte", "Il semblerais que le pseudo et le mot de passe ne correspondent pas", "Ok", null);

                    // et Si le Pseudo est incorecte, j'affiche un message
                } else if (res.body['validMdp'] && !res.body['validPseudo']) {

                    console.log("pseudo deja uttilisé");

                    this.restProvider.customPopUp("Information incorrecte", "Votre mot de passe ou votre pseudo est invalide", 'Ok', null);

                    //et si le mail est deja utilisé alors j'affiche un message
                } else if (!res.body['validMdp'] && res.body['validPseudo']) {

                    console.log("Information incorrecte");

                    this.restProvider.customPopUp("Information incorrecte", "Votre mot de passe ou votre pseudo est invalide", "ok", null);

                    //dans tous les autre cas le pseudo et le mdp sont correcte
                    // alors j'appele ma fonction qui connecte l'utilisateur
                } else {

                    //je persiste mon token recupere du serveur
                    this.restProvider.setToken(res.headers.get('X-AUTH-TOKEN'));

                    this.verifConUser();
                }

            }
        }, (err : HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        })



}

    //cette methode redirige l'uttilisateur vers la page d'accueil
    redirectAccueil(){

        this.navCtrl.push(AccueilPage);
    }



}
