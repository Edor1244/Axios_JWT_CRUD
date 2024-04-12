//Primero obtendremos el toks para poderlo parsear y el rol de la persona que se loguea}
var locStorToken = localStorage.getItem('token');
var tokenPar = JSON.parse(locStorToken);
var userRol = tokenPar.rol;

$(document).ready(function () {
    cargarUsuarios();
    
  
    var userRol = 'Admin'; // Aquí debes obtener el valor real de userRol
    var optionAdmin = document.getElementById('OptionAdmin');
    if (userRol == 'Admin') {
      optionAdmin.style.display = 'block';
    }else{
      optionAdmin.style.display = 'none';
    }
    // Manejar el envío del formulario para añadir o actualizar usuarios
    $('form').on('submit', function (e) {
      e.preventDefault(); // Evitar el envío tradicional del formulario
      const usuarioData = {
        id: $('#id').val(), // Este campo es para identificar si es una actualización
        nombre: $('#nombre').val(),
        rol: $('#rol').val(),
        password: $('#password').val(),
      };
      console.log(usuarioData)
      guardarUsuario(usuarioData);
    }); 
    $(document).on('click', '.eliminar-usuario', function () {
      const usuarioId = $(this).data('id');
      eliminarUsuario(usuarioId);
    });
  });


  
  function cargarUsuarios() {
    $.ajax({
      url: '/usuarios/api', //Aqui esta la ruta que invocara 
      type: 'GET',
      success: function (response) {
        const usuarios = response.usuarios;
        let table = '';
        usuarios.forEach(function (usuario) {
            table += `<tr>
                              <td>${usuario.id}</td>
                              <td>${usuario.nombre}</td>
                              <td>${usuario.rol}</td>
                              <td>`;
          if (userRol === 'Admin') {
            table += `<button class="editar-usuario btn btn-outline-primary btn-sm me-1" data-id="${usuario.id}">Editar</button>
                                <button class="eliminar-usuario btn btn-outline-danger btn-sm" data-id="${usuario.id}">Eliminar</button>`;
          } else {
            table += `<button class="editar-usuario btn btn-outline-primary btn-sm me-1" data-id="${usuario.id}" disabled>Editar</button>
                                <button class="eliminar-usuario btn btn-outline-danger btn-sm" data-id="${usuario.id}" disabled>Eliminar</button>`;
          }
  
          table += `</td></tr>`;
        });
        $('#usuariosTableBody').html(table);
      },
      error: function (error) {
        console.error("Error al cargar los usuarios:", error);
        toastr.error('Error al cargar los usuarios.');
      }
    });
  }
  
  
  function guardarUsuario(usuario) {
    if (usuario.id === '' || usuario.id == undefined) {
      $.ajax({
        url: '/usuarios/api',
        type: 'POST',
        data: usuario,
        success: function (response) {
          toastr.success(response.message);
          cargarUsuarios(); // Recargar la lista de usuarios
          // Limpiar formulario
          $('#id').val('');
          $('#nombre').val('');
          $('#rol').val('');
          $('#password').val('');
        },
        error: function (error) {
          console.error("Error al guardar el usuario:", error);
          toastr.error('Error al guardar el usuario.');
        }
      });
    } else {
      $.ajax({
        url: `/usuarios/api/${usuario.id}`,
        type: 'PUT',
        headers: {
          'user_token': JSON.parse(localStorage.getItem('token')).succesfull
        },
        data: usuario,
        success: function (response) {
          if (response.error) {
            toastr.error(response.error);
          } else if (response.message) {
            toastr.success(response.message);
          }
          cargarUsuarios(); // Recargar la lista de usuarios
          // Limpiar formulario
          $('#id').val('');
          $('#nombre').val('');
          $('#rol').val('');
          $('#password').val('');
        },
        error: function (error) {
          console.error("Error al guardar el usuario:", error);
          toastr.error('Error al guardar el usuario.');
        }
      });
    }
  }
  
  function eliminarUsuario(id) {
    console.log(JSON.parse(localStorage.getItem('token')).succesfull);
    $.ajax({
      url: `/usuarios/api/${id}`,
      headers: {
        'user_token': JSON.parse(localStorage.getItem('token')).succesfull
      },
      type: 'DELETE',
      success: function (response) {
        if (response.error) {
          toastr.error(response.error);
        } else if (response.message) {
          toastr.success(response.message);
        }
        cargarUsuarios(); // Recargar la lista de usuarios
      },
      error: function (error) {
        console.error("Error al eliminar el usuario:", error);
        toastr.error('Error al eliminar el usuario.');
      }
    });
  }
  
  
  $(document).on('click', '.editar-usuario', function () {
    const usuarioId = $(this).data('id');
    $.ajax({
      url: `/usuarios/api/${usuarioId}`, // Asegúrate de tener esta ruta en el servidor para obtener los datos del usuario
      type: 'GET',
      success: function (response) {
        const usuario = response.usuario;
  
        $('#id').val(usuario.id); // Asegura que el campo 'id' se utilice para identificar la actualización
        $('#nombre').val(usuario.nombre);
        $('#rol').val(usuario.rol);
      },
      error: function (error) {
        console.error("Error al obtener el usuario:", error);
        toastr.error('Error al cargar los datos del usuario para edición.');
      }
    });
  });
