import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AlertController} from "ionic-angular/components/alert/alert-controller";
import {HttpParams} from "@angular/common/http";






/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

    apiUrl : string = "http://rentre-en-vie-api.fr:80";

    currentUserId :number ;

    idUserProfil : number ;

    idRecepteur : number;

    token : string;

  constructor(public http: HttpClient, private alerte : AlertController) {
    console.log('Hello RestProvider Provider');
  }
    getPathImgDirectory(){

      return this.apiUrl+'/build/img/';

    }

    setToken(token:any){

      this.token = token;

        return this.token
    }

    getCurrentIdUser(){

        return this.currentUserId;


    }

    setCurrentId(id : number){


        this.currentUserId = id;

        return this.currentUserId;

    }

    getIdUserProfil(){

      return this.idUserProfil;
    }

    setIdUserProfil(id: number){

      this.idUserProfil = id;
      return this.currentUserId;
    }

    getIdRecepteur(){

      return this.idRecepteur;
    }

    setIdRecepteur(id: number){

      this.idRecepteur = id;

      return this.idRecepteur;
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

  // //fonction qui me permet de récupérer tous les utilisateur en base de donné
  //   getUsers() {
  //
  //       return new Promise(resolve => {
  //           this.http.get(this.apiUrl+'/api/getusers').subscribe(data => {
  //               resolve(data);
  //           }, err => {
  //               console.log(err);
  //           });
  //       });
  //   }

    //fonction qui me permet d'inserer un utilisateur en base de donné

    saveUser(data : Observable<any>) {


        return this.http.post(this.apiUrl+'/api/post/user',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});


    }

    //cette methode permet de mettre a jour l'utilisateur courant
    putCurrentUser(data : Observable<any>){

        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.put(this.apiUrl+'/api/put/user/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, params : options});


    }



    //cette fonction sert a savoir si le mail ou le pseudo existe en bdd, retourne un tableau format json (reponse du serveur)
    verifInscUser(data : Observable <any>){



        return this.http.post(this.apiUrl+'/api/verifInscUser',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});



    }

    verifConUser(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/verifConUser',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, params : options});


    }

    checkInfoConnexion(data : Observable <any>){


        return this.http.post(this.apiUrl+'/api/checkInfoConnexion',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, observe: "response", responseType:"json"});



    }

    postPreferenceUser(data : Observable <any>){


        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/postPreferenceUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-AUTH-TOKEN': this.token}, params : options});

    }


    putPreferenceUser(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.put(this.apiUrl+'/api/putPreference/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-AUTH-TOKEN': this.token},params : options});

    }

    verifIfPreferenceExist(){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl+'/api/checkIfPreference/'+this.currentUserId,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getResultaPreferenceUser() {



        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);

            this.http.get(this.apiUrl + '/api/getRechercheUser/' + this.currentUserId,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    //permet de vérifier si la position de l'utilisateur a deja été inséré
    getIfPositionUserExist(){


        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getIfPositionExist/' + this.currentUserId,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });


    }

    //permet d'inserer la position de l'utilisateur en bdd
    postPositionUser(data : Observable <any>){

        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/postPositionUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params :options});

    }

    //permet de mettre a jour la position de l'utilisateur
    putPositionUser(data : Observable <any>){

        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);

        return this.http.put(this.apiUrl+'/api/putPositionUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params :options});


    }

    //cette methode permet de savoir si l'utilisateur courant a été blacklister par un autre membre,
    // prend en argument l'id du membre a tester
    getIfUserIsInBlacklist(idUserBloquant : number){


        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getIfUserIsInBlacklist/'+idUserBloquant+'/' + this.currentUserId,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }

    //cette methode permet de savoir si l'utilisateur courant a blacklister un membre
    //prend en argument l'id du membre a tester
    getIfblocked(id:number){


        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getIfUserIsInBlacklist/'+this.currentUserId+'/' + id,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }

    //cette methode permet de savoir si l'utilisateur a deja eu une conversation avec un autre membre
    //prend en argument l'id du membre à tester
    getIfHeaderMsgExist(idRecepteur : number){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getIfHeaderMsgExist/'+this.currentUserId+'/' + idRecepteur,{params :options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });


    }

    //cette methode permet de poster un nouveau header msg
    postHeaderMsgUser(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/postHeaderMsgUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});


    }

    //cette methode permet de mettre a jour la valeur de is_del du headerMsg de l'emmetteur

    putHeaderMsgUser(data : Observable <any>, idRecepteur : number){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.put(this.apiUrl+'/api/putHeaderMsgUser/'+this.currentUserId + '/'+idRecepteur,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});


    }

    //cette méthode permet a un utilisateur de poster un nouveau message
    postMsgUser(data : Observable <any>, idRecepteur : number){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/postMsg/'+this.currentUserId + '/'+idRecepteur,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, params:options});


    }

    //cette methode permet de retourner la conversation entre deux membres

    getConversation(idRecepteur){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getConversation/'+this.currentUserId+'/' + idRecepteur,{params : options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }

    //cette methode permet d'obtenir les imformation d'un utilisateur par rapport a son id
    findUser(id : number){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/get/user/'+ id,{params : options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }


    //cette methode permet d'inséré un utilisateur en blacklist
    postBlacklistUser(data : Observable <any>){

        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/postBlacklist',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params: options});

    }

    //cette methode de supprimmer un utilisateur de la blacklist deleteBlacklist
    deleteBlacklist(idBlacklist : number){

        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
           return  this.http.delete(this.apiUrl + '/api/deleteBlacklist/'+idBlacklist,{params:options});



    }

    //cette methode retourne tous les utilisateur blacklister de l'utilisateur courant
    getBlacklistCurrentUser(){


        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getBlacklist/' + this.currentUserId,{params:options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });


    }


    //cette methode permet de mettre a jour le statut de l'utilisateur
    putStatutUser(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.put(this.apiUrl+'/api/putStatutUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});


    }

    //cette methode permet de mettre  a jour le role de l'utilisateur
    putRoleUser(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.put(this.apiUrl+'/api/putRoleUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});


    }

    getAllNews(){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getNews',{params:options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });


    }


    //cette méthode permet de recupéré tous les header message d'un utilisateur dont la valeur de is_del est égale a 0
    getAllHeaderMsgUser(){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/GetHeaderMsg/'+ this.currentUserId,{params:options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }


    //cette methode permet de stocker l'image de profil correspondant a un utilisateur
    postImageUser( data,id : number){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
      let body = new FormData();
      body.append('img',data);

        return this.http.post(this.apiUrl+'/api/postImgUser/'+id,
            body,{params:options});


    }

    verifUpdateProfil(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);

        return this.http.post(this.apiUrl+'/api/verifUpdateProfilUser/'+this.currentUserId,
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});

    }

    //cette methode envoi un mail contenant un nouveau mdp par rapport au mail de l'utilisateur
    sendMailForNewMdp(data : Observable <any>){

        return this.http.post(this.apiUrl+'/api/getNewMdp',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});


    }

    sendMsgContact(data : Observable <any>){
        const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
        return this.http.post(this.apiUrl+'/api/sendMsgContact',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},params:options});


    }


    //cette methode requete sur l'api pour recuperer le perimetre choisi par l'utilisateur
    getPerimetreUser(){

        return new Promise(resolve => {
            const options = new HttpParams().set('X-AUTH-TOKEN',this.token);
            this.http.get(this.apiUrl + '/api/getPreferencePerimetreUser/'+ this.currentUserId,{params:options}).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });

    }

}
