import { Component } from '@angular/core';

// Modelo para la persona
export class Persona {
  id: number | undefined;
  nombre: string | undefined;
  edad: number | undefined;
  email: string | undefined;
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {
  // Variable para controlar la visualización de la tabla de personas
  mostrarTablaPersonas2: boolean = true;

  // Propiedades para el CRUD de personas
  personas: Persona[] = [];
  nuevaPersona: Persona = new Persona();
  editandoPersona: boolean = false;
  indiceEditandoPersona: number = -1;

  // Variables para controlar las validaciones del formulario
  nombreValido: boolean = true;
  edadValida: boolean = true;
  correoValido: boolean = true;

  // Función para guardar una persona (agregar/editar)
  guardarPersona() {
    // Validar el nombre, la edad y el correo antes de guardar la persona
    this.nombreValido = this.nuevaPersona.nombre !== undefined && this.nuevaPersona.nombre.trim() !== '';
    this.edadValida = this.nuevaPersona.edad !== undefined && this.nuevaPersona.edad >= 18;
    this.correoValido = this.nuevaPersona.email !== undefined && this.isValidEmail(this.nuevaPersona.email);

    // Si todos los campos son válidos, guardar la persona
    if (this.nombreValido && this.edadValida && this.correoValido) {
      // Asignar un nuevo ID único a la persona
      if (this.personas.length === 0) {
        this.nuevaPersona.id = 1;
      } else {
        const lastPersonaId = this.personas[this.personas.length - 1].id || 0;
        this.nuevaPersona.id = lastPersonaId + 1;
      }

      // Si estamos editando, reemplazamos la persona en el arreglo
      if (this.editandoPersona && this.indiceEditandoPersona !== -1) {
        this.personas[this.indiceEditandoPersona] = this.nuevaPersona;
        this.editandoPersona = false;
        this.indiceEditandoPersona = -1;
      } else {
        // Si no estamos editando, agregamos la nueva persona al arreglo
        this.personas.push(this.nuevaPersona);
      }

      // Limpiar los campos para agregar/editar una nueva persona
      this.nuevaPersona = new Persona();
    }
  }

  // Función para validar el formato de un correo electrónico
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para editar una persona
  editarPersona(indice: number) {
    this.editandoPersona = true;
    this.indiceEditandoPersona = indice;
    this.nuevaPersona = { ...this.personas[indice] };
  }

  // Función para eliminar una persona
  eliminarPersona(indice: number) {
    this.personas.splice(indice, 1);
  }

  // Función para mostrar la tabla de personas
  mostrarTablaPersonas() {
    this.mostrarTablaPersonas2 = true;
  }

  // Función para ocultar la tabla de personas
  ocultarTablaPersonas() {
    this.mostrarTablaPersonas2 = false;
  }
}
