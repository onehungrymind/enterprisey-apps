import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { mockEmptyUser, mockUser } from '@proto/testing';
import { UsersFacade } from '@proto/users-state';
import { UsersComponent } from './users.component';
describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let de: DebugElement;
  let usersFacade: UsersFacade;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, NoopAnimationsModule],
      providers: [provideMockStore({})],
    }).compileComponents();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    usersFacade = TestBed.inject(UsersFacade);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should on select call usersFacade selectUser', () => {
    const spy = jest.spyOn(usersFacade, 'selectUser');
    component.selectUser(mockUser);
    expect(spy).toHaveBeenCalledWith(mockUser.id);
  });
  describe('should on save call UsersFacade', () => {
    it('updateUser', () => {
      const spy = jest.spyOn(usersFacade, 'updateUser');
      component.saveUser(mockUser);
      expect(spy).toHaveBeenCalledWith(mockUser);
    });
    it('createUser', () => {
      const spy = jest.spyOn(usersFacade, 'createUser');
      component.saveUser(mockEmptyUser);
      expect(spy).toHaveBeenCalledWith(mockEmptyUser);
    });
  });
  it('should on delete call UsersFacade deleteUser', () => {
    const spy = jest.spyOn(usersFacade, 'deleteUser');
    component.deleteUser(mockUser);
    expect(spy).toHaveBeenCalledWith(mockUser);
  });
});
