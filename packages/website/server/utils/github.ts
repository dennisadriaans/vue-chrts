import { Octokit } from '@octokit/rest'

const config = useRuntimeConfig()

const octokit = new Octokit({
  auth: config.githubToken
})

const API_VERSION = '2022-11-28'
const defaultHeaders = {
  'X-GitHub-Api-Version': API_VERSION
}

export async function checkRepositoryAccess(username: string, repo: string) {
  try {
    return await octokit.request(
      'GET /repos/nuxtcharts/{repo}/collaborators/{username}',
      {
        repo: repo,
        username: username,
        headers: defaultHeaders
      }
    )
  } catch (error) {
    return 'not-found'
  }
}

export async function inviteToRepository(username: string, repo: string) {
  try {
    return await octokit.request(
      'PUT /repos/nuxtcharts/{repo}/collaborators/{username}',
      {
        repo: repo,
        username: username,
        permission: 'pull',
        headers: defaultHeaders
      }
    )
  } catch (error) {
    throw error
  }
}

export async function getRepoCommits(owner: string, repo: string) {
  const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner,
    repo,
    headers: defaultHeaders
  })

  return response.data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name ?? 'Unknown',
    date: commit.commit.author?.date ?? null
  }))
}

export async function getRepoIssues(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open'
) {
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    state,
    headers: defaultHeaders
  })

  return data.map(issue => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,
    author: issue.user?.login ?? 'Unknown'
  }))
}

export async function getAllRepos() {
  const { data } = await octokit.request('GET /orgs/nuxtcharts/repos', {
    headers: defaultHeaders,
    per_page: 100
  })
  return data.map(
    (repo: {
      id: number
      name: string
      full_name: string
      html_url: string
      description: string | null
      fork: boolean
    }) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      fork: repo.fork
    })
  )
}

export async function getRepoContributors(repo: string) {
  const { data } = await octokit.request(
    'GET /repos/nuxtcharts/{repo}/collaborators',
    {
      repo,
      headers: defaultHeaders
    }
  )
  return data.map(
    (contributor: {
      login: string
      id: number
      avatar_url: string
      html_url: string
      contributions?: number
    }) => ({
      login: contributor.login,
      id: contributor.id,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions ?? 0
    })
  )
}
