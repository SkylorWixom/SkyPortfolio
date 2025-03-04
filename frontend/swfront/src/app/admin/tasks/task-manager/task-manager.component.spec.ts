import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TaskManagerComponent } from './task-manager.component';
import { TasksService } from '../../../services/task/task.service'; // Updated path to match component
import { of } from 'rxjs';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;
  let taskServiceSpy: jasmine.SpyObj<TasksService>; // Updated type

  beforeEach(async () => {
    // Create TasksService spy with the correct method names
    const spy = jasmine.createSpyObj('TasksService', ['getAllTasks', 'createTask', 'updateTask', 'deleteTask']);
    
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [TaskManagerComponent],
      providers: [
        { provide: TasksService, useValue: spy } // Updated service name
      ]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>; // Updated type
    
    // Configure spy default responses with correct method names
    taskServiceSpy.getAllTasks.and.returnValue(of([]));
    taskServiceSpy.createTask.and.returnValue(of({}));
    taskServiceSpy.updateTask.and.returnValue(of({}));
    taskServiceSpy.deleteTask.and.returnValue(of({}));

    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    
    // Initialize component properties that are used in the template
    component.successMessage = '';
    component.errorMessage = '';
    component.editMode = false;
    component.newTask = {
      _id: '',
      title: '',
      details: '',
      status: 'pending'
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on initialization', () => {
    expect(taskServiceSpy.getAllTasks).toHaveBeenCalled(); // Updated method name
  });

  it('should save a new task', () => {
    component.newTask = {
      _id: '',
      title: 'Test Task',
      details: 'Task details',
      status: 'active'
    };

    component.saveTask();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(component.newTask);
  });

  it('should update an existing task in edit mode', () => {
    component.editMode = true;
    component.newTask = {
      _id: '123',
      title: 'Updated Task',
      details: 'Updated details',
      status: 'completed'
    };

    component.saveTask();
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('123', component.newTask);
  });

  it('should cancel edit mode', () => {
    component.editMode = true;
    component.cancelEdit();
    expect(component.editMode).toBeFalse();
  });

  it('should set up edit mode when editing a task', () => {
    const task = {
      _id: '123',
      title: 'Test Task',
      details: 'Task details',
      status: 'active'
    };

    component.editTask(task);
    expect(component.editMode).toBeTrue();
    expect(component.newTask).toEqual(task);
  });

  it('should delete a task', () => {
    component.deleteTask('123');
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('123');
  });
});
