import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Stage} from '../models/stage';
import {Task} from '../models/task';
import {BackendService} from '../backend.service';
import {Subject, Subscription} from 'rxjs';
import {repeatWhen} from 'rxjs/operators';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, OnDestroy {

  @Input()
  stage: Stage;
  @Input()
  moveEnabled: boolean;

  @Output()
  moveTask: EventEmitter<Task> = new EventEmitter<Task>();

  getTasksByStageSubscription: Subscription;
  refreshStage = new Subject();

  isEdit = false;
  stageName: string;

  constructor(private service: BackendService) {

  }

  ngOnInit() {
    this.getTasksByStageSubscription = this.service
      .getTasksByStage(this.stage.id)
      .pipe(repeatWhen(() => this.refreshStage))
      .subscribe((tasks: Task[]) => this.stage.tasks = tasks);
  }

  addTask(task: Task) {
    task.stageId = this.stage.id;
    const newTaskSubscription = this.service
      .createNewTask(task)
      .subscribe(() => {
        this.refreshStage.next();
        newTaskSubscription.unsubscribe();
      });
  }

  onTaskMoved($event: Task) {
    this.stage.tasks = this.stage.tasks.filter(value => value !== $event);
    this.moveTask.emit($event);
  }

  ngOnDestroy(): void {
    this.getTasksByStageSubscription.unsubscribe();
  }

  onEditStart() {
    this.isEdit = true;
    this.stageName = this.stage.name;
  }

  onEditFinish() {
    this.isEdit = false;
    this.stage.name = this.stageName;
    const updateStageSubscription = this.service
      .updateStage(this.stage)
      .subscribe(() => updateStageSubscription.unsubscribe());
  }

  onEditCancel() {
    this.isEdit = false;
  }
}
