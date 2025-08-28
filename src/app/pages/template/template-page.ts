import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../components/side-bar/side-bar';
import { GlobalStatusService } from '../../services/global-status-service';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet, SideBar],
  templateUrl: './template-page.html',
  styleUrl: './template-page.css',
})
export class TemplatePage {
  constructor(private globalStatusService: GlobalStatusService) { }

  isLoading(): boolean {
    return this.globalStatusService.isLoading();
  }
}