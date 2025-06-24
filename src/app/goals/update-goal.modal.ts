import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { supabase } from '../supabase';

@Component({
  selector: 'app-update-goal-modal',
  templateUrl: './update-goal.modal.html',
  styleUrls: ['./update-goal.modal.scss'],
})
export class UpdateGoalModal {
  @Input() goal: any = null;
  nombre: string = '';
  inicio: string = '';
  duracion: number | null = null;
  descripcion: string = '';

  ngOnInit() {
    if (this.goal) {
      this.nombre = this.goal.nombre;
      this.inicio = this.goal.inicio;
      this.duracion = this.goal.duracion;
      this.descripcion = this.goal.descripcion;
    }
  }

  async updateGoal() {
    if (!this.goal) return;
    const { error } = await supabase
      .from('goals')
      .update({ nombre: this.nombre, inicio: this.inicio, duracion: this.duracion, descripcion: this.descripcion })
      .eq('id', this.goal.id);
    if (!error) this.dismiss(true);
  }

  dismiss(success = false) {
    this.modalController.dismiss(success);
  }

  constructor(private modalController: ModalController) {}
}
