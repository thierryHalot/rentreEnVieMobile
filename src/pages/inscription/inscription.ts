import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {AlertController} from "ionic-angular/components/alert/alert-controller";
import {ConnexionPage} from "../connexion/connexion";
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
        fumeur: false,
        musiqueFavoris:'',
        clubFavoris:'',
        condUtil: false
    };

    message : string;
    titreMessage : string;
    checkStatus :boolean;

formInsc : FormGroup;
    validation_messages = {
        'nom': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre nom' },
            { type: 'pattern', message: 'Veuillez renseigné un nom correcte, les chiffres et les charactères spéciaux sont invalide' },
            { type: 'maxlength', message: "Votre nom ne peut pas depasser 45 charactères" }
        ],
        'prenom': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre prenom' },
            { type: 'pattern', message: 'Veuillez renseigné un prenom correcte, les chiffres et les charactères spéciaux sont invalide' },
            { type: 'maxlength', message: "Votre prenom ne peut pas depasser 45 charactères" }
        ],
        'pseudo': [
            { type: 'required', message: 'Pour vous inscrire il vous faut choisir un pseudo' },
            { type: 'pattern', message: "Votre pseudo ne peut pas comporter d'espace,ni de caractère spéciaux" },
            { type: 'minlength', message: "Votre pseudo doit au moin comporter 6 charatères" },
            { type: 'maxlength', message: "Votre pseudo ne peut pas depasser 25 charactères" }
        ],
        'age': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre age' },
            { type: 'pattern', message: "Veuillez renseigné un age valide, les lettres ne sont pas autoriser" }
        ],
        'sexe': [
            { type: 'required', message: 'Pour vous inscrire veuillez indiqué si vous ete un homme ou une femme' }
        ],
        'tel': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre numéros de téléphone' },
            { type: 'pattern', message: 'Veuillez renseigné un numéros de téléphone valide, seul les chiffres sont autoriser, il doit obligatoirement commençer par un 0' }
        ],
        'adresse': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre adresse' },
            { type: 'pattern', message: 'Pour vous inscrire votre adresse doit etre valide, les caractères spéciaux ne sont pas autorisé' },
            { type: 'maxlength', message: "Votre adresse ne peut pas depasser 150 charactères" }
        ],
        'mail': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre mail' },
            { type: 'pattern', message: 'veuillez renseigné une adresse mail valide' },
            { type: 'maxlength', message: "Votre adresse ne peut pas depasser 100 charactères" }
        ],
        'mdp': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigné votre mot de passe' },
            { type: 'minlength', message: "Votre mot de passe doit au moin comporter 6 charatères" },
            { type: 'maxlength', message: "Votre mot de passe ne peut pas depasser 25 charactères" }
        ],
        'confMdp': [
            { type: 'required', message: 'Pour vous inscrire veuillez confirmer votre mot de passe' }
        ],
        'fumeur': [
            { type: 'required', message: 'Pour vous inscrire veuillez indiqué si vous ete fumeur' }
        ],
        'musiqueFavoris': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre style de musique préféré' }
        ],
        'clubFavoris': [
            { type: 'required', message: 'Pour vous inscrire veuillez renseigner votre club Favoris' }
        ],
        'condUtil': [
            { type: 'required', message: "Pour vous inscrire, vous devez accepter les condition d'utilisation" }
        ],
    };




  constructor(public navCtrl: NavController, public navParams: NavParams,public restPro : RestProvider,private formBuilder : FormBuilder, private alerte : AlertController) {

      this.formInsc = this.formBuilder.group({
          nom : ['', Validators.compose([Validators.required,Validators.pattern("^[a-zA-Zéèàêâùïüë ]+"),Validators.maxLength(45)])],
          prenom: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë ]+'),Validators.maxLength(45)])],
          pseudo:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9]+'), Validators.minLength(6),Validators.maxLength(25)])],
          age:['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}')])],
          sexe:['', Validators.compose([Validators.required])],
          tel: ['', Validators.compose([Validators.required, Validators.pattern('^0[0-9]{9}')])],
          adresse:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9 ]+'),Validators.maxLength(150)])],
          mail:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9._-]+@[a-zA-Zéèàêâùïüë0-9._-]{2,}\.[a-z]{2,4}$'),Validators.maxLength(100)])],
          mdp:['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(25)])],
          confMdp:['', Validators.compose([Validators.required])],
          fumeur:['', Validators.compose([Validators.required])],
          musiqueFavoris:['', Validators.compose([Validators.required])],
          clubFavoris:['', Validators.compose([Validators.required])],
          condUtil:['', Validators.requiredTrue]
      });

      //this.formInsc.nom = this.formInsc.contains['nom'];

  }

  //cette methode verifie que le mot de passse et la confiramtion du mot de passe correspondent
    //retourne true si la confirmation du mot de passe est bonne et false si les deux ne corespondent pas
  verifPsw(){

      let mdp = this.formInsc.get('mdp').value;

      let confmdp = this.formInsc.get('confMdp').value;


      if(mdp === confmdp){

          return false;


      }else {


          return true
      }
  }
    inscform() {

        console.log(this.formInsc.value);

    };

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

    //cette methode permet de crée une popup custom
    customPopUp(titre :string,message : string,textBouton :string, fonctionBouton :any){


      let alert = this.alerte.create({
          title: titre,
          message: message,
          buttons: [
            {
                text: textBouton,
                handler: () => {

                    if(fonctionBouton != undefined) {
                        fonctionBouton;
                    }
                }
            }
        ]
      });
        alert.present();
    }



    //cette fonction permet de sauvegarder les imformations de l'utilisateur en bdd,
    // effectue une requete de type post sur l'api et envoi les donné au format x-www-form-urlencoded
    saveUser() {

      //this.verifInscUser();
        //console.log(this.user);

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
       // console.log(data);

        this.restPro.saveUser(data).subscribe(res => {
                        this.message = "Bienvenue sur Rentre en Vie "+this.user.pseudo+
                            " ,votre inscription c'est déroulé avec sucses,vous allez etre rediriger vers la page d'accueil.";
                        console.log(res);
                        this.customPopUp("Inscription Reussi ", this.message,"Ok",this.redirectHome());
                     }, (err : HttpErrorResponse) => {
                         console.log(err.error);
                         console.log(err.name);
                         console.log(err.message);
                         console.log(err.status);
                     });


    }



    //cette methode redirige l'uttilisateur vers la page d'accueil
    redirectHome(){

        this.navCtrl.push(ConnexionPage);
    }


    //cette fonction permet de vérifier si le pseudo et le mot de passe de l'uttilisateur on deja été uttilisé
    //envoi une requete de type post sur l'api, le serveur retourne un tableau au format json
    //si la clé verifPseudo est égale a false, le pseudo a deja été utilisé, si c'est true le pseudo n'a jamais été utilisé
    //si la clé verifMail est égale a false, le mail a déja été utilisé, si c'est true le mail na jamais été utilisé
        verifInscUser(){
      //je vérifie si les imformation rentrer son valide
            if (this.formInsc.valid && !this.verifPsw()) {
                //j'initialise une variable contenant les informations a envoyé au serveur
                let data: any = "mail=" + this.user.mail + "&&pseudo=" + this.user.pseudo;


                this.restPro.verifInscUser(data).subscribe(res => {

                    if (res) {
                        //si le mail et le pseudo son egale a false alors j'affiche un message
                        if (!res['validMail'] && !res['validPseudo']) {

                            console.log("mail et pseudo deja uttilisé");

                            this.customPopUp("Oups <br>Pseudo et Email incorrecte", "Le Pseudo et le mail on déja été utilisé", "Ok", null);

                            // et Si le Pseudo est deja utilisé, j'affiche un message
                        } else if (res['validMail'] && !res['validPseudo']) {

                            console.log("pseudo deja uttilisé");

                            this.customPopUp("Oups <br> Pseudo incorecte", "le pseudo que vous avez indiqué à déjà été utilisé", 'Ok', null);

                            //et si le mail est deja utilisé alors j'affiche un message
                        } else if (!res['validMail'] && res['validPseudo']) {

                            console.log("Email <br> deja utililisé");

                            this.customPopUp("Oups Email incorecte", "Ce mail a déjà été utilisé", "ok", null);

                            //dans tous les autre cas le pseudo et le mail sont correcte
                            // alors j'appele ma fonction qui persiste l'utilisateur
                        } else {

                            this.saveUser()

                        }

                    }
                }, (err: HttpErrorResponse) => {

                    console.log(err.error);
                    console.log(err.name);
                    console.log(err.message);
                    console.log(err.status);

                });
            //si les imformations du formulaire sont incorrecte je renvoi un message d'erreur
            }else{

                this.customPopUp('Imformation renseigné incorecte',"Afin de vous inscrire, vous devez compléter correctement les champs",'Ok',null);


            }
  }
}

