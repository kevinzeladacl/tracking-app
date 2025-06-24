import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { DirectoryService } from '../services/directory.service';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';


/**
 * Registro del plugin de geolocalización en segundo plano proveniente de la comunidad de Capacitor.
 */

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  providers: [DatePipe]
})
export class TabsPage implements OnInit, OnDestroy {
  /**
   * Información del perfil del usuario.
   */
  profileDataInfo: any;



  /**
   * Información de notificaciones y su conteo.
   */
  notificationDataInfo: any;      // Almacena el conjunto de notificaciones recibidas
  notificationUnRead: number = 0; // Cantidad de notificaciones no leídas
  notifications: any[] = [];

  /**
   * Parámetro de entrada para calificación (se mantiene por compatibilidad).
   */
  @Input() rank!: number;

  /**
   * Loader (spinner) de Ionic para bloquear la UI durante llamadas asíncronas.
   */
  private loader: HTMLIonLoadingElement | null = null;

  /**
   * Constructor de la clase.
   * Inicializa los servicios requeridos, controla la obtención del vehículo,
   * y verifica sesión en localStorage (redireccionando a login si no hay credenciales).
   */
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private router: Router,
    private directoryService: DirectoryService,
    private datePipe: DatePipe,
    private loadingController: LoadingController // <-- se inyecta el LoadingController
  ) {
    // Verificación de sesión con Supabase
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  /**
   * Hook de inicialización del componente.
   * Llama información de perfil, notificaciones,
   * e inicializa los intervalos de rastreo.
   */
  ngOnInit() {
    // this.profileInfo();           // Carga la información del perfil del usuario    

    this.loadNotifications();

  }


  ngOnDestroy() {

  }

  /**
   * ==============================
   *       MÉTODOS DEL COMPONENTE
   * ==============================
   */

  /**
   * Muestra un loader con un mensaje opcional.
   */
  private async presentLoader(message: string = 'Cargando...') {
    if (this.loader) return; // Evita crear dos loaders simultáneos
    this.loader = await this.loadingController.create({ message });
    await this.loader.present();
  }

  /**
   * Oculta el loader si está activo.
   */
  private async dismissLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }



  /**
   * Obtiene la información de perfil del usuario, la guarda en localStorage,
   * y determina si el usuario está validado.
   */
  async profileInfo() {
    try {
      const pkUser = localStorage.getItem('pkUserGetGo');
      if (!pkUser) {
        throw new Error('No se encontró el pkUser en el almacenamiento local.');
      }

      const tkUserGetGo = localStorage.getItem('tkUserGetGo');
      if (!tkUserGetGo) {
        throw new Error('No se encontró el tkUserGetGo en el almacenamiento local.');
      }

      console.log("PROFILE")
      // this.profileDataInfo = await this.authService.getUserInfo(tkUserGetGo, pkUser).toPromise();


      localStorage.setItem('profileInfo', JSON.stringify(this.profileDataInfo));

    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
    } finally {
      await this.dismissLoader(); // <-- ocultar loader
    }
  }



  loadNotifications() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
      const dataUser = JSON.parse(storedData);
      const user_id = dataUser.user.id;

      // Llamada al servicio para obtener notificaciones
      this.directoryService.getNotifications(user_id).subscribe(
        (res: any) => {
          console.log('Notificaciones cargadas:', res);
          this.notifications = res.data ? res.data : res;

          // Actualiza el contador de notificaciones no leídas
          this.notificationUnRead = this.notifications.filter(n => !n.read
            && n.type !== 'notification').length;

        },
        (error) => {
          console.error('Error al cargar notificaciones:', error);
        }
      );
    }
  }





}
