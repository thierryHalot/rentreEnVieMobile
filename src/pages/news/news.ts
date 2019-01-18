import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  tabNews : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private restProvider : RestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }
    ionViewDidEnter(){
    this.getAllNews();
    }

    getAllNews(){

        this.restProvider.getAllNews().then(data => {

            console.log(data);

            this.tabNews = data;

        });
    }
}
