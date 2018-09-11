import {Component, OnInit} from '@angular/core';
import {Task} from '../models/task';
import {ActivatedRoute} from '@angular/router';
import {BackendService} from '../backend.service';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit {

  task: Task;

  constructor(private route: ActivatedRoute,
              private backend: BackendService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => params.id),
        switchMap(id => this.backend.getTask(id))
      )
      .subscribe(task => this.task = task);
    console.log('I`m initialized');
  }

}
