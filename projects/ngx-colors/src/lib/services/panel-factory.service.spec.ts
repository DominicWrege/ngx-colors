import { TestBed } from '@angular/core/testing';

import { PanelFactoryService } from './panel-factory.service';

describe('PanelFactoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanelFactoryService = TestBed.inject(PanelFactoryService);
    expect(service).toBeTruthy();
  });
});
