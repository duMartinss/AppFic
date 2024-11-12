// Importa as bibliotecas necessárias
const express = require('express'); // Framework para construir o servidor
const mysql = require('mysql2/promise'); // Biblioteca para conectar ao MySQL usando Promises
const bcrypt = require('bcrypt'); // Biblioteca para hashing de senhas
const axios = require('axios'); // Biblioteca para fazer requisições HTTP

const path = require('path'); // Biblioteca para manipulação de caminhos de arquivo

// Cria uma instância do Express
const app = express();

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Configuração do express.json() ANTES das rotas
app.use(express.json());

// Configuração de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Configuração do banco de dados
const dbConfig = {
  host: '10.90.235.163', // ou o IP do seu servidor MySQL
  user: 'devmysql',
  password: 'Ti@80123',
  database: 'esina'
};

// Função para buscar cidade e estado pelo CEP
const getCityAndStateByCep = async (cep) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data && !response.data.erro) {
      return {
        cidade: response.data.localidade,
        estado: response.data.uf,
      };
    }
    throw new Error('CEP inválido');
  } catch (error) {
    throw new Error('Erro ao buscar informações do CEP');
  }
};

// Rota para editar informações do usuário
app.put('/api/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_user, email_user, nascimento_user, telefone_user } = req.body;

  if (!nome_user || !email_user || !nascimento_user || !telefone_user) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Atualiza os dados do usuário
    const sql = `
      UPDATE usuario 
      SET nome_user = ?, email_user = ?, nascimento_user = ?, telefone_user = ? 
      WHERE id_user = ?`;
    
    const [result] = await connection.execute(sql, [nome_user, email_user, nascimento_user, telefone_user, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
});



// Rota para cadastro de usuários
app.post('/api/signup', async (req, res) => {
  const { nome, email, senha, nascimento, telefone, cep } = req.body;

  if (!nome || !email || !senha || !nascimento || !telefone || !cep) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nome)) {
    return res.status(400).json({ message: 'O nome deve conter apenas letras e espaços.' });
  }

  try {
    const { cidade, estado } = await getCityAndStateByCep(cep);
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute('SELECT * FROM usuario WHERE email_user = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const sql = `
      INSERT INTO usuario 
      (nome_user, email_user, senha_user, nascimento_user, telefone_user, cep_user, cidade_user, estado_user, status_user) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
    await connection.execute(sql, [nome, email, hashedPassword, nascimento, telefone, cep, cidade, estado, 1]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar o cadastro:', error.message);
    return res.status(400).json({ message: error.message });
  }
});

// Rota para login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute('SELECT * FROM usuario WHERE email_user = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha_user);

    if (!match) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!', user });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});

// Rota para obter informações do usuário por ID
app.get('/api/usuario/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID recebido:', id);
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Especifique explicitamente todas as colunas, incluindo imagem_user
    const [rows] = await connection.execute(
      'SELECT id_user, nome_user, email_user, nascimento_user, telefone_user, cidade_user, estado_user, imagem_user FROM usuario WHERE id_user = ?',
      [id]
    );
    
    console.log('Dados do usuário:', rows[0]);
    
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// Rota para obter todos os usuários
app.get('/api/usuario', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      'SELECT id_user, nome_user, email_user, nascimento_user, telefone_user, cidade_user, estado_user, status_user as status FROM usuario'
    );

    console.log('Usuários encontrados:', results); // Para debug
    res.status(200).json(results);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    return res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

// Rota para criar cursos
app.post('/api/curso', async (req, res) => {
  const { nome_curso, status_curso, statusPag_curso, horas_curso, imagem_curso, dataInicio_curso, dataFim_curso, descricao_curso, programacao_curso, requisitos_curso, perfil_curso, topico_curso } = req.body;

  if (!nome_curso || !dataInicio_curso || !dataFim_curso) {
    return res.status(400).json({ message: 'Nome do curso, data de início e data de fim são obrigatórios.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const sql = `
      INSERT INTO cursos 
      (nome_curso, status_curso, statusPag_curso, horas_curso, imagem_curso, dataInicio_curso, dataFim_curso, descricao_curso, programacao_curso, requisitos_curso, perfil_curso, topico_curso) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await connection.execute(sql, [nome_curso, status_curso, statusPag_curso, horas_curso, imagem_curso, dataInicio_curso, dataFim_curso, descricao_curso, programacao_curso, requisitos_curso, perfil_curso, topico_curso]);

    res.status(201).json({ message: 'Curso criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar curso:', error.message);
    return res.status(500).json({ message: 'Erro ao criar curso.' });
  }
});

// Rota para obter todos os cursos
app.get('/api/cursos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute('SELECT * FROM cursos');
    
    // Formata os dados consistentemente
    const cursosFormatados = results.map(curso => ({
      id_curso: curso.id_curso,
      nome_curso: curso.nome_curso,
      descricao_curso: curso.descricao_curso, // Adiciona a descrição
      categoria: curso.topico_curso,
      status_curso: curso.status_curso,
      statusPag_curso: curso.statusPag_curso,
      horas_curso: curso.horas_curso,
      imagem_curso: curso.imagem_curso,
      dataInicio_curso: curso.dataInicio_curso,
      dataFim_curso: curso.dataFim_curso
    }));

    res.status(200).json(cursosFormatados);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error.message);
    return res.status(500).json({ message: 'Erro ao buscar cursos.' });
  }
});

// Rota para obter cursos por tópico
app.get('/api/cursos/topico/:topico', async (req, res) => {
  const { topico } = req.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [cursos] = await connection.execute(
      'SELECT * FROM cursos WHERE topico_curso LIKE ?',
      [`%${topico}%`]
    );

    const cursosFormatados = cursos.map(curso => ({
      id: curso.id_curso,
      nome: curso.nome_curso,
      descricao: curso.descricao_curso,
      duracao: curso.horas_curso,
      dataInicio: curso.dataInicio_curso,
      dataFim: curso.dataFim_curso,
      preco: curso.statusPag_curso,
      requisitos: curso.requisitos_curso,
      programacao: curso.programacao_curso,
      perfilProfissional: curso.perfil_curso,
      topico_curso: curso.topico_curso,
      imagem: curso.imagem_curso
    }));

    res.status(200).json(cursosFormatados);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar cursos',
      error: error.message 
    });
  }
});

