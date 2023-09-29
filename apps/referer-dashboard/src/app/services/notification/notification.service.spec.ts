import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { SharedModule } from '@shared/modules/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, BrowserAnimationsModule],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call info() with proper arguments', () => {
    spyOn(service, 'info').and.callThrough();
    service.info('test');
    expect(service.info).toHaveBeenCalledWith('test');
  });

  it('should call error() with proper arguments', () => {
    spyOn(service, 'error').and.callThrough();
    service.error('testError');
    expect(service.error).toHaveBeenCalledWith('testError');
  });
});
