import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  redirectTo: string = '';

  constructor(private navCtrl: NavController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Obtener el parámetro de redirección
    this.activatedRoute.queryParams.subscribe(params => {
      this.redirectTo = params['redirectTo'] || '/home'; // Ruta por defecto '/home'
    });

    // Mostrar el loader y redirigir después de 3 segundos
    setTimeout(() => {
      this.navCtrl.navigateRoot(this.redirectTo); // Navegación usando setRoot
    }, 3000);
  }

}
