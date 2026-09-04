import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TOKEN_PATH = path.join(rootDir, 'github_token.txt');
const AUDIT_PATH = path.join(rootDir, 'audit.json');

const REPO_OWNER = 'dennierucom-com';
const REPO_NAME = 'mark-down';

async function main() {
  try {
    const token = (await fs.readFile(TOKEN_PATH, 'utf-8')).trim();
    if (!token) {
      console.error('GitHub token is empty.');
      process.exit(1);
    }

    const auditData = JSON.parse(await fs.readFile(AUDIT_PATH, 'utf-8'));
    
    // Iterate over vulnerabilities
    const vulnerabilities = Object.values(auditData.vulnerabilities || {});
    const highCriticalVulns = vulnerabilities.filter(v => v.severity === 'high' || v.severity === 'critical');

    console.log(`Found ${highCriticalVulns.length} high/critical vulnerabilities.`);

    for (const vuln of highCriticalVulns) {
      const issueTitle = `Security Vulnerability [${vuln.severity.toUpperCase()}]: ${vuln.name}`;
      
      const fixAvailableText = vuln.fixAvailable ? 
        (typeof vuln.fixAvailable === 'boolean' ? 'Yes, via `npm audit fix`' : `Yes, via \`${vuln.fixAvailable.name}\``) 
        : 'No direct fix available';

      let advisoriesText = '';
      if (vuln.via && Array.isArray(vuln.via)) {
        vuln.via.forEach(v => {
          if (typeof v === 'object' && v.title) {
             advisoriesText += `- [${v.title}](${v.url})\n`;
          }
        });
      }

      const issueBody = `
### Vulnerability Details
- **Dependency:** \`${vuln.name}\`
- **Severity:** ${vuln.severity}
- **Vulnerable Range:** \`${vuln.range}\`
- **Nodes Affected:** ${vuln.nodes.join(', ')}

### Description
${advisoriesText || 'No specific advisory description available in audit report.'}

### Recommended Fix
${fixAvailableText}

> *This issue was automatically generated from an \`npm audit\` scan.*
      `.trim();

      console.log(`Creating issue: ${issueTitle}`);
      
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['bug', 'security', vuln.severity]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create issue for ${vuln.name}:`, errorText);
      } else {
        const data = await response.json();
        console.log(`Created issue #${data.number} for ${vuln.name}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log('Finished creating issues.');

  } catch (error) {
    console.error('Error creating issues:', error);
    process.exit(1);
  }
}

main();
