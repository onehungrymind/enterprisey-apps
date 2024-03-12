import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromWorkshops from './state/workshops.reducer';
import { WorkshopsEffects } from './state/workshops.effects';
import { WorkshopsFacade } from './state/workshops.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromWorkshops.WORKSHOPS_FEATURE_KEY,
      fromWorkshops.workshopsReducer
    ),
    EffectsModule.forFeature([WorkshopsEffects]),
  ],
  providers: [WorkshopsFacade],
})
export class WorkshopsStateModule {}
