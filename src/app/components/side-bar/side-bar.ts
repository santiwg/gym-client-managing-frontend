import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css']
})
export class SideBar {
  isCollapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    const shouldCollapse = width < 768;

    if (this.isCollapsed !== shouldCollapse) {
      this.isCollapsed = shouldCollapse;
      this.collapsedChange.emit(this.isCollapsed);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  @Output() collapsedChange = new EventEmitter<boolean>();
}

