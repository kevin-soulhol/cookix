// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Importing database from backup...');
    
    // Chemin absolu vers le fichier de sauvegarde
    const backupFile = path.resolve('./prisma/backups/dump.sql');
    
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Le fichier de sauvegarde ${backupFile} n'existe pas`);
    }
    
    console.log(`Utilisation du fichier de sauvegarde: ${backupFile}`);
    
    // Exécuter la commande d'import via Docker
    const command = `cat ${backupFile} | docker exec -i $(docker compose ps -q db) mysql -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME}`;
    
    console.log('Exécution de la commande d\'importation...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Warning')) {
      throw new Error(`Erreur lors de l'importation: ${stderr}`);
    }
    
    console.log('Base de données importée avec succès!');
    console.log(stdout);
  } catch (error) {
    console.error('Erreur lors de l\'importation de la base de données:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();