const fileUpload = require('express-fileupload'); // Importa o express-fileupload

// Configura o middleware para lidar com uploads de arquivos
app.use(fileUpload());

// Rota para upload de imagem
app.post('/api/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
  }

  const image = req.files.file;
  
  // Gera um nome único para a imagem
  const fileName = `${Date.now()}-${image.name}`;
  const uploadPath = path.join(__dirname, 'uploads', fileName);

  try {
    await image.mv(uploadPath);
    const imageUrl = `http://10.90.235.163:3000/uploads/${fileName}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    res.status(500).json({ message: 'Erro ao salvar a imagem.' });
  }
});

// Servir arquivos estáticos do diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para atualizar o status do usuário
app.put('/api/usuario/status/:id', async (req, res) => {
  console.log('Rota de status acessada:', req.params, req.body); // Log adicional
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ message: 'Status não fornecido' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = `
      UPDATE usuario 
      SET status_user = ? 
      WHERE id_user = ?`;
    
    const [result] = await connection.execute(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ 
      message: 'Status do usuário atualizado com sucesso!',
      status: status 
    });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error.message);
    return res.status(500).json({ message: 'Erro ao atualizar status do usuário.' });
  }
});

// Modifique a rota para buscar curso por ID
app.get('/api/curso/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID do curso recebido:', id);

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      'SELECT * FROM cursos WHERE id_curso = ?',
      [id]
    );
    console.log('Resultados da query:', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    // Formata os dados do curso para o formato esperado pelo frontend
    const curso = {
      id: results[0].id_curso,
      nome: results[0].nome_curso,
      imagem: results[0].imagem_curso,
      dataInicio: results[0].dataInicio_curso,
      dataFim: results[0].dataFim_curso,
      duracao: results[0].horas_curso,
      preco: results[0].statusPag_curso,
      descricao: results[0].descricao_curso,
      programacao: results[0].programacao_curso,
      requisitos: results[0].requisitos_curso,
      perfilProfissional: results[0].perfil_curso
    };

    res.status(200).json(curso);
  } catch (error) {
    console.error('Erro ao buscar curso:', error.message);
    return res.status(500).json({ message: 'Erro ao buscar curso.' });
  }
});

// Modifique a rota para buscar curso por nome usando POST
app.post('/api/cursos/buscar', async (req, res) => {
  const { nome } = req.body;
  console.log('Nome do curso recebido:', nome);

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Log da query para debug
    const query = 'SELECT * FROM cursos WHERE nome_curso = ?';
    console.log('Query SQL:', query);
    console.log('Parâmetros:', [nome]);

    const [results] = await connection.execute(query, [nome]);
    console.log('Resultados encontrados:', results.length);
    console.log('Dados do primeiro resultado:', results[0]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    // Formata os dados do curso para o formato esperado pelo frontend
    const curso = {
      id: results[0].id_curso,
      nome: results[0].nome_curso,
      imagem: results[0].imagem_curso,
      dataInicio: results[0].dataInicio_curso,
      dataFim: results[0].dataFim_curso,
      duracao: results[0].horas_curso,
      preco: results[0].statusPag_curso,
      descricao: results[0].descricao_curso,
      programacao: results[0].programacao_curso,
      requisitos: results[0].requisitos_curso,
      perfilProfissional: results[0].perfil_curso,
      topico_curso: results[0].topico_curso // Adiciona o tópico do curso
    };

    res.status(200).json(curso);
  } catch (error) {
    console.error('Erro detalhado:', error);
    return res.status(500).json({ 
      message: 'Erro ao buscar curso.',
      error: error.message 
    });
  }
});

// Rota para iniciar o processo de recuperação de senha
app.post('/api/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verifica se o email existe
    const [users] = await connection.execute(
      'SELECT id_user FROM usuario WHERE email_user = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email não encontrado.' 
      });
    }

    // Gera um código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000);
    
    // Salva o código e timestamp no banco
    await connection.execute(
      'UPDATE usuario SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE email_user = ?',
      [codigo, email]
    );

    // Aqui você implementaria o envio do email com o código
    // Por enquanto, vamos apenas retornar o código para teste
    res.json({ 
      success: true, 
      message: 'Código de recuperação enviado com sucesso.',
      codigo: codigo // Em produção, remover esta linha
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação.' 
    });
  }
});

// Rota para verificar o código e atualizar a senha
app.post('/api/redefinir-senha', async (req, res) => {
  const { email, codigo, novaSenha } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verifica se o código é válido e não expirou
    const [users] = await connection.execute(
      'SELECT id_user FROM usuario WHERE email_user = ? AND reset_code = ? AND reset_code_expires > NOW()',
      [email, codigo]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Código inválido ou expirado.' 
      });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    
    // Atualiza a senha e limpa o código
    await connection.execute(
      'UPDATE usuario SET senha_user = ?, reset_code = NULL, reset_code_expires = NULL WHERE email_user = ?',
      [hashedPassword, email]
    );

    res.json({ 
      success: true, 
      message: 'Senha atualizada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao redefinir a senha.' 
    });
  }
});

// Rota para atualizar a imagem do usuário
app.put('/api/usuario/:id/imagem', async (req, res) => {
  const { id } = req.params;
  const { imagem_user } = req.body;

  console.log('ID recebido:', id);
  console.log('Imagem recebida:', imagem_user);

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Atualiza a imagem no banco de dados
    await connection.execute(
      'UPDATE usuario SET imagem_user = ? WHERE id_user = ?',
      [imagem_user, id]
    );

    // Busca os dados atualizados do usuário
    const [rows] = await connection.execute(
      'SELECT * FROM usuario WHERE id_user = ?',
      [id]
    );

    console.log('Dados após atualização:', rows);

    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ 
        success: true, 
        message: 'Imagem atualizada com sucesso',
        user: rows[0]
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar imagem' 
    });
  }
});

// Rota para editar curso
app.put('/api/cursos/editar/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID recebido:', id);
  console.log('Dados recebidos:', req.body);

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = `
      UPDATE cursos 
      SET nome_curso = ?,
          dataInicio_curso = ?,
          dataFim_curso = ?,
          horas_curso = ?,
          statusPag_curso = ?,
          descricao_curso = ?,
          programacao_curso = ?,
          requisitos_curso = ?,
          perfil_curso = ?
      WHERE id_curso = ?`;
    
    const values = [
      req.body.nome,
      req.body.dataInicio,
      req.body.dataFim,
      req.body.duracao,
      req.body.status,
      req.body.descricao,
      req.body.programacao,
      req.body.requisitos,
      req.body.perfilProfissional,
      id
    ];

    await connection.execute(sql, values);

    res.status(200).json({ message: 'Curso atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error.message);
    return res.status(500).json({ message: 'Erro ao atualizar curso.' });
  }
});

// Rota para atualizar o status do curso
app.put('/api/cursos/status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('Recebido pedido de atualização:', { id, status }); // Debug
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Primeiro, verifica se o curso existe
    const [curso] = await connection.execute(
      'SELECT * FROM cursos WHERE id_curso = ?',
      [id]
    );

    if (curso.length === 0) {
      console.log('Curso não encontrado:', id);
      return res.status(404).json({ 
        message: 'Curso não encontrado.' 
      });
    }

    // Atualiza o status do curso
    const sql = `
      UPDATE cursos 
      SET status_curso = ? 
      WHERE id_curso = ?
    `;
    
    console.log('Executando query:', sql, [status, id]); // Debug
    
    const [result] = await connection.execute(sql, [status, id]);
    
    await connection.end();
    
    console.log('Resultado da atualização:', result); // Debug
    
    return res.status(200).json({ 
      message: 'Status do curso atualizado com sucesso.',
      status: status 
    });

  } catch (error) {
    console.error('Erro ao atualizar status do curso:', error);
    return res.status(500).json({ 
      message: 'Erro ao atualizar status do curso.',
      error: error.message 
    });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
