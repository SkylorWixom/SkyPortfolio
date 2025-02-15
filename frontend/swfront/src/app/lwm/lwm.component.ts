import { Component } from '@angular/core';

@Component({
  selector: 'app-learn-with-me',
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css']
})
export class LwmComponent {
  onSubscribe() {
    alert('Thank you for your interest! Subscription feature coming soon.');
  }
}
