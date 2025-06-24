import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { supabase } from '../supabase';
import { CreateGoalModal } from '../goals/create-goal.modal';
import { UpdateGoalModal } from '../goals/update-goal.modal';
import { CheckGoalModal } from '../goals/check-goal.modal';
import { GoalCalendarModal } from '../goals/goal-calendar.modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  viewMode: 'detalle' | 'simple' = 'detalle';

  toggleViewMode() {
    this.viewMode = this.viewMode === 'detalle' ? 'simple' : 'detalle';
  }
  goals: any[] = [];
  userId: string = '';
  checkins: { [goalId: string]: any[] } = {};

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;
    await this.loadGoals();
  }

  async ionViewWillEnter() {
    await this.loadGoals();
  }

  async loadGoals() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('usuario_id', this.userId)
      .order('inicio', { ascending: false });
    this.goals = data || [];
    await this.loadAllCheckins();
  }

  async loadAllCheckins() {
    // Carga el historial de check-ins para todas las metas
    this.checkins = {};
    for (const goal of this.goals) {
      this.checkins[goal.id] = await this.loadGoalCheckins(goal.id);
    }
  }

  async loadGoalCheckins(goalId: string) {
    const { data, error } = await supabase
      .from('goals_tracking')
      .select('*')
      .eq('goal_id', goalId)
      .order('checked_at', { ascending: false });
    return data || [];
  }

  async openCreateGoal(goal: any = null) {
    const modal = await this.modalController.create({
      component: CreateGoalModal,
      componentProps: { goal }
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) this.loadGoals();
    });
    await modal.present();
  }

  async openUpdateGoal(goal: any) {
    console.log("open update goal", goal);
    const modal = await this.modalController.create({
      component: UpdateGoalModal,
      componentProps: { goal }
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) this.loadGoals();
    });
    await modal.present();
  }

  async openCheckGoal(goal: any) {
    console.log("open goal", goal);
    const modal = await this.modalController.create({
      component: CheckGoalModal,
      componentProps: { goal }
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) this.loadGoals();
    });
    await modal.present();
  }

  // Ejemplo: obtener cuántos días ha sido marcada la meta
  getGoalCheckCount(goalId: string): number {
    return this.checkins[goalId]?.length || 0;
  }

  // Ejemplo: obtener la última fecha de check-in
  getLastCheckinDate(goalId: string): string {
    return this.checkins[goalId]?.[0]?.checked_at || '';
  }

  // Total de días marcados
  getGoalTotalDays(goalId: string): number {
    return this.checkins[goalId]?.length || 0;
  }

  // Racha de días consecutivos
  getGoalStreak(goalId: string): number {
    const checkins = (this.checkins[goalId] || [])
      .map(c => c.checked_at.split('T')[0])
      .sort((a, b) => a.localeCompare(b));
    if (checkins.length === 0) return 0;
    let streak = 1;
    let maxStreak = 1;
    for (let i = checkins.length - 2; i >= 0; i--) {
      const d1 = new Date(checkins[i+1]);
      const d0 = new Date(checkins[i]);
      const diff = (d1.getTime() - d0.getTime()) / (1000*60*60*24);
      if (diff === 1) {
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else if (diff > 1) {
        streak = 1;
      }
    }
    // Si el último check-in es hoy o ayer, la racha es válida
    const last = new Date(checkins[checkins.length-1]);
    const now = new Date();
    const diffLast = Math.floor((now.getTime() - last.getTime()) / (1000*60*60*24));
    if (diffLast > 1) return 0;
    return streak;
  }

  async openGoalCalendar(goal: any) {
    const modal = await this.modalController.create({
      component: GoalCalendarModal,
      componentProps: {
        goal,
        checkins: this.checkins[goal.id] || []
      }
    });
    await modal.present();
  }
}


