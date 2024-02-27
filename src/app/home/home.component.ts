import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() urlChange = new EventEmitter<string>();
  url = 'Loading...';

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.emitUrl();
    this.urlChange.emit(this.url);
    console.log('HomeComponent INIT');
    (window as any).api.onUpdateURL((value: string) => {
      console.log('js updated:' + value);
      this.url = value;
      this.emitUrl();
    });
  }

  back(): void {
    console.log('js:back');
    (window as any).api.back();
  }

  forward(): void {
    console.log('js:forward');
    (window as any).api.forward();
  }

  private emitUrl(): void {
    this.urlChange.emit(this.url);
    this.cdr.detectChanges();
  }
}
