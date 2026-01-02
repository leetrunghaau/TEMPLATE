#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');

const program = new Command();

program
  .name('template-gen')
  .description('CLI to generate project templates')
  .version('1.0.0');

program.command('generate')
  .description('Generate a project template')
  .argument('<template>', 'Template to generate (express or socketio)')
  .argument('<destination>', 'Destination directory')
  .action(async (template, destination) => {
    const templatePath = path.join(__dirname, '..', 'templates', template);
    if (!fs.existsSync(templatePath)) {
      console.error(`Template ${template} not found`);
      return;
    }
    const destPath = path.resolve(destination);
    try {
      await fs.copy(templatePath, destPath);
      console.log(`Template ${template} generated successfully at ${destPath}`);
    } catch (error) {
      console.error(`Error generating template: ${error.message}`);
    }
  });

program.parse();