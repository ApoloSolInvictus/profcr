require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const { Octokit } = require("@octokit/rest");
const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const TEMPLATE_REPO = "ApoloSolInvictus/plantilla-web"; // Cambia por tu plantilla
const octokit = new Octokit({ auth: GITHUB_TOKEN });

app.post('/crear-sitio', async (req, res) => {
  const { nombreCliente, nombreSitio, descripcion, color, emailCliente } = req.body;

  // 1. Crear nuevo repo
  const repoName = `${nombreSitio.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  const user = (await octokit.users.getAuthenticated()).data.login;

  const newRepo = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: false,
    description: `Sitio de ${nombreCliente}. ${descripcion}`,
    auto_init: false,
  });

  // 2. Clonar plantilla localmente (usa tmp dir)
  const tmpDir = path.join(__dirname, 'tmp', repoName);
  await fs.remove(tmpDir); // Limpieza
  await simpleGit().clone(`https://github.com/${TEMPLATE_REPO}.git`, tmpDir);

  // 3. Personalizar archivos (ejemplo: README.md)
  const readmePath = path.join(tmpDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    let content = await fs.readFile(readmePath, 'utf8');
    content = content
      .replace(/{{NOMBRE_CLIENTE}}/g, nombreCliente)
      .replace(/{{DESCRIPCION}}/g, descripcion)
      .replace(/{{COLOR}}/g, color)
      .replace(/{{EMAIL}}/g, emailCliente);
    await fs.writeFile(readmePath, content, 'utf8');
  }

  // 4. Inicializar git en el nuevo repo y hacer push
  const git = simpleGit(tmpDir);
  await git.init();
  await git.addRemote('origin', newRepo.data.clone_url.replace("https://", `https://${GITHUB_TOKEN}@`));
  await git.add('.');
  await git.commit('Personalización inicial del sitio');
  await git.push('origin', 'master');

  // 5. Limpieza
  await fs.remove(tmpDir);

  // 6. Responder con el enlace al repo creado
  res.json({ url: newRepo.data.html_url });
});

app.listen(3002, () => console.log('Servidor de creación de sitios activo en puerto 3002'));