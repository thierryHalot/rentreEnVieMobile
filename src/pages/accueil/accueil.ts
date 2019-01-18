import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import leaflet from 'leaflet';
import {ElementRef} from "@angular/core";
import {ViewChild} from "@angular/core";
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {ProfilMembresPage} from "../profil-membres/profil-membres";
import {MessagePage} from "../message/message";


/**
 * Generated class for the AccueilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html',
})
export class AccueilPage {
    @ViewChild('map') mapContainer: ElementRef;
    map: any;
    markerGroup : any;
    marker : any;
    tabMarker = [] ;
    resultatRecherche: any;
    checkViewProfil : boolean;
    verifPosition : boolean;
    checkifBlocked : boolean;
    checkIfHeaderMsgExist : boolean;
    idRecepteur : any;
    perimetreUser : any;





  constructor(public navCtrl: NavController, public navParams: NavParams, private restProvider : RestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');

      window.setInterval(function (){
          this.getPerimetreUser();
          this.getResultaPreferenceUser();
          this.loadmap()
      }.bind(this),3000);
  }


  //au moment ou j'initialise ma vue je genere ma carte
    ionViewDidEnter() {
      this.getPerimetreUser();
      this.getResultaPreferenceUser();
     this.loadmap()

    }

    //quand je sors de ma vue, je supprime le contenue de ma map
    ionViewCanLeave(){

      document.getElementById('map').outerHTML ="";
      //je met a jour les imformations concernants le résultat de recherche
        window.setInterval(function (){
            this.getPerimetreUser();
            this.getResultaPreferenceUser();
            this.loadmap()
        }.bind(this),30000);
    }

    //cette méthode gere l'affichage de la carte qui géolocalise les membres par rapport aux préférences de recherche de l'utilisateur
    loadmap() {

        //si jamais je ne recupere pas mes recherches
        if (this.resultatRecherche == undefined){

            //je fait appel a ma méthode qui récupere tous les utilisateurs rechercher
            this.getResultaPreferenceUser();
        }


        //je definie mes marqueurs correspondant a mes differents roles

            let currentIcone = leaflet.icon({
                iconUrl :'assets/curseur/blackCur.png',
                iconSize : [38,58],
                iconAnchor:[22,94],
                popupAnchor:[-3,-76]

            });

            let samIcone = leaflet.icon({
                iconUrl :'assets/curseur/blueCur.png',
                iconSize : [38,58],
                iconAnchor:[22,94],
                popupAnchor:[-3,-76]

            });
            let consoIcone = leaflet.icon({
                iconUrl :'assets/curseur/redCur.png',
                iconSize : [38,58],
                iconAnchor:[22,94],
                popupAnchor:[-3,-76]

            });

            //j'initinialise qu'une fois ma map
        if(this.map == undefined ) {
            this.map = leaflet.map("map").fitWorld();
            leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 10
            }).addTo(this.map);
           // alert(geometryutil.distance(this.map,leaflet.latlng(42.6,50.3),leaflet.latlng(42.6,50.3))+'metre');

            this.map.locate({
                setView: true,
                maxZoom: 10
            })

        }
        // let southWest = leaflet.latLng(40.712, -74.227),
        //     northEast = leaflet.latLng(40.774, -74.125),
        //     bounds = leaflet.latLngBounds(southWest, northEast);
        // this.map.setMaxBounds(bounds);



        this.map.setMinZoom(1);
        //je tente de récupérer la position de mon utilisateur courant
            this.map.locate({
                maxZoom: 10
            }).on('locationfound', (e) => {

                //je persiste la positon de l'utilisateur, cette methode s'occupe de faire une insertion
                // ou une mise a jour suivant le besoin
                this.getIfPositionUserExist(e.latitude, e.longitude);

                this.markerGroup = leaflet.featureGroup();

                //je defini le marqueur de mon utilisateur courant
                this.marker = leaflet.marker([e.latitude, e.longitude], {icon: currentIcone}).on('click', () => {


                });

                //j'injecte l'id de mon utilisateur courant dans le marquer
                this.marker.idUser = this.restProvider.currentUserId;

                //je récupère tous les sam et les consommateur correspondant à la recherche de mon utilisateur courant
                let sams = this.getSam(this.resultatRecherche);
                let consomateurs = this.getConsommateur(this.resultatRecherche);


                //si il y a des sams dans sa recherche, c'est que mon tableau n'est pas vide
                let i = 0;
                if (sams[0] != undefined) {

                //je boucle dans mon tableau de sam
                    while (i < sams.length) {

                        //si il a bien une latitude et longitude d'inséré
                        if (sams[i].latitude != null && sams[i].longitude != null) {

                            //je vérifie si son marqueur a deja été inséré, cette methode renvoi true si son marqueur existe
                            if (!this.verifIfMarqueurexiste(sams[i].id)) {
                                if (this.calculDistanceMarker(sams[i].latitude, sams[i].longitude) <= this.perimetreUser) {
                                    //si ma méthode renvoi false, c'est que le marqueur n'existe pas,
                                    // dans ce cas, j'insere son marqueur sur la carte avec l'icone qui correspond a son role
                                    this.addPostionUser(sams[i].latitude, sams[i].longitude, samIcone, sams[i].pseudo, sams[i].age, sams[i].id, sams[i].img)
                                }
                            }

                            //je vérifie si son marqueur est present qu'il n'y a pas de mise a jour a effectuer
                            //cette methode renvoi true si une mise a jour est a faire
                            if(!this.verifMajMarqueur(sams[i].id,sams[i].latitude, sams[i].longitude)){

                                //si une mise a jour du marqueur est a effectuer
                                //je recupere le marqueur de mon sam
                                let samMarkeur = this.findMarker(consomateurs[i].id);

                                //je met a jour sa position sur la carte
                                samMarkeur.setLatLng([sams[i].latitude,sams[i].longitude]).update()

                            }
                        }
                        i++;
                    }
                }

                //si mon tableau contient des consomateurs
                if (consomateurs[0] != undefined) {

                    i = 0;
                    //je boucle dans mes consomateurs
                    while (i < consomateurs.length) {

                        //si il on bien une latitude et une longitude d'inséré
                        if (consomateurs[i].latitude != null && consomateurs[i].longitude != null) {

                            //je vérifie que son marqueur n'est pas déja été inséré,
                            // cette méthode renvoi true si son marqueur existe
                            if (!this.verifIfMarqueurexiste(consomateurs[i].id)) {
                                if (this.calculDistanceMarker(consomateurs[i].latitude, consomateurs[i].longitude) <= this.perimetreUser){
                                //si ma methode renvoi false, je l'insere dans ma map
                                this.addPostionUser(consomateurs[i].latitude, consomateurs[i].longitude, consoIcone, consomateurs[i].pseudo, consomateurs[i].age, consomateurs[i].id, consomateurs[i].img)
                            }
                            }

                            //je vérifie si son marqueur est present et qu'il n'y a pas de mise a jour a effectuer
                            //cette methode renvoi true si une mise a jour est a faire
                            if(!this.verifMajMarqueur(consomateurs[i].id,consomateurs[i].latitude, consomateurs[i].longitude)){

                                //je récupère le marqueur de mon consomateur à mettre a jour
                                let consoMarkeur = this.findMarker(consomateurs[i].id);

                                //je met a jour sa position sur la carte
                                consoMarkeur.setLatLng([consomateurs[i].latitude,consomateurs[i].longitude]).update()

                            }


                        }
                        i++;
                    }
                }

    //je vérifie si le marqueur de mon utilisateur courant a été inséré sur la carte
    //cette méthode renvoi true si jamais le marqueur a été inséré
    if(!this.verifIfMarqueurexiste(this.marker.idUser)) {

    //si son marqueur n'est pas inséré je l'insere sur la carte
    this.markerGroup.addLayer(this.marker);
    this.map.addLayer(this.markerGroup);

    //j'insere le marqueur de l'uttilisateur dans mon tableau de marqueur
    this.tabMarker.push(this.marker);
        }


                // console.log('------------------------------------------------------------------------------');
                // console.log(this.marker._latlng.lng);
                // console.log(this.tabMarker);
                // console.log('------------------------------------------------------------------------------');

            //si la position de mon utilisateur n'a pas été trouver, j'affiche l'erreur
            }).on('locationerror', (err) => {
                alert(err.message);
            });
        // }

    }


    //cette métode permet de vérifier si une mise a jour est a effectuer sur un marqueur
    //elle se base sur les donné récupéré de l'api
    //prend en argument  l'id de l'utilisateur, sa latitude et sa longitude
    //renvoi true si aucune mise a jour est a effectuer et false dans le cas contraire
    verifMajMarqueur(idUser,latitudeUser,longitudeUser){

    //je recupere mon tableau de marqueur
      let tabRecherche = this.tabMarker;

      //j'inititialise un boolean a true
      let drapeau = true;

      //si mon tableau de recherche existe
      if(tabRecherche !== undefined) {
          let i = 0;

    //je boucle dans mon tableau pour rechercher le marqueur
    // correspondant a l'uttilisateur qui aurais une éventuel mis a jour a effectuer
          while (i < tabRecherche.length) {

              //si l'id envoyé correspond a l'id de l'utilisateur injecter dans mon marqueur
              //c'est que c'est le bon marqueur
              if (tabRecherche[i].idUser == idUser) {

                  //si sa lattitude ou sa latitude est différente des donné reçu par l'api alors je renvoi false
                  if(tabRecherche[i]._latlng.lat !== latitudeUser || tabRecherche[i]._latlng.lng !== longitudeUser){


                      drapeau = false;

                  }
              }
              i++
          }
      }
      //je retourne le resultat de ma recherche
        return drapeau;

    }


    //cette méthode retourne le marqueur correspondant a un utilisateur
    //prend en argument l'id de l'utilisateur
    findMarker(idUser){

    //je récupere mon tableau de marqueur
    let tabMarqueur = this.tabMarker;

    let i = 0;
    //je boucle pour tenter de récupérér son marqueur
    while(i < tabMarqueur.length){

    //si l'id de l'utilisateur correspond avec
    // l'id de l'utilisateur present dans mon marqueur
    //alors c'est le marqueur de cette utilisateur
    if(idUser == tabMarqueur[i].idUser){

    //je retourne donc son marqueur
        return tabMarqueur[i];

    }
    i++;
    }


    }
//cette fonction permet de calculer le nombre km entre le marqueur de l'utilisateur courant et un autre marqueur
//prend en argument la latitude et la longitude du marqueur
    calculDistanceMarker(lat,long){
//return (lat != null && long != null)?this.map.distance(leaflet.latLng(this.marker._latlng), leaflet.latLng(lat,long)) / 1000:0;
      let km = 0;
      if(lat != null && long != null) {
           km = this.map.distance(leaflet.latLng(this.marker._latlng), leaflet.latLng(lat,long)) / 1000;

      }
        return km;

    }
    //cette methode verifie si mon marqueur est present sur ma carte
    //prend en argument l'id de l'utilisateur
    verifIfMarqueurexiste(idUser){

      //j'initialise un boolean a false
        let drapeau = false;

        //si mon tableau de marqueur existe
      if(this.tabMarker !== undefined){

       let i = 0;



       //je boucle dans mon tableau de marqueur
          while(i < this.tabMarker.length){

              //si l'id de l'utilsateur est present dans mon tableau alors son marqueur existe
              if (this.tabMarker[i].idUser == idUser){

                  //mon boolean vaut donc true
                  drapeau =  true;

              }

              i++;
          }

      }
      //je retourne le résultat de mon boolean
      return drapeau;

    }

    //cette methode permet de rajouter un nouveau marqueur sur la carte
    // ainsi que la modal de profil lui correspondant
    //prend en argument :
    // la latitude, la longitude et l'icone de l'utilisateur qui sert a crée le marqueur
    //l'id de l'utilisateur pour l'injecter dans le marqueur crée
    //le pseudo et l'age de l'utilsateur pour afficher les imformations dans la modal
    addPostionUser(latitude,longitude,icone,pseudo,age,idUser,img){


        //je definie un nouveau marqueur avec les donné récupérer, a chaque evenement clique
       let marker = leaflet.marker([latitude, longitude ],{icon: icone }).on('click', () => {

//je verifie si l'utilisateur courant a été blacklister par cette utilisateur
           this.getIfUserIsInBlacklist(idUser);
           //j'appel ma fonction dispaly profil pour l'affichage du profil de l'utilisateur
           //je lui injecte son age et son pseudo
                this.displayProfil(pseudo,age,idUser,img);
       });


       //je rajoute l'id de mon utilisateur a mon marqueur
       marker.idUser = idUser;

       //j'insere le marqueur sur la carte
        this.markerGroup.addLayer(marker);
        this.map.addLayer(this.markerGroup);

        //jinsere le marqueur dans mon tableau de marqueur
        this.tabMarker.push(marker);
    }

    //methode qui permet de récupérer  tous les uttilisateurs correspondants à  la recherche de l'utilisateur courant
    getResultaPreferenceUser(){

      //je fait une requete de type get
        this.restProvider.getResultaPreferenceUser()
            .then(data => {

                //je stocke les imformations récupérer dans ma propriété resultatRecherche
                this.resultatRecherche = data;


            });


    }

    //methode qui retourne tous les sams en ligne
    //prend en argument une liste d'utilisateur a trier
    getSam(users :any) {

      //je declare un tableau vide
        let sam = [];
        if (users !== undefined) {
         let i = 0;


//je boucle dans les utilisateurs
    while (i < users.length) {

        //a chaque itération  si mon utilisateur est un sam et qu'il est en mode sortie
        if (users[i].type == "sam" && users[i].modeSortie == true) {

        //j'injecte le sam dans ma liste de sam
            sam.push(users[i]);

        }
        i++;
    }

    }
    //je retourne ma liste de sam
            return sam;


    }

    //methode qui retourne tous les consommateurs en ligne
    //prend en argument une liste d'utilisateur a trier
    getConsommateur(users : any) {

            let i = 0;

    //je declare un tableau de consomateur
            let consomateur = [];

        if (users !== undefined) {

            //je boucle dans ma liste d'utilisateur
            while (i < users.length) {

                //a chaque itération, si mon utilisateur est un consomateur et que son mode sortie est activé
                if (users[i].type == "consomateur" && users[i].modeSortie == true) {

                    //j'injecte mon consomateur dans ma liste de consomateur
                    consomateur.push(users[i]);


                }
                i++;
            }
        }
        //je retourne ma liste de consomateur
                return consomateur;


    }

    //cette fonction permet d'afficher le profil de l'utilisateur afficher sur la carte
    //et injecte son pseudo et son age dans la modal
    displayProfil(pseudo,age,id: number,img){

      //si l'utilisateur a bien un pseudo et un age present
    if (pseudo != null && age != null) {

        if(id != undefined) {
            this.restProvider.setIdUserProfil(id);
            this.restProvider.setIdRecepteur(id);
            this.getIfHeaderMsgExist(id);
            this.idRecepteur = id;




        }
        if(img !== null && img && img !== undefined && img !== '' ){

            document.getElementById("imgModal").setAttribute('src',this.restProvider.getPathImgDirectory()+pseudo+'/'+ img)

        }else{

            document.getElementById("imgModal").setAttribute('src','assets/profilImg/profilDefault.jpeg')

        }
    //j'injecte les donné dans deux balise p presente sur ma vue
    document.getElementById("pseudo").innerHTML = pseudo;
    document.getElementById("age").innerHTML = age + " ans";

    }
    //j'affiche ma modal
      this.checkViewProfil = true;


    }

    //cette methode permet de caher la modal de profil
    hideProfil(){


      this.checkViewProfil = false;
    }

    //cette methode verifie si l'uttilisateur courant a deja sa position d'inséré
    //fait une requete de type post si sa position n'a jamais été inséré
    // et fait une requete de type put si il faut mettre sa position a jour
    getIfPositionUserExist(latitude :any,longitude :any){

      this.restProvider.getIfPositionUserExist().then(data => {


    if (data) {

    switch (data['verifPosition']) {

        case true:
            this.putPositionUser(latitude, longitude);
            break;
        case false:
            this.postPositionUser(latitude, longitude);
            break;
        default:
            this.restProvider.customPopUp("Ooups", "une erreur est survenue veuillez reéessayer ultérieument", 'ok', null);


    }
    }
      });

    }

    //cette méthode insere la position de l'utilisateur en bdd
    postPositionUser(latitude :any,longitude:any) {
        if (latitude !== null && longitude !== null) {
            let data: any = "latitude=" + latitude + "&&longitude=" + longitude;

            this.restProvider.postPositionUser(data).subscribe(res => {
               // this.restProvider.customPopUp("position ", 'insertion effectuer', "Ok", null);

            }, (err: HttpErrorResponse) => {
                console.log(err.error);
                console.log(err.name);
                console.log(err.message);
                console.log(err.status);
            });

        }
    }

    //cette méthode met a jour la position de l'utilisateur en bdd
    putPositionUser(latitude : any,longitude :any){

      if (latitude !== null && longitude !== null) {
          let data: any = "latitude=" + latitude + "&&longitude=" + longitude;
          this.restProvider.putPositionUser(data).subscribe(res => {

              //this.restProvider.customPopUp("position ", 'mise a jour effectuer', "Ok", null);
          }, (err: HttpErrorResponse) => {
              console.log(err.error);
              console.log(err.name);
              console.log(err.message);
              console.log(err.status);
          });
      }
    }

    redirectToPageProfil(){



       this.navCtrl.push(ProfilMembresPage);



    }

    redidirectToPageMsg(){


        switch (this.checkIfHeaderMsgExist) {


            case true:
                this.putHeaderMsgUser(this.idRecepteur);
                break;
            case false:
                this.postHeaderMsgUser(this.idRecepteur);
                break;
            default:
                this.restProvider.customPopUp("Ooups", "une erreur est survenue veuillez reéessayer ultérieument", 'ok', null);


        }

        this.navCtrl.push(MessagePage);


    }

    //cette fonction permet de vérifier si l'utilisateur courant a été bloquer par un autre utilisateur
    //prend en argument l'id de l'utilisateur qui pourait l'avoir blocker
    getIfUserIsInBlacklist(idUserBlockant : number){


      this.restProvider.getIfUserIsInBlacklist(idUserBlockant).then(data => {

          //je stocke les imformations récupérer dans ma propriété resultatRecherche
          // console.log(data);

           this.checkifBlocked = data['verifBlacklist']
      });

    }


    //cette methode permet de savoir si l'utilisateur a deja eu une conversation avec un membre
    getIfHeaderMsgExist(idRecepteur : number){

      this.restProvider.getIfHeaderMsgExist(idRecepteur).then(data => {

          //je stocke les imformations récupérer dans ma propriété resultatRecherche
          console.log(data);

          this.checkIfHeaderMsgExist = data['verifHeaderMsg'];




      });


    }

    postHeaderMsgUser(idRecepteur : any){


     let data : any = "recepteur_id="+ idRecepteur;

      this.restProvider.postHeaderMsgUser(data).subscribe(res => {

          //this.restProvider.customPopUp("yathaaa ", 'insertion header msg complet ;-)', "Ok", null);
      }, (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.name);
          console.log(err.message);
          console.log(err.status);
      });




    }

    putHeaderMsgUser(idRecepteur : number){



        let data : any = "is_del=0";

        this.restProvider.putHeaderMsgUser(data,idRecepteur).subscribe(res => {

           // this.restProvider.customPopUp("yathaaa ", 'mise ajour reussi header msg complet ;-)', "Ok", null);
        }, (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.name);
            console.log(err.message);
            console.log(err.status);
        });


    }


    //cette methode recherche le perimetre choisie de l'utilisateur pour l'afficher sur la carte par default le perimetre est
    //egal a 3 si aucunne preference n'a été enregistré
    getPerimetreUser(){

        this.restProvider.getPerimetreUser().then(data => {

            //je stocke les imformations récupérer dans ma propriété resultatRecherche
            console.log(data);

            this.perimetreUser = data['perimetre'];

        });

    }

}
