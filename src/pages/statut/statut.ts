import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
/**
 * Generated class for the StatutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statut',
  templateUrl: 'statut.html',
})
export class StatutPage {

  formStatut : FormGroup;
  checkifUpdateStatue : boolean;
    checkifUpdateRole : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuider : FormBuilder, private restProvider : RestProvider) {

      this.formStatut = this.formBuider.group({

          modeSortie :['', Validators.compose([Validators.required])],
          role : ['', Validators.compose([Validators.required])]

      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatutPage');


  }
    ionViewDidEnter(){

        this.findUser();

    }
  putSatutUser(){


      let modeSortie = this.formStatut.get('modeSortie').value;
      let role = this.formStatut.get('role').value;
      console.log(modeSortie);
      console.log(role);


      let dataRole : any;

      if (role){

          dataRole = "role=consomateur";

      }else{

          dataRole = "role=sam";
      }

      this.restProvider.putRoleUser(dataRole).subscribe(res => {

        this.checkifUpdateRole = true;
      }, (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
      });

      let dataStatue : any;

      if (modeSortie){

          dataStatue = "mode_sortie=1";

      }else{
          dataStatue = "mode_sortie=0";
      }

      this.restProvider.putStatutUser(dataStatue).subscribe(res => {

        this.checkifUpdateStatue = true;
      }, (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
      });



          this.restProvider.customPopUp('Succses','votre statue a bien été mis a jour','ok', null);





}

    setFormValueModeSortie(value : boolean){

     return this.formStatut.get('modeSortie').setValue(value);

    }

    setFormValueRole(value : boolean){

        return this.formStatut.get('role').setValue(value);

    }



    findUser(){

        this.restProvider.findUser(this.restProvider.currentUserId).then(data => {

            if (data['modeSortie']!== undefined){

                this.setFormValueModeSortie(data['modeSortie'])
            }else{

                this.setFormValueModeSortie(false);

            }

            switch (data['type']){

                case 'sam':
                    this.setFormValueRole(false);
                    break;
                case 'consomateur':
                    this.setFormValueRole(true);
                    break;
                default:
                    this.setFormValueRole(false);
            }

        });

    }
}
