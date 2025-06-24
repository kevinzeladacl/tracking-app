import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { supabase } from '../supabase';

@Component({
  selector: 'app-check-goal-modal',
  templateUrl: './check-goal.modal.html',
  styleUrls: ['./check-goal.modal.scss'],
})
export class CheckGoalModal {
  @Input() goal: any = null;
  fecha: string = new Date().toISOString();
  usuario_id: string = '';

  ngOnInit() {
    this.usuario_id = JSON.parse(localStorage.getItem('user_data') || '{}').id;
  }

  async checkGoal() {
    if (!this.goal) return;
    // Validar si ya existe un check-in para este día
    const fechaDia = this.fecha.split('T')[0];
    const { data: existentes, error: errorExist } = await supabase
      .from('goals_tracking')
      .select('*')
      .eq('goal_id', this.goal.id)
      .eq('usuario_id', this.usuario_id)
      .gte('checked_at', fechaDia + 'T00:00:00')
      .lte('checked_at', fechaDia + 'T23:59:59');
    if (existentes && existentes.length > 0) {
      alert('Ya has marcado esta meta como realizada hoy.');
      return;
    }
    const { error } = await supabase
      .from('goals_tracking')
      .insert([{ goal_id: this.goal.id, usuario_id: this.usuario_id, checked_at: this.fecha }]);
    if (!error) this.dismiss(true);
  }

  dismiss(success = false) {
    this.modalController.dismiss(success);
  }

  constructor(private modalController: ModalController) {}
}
