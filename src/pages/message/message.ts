import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import { Content } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})

export class MessagePage {
    @ViewChild(Content) content: Content;


    tabMessage : any;

  formMessage : FormGroup;

  idRecepteur: any;

  pseudoRecepteur : any;

  idEmetteur: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuider : FormBuilder, private restProvider : RestProvider) {
      this.formMessage = this.formBuider.group({

          message :['', Validators.compose([Validators.required])],

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');

    setTimeout(() => {
          this.content.scrollToBottom(300);
      }, 1000);

  }

  ionViewDidEnter(){
      this.getIdRecepteur();
      this.getEmmeteurId();
      this.findUser();
      this.getConversation();

  }

  //cette methode permet de retourner la conversation entre deux membres
  getConversation(){

    this.restProvider.getConversation(this.idRecepteur).then(data => {

       console.log(data);

       this.tabMessage = data;

    });

    }




  //cette methode permet a l'utilisateur de poster un nouveau message
  postMsgUser(){

      let data : any = 'contenu='+ this.formMessage.get('message').value;
      this.restProvider.postMsgUser(data,this.idRecepteur).subscribe(res => {

          this.restProvider.customPopUp("yathaaa ", 'msg envoyé ;-)', "Ok", null);
      }, (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
      });

      //après que l'utilisateur est poster son message, je vide le contenu du champ input
      this.formMessage.get('message').setValue('');
      this.getConversation();

      //permet de rafraichir la page
      this.navCtrl.setRoot(this.navCtrl.getActive().component);

    }

    getIdRecepteur(){

      this.idRecepteur = this.restProvider.getIdRecepteur();

    }

    getEmmeteurId(){

      this.idEmetteur = this.restProvider.getCurrentIdUser();

    }

    //cette methode me permet de récupérer les imformation du recepteur
    findUser(){

        this.restProvider.findUser(this.idRecepteur).then(data => {

            console.log(data);

           this.pseudoRecepteur = data['pseudo'];

        });

    }
}
