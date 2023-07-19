import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Importar el modelo Departamento
export class Departamento {
  id: number | undefined;
  nombre: string | undefined;
  precioEnUF: number | undefined;
  cantidad: number | undefined;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-dream-app';
  nombre: string = '';
  comentario: string = '';
  apellido: string = '';
  email: string = '';
  arriendoUFValue: number | undefined;
  quantity1: number = 0;
  total1: number = 0;
  quantity2: number = 0;
  total2: number = 0;
  quantity3: number = 0;
  total3: number = 0;
  precioEnUF1: number = 0; // Precio en UF para la primera imagen
  precioEnUF2: number = 0; // Precio en UF para la segunda imagen
  precioEnUF3: number = 0; // Precio en UF para la tercera imagen

  // Funcionalidad CRUD con lista de departamentos
  departamentos: Departamento[] = [];
  nuevoDepartamento: Departamento = new Departamento();
  editando: boolean = false;
  indiceEditando: number = -1;

  // Variable para controlar la visualización de la tabla
  mostrarTablaDepartamentos: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getArriendoUFValue();
  }

  getArriendoUFValue() {
    console.log('Llamando a getArriendoUFValue()');
    this.http.get<any>('https://mindicador.cl/api').subscribe(
      data => {
        console.log('Respuesta de la API:', data);
        const ufValue = data.uf.valor; // Obtener el valor de UF desde la respuesta de la API
        this.arriendoUFValue = ufValue;
        console.log('Valor de arriendoUFValue:', this.arriendoUFValue);
        this.updatePrecioEnUF();
      },
      error => {
        console.error('Error al obtener el valor del arriendo en UF:', error);
      }
    );
  }

  updatePrecioEnUF() {
    if (this.arriendoUFValue) {
      const valorCLP1 = 100000; // Valor en CLP para la primera tarjeta
      const valorCLP2 = 200000; // Valor en CLP para la segunda tarjeta
      const valorCLP3 = 300000; // Valor en CLP para la tercera tarjeta

      this.precioEnUF1 = Number((valorCLP1 / this.arriendoUFValue).toFixed(2));
      this.precioEnUF2 = Number((valorCLP2 / this.arriendoUFValue).toFixed(2));
      this.precioEnUF3 = Number((valorCLP3 / this.arriendoUFValue).toFixed(2));
    }
  }

  incrementQuantity1() {
    this.quantity1++;
    this.updateTotal1();
  }

  decrementQuantity1() {
    if (this.quantity1 > 0) {
      this.quantity1--;
      this.updateTotal1();
    }
  }

  updateTotal1() {
    this.total1 = this.quantity1 * this.precioEnUF1;
  }

  incrementQuantity2() {
    this.quantity2++;
    this.updateTotal2();
  }

  decrementQuantity2() {
    if (this.quantity2 > 0) {
      this.quantity2--;
      this.updateTotal2();
    }
  }

  updateTotal2() {
    this.total2 = this.quantity2 * this.precioEnUF2;
  }

  incrementQuantity3() {
    this.quantity3++;
    this.updateTotal3();
  }

  decrementQuantity3() {
    if (this.quantity3 > 0) {
      this.quantity3--;
      this.updateTotal3();
    }
  }

  updateTotal3() {
    this.total3 = this.quantity3 * this.precioEnUF3;
  }

  enviarFormulario() {
    // Validar los campos del formulario
    if (this.nombre === '' || this.apellido === '' || this.email === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Por favor, ingrese una dirección de correo electrónico válida.');
      return;
    }

    if (this.comentario === '') {
      alert('Ingresa tu consulta o sugerencia');
      return;
    }

    console.log('Nombre:', this.nombre);
    console.log('Comentario:', this.comentario);
    console.log('Apellido:', this.apellido);
    console.log('Email:', this.email);

    // Aquí puedes realizar las acciones necesarias para enviar los datos del formulario

    window.location.href = 'https://portales.inacap.cl/';
  }

  redirectToIngresar(total: number) {
    const url = `https://tu-sitio-web.com/ingresar?monto=${total}`;
    this.router.navigateByUrl(url);
  }



  nombreValido: boolean = true;
  precioValido: boolean = true;
  cantidadValida: boolean = true;

  // Funciones para validar el formulario de agregar departamento
  validarFormulario() {
    const nombreValido = this.nuevoDepartamento.nombre !== undefined && this.nuevoDepartamento.nombre.trim() !== '';
    const precioValido = this.nuevoDepartamento.precioEnUF !== undefined && !isNaN(this.nuevoDepartamento.precioEnUF);
    const cantidadValida = this.nuevoDepartamento.cantidad !== undefined && !isNaN(this.nuevoDepartamento.cantidad);

    if (!nombreValido || !precioValido || !cantidadValida) {
      alert('Por favor, completa correctamente todos los campos.');
      return false;
    }

    return true;
  }

  agregarDepartamento() {
    // Validar el formulario antes de agregar un departamento
    if (!this.validarFormulario()) {
      return;
    }

    // Asignar un nuevo ID único al departamento
    if (this.departamentos.length === 0) {
      this.nuevoDepartamento.id = 1;
    } else {
      const lastDepartamentoId = this.departamentos[this.departamentos.length - 1].id || 0;
      this.nuevoDepartamento.id = lastDepartamentoId + 1;
    }

    // Agregar el nuevo departamento a la lista
    this.departamentos.push(this.nuevoDepartamento);

    // Limpiar los campos para agregar un nuevo departamento
    this.nuevoDepartamento = new Departamento();
  }

  editarDepartamento(indice: number) {
    this.editando = true;
    this.indiceEditando = indice;
    this.nuevoDepartamento = { ...this.departamentos[indice] };
  }

  guardarCambios() {
    if (this.editando && this.indiceEditando !== -1) {
      this.departamentos[this.indiceEditando] = this.nuevoDepartamento;
      this.editando = false;
      this.indiceEditando = -1;
      this.nuevoDepartamento = new Departamento(); // Limpiar los campos después de guardar los cambios
    }
  }

  eliminarDepartamento(indice: number) {
    this.departamentos.splice(indice, 1);
  }

  // Función para mostrar la lista de departamentos
  mostrarListaDepartamentos() {
    this.mostrarTablaDepartamentos = true;
    this.editando = false;
    this.indiceEditando = -1;
  }
}



