import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-goal-calendar-modal',
  templateUrl: './goal-calendar.modal.html',
  styleUrls: ['./goal-calendar.modal.scss'],
})
export class GoalCalendarModal {
  @Input() checkins: any[] = [];
  @Input() goal: any;

  get markedDates(): string[] {
    return this.checkins.map(c => c.checked_at.split('T')[0]);
  }

  get daysConfig() {
    return this.markedDates.map(date => ({ date: new Date(date), cssClass: 'marked-day' }));
  }

  dismiss() {
    this.modalController.dismiss();
  }

  constructor(private modalController: ModalController) {}
}
