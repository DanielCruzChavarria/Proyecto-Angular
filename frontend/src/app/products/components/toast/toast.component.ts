import { Component } from '@angular/core';
import { ToastType, ToastPosition } from '../../models/toast-model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  public showToast: boolean = false;
  public message: string = '';
  public toastType: ToastType = 'success';
  public toastPosition: ToastPosition = 'bottom-center';

  showToastMessage(
    message: string,
    type: ToastType = 'success',
    position: ToastPosition = 'bottom-center'
  ) {

    this.message = message;
    this.toastType = type;
    this.toastPosition = position;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000); // Oculta el toast después de 3 segundos
  }
}
