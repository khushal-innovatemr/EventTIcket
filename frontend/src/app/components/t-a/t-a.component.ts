import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-t-a',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './t-a.component.html',
  styleUrl: './t-a.component.css'
})
export class TAComponent {
  
amount:any;

  constructor(private router:Router,private eventService:EventService){}

ngOnInit():void{
  this.Amount();
}

  Amount():void{
    this.eventService.collectAmount().subscribe({
      next:((res:any) => {
        this.amount = res;
        console.log(res);
      })
    })
  }
}
