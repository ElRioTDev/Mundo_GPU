using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using APP.Models;

namespace APP.Data
{
    public class ConexionMySql
    {
        private readonly string connectionString;

        public ConexionMySql()
        {
            connectionString = "Server=localhost;Database=MundoGPUBD;User ID=root;Password=123qwe;Port=3306;SslMode=Preferred;";
        }

        public MySqlConnection GetConnection() => new MySqlConnection(connectionString);

        // ======================= LOGIN =======================
        public Usuario ObtenerUsuario(string usuario, string contraseña)
        {
            Usuario user = null;

            try
            {
                using var conn = GetConnection();
                conn.Open();
                string query = "SELECT idUSER, username, rol FROM user WHERE username=@usuario AND password=@password LIMIT 1";
                using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@usuario", usuario);
                cmd.Parameters.AddWithValue("@password", contraseña);

                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = new Usuario
                    {
                        Id = reader.GetInt32("idUSER"),
                        Username = reader.GetString("username"),
                        Rol = reader.GetString("rol")
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener usuario: " + ex.Message);
            }

            return user;
        }

        // ======================= OBTENER USUARIO POR USERNAME =======================
        public Usuario ObtenerUsuarioPorUsername(string username)
        {
            Usuario user = null;

            try
            {
                using var conn = GetConnection();
                conn.Open();
                string query = "SELECT idUSER, username, rol FROM user WHERE username=@usuario LIMIT 1";
                using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@usuario", username);

                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = new Usuario
                    {
                        Id = reader.GetInt32("idUSER"),
                        Username = reader.GetString("username"),
                        Rol = reader.GetString("rol")
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al buscar usuario por username: " + ex.Message);
            }

            return user;
        }

        // ======================= REGISTRO =======================
        public bool RegistrarUsuario(
            string username,
            string password,
            string nombre,
            string apellido,
            string sexo,
            int nivelAcademicoId,
            string rol,
            out string mensajeError)
        {
            mensajeError = "";
            try
            {
                using (var conn = this.GetConnection())
                {
                    conn.Open();

                    // Verificar si el username ya existe
                    string checkUser = "SELECT COUNT(*) FROM user WHERE username=@username";
                    using (var cmdCheck = new MySqlCommand(checkUser, conn))
                    {
                        cmdCheck.Parameters.AddWithValue("@username", username);
                        int count = Convert.ToInt32(cmdCheck.ExecuteScalar());
                        if (count > 0)
                        {
                            mensajeError = $"Error: el username '{username}' ya existe.";
                            return false;
                        }
                    }

                    int idGeneral;

                    // Insertar en Generales con Nivel_Academico
                    string insertGeneral = @"INSERT INTO Generales (nombre, apellido, sexo, NivelAcademicoId)
                                     VALUES (@nombre, @apellido, @sexo, @nivelAcademicoId);";
                    using (var cmd = new MySqlCommand(insertGeneral, conn))
                    {
                        cmd.Parameters.AddWithValue("@nombre", nombre);
                        cmd.Parameters.AddWithValue("@apellido", apellido);
                        cmd.Parameters.AddWithValue("@sexo", sexo);
                        cmd.Parameters.AddWithValue("@nivelAcademicoId", nivelAcademicoId);
                        cmd.ExecuteNonQuery();
                    }

                    // Obtener último ID
                    using (var cmd = new MySqlCommand("SELECT LAST_INSERT_ID();", conn))
                    {
                        idGeneral = Convert.ToInt32(cmd.ExecuteScalar());
                    }

                    // Insertar en user
                    string insertUsuario = @"INSERT INTO user (username, password, rol, Generales_idGeneral)
                                     VALUES (@username, @password, @rol, @idGeneral)";
                    using (var cmd = new MySqlCommand(insertUsuario, conn))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        cmd.Parameters.AddWithValue("@password", password);
                        cmd.Parameters.AddWithValue("@rol", rol);
                        cmd.Parameters.AddWithValue("@idGeneral", idGeneral);
                        cmd.ExecuteNonQuery();
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                mensajeError = "Error: " + ex.Message;
                return false;
            }
        }





        public List<Gpu> ObtenerGPUs()
        {
            var gpus = new List<Gpu>();

            try
            {
                using (var conn = this.GetConnection())
                {
                    conn.Open();
                    string query = "SELECT idGPU, Marca, Modelo, VRAM, NucleosCuda, RayTracing, Imagen, Precio FROM GPU";

                    using (var cmd = new MySqlCommand(query, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            gpus.Add(new Gpu
                            {
                                IdGPU = reader.GetInt32("idGPU"),
                                Marca = reader.GetString("Marca"),
                                Modelo = reader.GetString("Modelo"),
                                VRAM = reader.GetString("VRAM"),
                                NucleosCuda = reader.GetInt32("NucleosCuda"),
                                RayTracing = reader.GetBoolean("RayTracing"),
                                Imagen = reader.GetString("Imagen"),
                                Precio = reader.GetDecimal("Precio")
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener GPUs: " + ex.Message);
            }

            return gpus;
        }
        // ======================= USUARIOS =======================

        // Obtener todos los usuarios con su información general
        public Usuario ObtenerUsuarioPorId(int id)
        {
            Usuario usuario = null;

            try
            {
                using (var conn = GetConnection())
                {
                    conn.Open();
                    string query = @"SELECT u.idUSER, u.username, u.password, u.rol,
                                    g.nombre, g.apellido, g.sexo, g.NivelAcademicoId,
                                    n.Nombre AS NivelAcademicoNombre
                             FROM user u
                             JOIN Generales g ON u.Generales_idGeneral = g.idGeneral
                             JOIN Nivel_Academico n ON g.NivelAcademicoId = n.IdNivelAcademico
                             WHERE u.idUSER = @id";
                    using (var cmd = new MySqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                usuario = new Usuario
                                {
                                    Id = reader.GetInt32("idUSER"),
                                    Username = reader.GetString("username"),
                                    Password = reader.GetString("password"),
                                    Rol = reader.GetString("rol"),
                                    Nombre = reader.GetString("nombre"),
                                    Apellido = reader.GetString("apellido"),
                                    Sexo = reader.GetString("sexo"),
                                    NivelAcademicoId = reader.GetInt32("NivelAcademicoId"),
                                    NivelAcademicoNombre = reader.GetString("NivelAcademicoNombre")
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener usuario por ID: " + ex.Message);
            }

            return usuario;
        }




        // Actualizar un usuario
        public bool ActualizarUsuario(Usuario usuario, out string mensajeError)
        {
            mensajeError = string.Empty;

            try
            {
                using var conn = GetConnection();
                conn.Open();

                // 1️⃣ Validar que el nuevo username no exista en otro usuario
                string checkQuery = "SELECT COUNT(*) FROM user WHERE username=@username AND idUSER<>@id";
                using (var checkCmd = new MySqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@username", usuario.Username);
                    checkCmd.Parameters.AddWithValue("@id", usuario.Id);
                    var count = Convert.ToInt32(checkCmd.ExecuteScalar());
                    if (count > 0)
                    {
                        mensajeError = "Error: el username ya está en uso por otro usuario.";
                        Console.WriteLine(mensajeError);
                        return false;
                    }
                }

                // 2️⃣ Actualizar tabla Generales (incluyendo Nivel_Academico)
                string updateGenerales = @"UPDATE Generales 
                                   SET nombre=@nombre, apellido=@apellido, sexo=@sexo, NivelAcademicoId=@nivelAcademicoId
                                   WHERE idGeneral = (SELECT Generales_idGeneral FROM user WHERE idUSER=@id)";
                using (var cmd = new MySqlCommand(updateGenerales, conn))
                {
                    cmd.Parameters.AddWithValue("@nombre", usuario.Nombre);
                    cmd.Parameters.AddWithValue("@apellido", usuario.Apellido);
                    cmd.Parameters.AddWithValue("@sexo", usuario.Sexo);
                    cmd.Parameters.AddWithValue("@nivelAcademicoId", usuario.NivelAcademicoId);
                    cmd.Parameters.AddWithValue("@id", usuario.Id);
                    cmd.ExecuteNonQuery();
                }

                // 3️⃣ Actualizar tabla user
                string updateUser = @"UPDATE user 
                              SET username=@username, password=@password, rol=@rol
                              WHERE idUSER=@id";
                using (var cmd = new MySqlCommand(updateUser, conn))
                {
                    cmd.Parameters.AddWithValue("@username", usuario.Username);
                    cmd.Parameters.AddWithValue("@password", usuario.Password);
                    cmd.Parameters.AddWithValue("@rol", usuario.Rol);
                    cmd.Parameters.AddWithValue("@id", usuario.Id);
                    cmd.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                mensajeError = "Error al actualizar usuario: " + ex.Message;
                Console.WriteLine(mensajeError);
                return false;
            }
        }






        // Eliminar usuario
       // ======================= ELIMINAR USUARIO =======================
public bool EliminarUsuario(int id)
{
    try
    {
        using (var conn = GetConnection())
        {
            conn.Open();
            using (var tran = conn.BeginTransaction())
            {
                try
                {
                    // 1️⃣ Eliminar registros asociados en Nivel_Academico
                    string deleteNivel = @"DELETE FROM Nivel_Academico WHERE Usuario_id=@id";
                    using (var cmdNivel = new MySqlCommand(deleteNivel, conn, tran))
                    {
                        cmdNivel.Parameters.AddWithValue("@id", id);
                        cmdNivel.ExecuteNonQuery();
                    }

                    // 2️⃣ Eliminar el usuario
                    string deleteUser = "DELETE FROM user WHERE idUSER=@id";
                    using (var cmdUser = new MySqlCommand(deleteUser, conn, tran))
                    {
                        cmdUser.Parameters.AddWithValue("@id", id);
                        cmdUser.ExecuteNonQuery();
                    }

                    // 3️⃣ Eliminar el registro en Generales asociado al usuario
                    string deleteGenerales = @"DELETE FROM Generales 
                                               WHERE idGeneral NOT IN (SELECT Generales_idGeneral FROM user)";
                    using (var cmdGen = new MySqlCommand(deleteGenerales, conn, tran))
                    {
                        cmdGen.ExecuteNonQuery();
                    }

                    tran.Commit();
                    return true;
                }
                catch (Exception exTran)
                {
                    tran.Rollback();
                    Console.WriteLine("Error al eliminar usuario: " + exTran.Message);
                    return false;
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error al eliminar usuario: " + ex.Message);
        return false;
    }
}


        // ======================= OBTENER TODOS LOS USUARIOS =======================
        public List<Usuario> ObtenerUsuarios()
        {
            var lista = new List<Usuario>();

            try
            {
                using (var conn = GetConnection())
                {
                    conn.Open();
                    string query = @"SELECT u.idUSER, u.username, u.password, u.rol,
                                    g.nombre, g.apellido, g.sexo, g.NivelAcademicoId,
                                    n.Nombre AS NivelAcademicoNombre
                             FROM user u
                             JOIN Generales g ON u.Generales_idGeneral = g.idGeneral
                             JOIN Nivel_Academico n ON g.NivelAcademicoId = n.IdNivelAcademico";

                    using (var cmd = new MySqlCommand(query, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(new Usuario
                            {
                                Id = reader.GetInt32("idUSER"),
                                Username = reader.GetString("username"),
                                Password = reader.GetString("password"),
                                Rol = reader.GetString("rol"),
                                Nombre = reader.GetString("nombre"),
                                Apellido = reader.GetString("apellido"),
                                Sexo = reader.GetString("sexo"),
                                NivelAcademicoId = reader.GetInt32("NivelAcademicoId"),
                                NivelAcademicoNombre = reader.GetString("NivelAcademicoNombre")
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener usuarios: " + ex.Message);
            }

            return lista;
        }



        

    }
}
