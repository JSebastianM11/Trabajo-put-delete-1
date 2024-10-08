import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { nombre: '', email: '', empresa: '' }; // Modelo para el nuevo usuario
  idEliminar: number | undefined = undefined; // Usar undefined en lugar de null
  usuarioModificar: Usuario = { id: undefined, nombre: '', email: '', empresa: '' }; // Lo mismo para id en usuarioModificar


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  // Método para obtener los usuarios
  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id, // Agregamos el ID para las operaciones de modificar y eliminar
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  // Método para agregar un nuevo usuario con POST
  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push({ id: Date.now(), ...this.nuevoUsuario }); // Agregamos el usuario localmente
        this.nuevoUsuario = { nombre: '', email: '', empresa: '' }; // Limpiamos el formulario
      });
  }

  modificarUsuario() {
    if (!this.usuarioModificar.id) {
      alert('Por favor, proporciona un ID válido para modificar.');
      return;
    }
    const index = this.usuarios.findIndex(u => u.id === this.usuarioModificar.id);
    if (index !== -1) {
      // Solicitud PUT simulada
      const body = {
        name: this.usuarioModificar.nombre,
        email: this.usuarioModificar.email,
        company: {
          name: this.usuarioModificar.empresa
        }
      };
      this.http.put(`https://jsonplaceholder.typicode.com/users/${this.usuarioModificar.id}`, body)
        .subscribe(response => {
          console.log('Usuario modificado:', response);
          this.usuarios[index] = { ...this.usuarioModificar }; // Actualizamos el usuario en la lista
          this.usuarioModificar = { id: undefined, nombre: '', email: '', empresa: '' }; // Limpiamos el formulario
        });
    } else {
      alert(`No se encontró el usuario con ID ${this.usuarioModificar.id}.`);
    }
  }
  
  // Método para eliminar un usuario
  eliminarUsuario() {
    const index = this.usuarios.findIndex(u => u.id === this.idEliminar);
    if (index !== -1) {
      this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.idEliminar}`)
        .subscribe(response => {
          console.log('Usuario eliminado:', response);
          this.usuarios.splice(index, 1); // Eliminamos el usuario de la lista
          this.idEliminar = undefined; // Limpiamos el formulario
        });
    } else {
      alert(`No se encontró el usuario con ID ${this.idEliminar}.`);
    }
  }
}
