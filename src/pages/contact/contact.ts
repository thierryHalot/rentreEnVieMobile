import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  formContact : FormGroup;

    validation_messages = {
        'nom': [
            { type: 'required', message: 'Veuillez indiqué votre nom' },
            { type: 'pattern', message: 'Veuillez renseigné un nom correcte, les chiffres et les charactères spéciaux sont invalide' },
            { type: 'maxlength', message: "Votre nom ne peut pas depasser 45 charactères" }
        ],
        'mail': [
            { type: 'required', message: 'Veuillez rensignez un mail' },
            { type: 'pattern', message: 'veuillez renseigné une adresse mail valide' },
            { type: 'maxlength', message: "Votre mail ne peut pas depasser 100 charactères" }
        ],
        'message': [
            { type: 'required', message: 'Veuillez rentrer un message' },
            { type: 'pattern', message: 'votre message ne doit pas comporter de caractère spéciaux tel que || < > { }' },
            { type: 'maxlength', message: "Votre message ne peut pas depasser 300 charactères" }]
    };

  constructor(public navCtrl: NavController, public navParams: NavParams,public restPro : RestProvider,private formBuilder : FormBuilder) {

      this.formContact = this.formBuilder.group({
          nom : ['', Validators.compose([Validators.required,Validators.pattern("^[a-zA-Zéèàêâùïüë ]+"),Validators.maxLength(45)])],
          mail:['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9._-]+@[a-zA-Zéèàêâùïüë0-9._-]{2,}\.[a-z]{2,4}$'),Validators.maxLength(100)])],
          message:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Zéèàêâùïüëçâô0-9.?!'-_()^+*;: \n]+"),Validators.maxLength(300)])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }
    ionViewDidEnter(){
        this.findUser();
    }

  //cette methode me permet de récupérer les donné de l'utilisateur courant et de préremplir les champ du formulaire aves ces données
  findUser(){

      this.restPro.findUser(this.restPro.currentUserId).then(data => {

          console.log(data);

          this.formContact.get('nom').setValue(data['nom']);
          this.formContact.get('mail').setValue(data['mail']);

      });
  }

    sendMsgContact(){

      if(this.formContact.valid){

          let data : any = 'mail='+ this.formContact.get('mail').value + '&&nom='+this.formContact.get('nom').value+'&&message='+this.formContact.get('message').value;
          this.restPro.sendMsgContact(data).subscribe(res => {

              switch (res['verifMail']){

                  case true:
                      this.restPro.customPopUp('Mail envoyé','Nous avons bien réceptionné votre mail, vous reçevrer une réponse prochainement','Ok', null);
                      break;
                  case false:
                      this.restPro.customPopUp('Imformation incorecte',"Les imformations que vous nous avez indiqué ne correspondent pas avec votre profil, votre mail et votre nom doivent correspondre avec les données reçu lors de l'inscription",'ok',null);
                      break;
                  default:
                      this.restPro.customPopUp('Erreur',"Une erreur est survenu, veuillez réessayer ultérieurement",'Ok',null);
              }

          }, (err: HttpErrorResponse) => {
              console.log(err.error);
              console.log(err.name);
              console.log(err.message);
              console.log(err.status);
          });


        }else{


          this.restPro.customPopUp('Imformation incorecte','Pour nous ecrire, veuillez compléter corectement tous les champs','Ok',null);


      }



    }

}
