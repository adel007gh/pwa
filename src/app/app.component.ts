import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallPwaComponent } from "./install-pwa/install-pwa.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InstallPwaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pwa';
}
