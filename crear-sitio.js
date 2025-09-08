require('dotenv').config();
const express = require('express');
const { Octokit } = require("@octokit/rest");
const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(express.json());

// --- CONFIGURACIÓN ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
    console.error("Error: GITHUB_TOKEN no está configurado en tus variables de entorno.");
    process.exit(1);
}
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Mapa de plantillas según el plan
const TEMPLATE_REPOS = {
    'esencial': 'ApoloSolInvictus/modelo1',
    'crecimiento': 'ApoloSolInvictus/modelo2',
    'impacto': 'ApoloSolInvictus/modelo3'
};

// --- ENDPOINT DE CREACIÓN ---
app.post('/crear-sitio', async (req, res) => {
  const { plan, nombreCliente, nombreSitio, emailCliente, ...detalles } = req.body;

  // 1. Validar la entrada
  if (!plan || !nombreCliente || !nombreSitio || !emailCliente) {
    return res.status(400).json({ error: 'Faltan datos esenciales (plan, nombreCliente, nombreSitio, emailCliente).' });
  }

  const templateRepo = TEMPLATE_REPOS[plan.toLowerCase()];
  if (!templateRepo) {
    return res.status(400).json({ error: `El plan '${plan}' no es válido.` });
  }

  const repoName = `${nombreSitio.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  const tmpDir = path.join(__dirname, 'tmp', repoName);

  try {
    // 2. Crear el nuevo repositorio en GitHub
    console.log(`Creando repositorio: ${repoName}`);
    const newRepo = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false,
        description: `Sitio web para ${nombreCliente} (Plan: ${plan})`,
    });
    console.log(`Repositorio creado: ${newRepo.data.html_url}`);

    // 3. Clonar la plantilla correspondiente
    console.log(`Clonando plantilla de '${templateRepo}' en ${tmpDir}`);
    await fs.remove(tmpDir); // Limpieza previa
    await simpleGit().clone(`https://github.com/${templateRepo}.git`, tmpDir);

    // 4. Personalizar los archivos (Ejemplo: modificar el index.html)
    const indexPath = path.join(tmpDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('Personalizando index.html...');
        let content = await fs.readFile(indexPath, 'utf8');
        
        // Reemplazos comunes
        content = content.replace(/{{NOMBRE_CLIENTE}}/g, nombreCliente);
        content = content.replace(/{{EMAIL_CLIENTE}}/g, emailCliente);
        
        // Reemplazos específicos del plan (puedes añadir más)
        if (plan === 'esencial') {
             content = content.replace(/{{TITULO_PROFESIONAL}}/g, detalles.titulo || '');
             content = content.replace(/{{BIOGRAFIA}}/g, detalles.biografia || '');
        }
        // ... añadir más lógica de personalización para otros planes ...

        await fs.writeFile(indexPath, content, 'utf8');
        console.log('index.html personalizado.');
    }

    // 5. Hacer push al nuevo repositorio
    console.log(`Haciendo push a ${repoName}`);
    const git = simpleGit(tmpDir);
    await git.addRemote('origin', newRepo.data.clone_url.replace("https://", `https://${GITHUB_TOKEN}@`));
    await git.add('.');
    await git.commit(`Creación inicial del sitio para ${nombreCliente}`);
    await git.push('origin', 'master', {'--set-upstream': null}); // Forzamos la rama master
    console.log('Push completado.');

    // 6. Limpieza de archivos temporales
    await fs.remove(tmpDir);

    // 7. Responder con éxito
    res.status(201).json({ 
        message: '¡Sitio web creado con éxito!',
        url: newRepo.data.html_url 
    });

  } catch (error) {
    console.error("Error en el proceso de creación:", error);
    await fs.remove(tmpDir); // Asegurar limpieza en caso de error
    res.status(500).json({ error: 'Ocurrió un error al crear el sitio web.' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor de creación de sitios activo en el puerto ${PORT}`));
