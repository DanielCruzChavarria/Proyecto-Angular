import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() product: Product | null = null;
  @Input() title : string = '';
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() confirmActionEvent = new EventEmitter<string>();
}
