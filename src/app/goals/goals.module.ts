import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreateGoalModal } from './create-goal.modal';
import { UpdateGoalModal } from './update-goal.modal';
import { CheckGoalModal } from './check-goal.modal';
import { GoalCalendarModal } from './goal-calendar.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [CreateGoalModal, UpdateGoalModal, CheckGoalModal, GoalCalendarModal],
  exports: [CreateGoalModal, UpdateGoalModal, CheckGoalModal, GoalCalendarModal]
})
export class GoalsModule {}
