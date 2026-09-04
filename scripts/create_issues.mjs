import fs from 'fs/promises';

async function main() {
  const consolidatedFile = 'consolidated_github_issues.md';
  const repoOwner = 'dennierucom-com';
  const repoName = 'mark-down';
  let token = process.env.GITHUB_TOKEN;

  if (!token) {
    try {
      token = (await fs.readFile('github_token.txt', 'utf8')).trim();
    } catch (e) {
      // Ignore
    }
  }

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is missing.');
    console.error('Please run the command like this:');
    console.error(`  $env:GITHUB_TOKEN="your_token"; node scripts/create_issues.mjs`);
    console.error('\nYou can generate a token at: https://github.com/settings/tokens?type=beta');
    console.error('Make sure to grant "Issues: Read and Write" permissions for this repository.');
    process.exit(1);
  }

  try {
    const data = await fs.readFile(consolidatedFile, 'utf8');
    
    // Split the document by "### " which indicates an issue header
    const parts = data.split('### ');
    
    // The first part is the header/intro, skip it
    const issuesData = parts.slice(1);
    
    console.log(`Found ${issuesData.length} issues to process.`);

    for (const issueText of issuesData) {
      // Split by newline to get the title (first line) and body (the rest)
      const lines = issueText.trim().split('\n');
      const rawTitle = lines[0].trim();
      const bodyLines = lines.slice(1);
      
      // Clean up the number prefix (e.g., "1. Title" -> "Title")
      const title = rawTitle.replace(/^\d+\.\s*/, '');
      const body = bodyLines.join('\n').trim();

      // Add a footer linking to the audit
      const fullBody = `${body}\n\n---\n*Created automatically from the consolidated audit report.*`;

      console.log(`\nCreating Issue: "${title}"`);
      
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NodeJS/Agent-Script'
        },
        body: JSON.stringify({
          title: title,
          body: fullBody
        })
      });

      if (response.ok) {
        const json = await response.json();
        console.log(`Success: Issue created at ${json.html_url}`);
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.error(`Failed to create issue "${title}":`, response.status, response.statusText, errJson);
      }
      
      // Small delay to avoid hitting GitHub API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\nAll issues processed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
