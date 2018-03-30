import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class NotificationHelper {

    constructor(public toastCtrl: ToastController, public alertCtrl: AlertController) {
        
    }

    showToast(message: string, position: string, duration: any, showCloseButton: boolean) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: position,
            showCloseButton: showCloseButton,
        });

        toast.present(toast);
    }
    showAlert(title: string, subTitle: string, buttons: string[]) {
        let alert = this.alertCtrl.create({

            title: title,
            subTitle: subTitle,
            buttons: buttons
        });
        alert.present();
    }
    showAlertWithDialog(param:any) {
        let confirm = this.alertCtrl.create({
            title: param.title,
            message: param.message,
            buttons: param.buttons
        });
        confirm.present();
    }
}