
import { Component, computed, effect, signal } from '@angular/core';
import type {
  Actividad,
  EstadoActividad,
  FiltroEstado,
  FiltroPrioridad,
  Prioridad
} from '../modelos/actividad';

@Component({
  selector: 'app-tablero-prioridades',
  templateUrl: './tablero-prioridades.html',
  styleUrl: './tablero-prioridades.css'
})
export class TableroPrioridades {
  protected readonly actividades = signal<Actividad[]>([
    { id: 1, titulo: 'Preparar estructura HTML', estado: 'completada', prioridad: 'alta', creadaEn: '2026-08-10', destacada: false },
    { id: 2, titulo: 'Revisar contraste', estado: 'en_progreso', prioridad: 'media', creadaEn: '2026-08-12', destacada: true },
    { id: 3, titulo: 'Practicar TypeScript', estado: 'pendiente', prioridad: 'alta', creadaEn: '2026-08-14', destacada: false },
    { id: 4, titulo: 'Comprobar vista estrecha', estado: 'pendiente', prioridad: 'baja', creadaEn: '2026-08-16', destacada: false },
    { id: 5, titulo: 'Ejecutar el build', estado: 'pendiente', prioridad: 'media', creadaEn: '2026-08-18', destacada: false }
  ]);

  protected readonly busqueda = signal('');
  protected readonly filtroEstado = signal<FiltroEstado>('todas');
  protected readonly filtroPrioridad = signal<FiltroPrioridad>('todas');
  protected readonly seleccionadaId = signal<number | null>(null);

  protected readonly total = computed(() => this.actividades().length);
  protected readonly pendientes = computed(() =>
    this.actividades().filter(a => a.estado === 'pendiente').length
  );
  protected readonly enProgreso = computed(() =>
    this.actividades().filter(a => a.estado === 'en_progreso').length
  );
  protected readonly completadas = computed(() =>
    this.actividades().filter(a => a.estado === 'completada').length
  );
  protected readonly destacadas = computed(() =>
    this.actividades().filter(a => a.destacada).length
  );

  protected readonly actividadesFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    return this.actividades().filter(a =>
      a.titulo.toLowerCase().includes(texto) &&
      (this.filtroEstado() === 'todas' || a.estado === this.filtroEstado()) &&
      (this.filtroPrioridad() === 'todas' || a.prioridad === this.filtroPrioridad())
    );
  });

  protected readonly actividadSeleccionada = computed(() =>
    this.actividades().find(a => a.id === this.seleccionadaId()) ?? null
  );

  constructor() {
    effect(() => {
      console.log('Tablero actualizado:', this.actividades().length, 'actividades');
    });
  }

  protected cambiarBusqueda(valor: string): void {
    this.busqueda.set(valor);
  }

  protected cambiarEstadoFiltro(valor: string): void {
    this.filtroEstado.set(valor as FiltroEstado);
  }

  protected cambiarPrioridadFiltro(valor: string): void {
    this.filtroPrioridad.set(valor as FiltroPrioridad);
  }

  protected seleccionar(id: number): void {
    this.seleccionadaId.set(id);
  }

  protected alternarDestacada(id: number): void {
    this.actividades.update(lista =>
      lista.map(a => a.id === id ? { ...a, destacada: !a.destacada } : a)
    );
  }

  protected avanzarEstado(id: number): void {
    const siguiente: Record<EstadoActividad, EstadoActividad> = {
      pendiente: 'en_progreso',
      en_progreso: 'completada',
      completada: 'completada'
    };

    this.actividades.update(lista =>
      lista.map(a => a.id === id ? { ...a, estado: siguiente[a.estado] } : a)
    );
  }

  protected eliminar(id: number): void {
    this.actividades.update(lista => lista.filter(a => a.id !== id));
    if (this.seleccionadaId() === id) {
      this.seleccionadaId.set(null);
    }
  }

  protected reiniciar(): void {
    this.actividades.set([
      { id: 1, titulo: 'Preparar estructura HTML', estado: 'completada', prioridad: 'alta', creadaEn: '2026-08-10', destacada: false },
      { id: 2, titulo: 'Revisar contraste', estado: 'en_progreso', prioridad: 'media', creadaEn: '2026-08-12', destacada: true },
      { id: 3, titulo: 'Practicar TypeScript', estado: 'pendiente', prioridad: 'alta', creadaEn: '2026-08-14', destacada: false },
      { id: 4, titulo: 'Comprobar vista estrecha', estado: 'pendiente', prioridad: 'baja', creadaEn: '2026-08-16', destacada: false },
      { id: 5, titulo: 'Ejecutar el build', estado: 'pendiente', prioridad: 'media', creadaEn: '2026-08-18', destacada: false }
    ]);
    this.busqueda.set('');
    this.filtroEstado.set('todas');
    this.filtroPrioridad.set('todas');
    this.seleccionadaId.set(null);
  }
}
