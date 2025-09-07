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

        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }

        // ======================= LOGIN =======================
       public Usuario ObtenerUsuario(string usuario, string contraseña)
        {
            Usuario user = null;

            try
            {
                using (var conn = this.GetConnection())
                {
                    conn.Open();
                    string query = "SELECT idUSER, username, rol FROM user WHERE username=@usuario AND password=@password LIMIT 1";

                    using (var cmd = new MySqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@usuario", usuario);
                        cmd.Parameters.AddWithValue("@password", contraseña);

                        using (var reader = cmd.ExecuteReader())
                        {
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
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener usuario: " + ex.Message);
            }

            return user;
        }

               
        // ======================= REGISTRO =======================
        public bool RegistrarUsuario(          
            string username, string password)
        {
            try
            {
                using (var conn = this.GetConnection())
                {
                    conn.Open();

                                                      

                    // Insertar en usuario (asumiendo encuesta_completada DEFAULT 0 en la tabla user)
                    string insertUsuario = @"INSERT INTO user
                                        (username, password, rol)
                                        VALUES (@username, @password, 'ADMIN')";
                    using (var cmd = new MySqlCommand(insertUsuario, conn))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        cmd.Parameters.AddWithValue("@password", password);

                        cmd.ExecuteNonQuery();
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al registrar usuario: " + ex.Message);
                return false;
            }
        }

        
        

    }
}
