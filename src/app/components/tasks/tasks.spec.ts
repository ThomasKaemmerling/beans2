import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksComponent } from './tasks';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a task', () => {
    component.addTask('Test task');
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].text).toBe('Test task');
  });

  it('should calculate beans earned correctly', () => {
    component.addTask('Task 1');
    component.addTask('Task 2');
    component.tasks[0].completed = true;
    component.tasks[1].completed = true;
    component['calculateBeansEarned']();
    expect(component.beansEarned).toBe(4); // 2 tasks * 2 beans each
  });
});
