import fs from 'fs/promises';

async function main() {
  const repoOwner = 'dennierucom-com';
  const repoName = 'mark-down';
  let token;
  
  try {
    token = (await fs.readFile('github_token.txt', 'utf8')).trim();
  } catch (e) {
    console.error('Could not read github_token.txt');
    process.exit(1);
  }

  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues?state=open&per_page=100`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'NodeJS/Agent-Script'
    }
  });

  if (response.ok) {
    const issues = await response.json();
    console.log(`Found ${issues.length} open issues.`);
    const issueList = issues.map(i => ({
      number: i.number,
      title: i.title,
      body: i.body
    }));
    await fs.writeFile('current_issues.json', JSON.stringify(issueList, null, 2));
    console.log('Issues saved to current_issues.json');
  } else {
    console.error('Failed to fetch issues:', response.status, response.statusText);
  }
}

main();
