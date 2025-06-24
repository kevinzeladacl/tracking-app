import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../services/directory.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: any[] = [];

  constructor(
    private directoryService: DirectoryService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  ionViewWillEnter() {
    this.loadNotifications();
    console.log("ENTER")
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
        },
        (error) => {
          console.error('Error al cargar notificaciones:', error);
        }
      );
    }
  }

  saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  markAsRead(id_notification: any) {
    // Enviar la petición para marcar como leída
    const data = {
      "is_read": true
    };

    this.directoryService.readNotification(id_notification, data).subscribe(
      (res: any) => {
        console.log('Notificación marcada como leída:', res);
        // Actualiza la notificación en el array local
        const notification = this.notifications.find(n => n.id === id_notification);
        if (notification) {
          notification.read = true;
        }
        this.loadNotifications();
      },
      (error) => {
        console.error('Error al marcar notificación como leída:', error);
      }
    );
  }

  markAllAsRead() {
    this.notifications.forEach(notification => notification.read = true);
    this.saveNotifications();
  }

  postNotification() {
    // Obtener datos de usuario almacenados en localStorage
    const storedData = localStorage.getItem('data');
    if (storedData) {
      const dataUser = JSON.parse(storedData);
      const user_id = dataUser.user.id;

      const notification = {
        user_id: user_id,
        title: "Notificación de prueba",
        message: "Este es un mensaje de prueba"
      };

      // Llamada al servicio para crear la notificación
      this.directoryService.postNotification(notification).subscribe(
        (res: any) => {
          console.log('Notificación creada:', res);
          // Agregar la notificación creada al array local
          this.notifications.push(res.data ? res.data : res);
          this.saveNotifications();
        },
        (error) => {
          console.error('Error al crear notificación:', error);
        }
      );
    } else {
      console.error('No se encontraron datos de usuario en localStorage.');
    }
  }
}
