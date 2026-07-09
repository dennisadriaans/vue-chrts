import { getAllRepos, getRepoContributors } from '~~/server/utils/github'

export default defineEventHandler(async (event) => {
  const repos = await getAllRepos()
  const usernameHeader = getHeader(event, 'x-github-username')

  if (!usernameHeader) {
    return { error: 'Missing x-github-username header' }
  }

  const reposWithUserInvited = await Promise.all(
    repos.map(async (repo: any) => {
      const contributors = await getRepoContributors(repo.name)
      const userInvited = contributors.some(
        (c: any) => c.login === usernameHeader
      )
      return { ...repo, userInvited }
    })
  )
  return reposWithUserInvited
})
