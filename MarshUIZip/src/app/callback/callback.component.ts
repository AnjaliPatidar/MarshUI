import { Component } from '@angular/core';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, OktaCallbackComponent],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent {

}
