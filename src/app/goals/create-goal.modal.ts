import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { supabase } from '../supabase';

@Component({
  selector: 'app-create-goal-modal',
  templateUrl: './create-goal.modal.html',
  styleUrls: ['./create-goal.modal.scss'],
})
export class CreateGoalModal {
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

  async saveGoal() {
    const usuario_id = JSON.parse(localStorage.getItem('user_data') || '{}').id;
    if (this.goal) {
      // Edición
      const { error } = await supabase
        .from('goals')
        .update({ nombre: this.nombre, inicio: this.inicio, duracion: this.duracion, descripcion: this.descripcion })
        .eq('id', this.goal.id);
      if (!error) this.dismiss(true);
    } else {
      // Creación
      const { error } = await supabase
        .from('goals')
        .insert([{ nombre: this.nombre, inicio: this.inicio, duracion: this.duracion, descripcion: this.descripcion, usuario_id }]);
      if (!error) this.dismiss(true);
    }
  }

  dismiss(success = false) {
    this.modalController.dismiss(success);
  }

  constructor(private modalController: ModalController) {}
}
