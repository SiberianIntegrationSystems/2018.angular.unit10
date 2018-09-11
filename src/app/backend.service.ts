import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Stage} from './models/stage';
import {Task} from './models/task';

@Injectable()
export class BackendService {

  url = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  getStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.url + 'stages');
  }

  getTasksByStage(stageId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}stages/${stageId}/tasks`);
  }

  createNewTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url + 'tasks', task);
  }

  updateStage(stage: Stage): Observable<Stage> {
    return this.http.put<Stage>(this.url + 'stages/' + stage.id, stage);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(this.url + 'tasks/' + id);
  }
}
