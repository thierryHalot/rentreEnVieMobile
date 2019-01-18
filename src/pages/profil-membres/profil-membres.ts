import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {MessagePage} from "../message/message";

/**
 * Generated class for the ProfilMembresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profil-membres',
  templateUrl: 'profil-membres.html',
})
export class ProfilMembresPage {

  idUserProfil : any;
    user : any = {
        pseudo:'',
        role:'',
        age:'',
        sexe:'',
        fumeur: '',
        musiqueFavoris:'',
        clubFavoris:'',
        img:''

    };

    checkIfHeaderMsgExist :boolean;
    checkifBlocked: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private resteProvider : RestProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilMembresPage');
  }

  ionViewDidEnter(){

      this.getIdUserProfil();

      this.findUser();
      this.getIfHeaderMsgExist(this.idUserProfil);
      this.getIfUserIsInBlacklist(this.idUserProfil);
  }

getIdUserProfil(){

    this.idUserProfil = this.resteProvider.getIdUserProfil();
}

    //cette methode me permet de récupérer les imformation de l'utilisateur correspondant au profil
    findUser(){

        this.resteProvider.findUser(this.idUserProfil).then(data => {

            console.log(data);
            this.user.pseudo = data['pseudo'];
            this.user.role = data['type'];
            this.user.age = data['age'];
            this.user.sexe = data['sexe'];
            this.user.fumeur = data['fumeur'];
            this.user.clubFavoris = data['clubFavoris'];
            this.user.musiqueFavoris = data['musiqueFavoris'];
            this.user.img = data['img'];


        });

    }
    redidirectToPageMsg(){


        switch (this.checkIfHeaderMsgExist) {


            case true:
                this.putHeaderMsgUser(this.idUserProfil);
                break;
            case false:
                this.postHeaderMsgUser(this.idUserProfil);
                break;
            default:
                this.resteProvider.customPopUp("Ooups", "une erreur est survenue veuillez reéessayer ultérieument", 'ok', null);


        }

        this.navCtrl.push(MessagePage);


    }
    //cette methode permet de savoir si l'utilisateur a deja eu une conversation avec un membre
    getIfHeaderMsgExist(idRecepteur : number){

        this.resteProvider.getIfHeaderMsgExist(idRecepteur).then(data => {

            //je stocke les imformations récupérer dans ma propriété resultatRecherche
            console.log(data);

            this.checkIfHeaderMsgExist = data['verifHeaderMsg'];




        });


    }
    postHeaderMsgUser(idRecepteur : any){


        let data : any = "recepteur_id="+ idRecepteur;

        this.resteProvider.postHeaderMsgUser(data).subscribe(res => {

            //this.resteProvider.customPopUp("yathaaa ", 'insertion header msg complet ;-)', "Ok", null);
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });




    }

    putHeaderMsgUser(idRecepteur : number){



        let data : any = "is_del=0";

        this.resteProvider.putHeaderMsgUser(data,idRecepteur).subscribe(res => {

             //this.resteProvider.customPopUp("yathaaa ", 'mise ajour reussi header msg complet ;-)', "Ok", null);
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });


    }

    //cette fonction permet de vérifier si l'utilisateur courant a été bloquer par un autre utilisateur
    //prend en argument l'id de l'utilisateur qui pourait l'avoir blocker
    getIfUserIsInBlacklist(idUserBlockant : number){


        this.resteProvider.getIfUserIsInBlacklist(idUserBlockant).then(data => {

            //je stocke les imformations récupérer dans ma propriété resultatRecherche
            // console.log(data);

            this.checkifBlocked = data['verifBlacklist']
        });

    }

    // cette methode permet de verifier si l'utilisateur a deja blocker le membre dont le profil est selectionner
    // si le membre n'a jamais été bloquer effectue une requete de type post pour blacklister le membre
    //si le membre a deja été bloquer fait apparaitre une pop up pour pévenir l'utilisateur
    getIfblocked(){

        this.resteProvider.getIfblocked(this.idUserProfil).then(data => {

            //je stocke les imformations récupérer dans ma propriété resultatRecherche
            // console.log(data);
            switch(data['verifBlacklist']){

                case true:
                    this.resteProvider.customPopUp("Utilisateur bloquer", "vous avez deja blocker ce membre", 'ok', null);
                    break;
                case false:
                    this.postBlacklistUser();
                    break;
                default:
                    this.resteProvider.customPopUp("Ooups", "une erreur est survenue veuillez reéessayer ultérieument", 'ok', null);




            }
        });

    }

    //cette methode permet d'inséré un utilisateur en blacklist
    postBlacklistUser(){


        let data: any = "bloquerId=" + this.idUserProfil + "&&bloquandId=" + this.resteProvider.currentUserId;

    console.log(data);
        this.resteProvider.postBlacklistUser(data).subscribe(res => {

            this.resteProvider.customPopUp("Utilisateur Bloquer", "cette utilisateur ne pourra plus vous envoyé de message","Ok", null);
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });

    }
}
