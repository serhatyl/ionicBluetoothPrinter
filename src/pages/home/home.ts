import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  constructor(private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController) {
    bluetoothSerial.enable();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        // alert(element.name);
      });
    },
      (err) => {
        console.log(err);
      })

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      })
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any) {
    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();
  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }




  sendDataToSerial() {
    // this.bluetoothSerial.write('{D0931,0480,0601|}
    // {C|}
    // {PC00;0071,0131,1,1,A,00,B=Örnek Yazı|}
    // {LC;0000,0180,0480,0185,0,3|}
    // {XB00;0091,0440,A,3,03,0,0128,+0000000000,000,1,00=>512345678|}
    // {XS;I,0001,0002C1011|}')
    this.bluetoothSerial.write(
      this.write()
    ).then((success) => {

    }, (failure) => {

    });
  }


  declareLabelSize(pitchLengthOfLabel, effectivePrintWidth, effectivePrintLength): string {
    return '{D' + pitchLengthOfLabel + ',' + effectivePrintWidth + ',' + effectivePrintLength + '|}';
  }

  cleanBuffer(): string {
    return '{C|}';
  }

  printWriteCommand(id: string, x: string, y: string, text: string): string {
    // {PC000;0071,0131,1,1,S,00,B=Ornek Yaz|}  
    return '{PC' + id + ';' + y + ',' + x + ',' + '1' + ',' + '1' + ',' + 'O' + ',' + '00' + ',' + 'B=' + text + '|}';
  }

  printDrawLine(xStartPoint, yStartPoint, xEndPoint, yEndPoint): string {
    return '{LC;' + yStartPoint + ',' + xStartPoint + ',' + yEndPoint + ',' + xEndPoint + ',' + '0' + ',' + '3|}';
  }

  generateBarcode(barcodeTotalNumber, x, y, rotationAngleOfBarcode, barcodeNumber): string {
    // {XB00;0091,0440,A,3,03,0,0128,+0000000000,000,1,00=>512345678|}
    return '{XB' + barcodeTotalNumber + ';' + x + ',' + y + ',' + 'A,3,03,' + rotationAngleOfBarcode + ',0128,+0000000000,000,1,00=>5' + barcodeNumber + '|}';
  }

  printConditions(): string {
    return '{XS;I,0001,0002C1011|}';
  }

  write(): string {
    let toshibaPrintScript: string =
      this.declareLabelSize('0700', '0700', '0690') +
      this.cleanBuffer() +
      this.printWriteCommand('00', '0050', '0010', 'Gonderici Adresi') +
      this.printWriteCommand('01', '0100', '0010', 'Resitpasa Mahallesi Katar Caddesi') +
      this.printWriteCommand('02', '0150', '0010', 'No:4/B3 Sariyer/Istanbul') +
      this.printDrawLine('0160', '0000', '0160', '2000') +
      this.printWriteCommand('03', '0200', '0010', 'Alici Adresi') +
      this.printWriteCommand('04', '0250', '0010', 'Yenikoy Mahallesi Doganlar Caddesi') +
      this.printWriteCommand('05', '0300', '0010', 'No:12/2 Savsat/Artvin') +
      this.printDrawLine('0310', '0000', '0310', '2000') +
      this.generateBarcode('00', '0200', '0460', '0', '12345678') +
      this.printConditions();
    return toshibaPrintScript;
  }


}













// {D0931,0480,0901|}
// {C|}
// {PC000;0071,0131,1,1,S,00,B=™rnek YazÕ|}
// {XB00;0091,0238,A,3,03,0,0128,+0000000000,000,1,00=>512345678|}
// {XS;I,0001,0002C1011|}