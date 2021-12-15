import { Component, OnInit } from '@angular/core';
import { Dialog } from '@capacitor/dialog';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  async showAlert(title, message){
    await Dialog.alert({
      title: title,
      message: message,
    });
  };

  ngOnInit() {

    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On succcess, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        alert('Push registration success, token: ' + token.value);
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        var audio1 = new Audio('assets/audio.mp3');
        console.log('Audio');
        audio1.play();
        //alert('Push received: ' + JSON.stringify(notification));
        //this.ekle(notification.id, notification.title, notification.body);
        console.log('Push received: ', notification);
       this.showAlert(notification.title, notification.body);

      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
        console.log('Push action performed: ' + notification);
        //this.ekle(notification.notification.id, notification.notification.title, notification.notification.body);
      }
    );
  }


}
