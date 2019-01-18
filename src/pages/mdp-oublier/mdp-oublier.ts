import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {HomePage} from "../home/home";
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";

/**
 * Generated class for the MdpOublierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mdp-oublier',
  templateUrl: 'mdp-oublier.html',
})
export class MdpOublierPage {

    formForgetMdp : FormGroup;
    validation_messages = {
        'mail': [
            { type: 'required', message: 'Veuillez renseigner votre mail' },
            { type: 'pattern', message: 'Veuillez renseigné une adresse mail valide' },
            { type: 'maxlength', message: "Votre adresse ne peut pas depasser 100 charactères" }
        ],
        'checkIfBoth': [
            { type: 'required', message: "Veuillez confirmé que vous n'ete pas un robot" }
        ],

    };

  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuider : FormBuilder, private restProvider : RestProvider) {

      this.formForgetMdp = this.formBuider.group({

          mail :['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Zéèàêâùïüë0-9._-]+@[a-zA-Zéèàêâùïüë0-9._-]{2,}\.[a-z]{2,4}$'),Validators.maxLength(100)])],
          checkIfBoth: ['', Validators.requiredTrue]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MdpOublierPage');
    this.formForgetMdp.get('checkIfBoth').setValue(false);
  }

    redirectHome() {
        this.navCtrl.push(HomePage);
    }

    sendMailForNewMdp(){

      if (this.formForgetMdp.valid) {

          let data : any = 'mail='+ this.formForgetMdp.get('mail').value;
          this.restProvider.sendMailForNewMdp(data).subscribe(res => {

              switch (res['verifMail']){

                  case true:
                      this.restProvider.customPopUp('Mail envoyé','Vous allez reçevoir prochainement un mail contenant votre nouveau mot de passe, vous aller etre rediriger','Ok',this.redirectHome());
                  break;
                  case false:
                      this.restProvider.customPopUp('Mail incorecte',"Le mail que vous avez indiquer n'existe pas sur notre site",'ok',null);
                      break;
                  default:
                      this.restProvider.customPopUp('Erreur',"Une erreur est survenu, veuillez réessayer ultérieurement",'Ok',null);
              }

          }, (err: HttpErrorResponse) => {
              console.log(err.error);
              console.log(err.name);
              console.log(err.message);
              console.log(err.status);
          });


      }else {

          this.restProvider.customPopUp('Donnée incorrecte','Pour vous envoyé votre mot de passe, veuillez remplir correctement tous les champs','ok',null);
      }
    }


}
