import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {AccueilPage} from "../accueil/accueil";
/**
 * Generated class for the ProfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {
    checkStatus :boolean;
    formProfil : FormGroup;
    file: File;
    imgUser : any;
    validation_messages = {
        'nom': [
            { type: 'required', message: 'Veuillez renseigner votre nom' },
            { type: 'pattern', message: 'Veuillez renseigné un nom correcte, les chiffres et les charactères spéciaux sont invalide' },
            { type: 'maxlength', message: "Votre nom ne peut pas depasser 45 charactères" }
        ],
        'prenom': [
            { type: 'required', message: 'Veuillez renseigner votre prenom' },
            { type: 'pattern', message: 'Veuillez renseigné un prenom correcte, les chiffres et les charactères spéciaux sont invalide' },
            { type: 'maxlength', message: "Votre prenom ne peut pas depasser 45 charactères" }
        ],
        'pseudo': [
            { type: 'required', message: 'Veuillez renseigner un pseudo' },
            { type: 'pattern', message: "Votre pseudo ne peut pas comporter d'espace,ni de caractère spéciaux" },
            { type: 'minlength', message: "Votre pseudo doit au moin comporter 6 charatères" },
            { type: 'maxlength', message: "Votre pseudo ne peut pas depasser 25 charactères" }
        ],
        'age': [
            { type: 'required', message: 'Veuillez renseigner votre age' },
            { type: 'pattern', message: "Veuillez renseigné un age valide, les lettres ne sont pas autoriser" }
        ],
        'sexe': [
            { type: 'required', message: 'Veuillez indiqué si vous ete un homme ou une femme' }
        ],
        'tel': [
            { type: 'required', message: 'Veuillez renseigner votre numéros de téléphone' },
            { type: 'pattern', message: 'Veuillez renseigné un numéros de téléphone valide, seul les chiffres sont autoriser, il doit obligatoirement commençer par un 0' }
        ],
        'adresse': [
            { type: 'required', message: 'Veuillez renseigner votre adresse' },
            { type: 'pattern', message: ' Votre adresse doit etre valide, les caractères spéciaux ne sont pas autorisé' },
            { type: 'maxlength', message: "Votre adresse ne peut pas depasser 150 charactères" }
        ],
        'mail': [
            { type: 'required', message: 'Veuillez renseigner votre mail' },
            { type: 'pattern', message: 'Veuillez renseigné une adresse mail valide' },
            { type: 'maxlength', message: "Votre adresse ne peut pas depasser 100 charactères" }
        ],
        'mdp': [
            { type: 'minlength', message: "Votre mot de passe doit au moin comporter 6 charatères" },
            { type: 'maxlength', message: "Votre mot de passe ne peut pas depasser 25 charactères" }
        ],
        'fumeur': [
            { type: 'required', message: 'Veuillez indiqué si vous ete fumeur' }
        ],
        'musiqueFavoris': [
            { type: 'required', message: 'Veuillez renseigner votre style de musique préféré' }
        ],
        'clubFavoris': [
            { type: 'required', message: 'Veuillez renseigner votre club Favoris' }
        ],

    };
  constructor(public navCtrl: NavController, public navParams: NavParams,public restPro : RestProvider,private formBuilder : FormBuilder) {
      this.formProfil = this.formBuilder.group({
          nom : ['', Validators.compose([Validators.required,Validators.pattern("^[a-zA-Zéèàêâùïüë ]+"),Validators.maxLength(45)])],
          prenom: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë ]+'),Validators.maxLength(45)])],
          pseudo:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9]+'), Validators.minLength(6),Validators.maxLength(25)])],
          age:['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}')])],
          sexe:['', Validators.compose([Validators.required])],
          tel: ['', Validators.compose([Validators.required, Validators.pattern('^0[0-9]{9}')])],
          adresse:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9 ]+'),Validators.maxLength(150)])],
          mail:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9._-]+@[a-zA-Zéèàêâùïüë0-9._-]{2,}\.[a-z]{2,4}$'),Validators.maxLength(100)])],
          mdp:['',Validators.compose([Validators.minLength(6),Validators.maxLength(25)])],
          confMdp:[''],
          fumeur:['', Validators.compose([Validators.required])],
          musiqueFavoris:['', Validators.compose([Validators.required])],
          clubFavoris:['', Validators.compose([Validators.required])]

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilPage');
  }
    ionViewDidEnter(){
      this.findUser();
    }
    showInfoCompInsc(){

        this.checkStatus = true;



    }

    showInfoPersoInscr(){

        this.checkStatus = false;
    }

    //cette methode retourne false si le mdp et la confirmation du formulaire  sont identique et true si il ne le sont pas
    verifPsw(){

        let mdp = this.formProfil.get('mdp').value;

        let confmdp = this.formProfil.get('confMdp').value;


        if(mdp === confmdp){

            return false;


        }else {


            return true
        }
    }

    //cette methode me permet de récupérer les imformation de l'utilisateur courant
    findUser() {

        this.restPro.findUser(this.restPro.currentUserId).then(data => {

            console.log(data);

            this.formProfil.get('nom').setValue(data['nom']);
             this.formProfil.get('prenom').setValue(data['prenom']);
             this.formProfil.get('pseudo').setValue(data['pseudo']);
             this.formProfil.get('age').setValue(data['age']);
             this.formProfil.get('sexe').setValue(data['sexe']);
             this.formProfil.get('tel').setValue('0'+data['tel']);
             this.formProfil.get('adresse').setValue(data['adresse']);
             this.formProfil.get('mail').setValue(data['mail']);
             this.formProfil.get('fumeur').setValue(data['fumeur']);
             this.formProfil.get('musiqueFavoris').setValue(data['musiqueFavoris']);
             this.formProfil.get('clubFavoris').setValue(data['clubFavoris']);
             if(data['img'] !== null ) {
                 this.imgUser = this.restPro.getPathImgDirectory() + data['pseudo'] + '/' + data['img'];
             }

        });
    }

    changeListener($event):void{

        this.file = $event.target.files[0];

        console.log(this.file);


    }


    sendImage(){

        this.restPro.postImageUser(this.file,this.restPro.currentUserId).subscribe(res => {

            console.log(res);
            this.navCtrl.setRoot(this.navCtrl.getActive().component);

        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });
    }


    //cette fonction permet de vérifier si le pseudo et le mot de passe de l'uttilisateur on deja été uttilisé
    //envoi une requete de type post sur l'api, le serveur retourne un tableau au format json
    //si la clé verifPseudo est égale a false, le pseudo a deja été utilisé, si c'est true le pseudo n'a jamais été utilisé
    //si la clé verifMail est égale a false, le mail a déja été utilisé, si c'est true le mail na jamais été utilisé
    verifUpdateProfil(){
        //je vérifie si les imformation rentrer son valide
        if (this.formProfil.valid && !this.verifPsw()) {
            //j'initialise une variable contenant les informations a envoyé au serveur
            let data: any = "mail=" + this.formProfil.get('mail').value + "&&pseudo=" + this.formProfil.get('pseudo').value;


            this.restPro.verifUpdateProfil(data).subscribe(res => {

                if (res) {
                    //si le mail et le pseudo son egale a false alors j'affiche un message
                    if (!res['validMail'] && !res['validPseudo']) {

                        console.log("mail et pseudo deja uttilisé");

                        this.restPro.customPopUp("Oups <br>Pseudo et Email incorrecte", "Le Pseudo et le mail on déja été utilisé", "Ok", null);

                        // et Si le Pseudo est deja utilisé, j'affiche un message
                    } else if (res['validMail'] && !res['validPseudo']) {

                        console.log("pseudo deja uttilisé");

                        this.restPro.customPopUp("Oups <br> Pseudo incorecte", "le pseudo que vous avez indiqué à déjà été utilisé", 'Ok', null);

                        //et si le mail est deja utilisé alors j'affiche un message
                    } else if (!res['validMail'] && res['validPseudo']) {

                        console.log("Email <br> deja utililisé");

                        this.restPro.customPopUp("Oups Email incorecte", "Ce mail a déjà été utilisé", "ok", null);

                        //dans tous les autre cas le pseudo et le mail sont correcte
                        // alors j'appele ma fonction qui persiste l'utilisateur
                    } else {

                        this.putCurrentUser();

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

            this.restPro.customPopUp('Imformation renseigné incorecte',"Afin de vous inscrire, vous devez compléter correctement les champs",'Ok',null);


        }


    }

    //permet de mettre a jour l'uttilisateur avec les imformation du formulaire
    putCurrentUser(){


        let data : any = "nom="+this.formProfil.get('nom').value+
            "&&prenom="+this.formProfil.get('prenom').value+
            "&&pseudo="+this.formProfil.get('pseudo').value+
            "&&age="+this.formProfil.get('age').value+
            "&&sexe="+this.formProfil.get('sexe').value+
            "&&tel="+this.formProfil.get('tel').value+
            "&&adresse="+this.formProfil.get('adresse').value+
            "&&mail="+this.formProfil.get('mail').value+
            "&&mdp="+this.formProfil.get('mdp').value+
            "&&musiqueFavoris="+this.formProfil.get('musiqueFavoris').value+
            "&&clubFavoris="+this.formProfil.get('clubFavoris').value;


        switch(this.formProfil.get('fumeur').value){

            case true:
                data += "&&fumeur=1";
                break;
            case false:
                data += "&&fumeur=0";
                break;
            default:
                break;

        }

        this.restPro.putCurrentUser(data).subscribe(res => {

            this.restPro.customPopUp("Mise a jour reussi", 'Vos imformations ont bien été mis a jour, vous aller etre diriger vers la page principal',"Ok",this.redirectPageAccueil());
        }, (err : HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });



    }

    redirectPageAccueil(){


      this.navCtrl.push(AccueilPage);

    }
}
