import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  title = 'About Our Team';
  mission = 'We build delightful software';

  photoUrl = 'https://kartinki.pibig.info/uploads/posts/2023-04/1681968142_kartinki-pibig-info-p-biznes-komanda-kartinki-arti-vkontakte-1.png';
  isButtonDisabled = false;

  likes = 0;
  showMessage = false;

  name = '';
  email = '';
  subscribed = false;

  addLike() {
    this.likes++;
  }

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

  subscribe() {
    if (this.email) {
      this.subscribed = true;
    }
  }
}
