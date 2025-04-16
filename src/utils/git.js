import { execaCommand } from 'execa';
import conventionalCommitsParser from 'conventional-commits-parser';

/**
 * Get the latest git tag
 * @returns {Promise<string|null>} The latest tag or null if no tags exist
 */
export async function getLastTag() {
  try {
    const { stdout } = await execaCommand('git describe --tags --abbrev=0');
    return stdout.trim();
  } catch (error) {
    // No tags exist
    return null;
  }
}

/**
 * Parse raw git commit into structured data
 * @param {string} commitMsg - Raw git commit message
 * @returns {Object} Parsed commit object
 */
function parseCommit(commit) {
  const parsed = conventionalCommitsParser.sync(commit.message);
  
  return {
    hash: commit.hash,
    date: commit.date,
    author: commit.author,
    type: parsed.type,
    scope: parsed.scope,
    subject: parsed.subject,
    body: parsed.body,
    breaking: parsed.notes.some(note => note.title === 'BREAKING CHANGE'),
  };
}

/**
 * Get commits since the last tag
 * @param {string} fromTag - Starting tag
 * @param {string} toRef - Ending reference (default: HEAD)
 * @returns {Promise<Array>} Array of parsed commits
 */
export async function getCommitsSinceLastTag(fromTag, toRef = 'HEAD') {
  try {
    const range = fromTag ? `${fromTag}..${toRef}` : '';
    const format = '%H%n%an%n%at%n%s%n%b%n------------------------ COMMIT ------------------------';
    const { stdout } = await execaCommand(`git log ${range} --pretty=format:"${format}"`);
    
    if (!stdout.trim()) {
      return [];
    }
    
    const commits = stdout.split('------------------------ COMMIT ------------------------')
      .filter(Boolean)
      .map(commit => {
        const lines = commit.trim().split('\n');
        const hash = lines[0];
        const author = lines[1];
        const timestamp = parseInt(lines[2], 10) * 1000;
        const date = new Date(timestamp);
        const subject = lines[3] || '';
        const body = lines.slice(4).join('\n');
        
        return {
          hash,
          author,
          date,
          message: `${subject}\n\n${body}`.trim(),
        };
      });
    
    return commits.map(parseCommit);
  } catch (error) {
    console.error('Error getting commits:', error.message);
    return [];
  }
}
